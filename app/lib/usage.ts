import { safeDb, getDb } from "./email/db";
import type { Client } from "@libsql/client";

/**
 * Usage telemetry for the Realty cohort feed and per-tenant module engagement.
 *
 * Spec: INTEGRATION.md §3d.
 *
 * Two-layer privacy gate:
 *   1. The local Realty agent already anonymizes `tenant` to a hashed
 *      builder-id BEFORE pushing here. This module never sees raw
 *      builder identity, only the opaque id.
 *   2. The cohort feed enforces the ≥5-contributors rule (see
 *      `assertMinContributors`) before any aggregate is exposed in
 *      /admin/realty.
 *
 * Hard rule (INTEGRATION.md §4c): the portal NEVER accepts raw scrape
 * output (Dharani plot lists, 99acres listings, owner phone numbers,
 * etc.). The route handler enforces this via `looksLikeRawScrape` from
 * `./realty.ts` and rejects with 422.
 */

export interface UsageEvent {
  tenant: string;          // anonymized builder id from local agent
  module: string;          // e.g. "land-intel"
  event: string;           // e.g. "card-opened"
  ts: string;              // ISO 8601
  payload?: Record<string, unknown>;
}

export interface UsageAggregate {
  module: string;
  event: string;
  tenant: string;
  count: number;
  last_ts: string;
}

let _schemaReady = false;

async function ensureSchema(db: Client): Promise<void> {
  if (_schemaReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS usage_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant TEXT NOT NULL,
      module TEXT NOT NULL,
      event TEXT NOT NULL,
      ts TEXT NOT NULL,
      payload_json TEXT,
      received_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await db.execute(
    `CREATE INDEX IF NOT EXISTS ix_usage_module_ts ON usage_events(module, ts DESC)`,
  );
  _schemaReady = true;
}

/**
 * Persist a usage event. Never throws — Turso failures must not break
 * the local agent's push loop. Returns true on success, false if the
 * DB is unconfigured/unreachable or the insert failed.
 */
export async function recordUsage(usage: UsageEvent): Promise<boolean> {
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    await db.execute({
      sql: `INSERT INTO usage_events (tenant, module, event, ts, payload_json)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        usage.tenant,
        usage.module,
        usage.event,
        usage.ts,
        usage.payload ? JSON.stringify(usage.payload) : null,
      ],
    });
    return true;
  });
  return r === true;
}

export interface AggregateOptions {
  module?: string;        // filter to one module
  sinceIso?: string;      // optional lower bound
  limit?: number;         // max rows (default 200)
}

/**
 * Group usage events by (module, event, tenant) for the operator's
 * /admin/realty dashboard. The dashboard renders this as a per-builder
 * engagement count (anonymized — only the opaque tenant id is shown,
 * never the builder name).
 */
export async function aggregateUsage(
  opts: AggregateOptions = {},
): Promise<UsageAggregate[]> {
  const limit = Math.min(Math.max(opts.limit ?? 200, 1), 1000);
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    const where: string[] = [];
    const args: (string | number)[] = [];
    if (opts.module) {
      where.push("module = ?");
      args.push(opts.module);
    }
    if (opts.sinceIso) {
      where.push("ts >= ?");
      args.push(opts.sinceIso);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    args.push(limit);
    const result = await db.execute({
      sql: `SELECT module, event, tenant,
                   COUNT(*) AS count,
                   MAX(ts) AS last_ts
            FROM usage_events
            ${whereSql}
            GROUP BY module, event, tenant
            ORDER BY count DESC
            LIMIT ?`,
      args,
    });
    return result.rows.map((row) => ({
      module: String(row.module),
      event: String(row.event),
      tenant: String(row.tenant),
      count: Number(row.count),
      last_ts: String(row.last_ts),
    }));
  });
  return r ?? [];
}

/**
 * THE COHORT PRIVACY GATE.
 *
 * Validate that across N rows in a cohort window, at least k unique
 * tenants contributed. Returns false → caller drops the row (422).
 *
 * Same logic the local agent's `cohort/anonymizer.py` uses pre-push;
 * we re-enforce server-side because the portal cannot trust the agent
 * to have done it correctly. Defence in depth.
 *
 * @param rows - any array of objects with a `tenant` field
 * @param k    - minimum unique contributors (default 5)
 */
export function assertMinContributors<T extends { tenant: string }>(
  rows: T[],
  k = 5,
): boolean {
  if (k < 1) return true;
  const seen = new Set<string>();
  for (const r of rows) {
    if (typeof r.tenant === "string" && r.tenant.length > 0) {
      seen.add(r.tenant);
      if (seen.size >= k) return true;
    }
  }
  return false;
}

/**
 * Per-builder usage summary for the operator dashboard. Returns the
 * most-used (module, event) per tenant — used to surface "this builder
 * is heavily using land-intel" without leaking raw event payloads.
 */
export async function topModulesPerTenant(
  opts: { limit?: number } = {},
): Promise<UsageAggregate[]> {
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 500);
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    const result = await db.execute({
      sql: `SELECT module, event, tenant,
                   COUNT(*) AS count,
                   MAX(ts) AS last_ts
            FROM usage_events
            GROUP BY tenant, module
            ORDER BY count DESC
            LIMIT ?`,
      args: [limit],
    });
    return result.rows.map((row) => ({
      module: String(row.module),
      event: String(row.event),
      tenant: String(row.tenant),
      count: Number(row.count),
      last_ts: String(row.last_ts),
    }));
  });
  return r ?? [];
}

/**
 * Test-only helper — reset the schema-cache so a freshly opened
 * in-memory DB will re-run the CREATE TABLE statements.
 */
export function _resetSchemaCacheForTests(): void {
  _schemaReady = false;
}

/**
 * Direct DB exposure for the admin dashboard's "last push at" query
 * across realty_builders. Returns null if Turso is unconfigured.
 */
export function _getDbForRead(): Client | null {
  return getDb();
}
