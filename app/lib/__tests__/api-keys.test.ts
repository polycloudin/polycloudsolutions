import { test } from "node:test";
import assert from "node:assert/strict";
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
  assert.match(token, /^pck_live_[a-f0-9]{32}$/);
  // 32 hex chars after the prefix.
  assert.equal(token.length, "pck_live_".length + 32);
  // hash is sha256 hex (64 chars).
  assert.match(hash, /^[a-f0-9]{64}$/);
});

test("generateKey returns a different token every call", () => {
  const a = generateKey();
  const b = generateKey();
  assert.notEqual(a.token, b.token);
  assert.notEqual(a.hash, b.hash);
});

test("hashKey is deterministic", () => {
  const t = "pck_live_" + "a".repeat(32);
  assert.equal(hashKey(t), hashKey(t));
});

test("hashKey changes when input changes", () => {
  const a = hashKey("pck_live_" + "a".repeat(32));
  const b = hashKey("pck_live_" + "b".repeat(32));
  assert.notEqual(a, b);
});

test("looksLikeApiKey rejects garbage", () => {
  assert.equal(looksLikeApiKey(""), false);
  assert.equal(looksLikeApiKey("abc"), false);
  assert.equal(looksLikeApiKey("pck_live_short"), false);
  assert.equal(looksLikeApiKey("PCK_LIVE_" + "a".repeat(32)), false); // case-sensitive
  assert.equal(looksLikeApiKey("pck_live_" + "a".repeat(31) + "g"), false); // non-hex
});

test("looksLikeApiKey accepts a freshly-minted token", () => {
  const { token } = generateKey();
  assert.equal(looksLikeApiKey(token), true);
});

test("validateApiKey returns null when both headers missing", async () => {
  const req = new Request("https://test/api/events", { method: "POST" });
  const result = await validateApiKey(req);
  assert.equal(result, null);
});

test("validateApiKey returns null when only X-PolyCloud-Key set", async () => {
  const { token } = generateKey();
  const req = new Request("https://test/api/events", {
    method: "POST",
    headers: { "x-polycloud-key": token },
  });
  assert.equal(await validateApiKey(req), null);
});

test("validateApiKey returns null when only X-PolyCloud-Tenant set", async () => {
  const req = new Request("https://test/api/events", {
    method: "POST",
    headers: { "x-polycloud-tenant": "kumar-textiles" },
  });
  assert.equal(await validateApiKey(req), null);
});

test("validateApiKey returns null on malformed key syntax", async () => {
  const req = new Request("https://test/api/events", {
    method: "POST",
    headers: {
      "x-polycloud-key": "not-a-real-key",
      "x-polycloud-tenant": "kumar-textiles",
    },
  });
  assert.equal(await validateApiKey(req), null);
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
  assert.equal(await validateApiKey(req), null);
});

test("validateApiKey never throws — even on an empty Request", async () => {
  const req = new Request("https://test/api/events");
  await assert.doesNotReject(async () => {
    const result = await validateApiKey(req);
    assert.equal(result, null);
  });
});

test("hasScope checks the auth context scope list", () => {
  const ctx: AuthContext = {
    tenant: "kumar-textiles",
    scopes: ["events:write"],
    hash: "x".repeat(64),
  };
  assert.equal(hasScope(ctx, "events:write"), true);
  assert.equal(hasScope(ctx, "notifications:write"), false);
});

test("VALID_SCOPES has the 4 documented scopes", () => {
  assert.ok(VALID_SCOPES.includes("events:write"));
  assert.ok(VALID_SCOPES.includes("notifications:write"));
  assert.ok(VALID_SCOPES.includes("usage:write"));
  assert.ok(VALID_SCOPES.includes("realty:write"));
});
