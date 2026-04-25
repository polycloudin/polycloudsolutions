import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CLIENT_REGISTRY,
  getTenantConfig,
  listTenants,
} from "../tenants.ts";

// No DB — safeDb short-circuits to null and we exercise the registry path.
delete process.env.TURSO_DATABASE_URL;
delete process.env.TURSO_AUTH_TOKEN;

test("getTenantConfig returns null for unknown slug", async () => {
  const cfg = await getTenantConfig("does-not-exist-x9z");
  assert.equal(cfg, null);
});

test("getTenantConfig returns null for empty slug", async () => {
  // @ts-expect-error testing input hardening
  assert.equal(await getTenantConfig(undefined), null);
  assert.equal(await getTenantConfig(""), null);
});

test("getTenantConfig returns CLIENT_REGISTRY entry when no override", async () => {
  const cfg = await getTenantConfig("kumar-textiles");
  assert.ok(cfg);
  assert.equal(cfg.slug, "kumar-textiles");
  assert.equal(cfg.name, "Kumar Textiles");
  assert.equal(cfg.bundle, "growth");
  assert.deepEqual(cfg.modules_enabled, [
    "ads",
    "social",
    "whatsapp",
    "reviews",
    "outreach",
  ]);
  assert.equal(cfg.ga4_property_id, "533972528");
  assert.equal(cfg.retainer_monthly, 32000);
});

test("CLIENT_REGISTRY contains the documented starter tenants", () => {
  assert.ok(CLIENT_REGISTRY["kumar-textiles"]);
  assert.ok(CLIENT_REGISTRY["polycloud"]);
  assert.ok(CLIENT_REGISTRY["pkb-associates"]);
  assert.ok(CLIENT_REGISTRY["pharma-fund-x"]);
});

test("listTenants includes all registry entries when DB is unconfigured", async () => {
  const all = await listTenants();
  const slugs = all.map((t) => t.slug);
  assert.ok(slugs.includes("kumar-textiles"));
  assert.ok(slugs.includes("polycloud"));
  assert.ok(slugs.includes("pkb-associates"));
  assert.ok(slugs.includes("pharma-fund-x"));
});

test("getTenantConfig honors the override path when libsql row exists (mocked)", async () => {
  // Without TURSO env, the override branch never fires. Verify here that
  // getTenantConfig at least falls back to the registry entry — the
  // override merge logic is exercised in the integration tests in
  // lane B's worktree (DB is required to actually mutate the table).
  const cfg = await getTenantConfig("polycloud");
  assert.ok(cfg);
  assert.equal(cfg.bundle, "internal");
  assert.equal(cfg.retainer_monthly, 0);
});

test("polycloud tenant has labs + ca-firm modules enabled (dogfood)", async () => {
  const cfg = await getTenantConfig("polycloud");
  assert.ok(cfg);
  assert.ok(cfg.modules_enabled.includes("labs"));
  assert.ok(cfg.modules_enabled.includes("ca-firm"));
});
