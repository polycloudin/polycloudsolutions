import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession } from "../../../../lib/auth";
import { markRead } from "../../../../lib/notifications";

export const runtime = "nodejs";

/**
 * POST /api/notifications/<id>/read — mark a notification read by current user.
 *
 * Per Next.js 16 dynamic-route convention, `params` is a Promise.
 */
export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("polycloud_session")?.value;
  const claims = await readSession(sessionToken);
  if (!claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!id || typeof id !== "string" || !id.startsWith("nfn_")) {
    return NextResponse.json({ error: "Invalid notification id" }, { status: 400 });
  }

  const ok = await markRead(id, claims.sub);
  if (!ok) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
