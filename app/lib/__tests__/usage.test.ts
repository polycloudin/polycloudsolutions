/**
 * Usage telemetry tests.
 *
 * Run: `npm test`
 *
 * libsql is pointed at a unique on-disk file per test file so the
 * lazy-singleton in `app/lib/email/db.ts` gets a clean DB.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { tmpdir } from "node:os";
import { join } from "node:path";
import { unlinkSync, existsSync } from "node:fs";

const DB_FILE = join(
  tmpdir(),
  `polycloud-realty-usage-test-${process.pid}-${Date.now()}.db`,
);
process.env.TURSO_DATABASE_URL = `file:${DB_FILE}`;

// Late-imported in before() so env is fully set first
type UsageMod = typeof import("../usage");
type RealtyMod = typeof import("../realty");
let usage: UsageMod;
let realty: RealtyMod;

beforeAll(async () => {
  usage = await import("../usage");
  realty = await import("../realty");
  usage._resetSchemaCacheForTests();
  realty._resetSchemaCacheForTests();
});

afterAll(() => {
  if (existsSync(DB_FILE)) {
    try {
      unlinkSync(DB_FILE);
    } catch {
      // ignore cleanup failures
    }
  }
});

// ---------------------------------------------------------------------------

describe("recordUsage", () => {
  it("persists a valid event and aggregateUsage finds it", async () => {
    const ok = await usage.recordUsage({
      tenant: "anon-builder-aaa",
      module: "land-intel",
      event: "card-opened",
      ts: new Date().toISOString(),
      payload: { duration_s: 47 },
    });
    expect(ok).toBe(true, "recordUsage should return true on success");

    const rows = await usage.aggregateUsage({ module: "land-intel" });
    expect(rows.length >= 1, "aggregateUsage should return at least one row").toBeTruthy();
    const found = rows.find(
      (r) => r.tenant === "anon-builder-aaa" && r.event === "card-opened",
    );
    expect(found, "should find the event we just inserted").toBeTruthy();
    expect(found?.count).toBe(1);
  });

  it("aggregates multiple events per (module, event, tenant)", async () => {
    const ts = new Date().toISOString();
    await usage.recordUsage({ tenant: "t-1", module: "intel", event: "open", ts });
    await usage.recordUsage({ tenant: "t-1", module: "intel", event: "open", ts });
    await usage.recordUsage({ tenant: "t-1", module: "intel", event: "open", ts });
    const rows = await usage.aggregateUsage({ module: "intel" });
    const sum = rows
      .filter((r) => r.tenant === "t-1" && r.event === "open")
      .reduce((acc, r) => acc + r.count, 0);
    expect(sum).toBe(3, "three inserts should aggregate to count=3");
  });

  it("does not validate at the lib layer (route filters first)", async () => {
    // recordUsage itself does not validate — that's the route's job.
    // This test pins behavior: lib accepts what it's given.
    const ok = await usage.recordUsage({
      tenant: "x",
      module: "y",
      event: "z",
      ts: "2026-01-01T00:00:00Z",
    });
    expect(ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------

describe("assertMinContributors", () => {
  it("returns false for k=4 (below the cohort floor)", () => {
    const rows = [
      { tenant: "a" },
      { tenant: "b" },
      { tenant: "c" },
      { tenant: "d" },
    ];
    expect(usage.assertMinContributors(rows, 5)).toBe(false);
  });

  it("returns true for k=5", () => {
    const rows = [
      { tenant: "a" },
      { tenant: "b" },
      { tenant: "c" },
      { tenant: "d" },
      { tenant: "e" },
    ];
    expect(usage.assertMinContributors(rows, 5)).toBe(true);
  });

  it("dedupes by tenant — 5 rows from 3 tenants is below the floor", () => {
    const rows = [
      { tenant: "a" },
      { tenant: "a" },
      { tenant: "b" },
      { tenant: "b" },
      { tenant: "c" },
    ];
    expect(usage.assertMinContributors(rows, 5)).toBe(false);
  });

  it("returns true for k>=cardinality with enough unique tenants", () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({ tenant: `t${i}` }));
    expect(usage.assertMinContributors(rows, 5)).toBe(true);
    expect(usage.assertMinContributors(rows, 10)).toBe(true);
    expect(usage.assertMinContributors(rows, 11)).toBe(false);
  });

  it("ignores empty tenant strings", () => {
    const rows = [
      { tenant: "" },
      { tenant: "" },
      { tenant: "" },
      { tenant: "" },
      { tenant: "" },
    ];
    expect(usage.assertMinContributors(rows, 1)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// SCHEMA REJECT — the data-sovereignty heuristic
// ---------------------------------------------------------------------------

describe("looksLikeRawScrape (data-sovereignty heuristic)", () => {
  it("catches a Dharani plot row (top-level fields)", () => {
    const dharaniPlot = {
      plot_no: "234/A",
      khasra_number: "12-345",
      survey_no: "15/2",
      owner_name: "M Krishna Reddy",
      owner_phone: "+91 98xxxxxxx",
      area_sqyd: 250,
    };
    expect(realty.looksLikeRawScrape(dharaniPlot)).toBe(true);
  });

  it("catches a 99acres listing (top-level fields)", () => {
    const listing = {
      listing_id: "99-XYZ-123",
      address: "Plot 14, Madhapur, Hyderabad",
      owner_name: "K Rao",
      phone: "9876543210",
      price: 7500000,
    };
    expect(realty.looksLikeRawScrape(listing)).toBe(true);
  });

  it("catches an array of plot records nested under payload", () => {
    const body = {
      module: "land-intel",
      payload: [
        {
          plot_no: "1",
          khasra_number: "99",
          survey_no: "5",
        },
      ],
    };
    expect(realty.looksLikeRawScrape(body)).toBe(true);
  });

  it("catches records nested under source_payload", () => {
    const body = {
      module: "land-intel",
      metric_key: "x",
      source_payload: {
        owner_name: "X",
        plot_no: "Y",
      },
    };
    expect(realty.looksLikeRawScrape(body)).toBe(true);
  });

  it("catches record arrays under arbitrary array keys", () => {
    const body = {
      items: [
        {
          plot_no: "1",
          owner_name: "X",
          survey_no: "5",
        },
      ],
    };
    expect(realty.looksLikeRawScrape(body)).toBe(true);
  });

  it("ALLOWS a clean cohort metric", () => {
    const cleanCohort = {
      module: "land-intel",
      metric_key: "median_price_per_sqyd_madhapur_2BHK_2024Q4",
      cohort_value: 38500,
      n_contributors: 7,
      ts_window: "2024-Q4",
    };
    expect(realty.looksLikeRawScrape(cleanCohort)).toBe(false);
  });

  it("ALLOWS a clean usage event", () => {
    const usageEvent = {
      tenant: "anon-builder-id",
      module: "land-intel",
      event: "card-opened",
      ts: "2026-04-23T08:14:00Z",
      payload: { duration_s: 47 },
    };
    expect(realty.looksLikeRawScrape(usageEvent)).toBe(false);
  });

  it("does not flag empty objects or null", () => {
    expect(realty.looksLikeRawScrape(null)).toBe(false);
    expect(realty.looksLikeRawScrape({})).toBe(false);
    expect(realty.looksLikeRawScrape({ module: "x" })).toBe(false);
    expect(realty.looksLikeRawScrape("string")).toBe(false);
  });
});
