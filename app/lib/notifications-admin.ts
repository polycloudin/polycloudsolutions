import { createClient, type Client } from "@libsql/client";
import type { NotificationKind, NotificationSeverity, StoredNotification } from "./notifications";

/**
 * Operator-only helper: list notifications across ALL tenants.
 *
 * Kept out of `notifications.ts` so the per-tenant contract stays strict
 * (writers must always specify a tenant). This is read-only and consumed
 * by the /api/notifications GET handler when an `ops` session calls
 * without a tenant filter.
 */

let _client: Client | null = null;

function getDb(): Client | null {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) return null;
  _client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  return _client;
}

export function _resetNotificationsAdminDbForTests(client: Client | null): void {
  _client = client;
}

interface AdminListOpts {
  severity?: NotificationSeverity;
  unread_only?: boolean;
  unread_for_email?: string;
  limit?: number;
}

export async function listAllNotificationsImpl(
  opts: AdminListOpts = {},
): Promise<StoredNotification[]> {
  const db = getDb();
  if (!db) return [];

  const limit = Math.min(Math.max(opts.limit ?? 200, 1), 500);
  const where: string[] = ["(expires_at IS NULL OR expires_at > datetime('now'))"];
  const args: (string | number)[] = [];

  if (opts.severity) {
    where.push("severity = ?");
    args.push(opts.severity);
  }

  const sql = `SELECT id, tenant, kind, title, body, severity, link, expires_at,
                      created_at, read_by_json
               FROM notifications
               WHERE ${where.join(" AND ")}
               ORDER BY created_at DESC
               LIMIT ?`;
  args.push(limit);

  let rows;
  try {
    const r = await db.execute({ sql, args });
    rows = r.rows;
  } catch (e) {
    console.error("[notifications-admin] query failed:", e instanceof Error ? e.message : e);
    return [];
  }

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
