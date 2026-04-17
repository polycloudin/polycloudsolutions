import { NextResponse } from "next/server";
import { getDb, type LeadRow, type QueueRow } from "@/app/lib/email/db";
import { buildVars, composeAndSend, type TemplateName } from "@/app/lib/email/compose";

/**
 * Vercel Cron target. Runs hourly (see vercel.json).
 *
 * Responsibilities:
 *   1. Select up to 50 due rows from email_queue
 *   2. For each row: mark 'sending', fetch lead, skip if nurture + already replied,
 *      render + send via Resend, log, update status
 *   3. Failures are recorded on the row — no retry bomb (tries caps at 5)
 *
 * Authentication: Vercel Cron includes `Authorization: Bearer <CRON_SECRET>`.
 * We require EMAIL_CRON_SECRET to match. External callers without the secret
 * get 401.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BATCH = 50;
const MAX_TRIES = 5;

type WorkerResult = {
  examined: number;
  sent: number;
  failed: number;
  skipped: number;
  errors: string[];
};

async function authorize(req: Request): Promise<boolean> {
  const expected = process.env.EMAIL_CRON_SECRET;
  if (!expected) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${expected}`;
}

export async function GET(req: Request): Promise<NextResponse> {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "DB not configured", hint: "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN" },
      { status: 503 },
    );
  }

  const result: WorkerResult = {
    examined: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  let due;
  try {
    due = await db.execute({
      sql: `SELECT * FROM email_queue
            WHERE status = 'pending' AND datetime(scheduled_at) <= datetime('now')
            ORDER BY scheduled_at ASC
            LIMIT ?`,
      args: [MAX_BATCH],
    });
  } catch (e) {
    return NextResponse.json(
      { error: "queue_read_failed", detail: String(e).slice(0, 300) },
      { status: 500 },
    );
  }
  result.examined = due.rows.length;

  for (const rawRow of due.rows) {
    const row = rawRow as unknown as QueueRow;

    // Claim the row atomically
    const claim = await db.execute({
      sql: `UPDATE email_queue
            SET status = 'sending', tries = tries + 1
            WHERE id = ? AND status = 'pending'`,
      args: [row.id],
    });
    if (claim.rowsAffected === 0) continue; // another worker grabbed it

    // Load the lead
    const leadRes = await db.execute({
      sql: `SELECT * FROM leads WHERE id = ? LIMIT 1`,
      args: [row.lead_id],
    });
    const lead = leadRes.rows[0] as unknown as LeadRow | undefined;

    if (!lead) {
      await db.execute({
        sql: `UPDATE email_queue SET status = 'failed', last_error = ? WHERE id = ?`,
        args: ["lead_not_found", row.id],
      });
      result.failed++;
      continue;
    }

    // Honor unsubscribe / bounce
    if (lead.status === "unsubscribed" || lead.status === "bounced") {
      await db.execute({
        sql: `UPDATE email_queue SET status = 'skipped', last_error = ? WHERE id = ?`,
        args: [`lead_${lead.status}`, row.id],
      });
      result.skipped++;
      continue;
    }

    // For nurture templates, skip if the lead already replied
    if (row.template === "nurture-1" || row.template === "nurture-2") {
      const replied = await db.execute({
        sql: `SELECT 1 FROM email_log WHERE lead_id = ? AND replied_at IS NOT NULL LIMIT 1`,
        args: [lead.id],
      });
      if (replied.rows.length > 0) {
        await db.execute({
          sql: `UPDATE email_queue SET status = 'skipped', last_error = ? WHERE id = ?`,
          args: ["lead_replied", row.id],
        });
        result.skipped++;
        continue;
      }
    }

    // Build vars. vars_json holds per-send overrides (e.g. newsletter month,
    // nurture blog post suggestion). If empty, we use defaults.
    const overrides: Record<string, unknown> =
      row.vars_json ? JSON.parse(row.vars_json) : {};
    const vars = buildVars({
      template: row.template as TemplateName,
      lead: {
        name: lead.name,
        email: lead.email,
        topic: lead.topic,
        company: lead.company,
      },
      unsubscribeUrl: unsubscribeUrlFor(lead.email),
      blogPost: overrides.blogPost as
        | { title: string; description: string; url: string; readTime: string }
        | undefined,
      posts: overrides.posts as
        | Array<{
            title: string;
            description: string;
            url: string;
            readTime: string;
            category: string;
          }>
        | undefined,
      monthName: overrides.monthName as string | undefined,
      shippedTitle: overrides.shippedTitle as string | undefined,
      shippedBody: overrides.shippedBody as string | undefined,
    });

    // Render + send
    const send = await composeAndSend({
      template: row.template as TemplateName,
      to: lead.email,
      vars,
    });

    if (send.delivered) {
      await db.execute({
        sql: `INSERT INTO email_log (lead_id, queue_id, template, provider, provider_id, subject)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          lead.id,
          row.id,
          row.template,
          send.provider,
          send.providerId,
          `[${row.template}] ${lead.email}`,
        ],
      });
      await db.execute({
        sql: `UPDATE email_queue SET status = 'sent', sent_at = datetime('now') WHERE id = ?`,
        args: [row.id],
      });
      await db.execute({
        sql: `UPDATE leads
              SET last_contacted_at = datetime('now'),
                  status = CASE WHEN status = 'new' THEN 'contacted' ELSE status END
              WHERE id = ?`,
        args: [lead.id],
      });
      result.sent++;
    } else {
      const finalStatus = (row.tries + 1) >= MAX_TRIES ? "failed" : "pending";
      await db.execute({
        sql: `UPDATE email_queue SET status = ?, last_error = ? WHERE id = ?`,
        args: [finalStatus, `${send.reason}:${send.error ?? ""}`.slice(0, 500), row.id],
      });
      if (finalStatus === "failed") result.failed++;
      result.errors.push(`queue#${row.id}: ${send.reason}`);
    }
  }

  return NextResponse.json(result);
}

function unsubscribeUrlFor(email: string): string {
  // Day 6 wires the real token-based unsubscribe route. Until then we use a
  // base64url-of-email placeholder so links aren't broken and spam filters
  // see a valid href. The /api/email/unsubscribe route on Day 6 will accept
  // this format transparently.
  const token = Buffer.from(email).toString("base64url");
  const base = process.env.SITE_URL || "https://polycloud.in";
  return `${base}/api/email/unsubscribe?token=${token}`;
}
