import { NextResponse } from "next/server";
import {
  recordCohortMetric,
  validateRealtyApiKey,
  looksLikeRawScrape,
  type RealtyCohortMetric,
} from "@/app/lib/realty";

export const runtime = "nodejs";

/**
 * POST /api/realty/cohort/push — anonymized cohort metric ingestion.
 *
 * Spec: INTEGRATION.md §4c.
 *
 * Hard rules enforced:
 *   1. Auth — X-PolyCloud-Key with `events:write` scope.
 *   2. Schema reject — `looksLikeRawScrape(body)` → 422 with
 *      `raw_scrape_rejected`. The portal NEVER accepts a Dharani plot
 *      list or 99acres listing. Drop on the floor.
 *   3. Cohort gate — `n_contributors < 5` → 422 with `cohort_too_small`.
 *      Re-enforced by DB CHECK constraint on `realty_cohort`.
 *   4. Field validation — `module`, `metric_key`, `cohort_value`,
 *      `n_contributors`, `ts_window` all required and well-typed.
 *
 * Returns 201 on success.
 */

interface PushBody {
  module?: unknown;
  metric_key?: unknown;
  cohort_value?: unknown;
  n_contributors?: unknown;
  ts_window?: unknown;
  source_payload?: unknown;
}

export async function POST(req: Request) {
  // --- Auth ---
  const key = req.headers.get("x-polycloud-key");
  const ctx = await validateRealtyApiKey(key);
  if (!ctx) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!ctx.scopes.includes("events:write")) {
    return NextResponse.json(
      { error: "missing_scope", required: "events:write" },
      { status: 403 },
    );
  }

  // --- Body parse ---
  let body: PushBody;
  try {
    body = (await req.json()) as PushBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // --- Data-sovereignty rejection (HARD) ---
  // §4c: if the body smells like raw scrape data, drop it. This runs
  // before structural validation so a misconfigured agent that pushes
  // a plot row with `module: "land-intel"` set still gets rejected.
  if (looksLikeRawScrape(body)) {
    return NextResponse.json(
      {
        error: "raw_scrape_rejected",
        detail:
          "This endpoint accepts cohort aggregates only. Raw scrape rows (plot_no, owner_name, khasra, etc.) are never persisted.",
      },
      { status: 422 },
    );
  }

  // --- Source payload also gets the heuristic ---
  if (body.source_payload && looksLikeRawScrape({ payload: body.source_payload })) {
    return NextResponse.json(
      { error: "raw_scrape_rejected", detail: "source_payload contains record-level fields" },
      { status: 422 },
    );
  }

  // --- Field validation ---
  if (
    typeof body.module !== "string" ||
    typeof body.metric_key !== "string" ||
    typeof body.ts_window !== "string"
  ) {
    return NextResponse.json(
      { error: "missing_fields", required: ["module", "metric_key", "ts_window"] },
      { status: 400 },
    );
  }
  const cohort_value = Number(body.cohort_value);
  const n_contributors = Number(body.n_contributors);
  if (!Number.isFinite(cohort_value)) {
    return NextResponse.json({ error: "invalid_cohort_value" }, { status: 400 });
  }
  if (!Number.isInteger(n_contributors)) {
    return NextResponse.json({ error: "invalid_n_contributors" }, { status: 400 });
  }

  // --- THE COHORT GATE ---
  // 422 (not 400) — the request was well-formed but violates the
  // privacy invariant. Same status the local agent's anonymizer uses.
  if (n_contributors < 5) {
    return NextResponse.json(
      {
        error: "cohort_too_small",
        detail: `n_contributors=${n_contributors} below the ≥5 floor`,
        required_minimum: 5,
      },
      { status: 422 },
    );
  }

  const metric: RealtyCohortMetric = {
    module: body.module,
    metric_key: body.metric_key,
    cohort_value,
    n_contributors,
    ts_window: body.ts_window,
    source_payload:
      body.source_payload && typeof body.source_payload === "object"
        ? (body.source_payload as Record<string, unknown>)
        : undefined,
  };

  const ok = await recordCohortMetric(metric, ctx.builder_slug);
  if (!ok) {
    // Either Turso is down OR the DB CHECK constraint blocked the insert.
    // Both are 503-class on this hot path; the agent will retry.
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
