/**
 * RBAC user store — hybrid (libsql + in-code).
 *
 * Each user has an email + password (SHA-256 with per-user salt) + a set
 * of capability flags the JWT carries to proxy.ts at every request:
 *
 *   ops   — operator wildcard. Sees /dashboard, /portal, every /client/<slug>,
 *           every /labs/dashboard surface. Bypasses tenant/labs checks.
 *   ten[] — tenant slug allowlist for /client/<slug>. Empty if not a client.
 *   lab   — Labs intelligence access. Grants /labs/dashboard + /labs/dashboard/*.
 *
 * Resolution order (verifyUser):
 *   1. app_users table (libsql) — every customer onboarded via /admin/clients
 *   2. USERS array below — operator bootstrap (VK + Aasrith) and any users
 *      added by appending to the array + redeploying
 *
 * Operators don't go in the DB by default — they predate the migration and
 * stay in code. Customers go in the DB only — onboarding is a runtime op.
 *
 * Operator hash bootstrap: append to USERS, generate the hash with
 *   node scripts/hash-password.mjs <plaintext>
 * which prints `salt:hex / hash:hex` to paste in.
 */

import { safeDb } from "./email/db";
import type { Client } from "@libsql/client";

export interface UserCaps {
  ops: boolean;       // operator wildcard
  ten: string[];      // tenant slugs (subset of CLIENT_REGISTRY keys)
  lab: boolean;       // Labs intelligence
}

export interface User {
  email: string;
  salt: string;       // hex
  hash: string;       // hex SHA-256(salt + password)
  caps: UserCaps;
  notes?: string;
}

/**
 * BOOTSTRAP NOTE
 * --------------
 * For the first deploy, the legacy PRIVATE_DASH_PASS is also accepted as
 * an *operator* login — see app/api/auth/login/route.ts. Drop the legacy
 * fallback once every operator + client has a real entry below.
 *
 * To rotate a password: regenerate the salt+hash with the script and replace.
 * The JWT carries `iat`, so a re-signed cookie is always fresh; old cookies
 * stay valid until 14-day TTL — to invalidate immediately, also rotate
 * AUTH_SECRET in Vercel env.
 */
export const USERS: User[] = [
  // ---------- OPERATORS ----------
  {
    email: "vk@polycloud.in",
    // Placeholder hash — VK should regenerate via scripts/hash-password.mjs and replace.
    // Until then, login still works via the legacy PRIVATE_DASH_PASS shared password.
    salt: "REPLACE_ME",
    hash: "REPLACE_ME",
    caps: { ops: true, ten: [], lab: true },
    notes: "Founder · operator · regenerate hash on first login",
  },
  {
    email: "aasrith@polycloud.in",
    salt: "REPLACE_ME",
    hash: "REPLACE_ME",
    caps: { ops: true, ten: [], lab: true },
    notes: "Co-founder · operator · regenerate hash on first login",
  },
  // ---------- CLIENTS ----------
  // Example shape — uncomment and replace when real clients onboard.
  // {
  //   email: "owner@kumar-textiles.com",
  //   salt: "...",
  //   hash: "...",
  //   caps: { ops: false, ten: ["kumar-textiles"], lab: false },
  //   notes: "Kumar Textiles owner — sees only their own dashboard",
  // },
  // ---------- LABS SUBSCRIBERS ----------
  // {
  //   email: "fund-analyst@example.com",
  //   salt: "...",
  //   hash: "...",
  //   caps: { ops: false, ten: [], lab: true },
  //   notes: "Pharma intel subscriber — sees /labs/dashboard + company drilldowns",
  // },
];

// ----------------------------------------------------------------
// Hashing — Web Crypto SHA-256 with per-user salt. Edge-runtime safe.
// ----------------------------------------------------------------

const HEX = (buf: ArrayBuffer): string =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export async function hashPassword(plain: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + ":" + plain);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return HEX(digest);
}

/**
 * Verify a login attempt. DB-first, then static USERS array.
 *
 * Returns the matched User (with caps populated) or null if neither
 * store recognises the email/password combo. Never throws.
 */
export async function verifyUser(
  email: string,
  password: string
): Promise<User | null> {
  const normalized = email.trim().toLowerCase();

  // ---- Path 1: libsql ----
  const fromDb = await safeDb(async (db) => {
    await ensureUsersSchema(db);
    const r = await db.execute({
      sql: `SELECT email, salt, hash, caps, notes
            FROM app_users
            WHERE lower(email) = ?
            LIMIT 1`,
      args: [normalized],
    });
    const row = r.rows[0];
    if (!row) return null;
    let caps: UserCaps;
    try {
      caps = JSON.parse(String(row.caps)) as UserCaps;
    } catch {
      return null;
    }
    return {
      email: String(row.email),
      salt: String(row.salt),
      hash: String(row.hash),
      caps,
      notes: row.notes ? String(row.notes) : undefined,
    } as User;
  });

  if (fromDb && fromDb.salt !== "REPLACE_ME") {
    const computed = await hashPassword(password, fromDb.salt);
    if (constantTimeEquals(computed, fromDb.hash)) return fromDb;
    // DB row exists but password mismatched — do NOT fall through to the
    // static array (would let a code-defined password override an
    // intentionally-rotated DB password).
    return null;
  }

  // ---- Path 2: static bootstrap ----
  const u = USERS.find((x) => x.email.toLowerCase() === normalized);
  if (!u || u.salt === "REPLACE_ME") return null;
  const computed = await hashPassword(password, u.salt);
  return constantTimeEquals(computed, u.hash) ? u : null;
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// ----------------------------------------------------------------
// libsql persistence — used by /admin/clients onboarding
// ----------------------------------------------------------------

let _usersSchemaReady = false;

async function ensureUsersSchema(db: Client): Promise<void> {
  if (_usersSchemaReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS app_users (
      email      TEXT PRIMARY KEY,
      salt       TEXT NOT NULL,
      hash       TEXT NOT NULL,
      caps       TEXT NOT NULL,
      notes      TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  _usersSchemaReady = true;
}

/**
 * True when the email is taken in EITHER store. Used by onboarding to
 * reject duplicate signups before insert.
 */
export async function userExists(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (USERS.some((u) => u.email.toLowerCase() === normalized)) return true;
  const r = await safeDb(async (db) => {
    await ensureUsersSchema(db);
    const result = await db.execute({
      sql: `SELECT 1 FROM app_users WHERE lower(email) = ? LIMIT 1`,
      args: [normalized],
    });
    return result.rows.length > 0;
  });
  return r === true;
}

/**
 * Create or update a user in the DB. The plaintext password is hashed
 * here with a fresh 16-byte hex salt; callers never see the hash.
 *
 * Returns ok:false if libsql is unconfigured/unreachable. Never throws.
 */
export async function upsertUser(input: {
  email: string;
  password: string;
  caps: UserCaps;
  notes?: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, reason: "Invalid email" };
  }
  if (!input.password || input.password.length < 8) {
    return { ok: false, reason: "Password must be at least 8 characters" };
  }
  const salt = randomHex(16);
  const hash = await hashPassword(input.password, salt);
  const caps = JSON.stringify(input.caps);

  const ok = await safeDb(async (db) => {
    await ensureUsersSchema(db);
    await db.execute({
      sql: `INSERT INTO app_users (email, salt, hash, caps, notes)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              salt       = excluded.salt,
              hash       = excluded.hash,
              caps       = excluded.caps,
              notes      = excluded.notes,
              updated_at = datetime('now')`,
      args: [email, salt, hash, caps, input.notes ?? null],
    });
    return true;
  });
  return ok === true
    ? { ok: true }
    : { ok: false, reason: "Database is unconfigured or unreachable" };
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Test-only — clears the schema-cache so a fresh DB re-runs CREATE TABLE. */
export function _resetUsersSchemaCacheForTests(): void {
  _usersSchemaReady = false;
}

// ----------------------------------------------------------------
// Capability checks — used by proxy.ts after JWT decode
// ----------------------------------------------------------------

/** True if caps allows access to a /client/<slug> path. */
export function canSeeTenant(caps: UserCaps, slug: string): boolean {
  return caps.ops || caps.ten.includes(slug);
}

/** True if caps allows access to a /labs/dashboard path. */
export function canSeeLabs(caps: UserCaps): boolean {
  return caps.ops || caps.lab;
}

/** True if caps allows access to operator-only surfaces (/dashboard, /portal). */
export function isOperator(caps: UserCaps): boolean {
  return caps.ops;
}
