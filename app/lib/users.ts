/**
 * RBAC user store — seeded in-code for v1.
 *
 * Each user has an email + password (SHA-256 with per-user salt) + a set
 * of capability flags the JWT carries to proxy.ts at every request:
 *
 *   ops   — operator wildcard. Sees /dashboard, /portal, every /client/<slug>,
 *           every /labs/dashboard surface. Bypasses tenant/labs checks.
 *   ten[] — tenant slug allowlist for /client/<slug>. Empty if not a client.
 *   lab   — Labs intelligence access. Grants /labs/dashboard + /labs/dashboard/*.
 *
 * Add a user: append to USERS, generate the hash with
 *   node scripts/hash-password.mjs <plaintext>
 * which prints `salt:hex / hash:hex` to paste in.
 *
 * Migrate to libsql when user count > ~10 — see polycloud_portal_spec.md.
 */

import { safeDb } from "./db/schema";

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

export async function verifyUser(
  email: string,
  password: string
): Promise<User | null> {
  const u = await getUserByEmail(email);
  if (!u || u.salt === "REPLACE_ME") return null;
  const computed = await hashPassword(password, u.salt);
  return constantTimeEquals(computed, u.hash) ? u : null;
}

// ----------------------------------------------------------------
// libsql-backed user store (additive layer on top of the in-code USERS array)
//
// Resolution order:
//   1. libsql `users` table — authoritative if present
//   2. in-code USERS array — seed data + dev fallback
//
// On first DB read we copy any in-code USERS rows into libsql so the
// table starts populated. Idempotent: rows already in DB win.
// ----------------------------------------------------------------

let _migrated = false;
let _migratePromise: Promise<void> | null = null;

/**
 * Look up a user by email. libsql first, fall back to USERS array.
 * Always normalizes email comparison to lowercase.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!email) return null;
  const normalized = email.toLowerCase();
  await migrateUsersToDb();
  const dbRow = await safeDb(async (db) => {
    const r = await db.execute({
      sql: `SELECT email, salt, hash, caps_json, notes
            FROM users WHERE lower(email) = ? LIMIT 1`,
      args: [normalized],
    });
    const row = r.rows[0];
    if (!row) return null;
    const caps = parseCapsJson(row.caps_json);
    if (!caps) return null;
    return {
      email: String(row.email),
      salt: String(row.salt),
      hash: String(row.hash),
      caps,
      notes: row.notes === null ? undefined : String(row.notes),
    } satisfies User;
  });
  if (dbRow) return dbRow;
  return (
    USERS.find((u) => u.email.toLowerCase() === normalized) ?? null
  );
}

/** Insert or update a user. Returns true on success, false on failure. */
export async function addUser(user: User): Promise<boolean> {
  if (!user.email || !user.salt || !user.hash) return false;
  await migrateUsersToDb();
  const ok = await safeDb(async (db) => {
    await db.execute({
      sql: `INSERT INTO users (email, salt, hash, caps_json, notes)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              salt = excluded.salt,
              hash = excluded.hash,
              caps_json = excluded.caps_json,
              notes = excluded.notes`,
      args: [
        user.email.toLowerCase(),
        user.salt,
        user.hash,
        JSON.stringify(user.caps),
        user.notes ?? null,
      ],
    });
    return true;
  });
  return ok ?? false;
}

/** Update only the capability flags for an existing user. */
export async function updateUserCaps(
  email: string,
  caps: UserCaps,
): Promise<boolean> {
  if (!email) return false;
  await migrateUsersToDb();
  const ok = await safeDb(async (db) => {
    const r = await db.execute({
      sql: `UPDATE users SET caps_json = ? WHERE lower(email) = ?`,
      args: [JSON.stringify(caps), email.toLowerCase()],
    });
    return Number(r.rowsAffected ?? 0) > 0;
  });
  return ok ?? false;
}

/**
 * Copy USERS array seeds into libsql on first connection. Skips entries
 * with placeholder hashes (`REPLACE_ME`). Idempotent — `INSERT OR IGNORE`
 * means rows already in DB stay untouched.
 */
export async function migrateUsersToDb(): Promise<void> {
  if (_migrated) return;
  if (_migratePromise) return _migratePromise;
  _migratePromise = (async () => {
    const ok = await safeDb(async (db) => {
      for (const u of USERS) {
        if (u.salt === "REPLACE_ME" || u.hash === "REPLACE_ME") continue;
        await db.execute({
          sql: `INSERT OR IGNORE INTO users (email, salt, hash, caps_json, notes)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            u.email.toLowerCase(),
            u.salt,
            u.hash,
            JSON.stringify(u.caps),
            u.notes ?? null,
          ],
        });
      }
      return true;
    });
    // If safeDb returned null the DB isn't configured — that's fine, fall
    // back to the in-code USERS array. Mark migrated either way so we
    // don't spin on every login.
    _migrated = true;
    if (ok === null) {
      // No DB — silent. Login still works via the in-code USERS path.
      return;
    }
  })();
  return _migratePromise;
}

function parseCapsJson(raw: unknown): UserCaps | null {
  try {
    const obj = JSON.parse(String(raw));
    if (!obj || typeof obj !== "object") return null;
    if (
      typeof obj.ops !== "boolean" ||
      !Array.isArray(obj.ten) ||
      typeof obj.lab !== "boolean"
    ) {
      return null;
    }
    return {
      ops: obj.ops,
      ten: obj.ten.map(String),
      lab: obj.lab,
    };
  } catch {
    return null;
  }
}

/** Test-only helper to clear the migration latch. */
export function _resetUsersMigrationForTests(): void {
  _migrated = false;
  _migratePromise = null;
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
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
