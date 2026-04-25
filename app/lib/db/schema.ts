import { createClient, type Client } from "@libsql/client";

/**
 * Shared libsql connection + schema bootstrap for the portal integration.
 *
 * Mirrors the lazy-singleton + safeDb pattern in app/lib/email/db.ts but
 * exposes a single client for the portal-integration tables (api_keys,
 * tenants, users, events, notifications, usage_aggregates,
 * realty_builders, realty_cohort).
 *
 * All tables are created with CREATE TABLE IF NOT EXISTS — the bootstrap
 * is idempotent and runs on first DB read. If TURSO_DATABASE_URL is unset
 * the entire module no-ops gracefully (returns null) so dev works without
 * a database.
 */

let _client: Client | null = null;
let _schemaReady = false;
let _schemaPromise: Promise<void> | null = null;

/** Lazy singleton libsql client. Returns null when env is unconfigured. */
export function getDb(): Client | null {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return null;
  _client = createClient({ url, authToken });
  return _client;
}

/**
 * Run a DB op with timeout + try/catch. Never throws. Mirrors
 * app/lib/email/db.ts safeDb so the rest of the codebase has one shape.
 *
 * Behavior contract:
 * - Returns null when DB is unconfigured.
 * - Returns null on timeout, network error, or any thrown exception.
 * - Logs the underlying error with a tag so we can grep production logs.
 */
export async function safeDb<T>(
  op: (db: Client) => Promise<T>,
  timeoutMs = 1500,
): Promise<T | null> {
  const db = getDb();
  if (!db) return null;
  // Make sure schema is in place before the caller queries it.
  await ensureSchema();
  try {
    return await Promise.race<T>([
      op(db),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("db timeout")), timeoutMs),
      ),
    ]);
  } catch (e) {
    console.error("[db/schema] safeDb failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

/**
 * Create the full portal integration schema. Idempotent — every statement
 * is CREATE TABLE / CREATE INDEX IF NOT EXISTS. Safe to call from every
 * code path before its first read.
 *
 * Tables coordinated across foundation + lane B + lane C:
 *
 *   api_keys           — per-tenant machine-to-machine credentials (foundation)
 *   tenants            — TenantConfig overrides (foundation)
 *   users              — RBAC user store (foundation, migrating from TS array)
 *   events             — POST /api/events firehose (lane B)
 *   notifications      — POST /api/notifications inbox (lane B)
 *   usage_aggregates   — POST /api/usage telemetry rollups (lane C)
 *   realty_builders    — Realty builder provisioning (lane C)
 *   realty_cohort      — Anonymized cohort metrics, ≥5 contributors (lane C)
 */
export function ensureSchema(): Promise<void> {
  if (_schemaReady) return Promise.resolve();
  if (_schemaPromise) return _schemaPromise;
  const db = getDb();
  if (!db) {
    _schemaReady = true;
    return Promise.resolve();
  }
  _schemaPromise = (async () => {
    try {
      await db.batch(STATEMENTS, "write");
      _schemaReady = true;
    } catch (e) {
      // Don't keep the rejected promise — let a future call retry.
      _schemaPromise = null;
      console.error("[db/schema] ensureSchema failed:", e instanceof Error ? e.message : e);
      throw e;
    }
  })();
  return _schemaPromise;
}

/**
 * For tests + scripts that want to wipe the singleton (e.g. switch DBs
 * mid-process). Not used in production.
 */
export function _resetForTests(): void {
  _client = null;
  _schemaReady = false;
  _schemaPromise = null;
}

const STATEMENTS: string[] = [
  // ---------- foundation lane ----------
  `CREATE TABLE IF NOT EXISTS api_keys (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     hash TEXT UNIQUE NOT NULL,
     tenant TEXT NOT NULL,
     scopes TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     last_used_at TEXT,
     revoked_at TEXT,
     label TEXT
   )`,
  `CREATE INDEX IF NOT EXISTS ix_api_keys_tenant
     ON api_keys(tenant) WHERE revoked_at IS NULL`,

  `CREATE TABLE IF NOT EXISTS tenants (
     slug TEXT PRIMARY KEY,
     config_json TEXT NOT NULL,
     updated_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE TABLE IF NOT EXISTS users (
     email TEXT PRIMARY KEY,
     salt TEXT NOT NULL,
     hash TEXT NOT NULL,
     caps_json TEXT NOT NULL,
     notes TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  // ---------- lane B (events + notifications) ----------
  // Schema reserved here so all lanes converge on identical column shapes.
  `CREATE TABLE IF NOT EXISTS events (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     event_id TEXT UNIQUE NOT NULL,
     tenant TEXT NOT NULL,
     kind TEXT NOT NULL,
     actor TEXT,
     summary TEXT,
     signal TEXT,
     action TEXT,
     outcome TEXT,
     links_json TEXT,
     tags_json TEXT,
     payload_json TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,
  `CREATE INDEX IF NOT EXISTS ix_events_tenant_created
     ON events(tenant, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS ix_events_kind_created
     ON events(kind, created_at DESC)`,

  `CREATE TABLE IF NOT EXISTS notifications (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     tenant TEXT NOT NULL,
     kind TEXT NOT NULL,
     title TEXT NOT NULL,
     body TEXT,
     severity TEXT NOT NULL DEFAULT 'medium',
     link TEXT,
     expires_at TEXT,
     dismissed_at TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,
  `CREATE INDEX IF NOT EXISTS ix_notifications_tenant_active
     ON notifications(tenant, created_at DESC) WHERE dismissed_at IS NULL`,

  // ---------- lane C (usage + realty) ----------
  `CREATE TABLE IF NOT EXISTS usage_aggregates (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     tenant TEXT NOT NULL,
     module TEXT NOT NULL,
     event TEXT NOT NULL,
     ts_window TEXT NOT NULL,
     count INTEGER NOT NULL DEFAULT 0,
     payload_json TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     UNIQUE(tenant, module, event, ts_window)
   )`,
  `CREATE INDEX IF NOT EXISTS ix_usage_module_window
     ON usage_aggregates(module, ts_window DESC)`,

  `CREATE TABLE IF NOT EXISTS realty_builders (
     builder_slug TEXT PRIMARY KEY,
     status TEXT NOT NULL DEFAULT 'active',
     api_key_hash TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     last_seen_at TEXT
   )`,

  `CREATE TABLE IF NOT EXISTS realty_cohort (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     module TEXT NOT NULL,
     metric_key TEXT NOT NULL,
     cohort_value REAL,
     cohort_value_text TEXT,
     n_contributors INTEGER NOT NULL,
     ts_window TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     UNIQUE(module, metric_key, ts_window)
   )`,
  `CREATE INDEX IF NOT EXISTS ix_realty_cohort_module_window
     ON realty_cohort(module, ts_window DESC)`,
];
