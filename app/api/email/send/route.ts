import { NextResponse } from "next/server";
import { composeAndSend, type TemplateName } from "@/app/lib/email/compose";

/**
 * Internal send endpoint. Used by:
 *   - Day 6 broadcast CLI (python scripts/broadcast.py)
 *   - manual test sends from curl
 *
 * Not called from /api/book (that uses compose lib directly, inline).
 *
 * Auth: Bearer EMAIL_CRON_SECRET.
 *
 * Payload:
 *   { template: "welcome" | "nurture-1" | "nurture-2" | "newsletter",
 *     to: "user@example.com",
 *     vars: { name: "...", ... } }
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_TEMPLATES: TemplateName[] = ["welcome", "nurture-1", "nurture-2", "newsletter"];

export async function POST(req: Request): Promise<NextResponse> {
  const expected = process.env.EMAIL_CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { template?: string; to?: string; vars?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { template, to, vars } = body;
  if (!template || !VALID_TEMPLATES.includes(template as TemplateName)) {
    return NextResponse.json(
      { error: "Invalid template", valid: VALID_TEMPLATES },
      { status: 400 },
    );
  }
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Invalid to address" }, { status: 400 });
  }

  const result = await composeAndSend({
    template: template as TemplateName,
    to,
    vars: vars ?? {},
  });

  return NextResponse.json(result, { status: result.delivered ? 200 : 502 });
}
