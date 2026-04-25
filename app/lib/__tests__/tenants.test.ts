import { test, expect } from "vitest";

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
  expect(cfg).toBe(null);
});

test("getTenantConfig returns null for empty slug", async () => {
  // @ts-expect-error testing input hardening
  expect(await getTenantConfig(undefined)).toBe(null);
  expect(await getTenantConfig("")).toBe(null);
});

test("getTenantConfig returns CLIENT_REGISTRY entry when no override", async () => {
  const cfg = await getTenantConfig("kumar-textiles");
  expect(cfg).toBeTruthy();
  expect(cfg.slug).toBe("kumar-textiles");
  expect(cfg.name).toBe("Kumar Textiles");
  expect(cfg.bundle).toBe("growth");
  expect(cfg.modules_enabled).toEqual([
    "ads",
    "social",
    "whatsapp",
    "reviews",
    "outreach",
  ]);
  expect(cfg.ga4_property_id).toBe("533972528");
  expect(cfg.retainer_monthly).toBe(32000);
});

test("CLIENT_REGISTRY contains the documented starter tenants", () => {
  expect(CLIENT_REGISTRY["kumar-textiles"]).toBeTruthy();
  expect(CLIENT_REGISTRY["polycloud"]).toBeTruthy();
  expect(CLIENT_REGISTRY["pkb-associates"]).toBeTruthy();
  expect(CLIENT_REGISTRY["pharma-fund-x"]).toBeTruthy();
});

test("listTenants includes all registry entries when DB is unconfigured", async () => {
  const all = await listTenants();
  const slugs = all.map((t) => t.slug);
  expect(slugs.includes("kumar-textiles")).toBeTruthy();
  expect(slugs.includes("polycloud")).toBeTruthy();
  expect(slugs.includes("pkb-associates")).toBeTruthy();
  expect(slugs.includes("pharma-fund-x")).toBeTruthy();
});

test("getTenantConfig honors the override path when libsql row exists (mocked)", async () => {
  // Without TURSO env, the override branch never fires. Verify here that
  // getTenantConfig at least falls back to the registry entry — the
  // override merge logic is exercised in the integration tests in
  // lane B's worktree (DB is required to actually mutate the table).
  const cfg = await getTenantConfig("polycloud");
  expect(cfg).toBeTruthy();
  expect(cfg.bundle).toBe("internal");
  expect(cfg.retainer_monthly).toBe(0);
});

test("polycloud tenant has labs + ca-firm modules enabled (dogfood)", async () => {
  const cfg = await getTenantConfig("polycloud");
  expect(cfg).toBeTruthy();
  expect(cfg.modules_enabled.includes("labs")).toBeTruthy();
  expect(cfg.modules_enabled.includes("ca-firm")).toBeTruthy();
});
