/**
 * Email delivery providers for polycloud.in.
 *
 * Two flavors:
 *
 *   sendNotification()  — plain text to the polycloud inbox. Used by /api/book.
 *                         Fallback chain: Resend → Web3Forms → Formsubmit.
 *                         All three support this use case.
 *
 *   sendMarketing()     — HTML email to an arbitrary lead. Used by the email
 *                         worker (nurture sequences, newsletter).
 *                         Only Resend supports arbitrary-recipient HTML on the
 *                         free tier we use. Web3Forms and Formsubmit are
 *                         form-notification services, not ESPs — they can't
 *                         deliver to arbitrary addresses.
 *
 *                         If RESEND_API_KEY isn't set, sendMarketing returns
 *                         {delivered: false, reason: 'no_provider'} and the
 *                         worker logs + moves on (no throw, no retry).
 *
 * This split is documented in DECISIONS.md and keeps the "no new delivery
 * dependency" constraint honest.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
const TO_EMAIL = process.env.BOOKING_TO_EMAIL || "hello@polycloud.in";
const FROM_EMAIL = process.env.BOOKING_FROM_EMAIL || "PolyCloud <onboarding@resend.dev>";
const MARKETING_FROM = process.env.EMAIL_MARKETING_FROM || FROM_EMAIL;

export type SendResult = {
  delivered: boolean;
  provider: "resend" | "web3forms" | "formsubmit" | "none";
  providerId: string | null;
  reason?: string;
  error?: string;
};

/**
 * Plain-text notification to the team. Used by /api/book.
 * Preserves the exact 3-backend fallback behavior that existed before the
 * email-marketing template landed.
 */
export async function sendNotification(opts: {
  subject: string;
  text: string;
  replyTo?: string;
  fromName?: string;
}): Promise<SendResult> {
  // Backend 1: Resend
  if (RESEND_API_KEY) {
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
          reply_to: opts.replyTo,
          subject: opts.subject,
          text: opts.text,
        }),
      });
      if (res.ok) {
        const body = (await res.json().catch(() => ({}))) as { id?: string };
        return { delivered: true, provider: "resend", providerId: body.id ?? null };
      }
    } catch (err) {
      console.error("[email/providers] Resend exception (notification):", err);
    }
  }

  // Backend 2: Web3Forms
  if (WEB3FORMS_ACCESS_KEY) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: opts.subject,
          from_name: opts.fromName ?? "polycloud.in",
          email: opts.replyTo ?? TO_EMAIL,
          message: opts.text,
          replyto: opts.replyTo,
        }),
      });
      if (res.ok) return { delivered: true, provider: "web3forms", providerId: null };
    } catch (err) {
      console.error("[email/providers] Web3Forms exception:", err);
    }
  }

  // Backend 3: Formsubmit (ajax endpoint)
  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: opts.subject,
          _replyto: opts.replyTo,
          _template: "table",
          message: opts.text,
          source: "polycloud.in",
        }),
      },
    );
    if (res.ok) return { delivered: true, provider: "formsubmit", providerId: null };
  } catch (err) {
    console.error("[email/providers] Formsubmit exception:", err);
  }

  return { delivered: false, provider: "none", providerId: null, reason: "all_backends_failed" };
}

/**
 * HTML email to an arbitrary recipient. Requires Resend.
 * Used for welcome / nurture / newsletter. Never throws.
 */
export async function sendMarketing(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!RESEND_API_KEY) {
    return {
      delivered: false,
      provider: "none",
      providerId: null,
      reason: "no_resend_key",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MARKETING_FROM,
        to: opts.to,
        reply_to: opts.replyTo ?? TO_EMAIL,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (res.ok) {
      const body = (await res.json().catch(() => ({}))) as { id?: string };
      return { delivered: true, provider: "resend", providerId: body.id ?? null };
    }
    const errText = await res.text();
    return {
      delivered: false,
      provider: "resend",
      providerId: null,
      reason: `resend_${res.status}`,
      error: errText.slice(0, 500),
    };
  } catch (err) {
    return {
      delivered: false,
      provider: "resend",
      providerId: null,
      reason: "resend_exception",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
