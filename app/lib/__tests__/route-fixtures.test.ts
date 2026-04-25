/**
 * Route-layer fixture tests — exercise the actual /api/usage and
 * /api/realty/cohort/push handlers via in-process invocation.
 *
 * These prove the data-sovereignty enforcement works end-to-end:
 *   - 401 when no key
 *   - 422 when payload looks like raw scrape
 *   - 422 when n_contributors < 5
 *   - 201 when everything is clean
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { tmpdir } from "node:os";
import { join } from "node:path";
import { unlinkSync, existsSync } from "node:fs";

const DB_FILE = join(
  tmpdir(),
  `polycloud-realty-route-test-${process.pid}-${Date.now()}.db`,
);
process.env.TURSO_DATABASE_URL = `file:${DB_FILE}`;
process.env.REALTY_SETUP_TOKENS = "route-test-tok";

let usageRoute: typeof import("../../api/usage/route");
let pushRoute: typeof import("../../api/realty/cohort/push/route");
let realty: typeof import("../realty");
let buildersRoute: typeof import("../../api/realty/builders/route");
let apiKey: string = "";

beforeAll(async () => {
  realty = await import("../realty");
  realty._resetSchemaCacheForTests();
  usageRoute = await import("../../api/usage/route");
  pushRoute = await import("../../api/realty/cohort/push/route");
  buildersRoute = await import("../../api/realty/builders/route");

  // Provision a builder so we have a real api_key
  const r = await realty.provisionBuilder({
    setupToken: "route-test-tok",
    name: "Route Test Builder",
    region: "test",
  });
  if (!r.success || !r.api_key) {
    throw new Error(`provisioning failed: ${r.error}`);
  }
  apiKey = r.api_key;
});

afterAll(() => {
  if (existsSync(DB_FILE)) {
    try {
      unlinkSync(DB_FILE);
    } catch {
      // ignore
    }
  }
});

function jsonReq(url: string, body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// /api/usage
// ---------------------------------------------------------------------------

describe("POST /api/usage", () => {
  it("401 without an api key", async () => {
    const res = await usageRoute.POST(
      jsonReq("http://test/api/usage", {
        tenant: "t",
        module: "m",
        event: "e",
        ts: "2026-01-01T00:00:00Z",
      }),
    );
    expect(res.status).toBe(401);
  });

  it("422 when body looks like raw scrape (Dharani plot)", async () => {
    const res = await usageRoute.POST(
      jsonReq(
        "http://test/api/usage",
        {
          tenant: "t",
          plot_no: "234/A",
          khasra_number: "12-345",
          owner_name: "X",
        },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("raw_scrape_rejected");
  });

  it("400 when missing fields", async () => {
    const res = await usageRoute.POST(
      jsonReq(
        "http://test/api/usage",
        { tenant: "t" },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(400);
  });

  it("201 on a clean usage event", async () => {
    const res = await usageRoute.POST(
      jsonReq(
        "http://test/api/usage",
        {
          tenant: "anon-tenant-x",
          module: "land-intel",
          event: "card-opened",
          ts: "2026-04-23T08:14:00Z",
          payload: { duration_s: 47 },
        },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as { ok: boolean; builder: string };
    expect(body.ok).toBe(true);
    expect(body.builder).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// /api/realty/cohort/push
// ---------------------------------------------------------------------------

describe("POST /api/realty/cohort/push", () => {
  it("401 without api key", async () => {
    const res = await pushRoute.POST(
      jsonReq("http://test/api/realty/cohort/push", {
        module: "land-intel",
        metric_key: "k",
        cohort_value: 1,
        n_contributors: 5,
        ts_window: "2024-Q4",
      }),
    );
    expect(res.status).toBe(401);
  });

  it("422 when body has plot_no (raw scrape)", async () => {
    const res = await pushRoute.POST(
      jsonReq(
        "http://test/api/realty/cohort/push",
        {
          module: "land-intel",
          metric_key: "k",
          cohort_value: 1,
          n_contributors: 5,
          ts_window: "2024-Q4",
          plot_no: "234/A",
        },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("raw_scrape_rejected");
  });

  it("422 when source_payload contains record-level fields", async () => {
    const res = await pushRoute.POST(
      jsonReq(
        "http://test/api/realty/cohort/push",
        {
          module: "land-intel",
          metric_key: "k",
          cohort_value: 1,
          n_contributors: 5,
          ts_window: "2024-Q4",
          source_payload: {
            owner_name: "leaked",
            phone: "9876543210",
          },
        },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(422);
  });

  it("422 when n_contributors=4 (cohort gate)", async () => {
    const res = await pushRoute.POST(
      jsonReq(
        "http://test/api/realty/cohort/push",
        {
          module: "land-intel",
          metric_key: "small_cohort",
          cohort_value: 1,
          n_contributors: 4,
          ts_window: "2024-Q4",
        },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: string; required_minimum: number };
    expect(body.error).toBe("cohort_too_small");
    expect(body.required_minimum).toBe(5);
  });

  it("201 on a clean cohort metric with n=7", async () => {
    const res = await pushRoute.POST(
      jsonReq(
        "http://test/api/realty/cohort/push",
        {
          module: "land-intel",
          metric_key: "median_price_per_sqyd_madhapur_2BHK_2024Q4",
          cohort_value: 38500,
          n_contributors: 7,
          ts_window: "2024-Q4",
        },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(201);
  });

  it("400 when fields missing", async () => {
    const res = await pushRoute.POST(
      jsonReq(
        "http://test/api/realty/cohort/push",
        {
          module: "land-intel",
        },
        { "x-polycloud-key": apiKey },
      ),
    );
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// /api/realty/builders
// ---------------------------------------------------------------------------

describe("POST /api/realty/builders", () => {
  it("401-ish (auth error) when setup_token is invalid", async () => {
    const res = await buildersRoute.POST(
      jsonReq("http://test/api/realty/builders", {
        setup_token: "nope",
        name: "X",
        region: "Y",
      }),
    );
    expect(res.status).toBe(401);
  });

  it("400 when fields missing", async () => {
    const res = await buildersRoute.POST(
      jsonReq("http://test/api/realty/builders", { setup_token: "x" }),
    );
    expect(res.status).toBe(400);
  });
});
