import { NextResponse } from "next/server";
import { requireOperator } from "../../../lib/route-auth";
import { revokeKey } from "../../../lib/api-keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Operator-only API key revocation.
 *
 *   DELETE /api/keys/<sha256-hash>
 *     returns: { ok: true } on success, 404 if no matching key,
 *              503 if DB is unconfigured.
 *
 * Hash is the sha256 of the plaintext token (64 hex chars). The plaintext
 * is never logged anywhere, so revocation has to go via the hash that
 * /api/keys (GET/POST) already exposes.
 *
 * Note Next.js 16 route handler params signature: `params` is now a
 * Promise that must be awaited.
 */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ hash: string }> },
) {
  const auth = await requireOperator();
  if (!auth.ok) return auth.response;

  const { hash } = await ctx.params;
  if (!hash || !/^[a-f0-9]{64}$/.test(hash)) {
    return NextResponse.json(
      { error: "Invalid hash. Must be 64 hex chars (sha256)." },
      { status: 400 },
    );
  }
  const ok = await revokeKey(hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Key not found or already revoked." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true });
}
