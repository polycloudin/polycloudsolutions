/**
 * Realty platform tests — provisioning, cohort gate, schema reject.
 *
 * The cohort gate is enforced at TWO layers:
 *   1. `recordCohortMetric` returns false for n_contributors < 5
 *   2. The DB CHECK constraint on `realty_cohort` rejects the insert
 * Both layers are covered below.
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
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

before(async () => {
  realty = await import("../realty");
  realty._resetSchemaCacheForTests();
});

after(() => {
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
    assert.equal(result.success, true);
    assert.ok(result.builder_slug, "should return a slug");
    assert.ok(result.api_key, "should return a plaintext api_key");
    assert.match(result.api_key!, /^pck_live_[a-f0-9]{48}$/);

    // The key should also validate
    const ctx = await realty.validateRealtyApiKey(result.api_key);
    assert.ok(ctx, "issued key should validate");
    assert.equal(ctx?.builder_slug, result.builder_slug);
    assert.ok(ctx?.scopes.includes("usage:write"));
    assert.ok(ctx?.scopes.includes("events:write"));
  });

  it("rejects an invalid setup token", async () => {
    const result = await realty.provisionBuilder({
      setupToken: "definitely-not-in-env",
      name: "Foo",
      region: "bar",
    });
    assert.equal(result.success, false);
    assert.equal(result.error, "invalid_setup_token");
  });

  it("rejects a missing name or region", async () => {
    const a = await realty.provisionBuilder({
      setupToken: "tok-bbb",
      name: "",
      region: "x",
    });
    assert.equal(a.success, false);
    assert.equal(a.error, "missing_fields");
  });

  it("enforces single-use — the same setup token cannot provision twice", async () => {
    // Use a token, then try again with the same one
    const reuseToken = "tok-ccc";
    const first = await realty.provisionBuilder({
      setupToken: reuseToken,
      name: "Builder One",
      region: "hyderabad",
    });
    assert.equal(first.success, true);

    const second = await realty.provisionBuilder({
      setupToken: reuseToken,
      name: "Builder Two",
      region: "vijayawada",
    });
    assert.equal(second.success, false);
    assert.equal(second.error, "setup_token_already_used");
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
    assert.equal(ok, false, "n=4 must be rejected by the lib");

    // Confirm nothing was inserted
    const rows = await realty.listCohort({ module: "land-intel" });
    const byKey = rows.find((r) => r.metric_key === "test_metric_n4");
    assert.equal(byKey, undefined, "rejected metric must not be in the table");
  });

  it("REJECTS n_contributors=0", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "test_metric_n0",
      cohort_value: 100,
      n_contributors: 0,
      ts_window: "2024-Q4",
    });
    assert.equal(ok, false);
  });

  it("REJECTS negative n_contributors", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "neg",
      cohort_value: 1,
      n_contributors: -1,
      ts_window: "2024-Q4",
    });
    assert.equal(ok, false);
  });

  it("ACCEPTS n_contributors=5 (exactly at the floor)", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "test_metric_n5",
      cohort_value: 38500,
      n_contributors: 5,
      ts_window: "2024-Q4",
    });
    assert.equal(ok, true, "n=5 must be accepted");

    const rows = await realty.listCohort({ module: "land-intel" });
    const byKey = rows.find((r) => r.metric_key === "test_metric_n5");
    assert.ok(byKey, "accepted metric must be readable");
    assert.equal(byKey?.n_contributors, 5);
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
    assert.equal(ok, true);
  });

  it("rejects malformed cohort_value", async () => {
    const ok = await realty.recordCohortMetric({
      module: "land-intel",
      metric_key: "nan",
      cohort_value: NaN,
      n_contributors: 7,
      ts_window: "2024-Q4",
    });
    assert.equal(ok, false);
  });

  it("rejects missing module / metric_key / ts_window", async () => {
    const a = await realty.recordCohortMetric({
      module: "",
      metric_key: "x",
      cohort_value: 1,
      n_contributors: 5,
      ts_window: "x",
    });
    assert.equal(a, false);

    const b = await realty.recordCohortMetric({
      module: "x",
      metric_key: "",
      cohort_value: 1,
      n_contributors: 5,
      ts_window: "x",
    });
    assert.equal(b, false);

    const c = await realty.recordCohortMetric({
      module: "x",
      metric_key: "x",
      cohort_value: 1,
      n_contributors: 5,
      ts_window: "",
    });
    assert.equal(c, false);
  });
});

// ---------------------------------------------------------------------------
// API KEY VALIDATION
// ---------------------------------------------------------------------------

describe("validateRealtyApiKey", () => {
  it("returns null for null/empty/non-string input", async () => {
    assert.equal(await realty.validateRealtyApiKey(null), null);
    assert.equal(await realty.validateRealtyApiKey(""), null);
    assert.equal(await realty.validateRealtyApiKey(undefined), null);
  });

  it("returns null for a token with the wrong prefix", async () => {
    assert.equal(
      await realty.validateRealtyApiKey("sk_live_abcdef"),
      null,
      "non-pck prefix must be rejected",
    );
  });

  it("returns null for a well-formed but unknown token", async () => {
    const fake = "pck_live_" + "0".repeat(48);
    assert.equal(await realty.validateRealtyApiKey(fake), null);
  });
});

// ---------------------------------------------------------------------------
// LIST FUNCTIONS
// ---------------------------------------------------------------------------

describe("listBuilders / listCohort", () => {
  it("listBuilders returns provisioned builders", async () => {
    const builders = await realty.listBuilders();
    assert.ok(builders.length >= 1, "should have at least one builder from provisioning tests");
    for (const b of builders) {
      assert.ok(typeof b.slug === "string");
      assert.ok(typeof b.name === "string");
      assert.ok(typeof b.region === "string");
      assert.ok(b.status === "active");
    }
  });

  it("listCohort filters by module", async () => {
    // We've inserted some land-intel rows above
    const rows = await realty.listCohort({ module: "land-intel" });
    for (const r of rows) {
      assert.equal(r.module, "land-intel");
      assert.ok(r.n_contributors >= 5, "every returned row must have n>=5");
    }
  });

  it("listCohort respects limit", async () => {
    const rows = await realty.listCohort({ limit: 2 });
    assert.ok(rows.length <= 2);
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
    assert.ok(db, "test DB must be open");

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
      assert.match(
        String(e),
        /CHECK constraint|n_contributors|constraint failed/i,
        "error must indicate the CHECK constraint",
      );
    }
    assert.equal(
      threw,
      true,
      "DB CHECK constraint must reject n_contributors<5 even when code bypasses the guard",
    );

    // And confirm nothing landed in the table for that key
    const rows = await realty.listCohort();
    const leaked = rows.find((r) => r.metric_key === "direct_n3");
    assert.equal(leaked, undefined, "rejected row must not be visible");
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
    assert.equal(provision.success, true);

    const before = await realty.listBuilders();
    const beforeRow = before.find((b) => b.slug === provision.builder_slug);
    assert.equal(beforeRow?.last_push_at, null);

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
    assert.equal(ok, true);

    const after = await realty.listBuilders();
    const afterRow = after.find((b) => b.slug === provision.builder_slug);
    assert.ok(afterRow?.last_push_at, "last_push_at must be set after a push");
  });
});
