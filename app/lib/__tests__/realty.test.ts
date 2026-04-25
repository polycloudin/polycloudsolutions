/**
 * Realty platform tests — provisioning, cohort gate, schema reject.
 *
 * The cohort gate is enforced at TWO layers:
 *   1. `recordCohortMetric` returns false for n_contributors < 5
 *   2. The DB CHECK constraint on `realty_cohort` rejects the insert
 * Both layers are covered below.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { tmpdir } from "node:os";
import { join } from "node:path";
import { unlinkSync, existsSync } from "node:fs";

const DB_FILE = join(
  tmpdir(),
  `polycloud-realty-test-${process.pid}-${Date.now()}.db`,
);
process.env.TURSO_DATABASE_URL = `file:${DB_FILE}`;
process.env.REALTY_SETUP_TOKENS = "tok-aaa,tok-bbb,tok-ccc,tok-push-test";

type RealtyMod = typeof import("../realty");
let realty: RealtyMod;

beforeAll(async () => {
  realty = await import("../realty");
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
// PROVISIONING
// ---------------------------------------------------------------------------

describe("provisionBuilder", () => {
  it("creates a builder + returns an api_key on a fresh setup token", async () => {
    const result = await realty.provisionBuilder({
      setupToken: "tok-aaa",
      name: "Aparna Constructions",
      region: "hyderabad",
    });
    expect(result.success).toBe(true);
    expect(result.builder_slug, "should return a slug").toBeTruthy();
    expect(result.api_key, "should return a plaintext api_key").toBeTruthy();
    expect(result.api_key!).toMatch(/^pck_live_[a-f0-9]{48}$/);

    // The key should also validate
    const ctx = await realty.validateRealtyApiKey(result.api_key);
    expect(ctx, "issued key should validate").toBeTruthy();
    expect(ctx?.builder_slug).toBe(result.builder_slug);
    expect(ctx?.scopes.includes("usage:write")).toBeTruthy();
    expect(ctx?.scopes.includes("events:write")).toBeTruthy();
  });

  it("rejects an invalid setup token", async () => {
    const result = await realty.provisionBuilder({
      setupToken: "definitely-not-in-env",
      name: "Foo",
      region: "bar",
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe("invalid_setup_token");
  });

  it("rejects a missing name or region", async () => {
    const a = await realty.provisionBuilder({
      setupToken: "tok-bbb",
      name: "",
      region: "x",
    });
    expect(a.success).toBe(false);
    expect(a.error).toBe("missing_fields");
  });

  it("enforces single-use — the same setup token cannot provision twice", async () => {
    // Use a token, then try again with the same one
    const reuseToken = "tok-ccc";
    const first = await realty.provisionBuilder({
      setupToken: reuseToken,
      name: "Builder One",
      region: "hyderabad",
    });
    expect(first.success).toBe(true);

    const second = await realty.provisionBuilder({
      setupToken: reuseToken,
      name: "Builder Two",
      region: "vijayawada",
    });
    expect(second.success).toBe(false);
    expect(second.error).toBe("setup_token_already_used");
  });
});

// ---------------------------------------------------------------------------
// COHORT GATE — the ≥5 contributors invariant
// ---------------------------------------------------------------------------

describe("recordCohortMetric — the ≥5 contributors gate", () => {
  it("REJECTS n_contributors=4 (below the floor)", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "test_metric_n4",
      cohort_value: 100,
      n_contributors: 4,
      ts_window: "2024-Q4",
    });
    expect(ok).toBe(false, "n=4 must be rejected by the lib");

    // Confirm nothing was inserted
    const rows = await realty.listCohort({ module: "land-intel" });
    const byKey = rows.find((r) => r.metric_key === "test_metric_n4");
    expect(byKey).toBe(undefined, "rejected metric must not be in the table");
  });

  it("REJECTS n_contributors=0", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "test_metric_n0",
      cohort_value: 100,
      n_contributors: 0,
      ts_window: "2024-Q4",
    });
    expect(ok).toBe(false);
  });

  it("REJECTS negative n_contributors", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "neg",
      cohort_value: 1,
      n_contributors: -1,
      ts_window: "2024-Q4",
    });
    expect(ok).toBe(false);
  });

  it("ACCEPTS n_contributors=5 (exactly at the floor)", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "test_metric_n5",
      cohort_value: 38500,
      n_contributors: 5,
      ts_window: "2024-Q4",
    });
    expect(ok).toBe(true, "n=5 must be accepted");

    const rows = await realty.listCohort({ module: "land-intel" });
    const byKey = rows.find((r) => r.metric_key === "test_metric_n5");
    expect(byKey, "accepted metric must be readable").toBeTruthy();
    expect(byKey?.n_contributors).toBe(5);
  });

  it("ACCEPTS n_contributors=7 (above the floor)", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "test_metric_n7",
      cohort_value: 42000,
      n_contributors: 7,
      ts_window: "2024-Q4",
      source_payload: { count_window_days: 90 },
    });
    expect(ok).toBe(true);
  });

  it("rejects malformed cohort_value", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "nan",
      cohort_value: NaN,
      n_contributors: 7,
      ts_window: "2024-Q4",
    });
    expect(ok).toBe(false);
  });

  it("rejects missing module / metric_key / ts_window", async () => {
    const a = await realty.recordCohortMetric({
      module: "",
      metric_key: "x",
      cohort_value: 1,
      n_contributors: 5,
      ts_window: "x",
    });
    expect(a).toBe(false);

    const b = await realty.recordCohortMetric({
      module: "x",
      metric_key: "",
      cohort_value: 1,
      n_contributors: 5,
      ts_window: "x",
    });
    expect(b).toBe(false);

    const c = await realty.recordCohortMetric({
      module: "x",
      metric_key: "x",
      cohort_value: 1,
      n_contributors: 5,
      ts_window: "",
    });
    expect(c).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// API KEY VALIDATION
// ---------------------------------------------------------------------------

describe("validateRealtyApiKey", () => {
  it("returns null for null/empty/non-string input", async () => {
    expect(await realty.validateRealtyApiKey(null)).toBe(null);
    expect(await realty.validateRealtyApiKey("")).toBe(null);
    expect(await realty.validateRealtyApiKey(undefined)).toBe(null);
  });

  it("returns null for a token with the wrong prefix", async () => {
    expect(await realty.validateRealtyApiKey("sk_live_abcdef")).toBe(null);
  });

  it("returns null for a well-formed but unknown token", async () => {
    const fake = "pck_live_" + "0".repeat(48);
    expect(await realty.validateRealtyApiKey(fake)).toBe(null);
  });
});

// ---------------------------------------------------------------------------
// LIST FUNCTIONS
// ---------------------------------------------------------------------------

describe("listBuilders / listCohort", () => {
  it("listBuilders returns provisioned builders", async () => {
    const builders = await realty.listBuilders();
    expect(builders.length >= 1, "should have at least one builder from provisioning tests").toBeTruthy();
    for (const b of builders) {
      expect(typeof b.slug === "string").toBeTruthy();
      expect(typeof b.name === "string").toBeTruthy();
      expect(typeof b.region === "string").toBeTruthy();
      expect(b.status === "active").toBeTruthy();
    }
  });

  it("listCohort filters by module", async () => {
    // We've inserted some land-intel rows above
    const rows = await realty.listCohort({ module: "land-intel" });
    for (const r of rows) {
      expect(r.module).toBe("land-intel");
      expect(r.n_contributors >= 5, "every returned row must have n>=5").toBeTruthy();
    }
  });

  it("listCohort respects limit", async () => {
    const rows = await realty.listCohort({ limit: 2 });
    expect(rows.length <= 2).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// DEFENCE IN DEPTH — DB CHECK constraint catches n<5 even if code lies
// ---------------------------------------------------------------------------

describe("DB CHECK constraint blocks n_contributors<5 directly", () => {
  it("a direct INSERT with n_contributors=3 throws", async () => {
    // Bypass recordCohortMetric entirely. Confirm the SCHEMA itself
    // refuses to hold a privacy-violating row.
    const db = realty._getDb();
    expect(db, "test DB must be open").toBeTruthy();

    let threw = false;
    try {
      await db!.execute({
        sql: `INSERT INTO realty_cohort
              (module, metric_key, cohort_value, n_contributors, ts_window)
              VALUES (?, ?, ?, ?, ?)`,
        args: ["land-intel", "direct_n3", 1, 3, "2024-Q4"],
      });
    } catch (e) {
      threw = true;
      expect(String(e)).toMatch(/CHECK constraint|n_contributors|constraint failed/i);
    }
    expect(threw).toBe(true);

    // And confirm nothing landed in the table for that key
    const rows = await realty.listCohort();
    const leaked = rows.find((r) => r.metric_key === "direct_n3");
    expect(leaked).toBe(undefined);
  });
});

// ---------------------------------------------------------------------------
// last_push_at timestamp updates when a builder pushes
// ---------------------------------------------------------------------------

describe("recordCohortMetric updates builder.last_push_at", () => {
  it("stamps last_push_at when builder_slug is supplied", async () => {
    const provision = await realty.provisionBuilder({
      setupToken: "tok-push-test",
      name: "Push-Test Builder",
      region: "test-region",
    });
    expect(provision.success).toBe(true);

    const before = await realty.listBuilders();
    const beforeRow = before.find((b) => b.slug === provision.builder_slug);
    expect(beforeRow?.last_push_at).toBe(null);

    const ok = await realty.recordCohortMetric(
      {
        module: "land-intel",
        metric_key: "push-stamp-test",
        cohort_value: 1,
        n_contributors: 5,
        ts_window: "2024-Q4",
      },
      provision.builder_slug,
    );
    expect(ok).toBe(true);

    const after = await realty.listBuilders();
    const afterRow = after.find((b) => b.slug === provision.builder_slug);
    expect(afterRow?.last_push_at, "last_push_at must be set after a push").toBeTruthy();
  });
});
