/**
 * Tests for the DB-backed customer dashboard store + user onboarding.
 *
 * Run: `npm test`
 *
 * Uses an on-disk libsql file per test process so the lazy singleton
 * inside `app/lib/email/db.ts` gets a clean DB.
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { unlinkSync, existsSync } from "node:fs";

const DB_FILE = join(
  tmpdir(),
  `polycloud-clients-test-${process.pid}-${Date.now()}.db`,
);
process.env.TURSO_DATABASE_URL = `file:${DB_FILE}`;
// users.ts hashes passwords with a key length-padded secret; verifyUser
// also reads from auth helpers, but those only matter for JWT signing
// (not exercised here). Set a placeholder so users.ts doesn't crash.
process.env.AUTH_SECRET = "test-secret-padded-out-to-32-chars-aaaaaaa";

type ClientsMod = typeof import("../clients");
type UsersMod = typeof import("../users");
let clients: ClientsMod;
let users: UsersMod;

before(async () => {
  clients = await import("../clients");
  users = await import("../users");
  clients._resetSchemaCacheForTests();
  users._resetUsersSchemaCacheForTests();
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

describe("getClient — static fallback", () => {
  it("returns the static kumar-textiles dashboard when DB has no row", async () => {
    const c = await clients.getClient("kumar-textiles");
    assert.ok(c, "expected kumar-textiles to resolve via static fallback");
    assert.equal(c?.meta.slug, "kumar-textiles");
  });

  it("returns null for a slug in neither store", async () => {
    const c = await clients.getClient("does-not-exist-anywhere");
    assert.equal(c, null);
  });
});

describe("upsertClient + getClient — DB path", () => {
  it("inserts a new client and reads it back", async () => {
    const skel = clients.buildSkeletonClientData({
      slug: "acme-cement",
      name: "Acme Cement Pvt Ltd",
      bundle: "growth",
      location: "Hyderabad · Industrial",
    });
    const r = await clients.upsertClient("acme-cement", skel, "private");
    assert.equal(r.ok, true);

    const got = await clients.getClient("acme-cement");
    assert.ok(got);
    assert.equal(got?.meta.slug, "acme-cement");
    assert.equal(got?.meta.name, "Acme Cement Pvt Ltd");
    assert.equal(got?.meta.bundle, "growth");
    assert.equal(got?.auth, "private");
  });

  it("updates an existing row on conflict", async () => {
    const skel = clients.buildSkeletonClientData({
      slug: "acme-cement",
      name: "Acme Cement Holdings",
      bundle: "total-growth",
    });
    const r = await clients.upsertClient("acme-cement", skel, "private");
    assert.equal(r.ok, true);

    const got = await clients.getClient("acme-cement");
    assert.equal(got?.meta.name, "Acme Cement Holdings");
    assert.equal(got?.meta.bundle, "total-growth");
  });

  it("rejects a non-kebab slug", async () => {
    const skel = clients.buildSkeletonClientData({
      slug: "acme-cement",
      name: "x",
      bundle: "growth",
    });
    const r = await clients.upsertClient("Acme Cement", skel, "private");
    assert.equal(r.ok, false);
  });

  it("rejects when data.meta.slug doesn't match the slug param", async () => {
    const skel = clients.buildSkeletonClientData({
      slug: "x",
      name: "x",
      bundle: "growth",
    });
    const r = await clients.upsertClient("y", skel, "private");
    assert.equal(r.ok, false);
  });
});

describe("slugExists", () => {
  it("returns true for static slugs", async () => {
    assert.equal(await clients.slugExists("kumar-textiles"), true);
  });
  it("returns true for DB slugs", async () => {
    assert.equal(await clients.slugExists("acme-cement"), true);
  });
  it("returns false for unknown slugs", async () => {
    assert.equal(await clients.slugExists("nope-not-here"), false);
  });
});

describe("listClients", () => {
  it("returns DB rows + static rows, deduped, DB-first", async () => {
    const all = await clients.listClients();
    const slugs = all.map((c) => c.slug);
    // The DB-onboarded one and the three static ones must all appear.
    assert.ok(slugs.includes("acme-cement"));
    assert.ok(slugs.includes("kumar-textiles"));
    assert.ok(slugs.includes("polycloud"));
    assert.ok(slugs.includes("viratkota"));
    // No duplicates
    assert.equal(new Set(slugs).size, slugs.length);
    // Source labelled correctly
    const acme = all.find((c) => c.slug === "acme-cement");
    assert.equal(acme?.source, "db");
    const kumar = all.find((c) => c.slug === "kumar-textiles");
    assert.equal(kumar?.source, "static");
  });
});

describe("deleteClient", () => {
  it("removes a DB row", async () => {
    const r = await clients.deleteClient("acme-cement");
    assert.equal(r.ok, true);
    assert.equal(r.existedInDb, true);
    assert.equal(await clients.getClient("acme-cement"), null);
  });

  it("is a no-op for static slugs (returns existedInDb: false)", async () => {
    const r = await clients.deleteClient("kumar-textiles");
    assert.equal(r.ok, true);
    assert.equal(r.existedInDb, false);
    // Static row still resolves
    const got = await clients.getClient("kumar-textiles");
    assert.ok(got);
  });
});

// ---------------------------------------------------------------------------

describe("upsertUser + verifyUser — DB path", () => {
  it("creates a customer login and verifies it", async () => {
    const r = await users.upsertUser({
      email: "owner@acmecement.com",
      password: "hunter2-but-longer",
      caps: { ops: false, ten: ["acme-cement"], lab: false },
      notes: "test fixture",
    });
    assert.equal(r.ok, true);

    const verified = await users.verifyUser(
      "owner@acmecement.com",
      "hunter2-but-longer",
    );
    assert.ok(verified, "expected verification to succeed");
    assert.deepEqual(verified?.caps, {
      ops: false,
      ten: ["acme-cement"],
      lab: false,
    });
  });

  it("rejects the wrong password", async () => {
    const v = await users.verifyUser("owner@acmecement.com", "wrong-password");
    assert.equal(v, null);
  });

  it("verifies regardless of email case (stored lowercased)", async () => {
    const v = await users.verifyUser(
      "Owner@AcmeCement.COM",
      "hunter2-but-longer",
    );
    assert.ok(v);
  });

  it("userExists returns true for an onboarded email", async () => {
    assert.equal(await users.userExists("owner@acmecement.com"), true);
  });

  it("userExists returns false for an unknown email", async () => {
    assert.equal(await users.userExists("nobody@nowhere.com"), false);
  });

  it("rejects too-short passwords on insert", async () => {
    const r = await users.upsertUser({
      email: "short@example.com",
      password: "short",
      caps: { ops: false, ten: [], lab: false },
    });
    assert.equal(r.ok, false);
  });

  it("upsert overwrites the password on conflict", async () => {
    const r = await users.upsertUser({
      email: "owner@acmecement.com",
      password: "rotated-password-1234",
      caps: { ops: false, ten: ["acme-cement"], lab: false },
    });
    assert.equal(r.ok, true);
    // Old password no longer works
    const v1 = await users.verifyUser(
      "owner@acmecement.com",
      "hunter2-but-longer",
    );
    assert.equal(v1, null);
    // New password works
    const v2 = await users.verifyUser(
      "owner@acmecement.com",
      "rotated-password-1234",
    );
    assert.ok(v2);
  });
});
