import { createClient, type Client } from "@libsql/client";

/**
 * Cross-product event firehose.
 *
 * Every product (CA Firm Toolkit, Nexus/Labs, Realty agent, etc.) writes
 * narrative events here. The portal renders these as activity cards on
 * /portal/feed and on per-tenant /client/<slug> dashboards.
 *
 * Schema is signal -> action -> outcome, per INTEGRATION.md §3a — a
 * three-line story you can read in 5 seconds.
 *
 * NOTE: EventKind + PortalEvent are duplicated here for the events lane.
 * During Lane A's integration commit they get hoisted to
 * `app/lib/api-types.ts` (the single shared schema module).
 */

// ----------------------------------------------------------------
// Types (mirror INTEGRATION.md §5; signal-detected added for Nexus C1-C6)
// ----------------------------------------------------------------

export type EventKind =
  | "recon-run"
  | "vendor-followup"
  | "ocr-result"
  | "memo-shipped"
  | "agent-run"
  | "scrape-completed"
  | "user-action"
  | "alert"
  | "signal-detected";

export const EVENT_KINDS: readonly EventKind[] = [
  "recon-run",
  "vendor-followup",
  "ocr-result",
  "memo-shipped",
  "agent-run",
  "scrape-completed",
  "user-action",
  "alert",
  "signal-detected",
] as const;

export interface PortalEvent {
  kind: EventKind;
  payload: {
    ts: string; // ISO 8601, when the event happened
    actor: string; // "ca-firm-toolkit@<tenant>" / "nexus@<tenant>" / etc.
    summary: string; // one-line for activity feed
    signal?: string;
    action?: string;
    outcome?: string;
    links?: Array<{ label: string; href: string }>;
    tags?: string[];
  };
}

/** Stored event row shape returned by listEvents. */
export interface StoredEvent extends PortalEvent {
  id: string;
  tenant: string;
  received_at: string;
}

// ----------------------------------------------------------------
// libsql lazy singleton + safeDb wrapper (mirrors app/lib/email/db.ts)
// ----------------------------------------------------------------

let _client: Client | null = null;

function getDb(): Client | null {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return null;
  _client = createClient({ url, authToken });
  return _client;
}

/** Reset singleton — used by tests to swap in an in-memory DB. */
export function _resetEventsDbForTests(client: Client | null): void {
  _client = client;
}

async function safeDb<T>(
  op: (db: Client) => Promise<T>,
  timeoutMs = 1500,
): Promise<T | null> {
  const db = getDb();
  if (!db) return null;
  try {
    return await Promise.race<T>([
      op(db),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("db timeout")), timeoutMs),
      ),
    ]);
  } catch (e) {
    console.error("[events] safeDb failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

// ----------------------------------------------------------------
// Schema bootstrap — idempotent CREATE IF NOT EXISTS
// ----------------------------------------------------------------

let _schemaReady = false;
async function ensureSchema(db: Client): Promise<void> {
  if (_schemaReady) return;
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      tenant TEXT NOT NULL,
      kind TEXT NOT NULL,
      actor TEXT NOT NULL,
      summary TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      ts TEXT NOT NULL,
      received_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS ix_events_tenant_ts ON events(tenant, ts DESC);
    CREATE INDEX IF NOT EXISTS ix_events_kind_ts ON events(kind, ts DESC);
  `);
  _schemaReady = true;
}

/** Internal — let tests force a fresh schema check. */
export function _resetEventsSchemaForTests(): void {
  _schemaReady = false;
}

// ----------------------------------------------------------------
// ULID-style id generation (Crockford base32, monotonic-ish)
// ----------------------------------------------------------------

const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function generateUlid(): string {
  // 48-bit timestamp + 80-bit randomness = 128 bits = 26 chars Crockford base32.
  // 10 timestamp chars (50 bits, only 48 used; top 2 bits zero) + 16 random
  // chars (80 bits packed correctly across bytes — no overlap).
  const time = Date.now();
  let timeChars = "";
  let t = time;
  for (let i = 0; i < 10; i++) {
    timeChars = ULID_ALPHABET[t % 32] + timeChars;
    t = Math.floor(t / 32);
  }

  // 80 random bits → 16 base32 chars. Use a 16-byte buffer and pack 5 bits at
  // a time. We only consume 80 bits = 10 bytes' worth, but using 16 bytes
  // gives us byte-aligned slicing for clarity.
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);

  let randChars = "";
  let bitBuf = 0;
  let bitCount = 0;
  let byteIdx = 0;
  while (randChars.length < 16) {
    if (bitCount < 5) {
      bitBuf = (bitBuf << 8) | bytes[byteIdx++];
      bitCount += 8;
    }
    bitCount -= 5;
    randChars += ULID_ALPHABET[(bitBuf >> bitCount) & 0x1f];
  }
  return timeChars + randChars;
}

export function newEventId(): string {
  return `evt_${generateUlid()}`;
}

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

/**
 * Persist an event for the given tenant. Returns the new id, or null on
 * any DB failure (Turso unreachable, schema hiccup, timeout). Never throws.
 *
 * `tenant` is passed alongside the event (it comes from the API key, not the body).
 */
export async function recordEvent(
  tenant: string,
  event: PortalEvent,
): Promise<{ id: string } | null> {
  const id = newEventId();
  const result = await safeDb(async (db) => {
    await ensureSchema(db);
    await db.execute({
      sql: `INSERT INTO events (id, tenant, kind, actor, summary, payload_json, ts)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        tenant,
        event.kind,
        event.payload.actor,
        event.payload.summary,
        JSON.stringify(event.payload),
        event.payload.ts,
      ],
    });
    return id;
  });
  return result ? { id: result } : null;
}

export interface ListEventsOpts {
  tenant?: string;
  kind?: EventKind;
  since?: string; // ISO 8601 — ts >= since
  limit?: number; // default 50, hard max 200
}

/**
 * Read events for the UI (operator feed, per-tenant dashboard).
 * Always returns an array — null DB returns [].
 */
export async function listEvents(opts: ListEventsOpts = {}): Promise<StoredEvent[]> {
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (opts.tenant) {
    where.push("tenant = ?");
    args.push(opts.tenant);
  }
  if (opts.kind) {
    where.push("kind = ?");
    args.push(opts.kind);
  }
  if (opts.since) {
    where.push("ts >= ?");
    args.push(opts.since);
  }
  const sql = `SELECT id, tenant, kind, actor, summary, payload_json, ts, received_at
               FROM events
               ${where.length ? "WHERE " + where.join(" AND ") : ""}
               ORDER BY ts DESC
               LIMIT ?`;
  args.push(limit);

  const rows = await safeDb(async (db) => {
    await ensureSchema(db);
    const r = await db.execute({ sql, args });
    return r.rows;
  });

  if (!rows) return [];

  return rows.map((row) => {
    const payloadJson = String(row.payload_json);
    let payload: PortalEvent["payload"];
    try {
      payload = JSON.parse(payloadJson);
    } catch {
      // Defensive — never let a corrupt row crash the feed
      payload = {
        ts: String(row.ts),
        actor: String(row.actor),
        summary: String(row.summary),
      };
    }
    return {
      id: String(row.id),
      tenant: String(row.tenant),
      kind: String(row.kind) as EventKind,
      payload,
      received_at: String(row.received_at),
    };
  });
}

/** Validate an inbound event payload. Returns null if valid, else error msg. */
export function validateEventBody(
  body: unknown,
): { kind: EventKind; payload: PortalEvent["payload"] } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.kind !== "string" || !EVENT_KINDS.includes(b.kind as EventKind)) {
    return { error: `kind must be one of: ${EVENT_KINDS.join(", ")}` };
  }
  const kind = b.kind as EventKind;

  if (!b.payload || typeof b.payload !== "object") {
    return { error: "payload must be an object" };
  }
  const p = b.payload as Record<string, unknown>;

  for (const k of ["ts", "actor", "summary"] as const) {
    if (typeof p[k] !== "string" || !(p[k] as string).trim()) {
      return { error: `payload.${k} is required and must be a non-empty string` };
    }
  }
  // Reject impossible timestamps early — saves us from poisoned ts indexes.
  if (Number.isNaN(Date.parse(p.ts as string))) {
    return { error: "payload.ts must be ISO 8601" };
  }

  // Optional fields — type-check shape only when present.
  for (const k of ["signal", "action", "outcome"] as const) {
    if (p[k] !== undefined && typeof p[k] !== "string") {
      return { error: `payload.${k} must be a string when present` };
    }
  }
  if (p.links !== undefined) {
    if (!Array.isArray(p.links)) return { error: "payload.links must be an array" };
    for (const link of p.links) {
      if (
        !link ||
        typeof link !== "object" ||
        typeof (link as Record<string, unknown>).label !== "string" ||
        typeof (link as Record<string, unknown>).href !== "string"
      ) {
        return { error: "payload.links[*] must be { label: string, href: string }" };
      }
    }
  }
  if (p.tags !== undefined) {
    if (!Array.isArray(p.tags) || !p.tags.every((t) => typeof t === "string")) {
      return { error: "payload.tags must be string[]" };
    }
  }

  return {
    kind,
    payload: {
      ts: p.ts as string,
      actor: p.actor as string,
      summary: p.summary as string,
      signal: p.signal as string | undefined,
      action: p.action as string | undefined,
      outcome: p.outcome as string | undefined,
      links: p.links as Array<{ label: string; href: string }> | undefined,
      tags: p.tags as string[] | undefined,
    },
  };
}
