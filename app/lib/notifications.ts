import { createClient, type Client } from "@libsql/client";

/**
 * Unified inbox — deadlines, approval-needed items, alerts, reviews.
 *
 * Surfaces in /portal/inbox (any authenticated user) and in the per-tenant
 * dashboard's "Needs you" KPI. Per INTEGRATION.md §3c.
 *
 * NOTE: Notification interface is duplicated here for the events lane.
 * During Lane A's integration commit it gets hoisted to
 * `app/lib/api-types.ts` (the single shared schema module).
 */

// ----------------------------------------------------------------
// Types (mirror INTEGRATION.md §5)
// ----------------------------------------------------------------

export type NotificationKind =
  | "approval-needed"
  | "deadline-warn"
  | "deadline-due"
  | "alert"
  | "review";

export const NOTIFICATION_KINDS: readonly NotificationKind[] = [
  "approval-needed",
  "deadline-warn",
  "deadline-due",
  "alert",
  "review",
] as const;

export type NotificationSeverity = "low" | "medium" | "high" | "critical";

export const NOTIFICATION_SEVERITIES: readonly NotificationSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export interface Notification {
  kind: NotificationKind;
  tenant: string;
  title: string;
  body: string;
  severity: NotificationSeverity;
  link?: string; // path on polycloud.in (e.g. /client/<slug>?tab=outreach)
  expires_at?: string; // ISO 8601
}

export interface StoredNotification extends Notification {
  id: string;
  created_at: string;
  read_by: string[]; // emails who marked it read
}

// ----------------------------------------------------------------
// libsql lazy singleton + safeDb wrapper
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

export function _resetNotificationsDbForTests(client: Client | null): void {
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
    console.error("[notifications] safeDb failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

// ----------------------------------------------------------------
// Schema bootstrap
// ----------------------------------------------------------------

let _schemaReady = false;
async function ensureSchema(db: Client): Promise<void> {
  if (_schemaReady) return;
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      tenant TEXT NOT NULL,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      severity TEXT NOT NULL,
      link TEXT,
      expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      read_by_json TEXT NOT NULL DEFAULT '[]'
    );
    CREATE INDEX IF NOT EXISTS ix_notifications_tenant_created ON notifications(tenant, created_at DESC);
  `);
  _schemaReady = true;
}

export function _resetNotificationsSchemaForTests(): void {
  _schemaReady = false;
}

// ----------------------------------------------------------------
// ULID-style id (separate prefix from events: nfn_)
// ----------------------------------------------------------------

const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function generateUlid(): string {
  // See app/lib/events.ts for the same implementation; duplicated to keep
  // each module self-contained for the Lane B integration commit.
  const time = Date.now();
  let timeChars = "";
  let t = time;
  for (let i = 0; i < 10; i++) {
    timeChars = ULID_ALPHABET[t % 32] + timeChars;
    t = Math.floor(t / 32);
  }
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

export function newNotificationId(): string {
  return `nfn_${generateUlid()}`;
}

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

export async function recordNotification(
  notif: Notification,
): Promise<{ id: string } | null> {
  const id = newNotificationId();
  const result = await safeDb(async (db) => {
    await ensureSchema(db);
    await db.execute({
      sql: `INSERT INTO notifications
            (id, tenant, kind, title, body, severity, link, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        notif.tenant,
        notif.kind,
        notif.title,
        notif.body,
        notif.severity,
        notif.link ?? null,
        notif.expires_at ?? null,
      ],
    });
    return id;
  });
  return result ? { id: result } : null;
}

export interface ListNotificationsOpts {
  unread_only?: boolean;
  unread_for_email?: string; // when unread_only is true, exclude items already read by this email
  severity?: NotificationSeverity;
  include_expired?: boolean; // default false — drop notifications past expires_at
  limit?: number;
}

/**
 * Read notifications for a tenant. Filters expired by default.
 * Pass `unread_only: true` + `unread_for_email` to filter by reader status.
 */
export async function listNotifications(
  tenant: string,
  opts: ListNotificationsOpts = {},
): Promise<StoredNotification[]> {
  const limit = Math.min(Math.max(opts.limit ?? 100, 1), 500);
  const where: string[] = ["tenant = ?"];
  const args: (string | number)[] = [tenant];

  if (opts.severity) {
    where.push("severity = ?");
    args.push(opts.severity);
  }
  if (!opts.include_expired) {
    where.push("(expires_at IS NULL OR expires_at > datetime('now'))");
  }

  const sql = `SELECT id, tenant, kind, title, body, severity, link, expires_at,
                      created_at, read_by_json
               FROM notifications
               WHERE ${where.join(" AND ")}
               ORDER BY created_at DESC
               LIMIT ?`;
  args.push(limit);

  const rows = await safeDb(async (db) => {
    await ensureSchema(db);
    const r = await db.execute({ sql, args });
    return r.rows;
  });

  if (!rows) return [];

  const mapped = rows.map((row): StoredNotification => {
    let readBy: string[] = [];
    try {
      const parsed = JSON.parse(String(row.read_by_json));
      if (Array.isArray(parsed) && parsed.every((e) => typeof e === "string")) {
        readBy = parsed;
      }
    } catch {
      readBy = [];
    }
    return {
      id: String(row.id),
      tenant: String(row.tenant),
      kind: String(row.kind) as NotificationKind,
      title: String(row.title),
      body: String(row.body),
      severity: String(row.severity) as NotificationSeverity,
      link: row.link == null ? undefined : String(row.link),
      expires_at: row.expires_at == null ? undefined : String(row.expires_at),
      created_at: String(row.created_at),
      read_by: readBy,
    };
  });

  if (opts.unread_only && opts.unread_for_email) {
    const email = opts.unread_for_email.toLowerCase();
    return mapped.filter((n) => !n.read_by.some((e) => e.toLowerCase() === email));
  }
  return mapped;
}

/**
 * Mark a notification read by the given user.
 * Returns true if the notification existed (whether or not the user was already in the list).
 */
export async function markRead(id: string, email: string): Promise<boolean> {
  const result = await safeDb(async (db) => {
    await ensureSchema(db);
    const r = await db.execute({
      sql: `SELECT read_by_json FROM notifications WHERE id = ? LIMIT 1`,
      args: [id],
    });
    if (!r.rows.length) return false;
    let readBy: string[] = [];
    try {
      const parsed = JSON.parse(String(r.rows[0].read_by_json));
      if (Array.isArray(parsed) && parsed.every((e) => typeof e === "string")) {
        readBy = parsed;
      }
    } catch {
      readBy = [];
    }
    const lower = email.toLowerCase();
    if (!readBy.some((e) => e.toLowerCase() === lower)) {
      readBy.push(email);
      await db.execute({
        sql: `UPDATE notifications SET read_by_json = ? WHERE id = ?`,
        args: [JSON.stringify(readBy), id],
      });
    }
    return true;
  });
  return result === true;
}

/** Validate inbound notification body. */
export function validateNotificationBody(
  body: unknown,
): Notification | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.kind !== "string" || !NOTIFICATION_KINDS.includes(b.kind as NotificationKind)) {
    return { error: `kind must be one of: ${NOTIFICATION_KINDS.join(", ")}` };
  }
  if (typeof b.tenant !== "string" || !b.tenant.trim()) {
    return { error: "tenant is required" };
  }
  if (typeof b.title !== "string" || !b.title.trim()) {
    return { error: "title is required" };
  }
  if (typeof b.body !== "string" || !b.body.trim()) {
    return { error: "body is required" };
  }
  if (
    typeof b.severity !== "string" ||
    !NOTIFICATION_SEVERITIES.includes(b.severity as NotificationSeverity)
  ) {
    return { error: `severity must be one of: ${NOTIFICATION_SEVERITIES.join(", ")}` };
  }
  if (b.link !== undefined && typeof b.link !== "string") {
    return { error: "link must be a string when present" };
  }
  if (b.expires_at !== undefined) {
    if (typeof b.expires_at !== "string" || Number.isNaN(Date.parse(b.expires_at))) {
      return { error: "expires_at must be ISO 8601 when present" };
    }
  }

  return {
    kind: b.kind as NotificationKind,
    tenant: b.tenant,
    title: b.title,
    body: b.body,
    severity: b.severity as NotificationSeverity,
    link: b.link as string | undefined,
    expires_at: b.expires_at as string | undefined,
  };
}
