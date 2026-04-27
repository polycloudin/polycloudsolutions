import { safeDb, getDb } from "./email/db";
import type { Client } from "@libsql/client";
import {
  CLIENT_REGISTRY as STATIC_REGISTRY,
} from "../client/data/registry";
import type { ClientData, Auth, Bundle } from "../client/data/types";

/**
 * Customer dashboard data store.
 *
 * Hybrid model:
 *   1. clients table (libsql/Turso) — every NEW customer onboarded via
 *      /admin/clients lives here as a JSON blob.
 *   2. STATIC_REGISTRY (app/client/data/registry.ts) — the three
 *      load-bearing dashboards that predate this migration:
 *        - kumar-textiles  (public sales demo)
 *        - polycloud       (internal — VK + Aasrith dashboard)
 *        - viratkota       (internal — VK personal)
 *      These keep their hand-curated .ts files. The registry is
 *      consulted only as a fallback when a slug isn't in the DB.
 *
 * Resolution order:
 *   getClient(slug) → DB row → static row → null
 *
 * Why a JSON blob and not a normalized schema:
 *   ClientData has 11 optional sections each with deep nested arrays
 *   (campaigns, leads, posts, drafts, etc.). Pre-PMF the shape will
 *   keep churning. Storing as JSON lets us evolve the type without
 *   migrations; reads are by primary key (no need to index inside).
 *   When a query needs cross-tenant aggregates, add a generated column.
 *
 * Server-only — never import from a "use client" file. Use the
 * /api/live/<slug> route as the client-side data path.
 */

let _schemaReady = false;

async function ensureSchema(db: Client): Promise<void> {
  if (_schemaReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS clients (
      slug       TEXT PRIMARY KEY,
      data       TEXT NOT NULL,
      auth       TEXT NOT NULL DEFAULT 'private',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      CHECK (auth IN ('public', 'private'))
    )
  `);
  await db.execute(
    `CREATE INDEX IF NOT EXISTS ix_clients_updated ON clients(updated_at DESC)`,
  );
  _schemaReady = true;
}

/**
 * Look up a client by slug. DB first, static registry fallback.
 *
 * Returns the full ClientData (matching the type in
 * app/client/data/types.ts) or null if neither store has the slug.
 *
 * Never throws. Turso outage → falls through to static (so the three
 * existing dashboards keep rendering even if the DB is down).
 */
export async function getClient(slug: string): Promise<ClientData | null> {
  const fromDb = await safeDb(async (db) => {
    await ensureSchema(db);
    const r = await db.execute({
      sql: `SELECT data FROM clients WHERE slug = ? LIMIT 1`,
      args: [slug],
    });
    const row = r.rows[0];
    if (!row) return null;
    try {
      return JSON.parse(String(row.data)) as ClientData;
    } catch {
      // Corrupt blob — fall through to static rather than 500ing the page.
      return null;
    }
  });
  if (fromDb) return fromDb;
  return STATIC_REGISTRY[slug] ?? null;
}

export interface ClientSummary {
  slug: string;
  name: string;
  bundle: Bundle;
  auth: Auth;
  source: "db" | "static";
  updatedAt: string | null;
}

/**
 * List every client across both stores. DB rows take precedence over
 * static rows on slug collision (so an operator could "shadow" a
 * static entry by inserting a DB row with the same slug).
 */
export async function listClients(): Promise<ClientSummary[]> {
  const dbRows = await safeDb(async (db) => {
    await ensureSchema(db);
    const r = await db.execute({
      sql: `SELECT slug, data, auth, updated_at FROM clients ORDER BY updated_at DESC`,
      args: [],
    });
    const out: ClientSummary[] = [];
    for (const row of r.rows) {
      let parsed: ClientData | null = null;
      try {
        parsed = JSON.parse(String(row.data)) as ClientData;
      } catch {
        continue;
      }
      out.push({
        slug: String(row.slug),
        name: parsed.meta.name,
        bundle: parsed.meta.bundle,
        auth: String(row.auth) as Auth,
        source: "db",
        updatedAt: String(row.updated_at),
      });
    }
    return out;
  });

  const dbSlugs = new Set((dbRows ?? []).map((c) => c.slug));
  const staticSummaries: ClientSummary[] = Object.values(STATIC_REGISTRY)
    .filter((c) => !dbSlugs.has(c.meta.slug))
    .map((c) => ({
      slug: c.meta.slug,
      name: c.meta.name,
      bundle: c.meta.bundle,
      auth: c.auth,
      source: "static" as const,
      updatedAt: null,
    }));

  return [...(dbRows ?? []), ...staticSummaries];
}

/**
 * Insert a new client, OR update an existing DB row. Never modifies
 * the static registry (those are code, not data).
 *
 * Validates JSON-serializability up front — `data` is stringified by
 * this function, so callers pass in a typed ClientData and we own the
 * encoding.
 */
export async function upsertClient(
  slug: string,
  data: ClientData,
  auth: Auth,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return { ok: false, reason: "Invalid slug — use kebab-case [a-z0-9-]" };
  }
  if (data.meta.slug !== slug) {
    return { ok: false, reason: "data.meta.slug must match the slug param" };
  }
  let blob: string;
  try {
    blob = JSON.stringify(data);
  } catch {
    return { ok: false, reason: "Client data is not JSON-serializable" };
  }
  const ok = await safeDb(async (db) => {
    await ensureSchema(db);
    await db.execute({
      sql: `INSERT INTO clients (slug, data, auth)
            VALUES (?, ?, ?)
            ON CONFLICT(slug) DO UPDATE SET
              data       = excluded.data,
              auth       = excluded.auth,
              updated_at = datetime('now')`,
      args: [slug, blob, auth],
    });
    return true;
  });
  return ok === true
    ? { ok: true }
    : { ok: false, reason: "Database is unconfigured or unreachable" };
}

/**
 * Delete a client's DB row. No-op (returns true) if the slug is only
 * in the static registry — those entries are code-owned and can't be
 * deleted from a runtime endpoint.
 */
export async function deleteClient(
  slug: string,
): Promise<{ ok: boolean; existedInDb: boolean }> {
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    const result = await db.execute({
      sql: `DELETE FROM clients WHERE slug = ?`,
      args: [slug],
    });
    return Number(result.rowsAffected ?? 0) > 0;
  });
  return { ok: r !== null, existedInDb: r === true };
}

/**
 * True when a slug is taken in EITHER store. Used by onboarding to
 * reject duplicates before we attempt to insert.
 */
export async function slugExists(slug: string): Promise<boolean> {
  if (slug in STATIC_REGISTRY) return true;
  const r = await safeDb(async (db) => {
    await ensureSchema(db);
    const result = await db.execute({
      sql: `SELECT 1 FROM clients WHERE slug = ? LIMIT 1`,
      args: [slug],
    });
    return result.rows.length > 0;
  });
  return r === true;
}

/**
 * Build a minimal-viable ClientData for a freshly onboarded customer.
 * Just the required sections (meta, auth, overview) — the operator can
 * fill in ads/leads/etc. later by editing the row, or by hooking up
 * live feeds.
 */
export function buildSkeletonClientData(input: {
  slug: string;
  name: string;
  bundle: Bundle;
  location?: string;
  retainerMonthly?: number;
  setupFee?: number;
  startedAt?: string; // ISO date; defaults to today
}): ClientData {
  const today = new Date();
  const startedAt = input.startedAt ?? today.toISOString().slice(0, 10);
  return {
    meta: {
      slug: input.slug,
      name: input.name,
      location: input.location ?? "",
      bundle: input.bundle,
      weekLabel: weekLabelFor(today),
      onboarded: `Onboarded ${formatHumanDate(today)}`,
      healthLabel: "Setup · in progress",
      bannerNote: `Welcome to ${input.name}. Your dashboard is in setup — first real metrics arrive within ~7 days of onboarding.`,
      retainerMonthly: input.retainerMonthly,
      setupFee: input.setupFee,
      startedAt,
    },
    auth: "private",
    overview: {
      kpis: [
        { label: "Days active", value: "0", tone: "ink" },
        { label: "Setup", value: "in progress", tone: "neutral" },
        { label: "Needs you", value: "0", tone: "neutral" },
      ],
      weeklyFocus: [
        "Setup tracking integrations (GA4, Meta pixel, Vercel Analytics)",
        "Schedule kickoff call with onboarding team",
        "Confirm baseline metrics — what we measure week 1",
      ],
    },
  };
}

function formatHumanDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function weekLabelFor(d: Date): string {
  // "21 – 28 Apr 2026" — match the existing convention in static dashboards.
  const end = new Date(d);
  const start = new Date(d);
  start.setDate(start.getDate() - 7);
  const fmt = (x: Date) =>
    x.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
}

/**
 * Test-only — clears the schema-cache so a freshly opened in-memory
 * DB re-runs CREATE TABLE.
 */
export function _resetSchemaCacheForTests(): void {
  _schemaReady = false;
}

/** Direct DB exposure for tests + admin queries. Returns null if unconfigured. */
export function _getDbForRead(): Client | null {
  return getDb();
}
