import { NextResponse } from "next/server";

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
