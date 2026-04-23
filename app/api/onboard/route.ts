import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Intake endpoint for new-client onboarding.
 *
 * For now: validate payload + log to Vercel function logs. Post-MVP:
 * push into libsql so /dashboard gets a "New intake" row.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const required = ["business_name", "contact_name", "email", "phone", "vertical", "bundle", "pain_point"];
  const missing = required.filter((k) => !body[k] || String(body[k]).trim() === "");
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const email = String(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // Structured log — picked up by Vercel Logs for now.
  // TODO: persist to libsql `intakes` table when schema lands.
  console.log(
    JSON.stringify({
      kind: "onboard_intake",
      received_at: new Date().toISOString(),
      payload: body,
    })
  );

  return NextResponse.json({ ok: true, next: "/onboard/thanks" });
}
