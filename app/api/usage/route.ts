import { NextResponse } from "next/server";
import { recordUsage, type UsageEvent } from "@/app/lib/usage";
import {
  validateRealtyApiKey,
  looksLikeRawScrape,
} from "@/app/lib/realty";

export const runtime = "nodejs";

/**
 * POST /api/usage — telemetry firehose for the Realty cohort feed.
 *
 * Spec: INTEGRATION.md §3d.
 *
 * Auth:        X-PolyCloud-Key with `usage:write` scope.
 * Body:        UsageEvent { tenant, module, event, ts, payload? }.
 * 201:         event persisted.
 * 401:         missing or invalid API key.
 * 422:         body looks like raw scrape data (PII / individual records).
 *              See §4c — the portal NEVER accepts raw output from Realty.
 *
 * `tenant` here is the already-anonymized id minted by the local
 * agent. We do not reverse-resolve it. The dashboard at /admin/realty
 * shows aggregate counts only.
 */
export async function POST(req: Request) {
  const key = req.headers.get("x-polycloud-key");
  const ctx = await validateRealtyApiKey(key);
  if (!ctx) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 },
    );
  }
  if (!ctx.scopes.includes("usage:write")) {
    return NextResponse.json(
      { error: "missing_scope", required: "usage:write" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // --- Data-sovereignty rejection ---
  // §4c hard rule: raw scrape data is dropped on the floor.
  if (looksLikeRawScrape(body)) {
    return NextResponse.json(
      {
        error: "raw_scrape_rejected",
        detail: "Use cohort/push for aggregated data",
      },
      { status: 422 },
    );
  }

  // --- Structural validation ---
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const required = ["tenant", "module", "event", "ts"] as const;
  const missing = required.filter(
    (k) => typeof b[k] !== "string" || (b[k] as string).length === 0,
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "missing_fields", fields: missing },
      { status: 400 },
    );
  }
  if (b.payload !== undefined && (typeof b.payload !== "object" || b.payload === null)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const usage: UsageEvent = {
    tenant: String(b.tenant),
    module: String(b.module),
    event: String(b.event),
    ts: String(b.ts),
    payload: b.payload as Record<string, unknown> | undefined,
  };

  const ok = await recordUsage(usage);
  if (!ok) {
    // Same posture as /api/book — never expose backend failures, but
    // do log + return 503 so the local agent can retry. Local agent
    // should buffer + back off (already implemented per §4c).
    return NextResponse.json(
      { error: "persist_failed" },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { ok: true, builder: ctx.builder_slug },
    { status: 201 },
  );
}
