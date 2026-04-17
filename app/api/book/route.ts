import { NextResponse, after } from "next/server";
import { upsertLead, enqueueEmail, getDb } from "@/app/lib/email/db";
import { buildVars, composeAndSend, TEMPLATE_SUBJECTS } from "@/app/lib/email/compose";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  topic?: string;
  stage?: string;
  message?: string;
  company_website?: string;
};

// Priority order of delivery backends (first non-empty wins):
// 1. Resend (RESEND_API_KEY)          — 3K/mo free, cleanest API
// 2. Web3Forms (WEB3FORMS_ACCESS_KEY) — totally free, no credit card, no signup friction
// 3. Formsubmit (BOOKING_TO_EMAIL)    — totally free, no key at all (uses bare email address)
// 4. Console log only                  — if none of the above set
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
const TO_EMAIL = process.env.BOOKING_TO_EMAIL || "hello@polycloud.in";
const FROM_EMAIL = process.env.BOOKING_FROM_EMAIL || "PolyCloud <onboarding@resend.dev>";

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (body.company_website) {
    return NextResponse.json({ success: true });
  }

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(body.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // -----------------------------------------------------------------------
  // NEW (Day 5): Lead nurture pipeline.
  // Runs AFTER the HTTP response is sent, via next/server's `after`.
  // Guardrail: Turso failure cannot break form submissions.
  //   - Never throws (wrapped in try/catch)
  //   - Never delays the response (runs post-response)
  //   - If TURSO_DATABASE_URL isn't set, all DB calls no-op gracefully
  //   - If RESEND_API_KEY isn't set, welcome skips with a logged reason
  // -----------------------------------------------------------------------
  after(async () => {
    try {
      await runLeadPipeline(body);
    } catch (e) {
      console.error("[/api/book] lead pipeline failed (non-fatal):", e);
    }
  });

  // -----------------------------------------------------------------------
  // ORIGINAL: Team notification delivery chain. UNCHANGED from pre-Day-5.
  // Resend → Web3Forms → Formsubmit. Same env var names, same log prefixes,
  // same always-success client response. Day 5 must not alter this behavior.
  // -----------------------------------------------------------------------
  const subject = `New booking — ${body.name}${body.company ? ` (${body.company})` : ""}`;
  const text = [
    `Name: ${body.name}`,
    `Email: ${body.email}`,
    `Company: ${body.company || "—"}`,
    `Topic: ${body.topic || "—"}`,
    `Stage: ${body.stage || "—"}`,
    `Source: polycloud.in`,
    ``,
    `Message:`,
    body.message,
  ].join("\n");

  console.log("[/api/book] Submission:", { ...body, company_website: undefined });

  let delivered = false;
  let lastErr: string | null = null;

  // Backend 1: Resend
  if (!delivered && RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          reply_to: body.email,
          subject,
          text,
        }),
      });
      if (res.ok) {
        delivered = true;
        console.log("[/api/book] Delivered via Resend");
      } else {
        lastErr = `Resend ${res.status}: ${await res.text()}`;
      }
    } catch (err) {
      lastErr = `Resend exception: ${err}`;
    }
  }

  // Backend 2: Web3Forms (free, no credit card)
  if (!delivered && WEB3FORMS_ACCESS_KEY) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: body.name,
          email: body.email,
          message: text,
          replyto: body.email,
        }),
      });
      if (res.ok) {
        delivered = true;
        console.log("[/api/book] Delivered via Web3Forms");
      } else {
        lastErr = `Web3Forms ${res.status}: ${await res.text()}`;
      }
    } catch (err) {
      lastErr = `Web3Forms exception: ${err}`;
    }
  }

  // Backend 3: Formsubmit (free, no key at all)
  // First submission requires a one-time email confirmation at TO_EMAIL
  if (!delivered) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _replyto: body.email,
          _template: "table",
          name: body.name,
          email: body.email,
          company: body.company || "—",
          topic: body.topic || "—",
          stage: body.stage || "—",
          message: body.message,
          source: "polycloud.in",
        }),
      });
      if (res.ok) {
        delivered = true;
        console.log("[/api/book] Delivered via Formsubmit");
      } else {
        lastErr = `Formsubmit ${res.status}: ${await res.text()}`;
      }
    } catch (err) {
      lastErr = `Formsubmit exception: ${err}`;
    }
  }

  if (!delivered) {
    console.error("[/api/book] Delivery failed on all backends. Last error:", lastErr);
  }

  // Always return success to the client — we've logged the submission server-side
  // and we don't want to leak backend failures to the user.
  return NextResponse.json({ success: true });
}

// ---------------------------------------------------------------------------
// Lead nurture pipeline (Day 5, non-blocking via `after`)
// ---------------------------------------------------------------------------

async function runLeadPipeline(body: Payload): Promise<void> {
  const { name, email, company, topic, stage, message } = body;
  if (!name || !email || !message) return; // validated above, defensive

  // Step 1: upsert lead in Turso. If Turso isn't configured or fails, returns null.
  const leadId = await upsertLead({ name, email, company, topic, stage, message });
  if (!leadId) {
    console.warn("[/api/book/lead] lead upsert returned null (Turso unreachable or unconfigured)");
    return;
  }

  // Step 2: render + send welcome email inline. Best-effort.
  const unsubscribeUrl = buildUnsubscribeUrl(email);
  const welcomeVars = buildVars({
    template: "welcome",
    lead: {
      name,
      email,
      topic: topic ?? "general",
      company: company ?? null,
    },
    unsubscribeUrl,
  });
  const welcomeResult = await composeAndSend({
    template: "welcome",
    to: email,
    vars: welcomeVars,
  });

  if (welcomeResult.delivered) {
    // Step 3: log welcome send + mark lead contacted
    const db = getDb();
    if (db) {
      try {
        await db.execute({
          sql: `INSERT INTO email_log (lead_id, template, provider, provider_id, subject)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            leadId,
            "welcome",
            welcomeResult.provider,
            welcomeResult.providerId,
            TEMPLATE_SUBJECTS.welcome,
          ],
        });
        await db.execute({
          sql: `UPDATE leads
                SET last_contacted_at = datetime('now'), status = 'contacted'
                WHERE id = ?`,
          args: [leadId],
        });
      } catch (e) {
        console.error("[/api/book/lead] welcome log failed (non-fatal):", e);
      }
    }
  } else {
    console.warn(
      `[/api/book/lead] welcome email not delivered (reason: ${welcomeResult.reason}). Lead stored for later nurture.`,
    );
  }

  // Step 4: enqueue nurture-1 (+3 days) and nurture-2 (+7 days). Worker picks up.
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  await enqueueEmail({ leadId, template: "nurture-1", scheduledAt: new Date(now + 3 * day) });
  await enqueueEmail({ leadId, template: "nurture-2", scheduledAt: new Date(now + 7 * day) });

  console.log(
    `[/api/book/lead] ✓ lead #${leadId} (${email}) — welcome ${welcomeResult.delivered ? "sent" : "skipped"}, nurtures queued`,
  );
}

function buildUnsubscribeUrl(email: string): string {
  const token = Buffer.from(email).toString("base64url");
  const base = process.env.SITE_URL || "https://polycloud.in";
  return `${base}/api/email/unsubscribe?token=${token}`;
}
