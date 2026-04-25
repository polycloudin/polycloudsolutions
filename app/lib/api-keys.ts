import { createHash, randomBytes } from "node:crypto";
import { safeDb } from "./db/schema";

/**
 * Per-tenant API key issuance + validation for machine-to-machine calls.
 *
 * Pattern matches Stripe / Anthropic: token shown once at issuance,
 * server only ever stores sha256(token). Validation hashes the inbound
 * token and looks it up against the api_keys table.
 *
 * Header contract for inbound calls (POST /api/events etc.):
 *   X-PolyCloud-Key:    pck_live_<32-char-token>
 *   X-PolyCloud-Tenant: <tenant-slug>
 *
 * Behavior contract:
 *   - validateApiKey NEVER throws — returns null on every failure mode
 *     (missing headers, missing key, wrong tenant, revoked, no scopes,
 *     DB unconfigured, DB timeout). Caller branches on null.
 *   - Token format: prefix `pck_live_` + 32 hex chars (16 random bytes).
 *     Prefix matches the Stripe-style convention so anyone reading logs
 *     instantly recognises a leaked credential.
 *   - Hash is sha256 → 64 hex chars. Constant-time-ish equality is
 *     irrelevant because libsql does the comparison via WHERE hash = ?.
 */

export type ApiKeyScope =
  | "events:write"
  | "notifications:write"
  | "usage:write"
  | "realty:write";

export const VALID_SCOPES: readonly ApiKeyScope[] = [
  "events:write",
  "notifications:write",
  "usage:write",
  "realty:write",
];

export interface AuthContext {
  tenant: string;
  scopes: ApiKeyScope[];
  /** SHA-256 of the inbound token. Lets callers update last_used_at. */
  hash: string;
}

export interface IssuedKey {
  /** Plain token to hand to the operator. NEVER persisted. */
  token: string;
  /** SHA-256(token). Persisted; safe to log. */
  hash: string;
}

export interface ApiKeyRow {
  hash: string;
  tenant: string;
  scopes: ApiKeyScope[];
  label: string | null;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

const TOKEN_PREFIX = "pck_live_";
const TOKEN_BYTE_LEN = 16; // 16 random bytes → 32 hex chars

// ----------------------------------------------------------------
// Generation + hashing
// ----------------------------------------------------------------

/**
 * Mint a fresh API key. Returns the plaintext token (show once) and its
 * sha256 hash (persist this).
 */
export function generateKey(): IssuedKey {
  const random = randomBytes(TOKEN_BYTE_LEN).toString("hex");
  const token = `${TOKEN_PREFIX}${random}`;
  return { token, hash: hashKey(token) };
}

/** sha256 of the token, hex-encoded. Deterministic. */
export function hashKey(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Quick syntactic check before we even hash — saves a DB round-trip on
 * obvious garbage (random unrelated header value).
 */
export function looksLikeApiKey(token: string): boolean {
  return (
    typeof token === "string" &&
    token.startsWith(TOKEN_PREFIX) &&
    /^pck_live_[a-f0-9]{32}$/.test(token)
  );
}

// ----------------------------------------------------------------
// Inbound validation — used by /api/events, /api/notifications, etc.
// ----------------------------------------------------------------

/**
 * Validate an inbound request's API key + tenant. Reads the two custom
 * headers, hashes the key, looks up the row, and confirms tenant match
 * + non-revoked. Returns { tenant, scopes, hash } or null.
 *
 * Side-effect: bumps last_used_at on success (best-effort, ignores failure).
 *
 * NEVER THROWS — every failure mode collapses to null.
 */
export async function validateApiKey(req: Request): Promise<AuthContext | null> {
  try {
    const token = req.headers.get("x-polycloud-key") ?? "";
    const tenantHeader = req.headers.get("x-polycloud-tenant") ?? "";
    if (!token || !tenantHeader) return null;
    if (!looksLikeApiKey(token)) return null;

    const hash = hashKey(token);
    const row = await getKeyRow(hash);
    if (!row) return null;
    if (row.revoked_at) return null;
    if (row.tenant !== tenantHeader) return null;

    // Best-effort touch — fire and forget. Don't await; don't fail.
    void touchLastUsed(hash);

    return { tenant: row.tenant, scopes: row.scopes, hash };
  } catch (e) {
    // Defensive — validateApiKey is on the hot path of every machine-to-machine
    // call and must NEVER blow up the request. Log and return null.
    console.error("[api-keys] validateApiKey failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

/**
 * Fetch the api_keys row for a given hash. Returns null if DB is
 * unconfigured, the row doesn't exist, or any error occurs.
 */
export async function getKeyRow(hash: string): Promise<ApiKeyRow | null> {
  return safeDb(async (db) => {
    const r = await db.execute({
      sql: `SELECT hash, tenant, scopes, label, created_at, last_used_at, revoked_at
            FROM api_keys
            WHERE hash = ?
            LIMIT 1`,
      args: [hash],
    });
    const row = r.rows[0];
    if (!row) return null;
    return {
      hash: String(row.hash),
      tenant: String(row.tenant),
      scopes: parseScopes(row.scopes),
      label: row.label === null ? null : String(row.label),
      created_at: String(row.created_at),
      last_used_at: row.last_used_at === null ? null : String(row.last_used_at),
      revoked_at: row.revoked_at === null ? null : String(row.revoked_at),
    };
  });
}

// ----------------------------------------------------------------
// Issuance + listing + revocation (operator endpoints)
// ----------------------------------------------------------------

export interface IssueOptions {
  tenant: string;
  scopes: ApiKeyScope[];
  label?: string;
}

export interface IssueResult extends IssuedKey {
  tenant: string;
  scopes: ApiKeyScope[];
  label?: string;
}

/**
 * Issue + persist a new API key. Returns the plaintext token + persisted
 * fields. Plaintext token must be shown to the operator EXACTLY ONCE.
 *
 * Returns null if the DB write fails (e.g. DB unconfigured) — operator
 * UI shows "DB not configured" rather than a silently-broken token.
 */
export async function issueKey(opts: IssueOptions): Promise<IssueResult | null> {
  const { tenant, scopes, label } = opts;
  if (!tenant || !Array.isArray(scopes) || scopes.length === 0) return null;
  // Reject unknown scopes — keeps operator UI honest.
  for (const s of scopes) {
    if (!VALID_SCOPES.includes(s)) return null;
  }
  const issued = generateKey();
  const wrote = await safeDb(async (db) => {
    await db.execute({
      sql: `INSERT INTO api_keys (hash, tenant, scopes, label)
            VALUES (?, ?, ?, ?)`,
      args: [issued.hash, tenant, JSON.stringify(scopes), label ?? null],
    });
    return true;
  });
  if (!wrote) return null;
  return { ...issued, tenant, scopes, label };
}

/** List all keys (without plaintext — only the persisted columns). */
export async function listKeys(): Promise<ApiKeyRow[]> {
  const rows = await safeDb(async (db) => {
    const r = await db.execute({
      sql: `SELECT hash, tenant, scopes, label, created_at, last_used_at, revoked_at
            FROM api_keys
            ORDER BY created_at DESC`,
      args: [],
    });
    return r.rows.map((row) => ({
      hash: String(row.hash),
      tenant: String(row.tenant),
      scopes: parseScopes(row.scopes),
      label: row.label === null ? null : String(row.label),
      created_at: String(row.created_at),
      last_used_at: row.last_used_at === null ? null : String(row.last_used_at),
      revoked_at: row.revoked_at === null ? null : String(row.revoked_at),
    } satisfies ApiKeyRow));
  });
  return rows ?? [];
}

/**
 * Mark a key revoked. Returns true on success, false if the key doesn't
 * exist or DB is unconfigured.
 */
export async function revokeKey(hash: string): Promise<boolean> {
  if (!hash) return false;
  const ok = await safeDb(async (db) => {
    const r = await db.execute({
      sql: `UPDATE api_keys
            SET revoked_at = datetime('now')
            WHERE hash = ? AND revoked_at IS NULL`,
      args: [hash],
    });
    return Number(r.rowsAffected ?? 0) > 0;
  });
  return ok ?? false;
}

/** Best-effort `last_used_at` update. Silent on failure. */
async function touchLastUsed(hash: string): Promise<void> {
  await safeDb(async (db) => {
    await db.execute({
      sql: `UPDATE api_keys
            SET last_used_at = datetime('now')
            WHERE hash = ?`,
      args: [hash],
    });
  });
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function parseScopes(raw: unknown): ApiKeyScope[] {
  try {
    const arr = JSON.parse(String(raw));
    if (!Array.isArray(arr)) return [];
    return arr.filter((s): s is ApiKeyScope =>
      VALID_SCOPES.includes(s as ApiKeyScope),
    );
  } catch {
    return [];
  }
}

/** Convenience for routes: confirm the auth context has the requested scope. */
export function hasScope(ctx: AuthContext, scope: ApiKeyScope): boolean {
  return ctx.scopes.includes(scope);
}
