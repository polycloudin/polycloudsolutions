import { safeDb, getDb } from "./email/db";
import type { Client } from "@libsql/client";

/**
 * Realty platform — builder provisioning + cohort feed.
 *
 * Spec: INTEGRATION.md §4c.
 *
 * NON-NEGOTIABLE DATA-SOVEREIGNTY RULE
 * ------------------------------------
 * The portal NEVER accepts raw scrape output from Realty. If a request
 * body matches the shape of a Dharani plot list or a 99acres listing,
 * we drop it on the floor and 422.
 *
 * The Realty pull-quote — "we cannot show you a single builder's data
 * even if subpoenaed" — depends on this enforcement working. Three
 * layers protect that promise:
 *
 *   1. The local Realty agent's `cohort/anonymizer.py` strips PII +
 *      gates on ≥5 contributors BEFORE any push.
 *   2. The route handler `/api/realty/cohort/push` uses
 *      `looksLikeRawScrape` to reject anything that even hints at
 *      individual records.
 *   3. The DB has a CHECK constraint enforcing `n_contributors >= 5`
 *      so a buggy code path cannot insert a privacy-violating row.
 *
 * If you find yourself relaxing any of these layers, stop. Talk to VK.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RealtyBuilder {
  slug: string;
  name: string;
  region: string;
  api_key_hash: string;
  signed_up_at: string;
  last_push_at: string | null;
  status: "active" | "suspended" | "revoked";
}

export interface RealtyCohortMetric {
  module: string;
  metric_key: string;       // e.g. "median_price_per_sqyd_madhapur_2BHK_2024Q4"
  cohort_value: number;
  n_contributors: number;   // MUST be >= 5
  ts_window: string;        // e.g. "2024-Q4"
  source_payload?: Record<string, unknown>;
}

export interface RealtyCohortRow extends RealtyCohortMetric {
  id: number;
  received_at: string;
}

// Inline stub for Lane A's api-keys module — replace at integration time.
// Lane A creates `app/lib/api-keys.ts` with `validateApiKey()` and
// `generateKey()`. Until that lands, we mint keys here so provisioning
// is end-to-end testable.
export interface IssuedKey {
  token: string;            // pck_live_<32-char>
  hash: string;             // sha256(token), what we persist
  scopes: string[];         // ["usage:write", "events:write"]
}

const KEY_PREFIX = "pck_live_";
const HEX_RE = /^[a-f0-9]+$/i;

function bytesToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(digest);
}

function randomToken(byteLen = 24): string {
  // pck_live_ + 48-hex-char body (24 bytes). Above the 32-char minimum
  // mentioned in INTEGRATION.md §2b — extra entropy is free.
  const buf = new Uint8Array(byteLen);
  crypto.getRandomValues(buf);
  return KEY_PREFIX + bytesToHex(buf.buffer);
}

/**
 * STUB: replace with `import { generateKey } from "./api-keys"` once
 * Lane A's module lands. Local mint keeps the lane independently
 * testable + lets `npm run build` succeed.
 */
async function generateKey(scopes: string[]): Promise<IssuedKey> {
  const token = randomToken();
  const hash = await sha256Hex(token);
  return { token, hash, scopes };
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

let _schemaReady = false;

async function ensureSchema(db: Client): Promise<void> {
  if (_schemaReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS realty_builders (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      api_key_hash TEXT NOT NULL,
      signed_up_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_push_at TEXT,
      status TEXT NOT NULL DEFAULT 'active'
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS realty_cohort (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module TEXT NOT NULL,
      metric_key TEXT NOT NULL,
      cohort_value REAL NOT NULL,
      n_contributors INTEGER NOT NULL,
      ts_window TEXT NOT NULL,
      source_payload_json TEXT,
      received_at TEXT NOT NULL DEFAULT (datetime('now')),
      CHECK (n_contributors >= 5)
    )
  `);
  await db.execute(
    `CREATE INDEX IF NOT EXISTS ix_realty_cohort_module_window
       ON realty_cohort(module, ts_window)`,
  );
  await db.execute(`
    CREATE TABLE IF NOT EXISTS realty_used_setup_tokens (
      token TEXT PRIMARY KEY,
      consumed_at TEXT NOT NULL DEFAULT (datetime('now')),
      builder_slug TEXT NOT NULL
    )
  `);
  _schemaReady = true;
}

// ---------------------------------------------------------------------------
// Setup token validation
// ---------------------------------------------------------------------------

function readSetupTokens(): Set<string> {
  const raw = process.env.REALTY_SETUP_TOKENS || "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

/** True if `token` is in REALTY_SETUP_TOKENS env. */
export function isSetupTokenValid(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  return readSetupTokens().has(token);
}

// ---------------------------------------------------------------------------
// THE DATA-SOVEREIGNTY HEURISTIC
// ---------------------------------------------------------------------------

/**
 * Returns true if `body` smells like raw scrape data — a Dharani plot
 * row, a 99acres listing, or any object containing individual records.
 *
 * Heuristic checks (any one trips the rule):
 *   - The body OR its `payload` OR `source_payload` has a top-level
 *     PII / individual-record field: `plot_no`, `khasra_number`,
 *     `survey_no`, `owner_name`, `owner_phone`, `father_name`,
 *     `aadhaar`, `pan`, `address`, `email`, `phone`.
 *   - The body contains an array of objects where each object has 3+
 *     of those fields (the canonical Dharani plot list shape).
 *
 * This is a black-list, not a white-list — there's no such thing as a
 * legitimate `owner_phone` field on a cohort metric. If you need to
 * add new metric types in the future, add fields to the `ALLOWED_*`
 * sets in the route handlers, not exceptions here.
 *
 * Test coverage: see `app/lib/__tests__/realty.test.ts` →
 * "looksLikeRawScrape catches raw plot data".
 */
const RAW_RECORD_FIELDS = new Set<string>([
  "plot_no",
  "plot_number",
  "khasra",
  "khasra_number",
  "survey_no",
  "survey_number",
  "owner_name",
  "owner_phone",
  "father_name",
  "aadhaar",
  "aadhar",
  "pan",
  "address",
  "email",
  "phone",
  "mobile",
  "buyer_name",
  "seller_name",
  "registration_no",
]);

function hasAnyRawField(o: unknown): boolean {
  if (!o || typeof o !== "object") return false;
  for (const k of Object.keys(o as Record<string, unknown>)) {
    if (RAW_RECORD_FIELDS.has(k.toLowerCase())) return true;
  }
  return false;
}

function looksLikeRecordObject(o: unknown): boolean {
  if (!o || typeof o !== "object") return false;
  let hits = 0;
  for (const k of Object.keys(o as Record<string, unknown>)) {
    if (RAW_RECORD_FIELDS.has(k.toLowerCase())) {
      hits++;
      if (hits >= 3) return true;
    }
  }
  return false;
}

export function looksLikeRawScrape(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const obj = body as Record<string, unknown>;

  // Top-level field check
  if (hasAnyRawField(obj)) return true;

  // Nested payload / source_payload check
  for (const nestedKey of ["payload", "source_payload", "data", "row"]) {
    const v = obj[nestedKey];
    if (hasAnyRawField(v)) return true;
    // If nested value is an array of records, scan first few
    if (Array.isArray(v)) {
      for (let i = 0; i < Math.min(v.length, 5); i++) {
        if (looksLikeRecordObject(v[i])) return true;
      }
    }
  }

  // Top-level arrays (e.g. body is `{ items: [...] }`)
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (Array.isArray(v)) {
      for (let i = 0; i < Math.min(v.length, 5); i++) {
        if (looksLikeRecordObject(v[i])) return true;
      }
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Provisioning
// ---------------------------------------------------------------------------

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "builder";
}

export interface ProvisionInput {
  setupToken: string;
  name: string;
  region: string;
}

export interface ProvisionResult {
  success: boolean;
  builder_slug?: string;
  api_key?: string;          // shown ONCE to the operator
  error?: string;
}

/**
 * Verify the operator's setup token (single-use, from
 * REALTY_SETUP_TOKENS env), create the realty_builders row, generate
 * an API key with `usage:write` + `events:write` scopes, and return
 * the plaintext token to the caller.
 *
 * The plaintext token is ONLY returned here. We persist `sha256(token)`
 * — same pattern Stripe / Anthropic use. There's no way to recover it
 * later; rotation = generate a new key, swap in the agent's env.
 *
 * Returns `{ success: false, error: ... }` if:
 *   - setupToken not in env list
 *   - setupToken already consumed
 *   - DB unconfigured/unreachable
 *   - name/region empty
 *
 * Never throws.
 */
export async function provisionBuilder(
  input: ProvisionInput,
): Promise<ProvisionResult> {
  if (!input.setupToken || !isSetupTokenValid(input.setupToken)) {
    return { success: false, error: "invalid_setup_token" };
  }
  const name = (input.name ?? "").trim();
  const region = (input.region ?? "").trim();
  if (!name || !region) {
    return { success: false, error: "missing_fields" };
  }

  const baseSlug = slugify(name);
  const issued = await generateKey(["usage:write", "events:write"]);

  const r = await safeDb(async (db) => {
    await ensureSchema(db);

    // Check single-use: has this setup token already been consumed?
    const used = await db.execute({
      sql: `SELECT builder_slug FROM realty_used_setup_tokens WHERE token = ?`,
      args: [input.setupToken],
    });
    if (used.rows.length > 0) {
      return { success: false as const, error: "setup_token_already_used" };
    }

    // Find a unique slug
    let slug = baseSlug;
    let suffix = 1;
    while (true) {
      const existing = await db.execute({
        sql: `SELECT slug FROM realty_builders WHERE slug = ?`,
        args: [slug],
      });
      if (existing.rows.length === 0) break;
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
      if (suffix > 100) {
        return { success: false as const, error: "slug_collision" };
      }
    }

    // Atomic insert pair — if either fails, both roll back. Prevents
    // an orphan builder row with a still-reusable setup token.
    try {
      await db.batch(
        [
          {
            sql: `INSERT INTO realty_builders (slug, name, region, api_key_hash, status)
                  VALUES (?, ?, ?, ?, 'active')`,
            args: [slug, name, region, issued.hash],
          },
          {
            sql: `INSERT INTO realty_used_setup_tokens (token, builder_slug)
                  VALUES (?, ?)`,
            args: [input.setupToken, slug],
          },
        ],
        "write",
      );
    } catch (e) {
      console.error("[realty] provisioning batch failed:", e);
      return { success: false as const, error: "provisioning_failed" };
    }

    return { success: true as const, slug };
  });

  if (!r) {
    return { success: false, error: "db_unavailable" };
  }
  if (!r.success) {
    return { success: false, error: r.error };
  }
  return {
    success: true,
    builder_slug: r.slug,
    api_key: issued.token,
  };
}

// ---------------------------------------------------------------------------
// API key validation (stub — replace with Lane A's validateApiKey)
// ---------------------------------------------------------------------------

export interface ApiKeyContext {
  builder_slug: string;
  scopes: string[];
}

/**
 * Validate an inbound Realty builder API key. Looks the key up by sha256
 * hash against `realty_builders.api_key_hash` (NOT the generic `api_keys`
 * table — builder agents have their own provisioning path via
 * `/api/realty/builders` and need a builder_slug context, not a tenant).
 *
 * Returns { builder_slug, scopes } or null. NEVER THROWS.
 */
export async function validateRealtyApiKey(
  token: string | null | undefined,
): Promise<ApiKeyContext | null> {
  if (!token || typeof token !== "string") return null;
  if (!token.startsWith(KEY_PREFIX)) return null;
  const hash = await sha256Hex(token);
  // Lookup-by-hash uses a hex-only column, defence against SQL surprises
  if (!HEX_RE.test(hash)) return null;
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    const result = await db.execute({
      sql: `SELECT slug, status FROM realty_builders WHERE api_key_hash = ? LIMIT 1`,
      args: [hash],
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    if (String(row.status) !== "active") return null;
    return { slug: String(row.slug) };
  });
  if (!r) return null;
  return {
    builder_slug: r.slug,
    scopes: ["usage:write", "events:write"],
  };
}

// ---------------------------------------------------------------------------
// Cohort feed — the ≥5-contributors gate
// ---------------------------------------------------------------------------

/**
 * Insert a cohort metric. Returns true if persisted, false if rejected.
 *
 * Rejection causes:
 *   - n_contributors < 5  (caller should 422)
 *   - DB CHECK constraint blocks the insert  (defence-in-depth)
 *   - DB unconfigured/unreachable
 *
 * Never throws.
 */
export async function recordCohortMetric(
  metric: RealtyCohortMetric,
  builder_slug?: string,
): Promise<boolean> {
  if (!Number.isFinite(metric.n_contributors) || metric.n_contributors < 5) {
    return false;
  }
  if (
    !metric.module ||
    !metric.metric_key ||
    !Number.isFinite(metric.cohort_value) ||
    !metric.ts_window
  ) {
    return false;
  }

  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    try {
      await db.execute({
        sql: `INSERT INTO realty_cohort
              (module, metric_key, cohort_value, n_contributors, ts_window, source_payload_json)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          metric.module,
          metric.metric_key,
          metric.cohort_value,
          metric.n_contributors,
          metric.ts_window,
          metric.source_payload ? JSON.stringify(metric.source_payload) : null,
        ],
      });
    } catch (e) {
      // CHECK constraint violation = privacy gate working as designed.
      // Other errors = log + bail.
      console.error("[realty] recordCohortMetric insert failed:", e);
      return false;
    }
    if (builder_slug) {
      await db.execute({
        sql: `UPDATE realty_builders
              SET last_push_at = datetime('now')
              WHERE slug = ?`,
        args: [builder_slug],
      });
    }
    return true;
  });
  return r === true;
}

export interface ListCohortOptions {
  module?: string;
  ts_window?: string;
  limit?: number;
}

export async function listCohort(
  opts: ListCohortOptions = {},
): Promise<RealtyCohortRow[]> {
  const limit = Math.min(Math.max(opts.limit ?? 100, 1), 1000);
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    const where: string[] = [];
    const args: (string | number)[] = [];
    if (opts.module) {
      where.push("module = ?");
      args.push(opts.module);
    }
    if (opts.ts_window) {
      where.push("ts_window = ?");
      args.push(opts.ts_window);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    args.push(limit);
    const result = await db.execute({
      sql: `SELECT id, module, metric_key, cohort_value, n_contributors,
                   ts_window, source_payload_json, received_at
            FROM realty_cohort
            ${whereSql}
            ORDER BY received_at DESC
            LIMIT ?`,
      args,
    });
    return result.rows.map((row) => {
      const payload_raw = row.source_payload_json
        ? String(row.source_payload_json)
        : null;
      let source_payload: Record<string, unknown> | undefined;
      if (payload_raw) {
        try {
          const parsed = JSON.parse(payload_raw);
          if (parsed && typeof parsed === "object") {
            source_payload = parsed as Record<string, unknown>;
          }
        } catch {
          source_payload = undefined;
        }
      }
      return {
        id: Number(row.id),
        module: String(row.module),
        metric_key: String(row.metric_key),
        cohort_value: Number(row.cohort_value),
        n_contributors: Number(row.n_contributors),
        ts_window: String(row.ts_window),
        received_at: String(row.received_at),
        source_payload,
      };
    });
  });
  return r ?? [];
}

export async function listBuilders(): Promise<
  Array<Pick<RealtyBuilder, "slug" | "name" | "region" | "signed_up_at" | "last_push_at" | "status">>
> {
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    const result = await db.execute(
      `SELECT slug, name, region, signed_up_at, last_push_at, status
       FROM realty_builders
       ORDER BY signed_up_at DESC`,
    );
    return result.rows.map((row) => ({
      slug: String(row.slug),
      name: String(row.name),
      region: String(row.region),
      signed_up_at: String(row.signed_up_at),
      last_push_at: row.last_push_at == null ? null : String(row.last_push_at),
      status: String(row.status) as RealtyBuilder["status"],
    }));
  });
  return r ?? [];
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/** Reset the schema-cache so a freshly opened in-memory DB rebuilds. */
export function _resetSchemaCacheForTests(): void {
  _schemaReady = false;
}

/** Direct DB access for cross-module dashboards. */
export function _getDb(): Client | null {
  return getDb();
}
