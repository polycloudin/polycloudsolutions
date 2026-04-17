import { createClient, type Client, type InValue } from "@libsql/client";

// Lazy singleton — avoids connecting when DB isn't configured or during build.
let _client: Client | null = null;

export function getDb(): Client | null {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return null;
  _client = createClient({ url, authToken });
  return _client;
}

/**
 * Run a DB operation with a timeout and full try/catch. Never throws.
 * Returns null on any failure. Used by /api/book to ensure Turso cannot
 * break form submissions.
 */
export async function safeDb<T>(
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
    console.error("[email/db] safeDb failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

export type LeadRow = {
  id: number;
  email: string;
  name: string;
  company: string | null;
  topic: string | null;
  stage: string | null;
  message: string | null;
  created_at: string;
  last_contacted_at: string | null;
  status: string;
};

export type QueueRow = {
  id: number;
  lead_id: number;
  template: string;
  scheduled_at: string;
  sent_at: string | null;
  status: string;
  tries: number;
  last_error: string | null;
  vars_json: string | null;
  created_at: string;
};

/**
 * Upsert a lead by email. Returns the lead row id, or null on failure.
 */
export async function upsertLead(input: {
  name: string;
  email: string;
  company?: string;
  topic?: string;
  stage?: string;
  message?: string;
}): Promise<number | null> {
  return safeDb(async (db) => {
    // Upsert by email
    const args: InValue[] = [
      input.email,
      input.name,
      input.company ?? null,
      input.topic ?? null,
      input.stage ?? null,
      input.message ?? null,
    ];
    await db.execute({
      sql: `INSERT INTO leads (email, name, company, topic, stage, message)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              name = excluded.name,
              company = COALESCE(excluded.company, leads.company),
              topic = COALESCE(excluded.topic, leads.topic),
              stage = COALESCE(excluded.stage, leads.stage),
              message = excluded.message`,
      args,
    });
    const r = await db.execute({
      sql: `SELECT id FROM leads WHERE email = ? LIMIT 1`,
      args: [input.email],
    });
    const id = r.rows[0]?.id;
    return typeof id === "number" || typeof id === "bigint" ? Number(id) : null;
  });
}

/**
 * Insert a scheduled email row. Returns row id or null.
 */
export async function enqueueEmail(input: {
  leadId: number;
  template: string;
  scheduledAt: Date;
  vars?: Record<string, string | number | null>;
}): Promise<number | null> {
  return safeDb(async (db) => {
    const r = await db.execute({
      sql: `INSERT INTO email_queue (lead_id, template, scheduled_at, vars_json)
            VALUES (?, ?, ?, ?)`,
      args: [
        input.leadId,
        input.template,
        input.scheduledAt.toISOString().replace("T", " ").slice(0, 19),
        input.vars ? JSON.stringify(input.vars) : null,
      ],
    });
    return Number(r.lastInsertRowid ?? 0) || null;
  });
}
