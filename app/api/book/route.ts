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

const RESEND_API_KEY = process.env.RESEND_API_KEY;
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

  console.log("[/api/book] Submission received:", { ...body, company_website: undefined });

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
          reply_to: body.email,
          subject,
          text,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[/api/book] Resend failed:", res.status, errText);
      }
    } catch (err) {
      console.error("[/api/book] Resend exception:", err);
    }
  } else {
    console.warn("[/api/book] RESEND_API_KEY not set — submission logged only");
  }

  return NextResponse.json({ success: true });
}
