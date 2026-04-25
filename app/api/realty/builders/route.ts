import { NextResponse } from "next/server";
import { provisionBuilder, listBuilders } from "@/app/lib/realty";
import { readSession } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/app/lib/auth";

export const runtime = "nodejs";

/**
 * /api/realty/builders
 *
 * POST  — provision a Realty builder via single-use setup token.
 *         Body: { setup_token, name, region }.
 *         Response: { builder_slug, api_key, expires_in_days: null }.
 *         Token is shown ONCE. Persisted as sha256(token).
 *
 * GET   — operator-only list of builders. Used by the admin dashboard.
 *         Auth: cookie session with `ops === true`.
 *
 * Spec: INTEGRATION.md §4c.
 */

interface ProvisionBody {
  setup_token?: string;
  name?: string;
  region?: string;
}

export async function POST(req: Request) {
  let body: ProvisionBody;
  try {
    body = (await req.json()) as ProvisionBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (
    typeof body.setup_token !== "string" ||
    typeof body.name !== "string" ||
    typeof body.region !== "string"
  ) {
    return NextResponse.json(
      { error: "missing_fields", required: ["setup_token", "name", "region"] },
      { status: 400 },
    );
  }

  const result = await provisionBuilder({
    setupToken: body.setup_token,
    name: body.name,
    region: body.region,
  });

  if (!result.success) {
    const status =
      result.error === "invalid_setup_token"
        ? 401
        : result.error === "setup_token_already_used"
        ? 409
        : result.error === "db_unavailable"
        ? 503
        : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(
    {
      builder_slug: result.builder_slug,
      api_key: result.api_key,
      expires_in_days: null,
    },
    { status: 201 },
  );
}

export async function GET() {
  // Operator-only. proxy.ts doesn't gate /api/* paths, so we re-check here.
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value ?? null;
  const claims = await readSession(token);
  if (!claims || !claims.ops) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const rows = await listBuilders();
  return NextResponse.json({ builders: rows });
}
