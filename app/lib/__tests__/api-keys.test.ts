import { test, expect } from "vitest";

import {
  generateKey,
  hashKey,
  looksLikeApiKey,
  validateApiKey,
  hasScope,
  VALID_SCOPES,
  type AuthContext,
} from "../api-keys.ts";

// All tests below intentionally run with NO TURSO env set, so safeDb()
// short-circuits to null. That gives us deterministic, no-DB behaviour
// for the syntactic + header-validation paths.
delete process.env.TURSO_DATABASE_URL;
delete process.env.TURSO_AUTH_TOKEN;

test("generateKey produces a pck_live_-prefixed token with 32 hex chars", () => {
  const { token, hash } = generateKey();
  expect(token).toMatch(/^pck_live_[a-f0-9]{32}$/);
  // 32 hex chars after the prefix.
  expect(token.length).toBe("pck_live_".length + 32);
  // hash is sha256 hex (64 chars).
  expect(hash).toMatch(/^[a-f0-9]{64}$/);
});

test("generateKey returns a different token every call", () => {
  const a = generateKey();
  const b = generateKey();
  expect(a.token).not.toBe(b.token);
  expect(a.hash).not.toBe(b.hash);
});

test("hashKey is deterministic", () => {
  const t = "pck_live_" + "a".repeat(32);
  expect(hashKey(t)).toBe(hashKey(t));
});

test("hashKey changes when input changes", () => {
  const a = hashKey("pck_live_" + "a".repeat(32));
  const b = hashKey("pck_live_" + "b".repeat(32));
  expect(a).not.toBe(b);
});

test("looksLikeApiKey rejects garbage", () => {
  expect(looksLikeApiKey("")).toBe(false);
  expect(looksLikeApiKey("abc")).toBe(false);
  expect(looksLikeApiKey("pck_live_short")).toBe(false);
  expect(looksLikeApiKey("PCK_LIVE_" + "a".repeat(32))).toBe(false); // case-sensitive
  expect(looksLikeApiKey("pck_live_" + "a".repeat(31) + "g")).toBe(false); // non-hex
});

test("looksLikeApiKey accepts a freshly-minted token", () => {
  const { token } = generateKey();
  expect(looksLikeApiKey(token)).toBe(true);
});

test("validateApiKey returns null when both headers missing", async () => {
  const req = new Request("https://test/api/events", { method: "POST" });
  const result = await validateApiKey(req);
  expect(result).toBe(null);
});

test("validateApiKey returns null when only X-PolyCloud-Key set", async () => {
  const { token } = generateKey();
  const req = new Request("https://test/api/events", {
    method: "POST",
    headers: { "x-polycloud-key": token },
  });
  expect(await validateApiKey(req)).toBe(null);
});

test("validateApiKey returns null when only X-PolyCloud-Tenant set", async () => {
  const req = new Request("https://test/api/events", {
    method: "POST",
    headers: { "x-polycloud-tenant": "kumar-textiles" },
  });
  expect(await validateApiKey(req)).toBe(null);
});

test("validateApiKey returns null on malformed key syntax", async () => {
  const req = new Request("https://test/api/events", {
    method: "POST",
    headers: {
      "x-polycloud-key": "not-a-real-key",
      "x-polycloud-tenant": "kumar-textiles",
    },
  });
  expect(await validateApiKey(req)).toBe(null);
});

test("validateApiKey returns null when DB is unconfigured (no key row exists)", async () => {
  const { token } = generateKey();
  const req = new Request("https://test/api/events", {
    method: "POST",
    headers: {
      "x-polycloud-key": token,
      "x-polycloud-tenant": "kumar-textiles",
    },
  });
  // No TURSO env → safeDb returns null → no row → validation null.
  expect(await validateApiKey(req)).toBe(null);
});

test("validateApiKey never throws — even on an empty Request", async () => {
  const req = new Request("https://test/api/events");
  const result = await validateApiKey(req);
  expect(result).toBe(null);
});

test("hasScope checks the auth context scope list", () => {
  const ctx: AuthContext = {
    tenant: "kumar-textiles",
    scopes: ["events:write"],
    hash: "x".repeat(64),
  };
  expect(hasScope(ctx).toBe("events:write"), true);
  expect(hasScope(ctx).toBe("notifications:write"), false);
});

test("VALID_SCOPES has the 4 documented scopes", () => {
  expect(VALID_SCOPES.includes("events:write").toBeTruthy());
  expect(VALID_SCOPES.includes("notifications:write").toBeTruthy());
  expect(VALID_SCOPES.includes("usage:write").toBeTruthy());
  expect(VALID_SCOPES.includes("realty:write").toBeTruthy());
});
