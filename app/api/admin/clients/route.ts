import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE } from "@/app/lib/auth";
import {
  upsertClient,
  slugExists,
  listClients,
  buildSkeletonClientData,
} from "@/app/lib/clients";
import { upsertUser, userExists } from "@/app/lib/users";
import type { Bundle } from "@/app/client/data/types";

export const runtime = "nodejs";

/**
 * /api/admin/clients
 *
 * Operator-only customer onboarding API. Backs the form at
 * /admin/clients/onboard and the list view at /admin/clients.
 *
 * GET   — list every client across both stores (DB + static fallback).
 *         Returns { clients: [{slug, name, bundle, auth, source, ...}] }.
 *
 * POST  — onboard a new customer. Atomic-ish: if the user creation fails,
 *         we DO NOT roll back the client row (the operator can reissue
 *         credentials without recreating the dashboard). The reverse —
 *         user created without a dashboard — would orphan a login, so we
 *         do clients first.
 *         Body: {
 *           slug, name, email, password,
 *           bundle?           ('starter' | 'growth' | 'total-growth' | 'internal'),
 *           location?, retainerMonthly?, setupFee?, notes?,
 *         }
 *         201 { ok: true, slug, dashboardUrl, login: { email } }
 *         409 { error: "slug_taken" | "email_taken" }
 *         400 { error: "validation", details: [...] }
 *         403 { error: "forbidden" }   — non-operator
 *         503 { error: "db_unavailable" } — Turso unreachable
 */

const BUNDLES: Bundle[] = ["local-starter", "growth", "total-growth", "internal"];

async function requireOperator(): Promise<
  | { ok: true }
  | { ok: false; res: NextResponse }
> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value ?? null;
  const claims = await readSession(token);
  if (!claims || !claims.ops) {
    return {
      ok: false,
      res: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }
  return { ok: true };
}

export async function GET() {
  const guard = await requireOperator();
  if (!guard.ok) return guard.res;
  const clients = await listClients();
  return NextResponse.json({ clients });
}

interface OnboardBody {
  slug?: string;
  name?: string;
  email?: string;
  password?: string;
  bundle?: string;
  location?: string;
  retainerMonthly?: number;
  setupFee?: number;
  notes?: string;
}

export async function POST(req: Request) {
  const guard = await requireOperator();
  if (!guard.ok) return guard.res;

  let body: OnboardBody;
  try {
    body = (await req.json()) as OnboardBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // ---------- Validate ----------
  const errors: string[] = [];
  const slug = (body.slug ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const bundle = (body.bundle ?? "growth") as Bundle;
  const location = (body.location ?? "").trim();

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    errors.push("slug must be kebab-case [a-z0-9-]");
  }
  if (slug.length > 60) errors.push("slug too long (max 60)");
  if (!name) errors.push("name required");
  if (!email || !email.includes("@")) errors.push("valid email required");
  if (!password || password.length < 8) {
    errors.push("password must be at least 8 characters");
  }
  if (!BUNDLES.includes(bundle)) {
    errors.push(`bundle must be one of ${BUNDLES.join(", ")}`);
  }
  if (
    body.retainerMonthly !== undefined &&
    (typeof body.retainerMonthly !== "number" || body.retainerMonthly < 0)
  ) {
    errors.push("retainerMonthly must be a non-negative number");
  }
  if (
    body.setupFee !== undefined &&
    (typeof body.setupFee !== "number" || body.setupFee < 0)
  ) {
    errors.push("setupFee must be a non-negative number");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "validation", details: errors },
      { status: 400 },
    );
  }

  // ---------- Uniqueness ----------
  if (await slugExists(slug)) {
    return NextResponse.json({ error: "slug_taken", slug }, { status: 409 });
  }
  if (await userExists(email)) {
    return NextResponse.json({ error: "email_taken", email }, { status: 409 });
  }

  // ---------- Create dashboard row ----------
  const skeleton = buildSkeletonClientData({
    slug,
    name,
    bundle,
    location,
    retainerMonthly: body.retainerMonthly,
    setupFee: body.setupFee,
  });
  const clientResult = await upsertClient(slug, skeleton, "private");
  if (!clientResult.ok) {
    return NextResponse.json(
      { error: "db_unavailable", reason: clientResult.reason },
      { status: 503 },
    );
  }

  // ---------- Create login ----------
  const userResult = await upsertUser({
    email,
    password,
    caps: { ops: false, ten: [slug], lab: false },
    notes: body.notes ?? `Onboarded ${new Date().toISOString().slice(0, 10)}`,
  });
  if (!userResult.ok) {
    // Dashboard exists but login failed. The operator can retry just the
    // user piece by re-POSTing — slugExists will return true now, but we
    // need a separate endpoint for that. For now, surface the error and
    // tell the operator the dashboard row exists.
    return NextResponse.json(
      {
        error: "user_create_failed",
        reason: userResult.reason,
        partial: { dashboard_created: true, slug, login_created: false },
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      slug,
      dashboardUrl: `/client/${slug}`,
      login: { email },
    },
    { status: 201 },
  );
}
