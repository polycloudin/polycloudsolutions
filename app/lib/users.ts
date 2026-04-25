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
  const u = USERS.find((x) => x.email.toLowerCase() === email.toLowerCase());
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
