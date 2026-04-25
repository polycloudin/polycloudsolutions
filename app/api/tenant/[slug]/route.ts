import { NextResponse } from "next/server";
import { currentClaims } from "../../../lib/route-auth";
import { validateApiKey } from "../../../lib/api-keys";
import { getTenantConfig } from "../../../lib/tenants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Read a tenant's config. Accepts either:
 *   1. An ops session (cookie) — operator looking at any tenant
 *   2. A valid API key whose tenant matches the requested slug —
 *      apps fetching their own config so they don't have to hardcode
 *      values like ga4_property_id.
 *
 * 404 if the slug isn't known to the registry or libsql.
 *
 * Next.js 16 route handler params signature: `params` is a Promise.
 */
export async function GET(
  request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  // Auth — allow ops session OR matching-tenant API key.
  const claims = await currentClaims();
  let authed = !!claims?.ops;
  if (!authed) {
    const apiCtx = await validateApiKey(request);
    if (apiCtx && apiCtx.tenant === slug) {
      authed = true;
    }
  }
  if (!authed) {
    return NextResponse.json(
      { error: "Authentication required (ops session or matching API key)." },
      { status: 401 },
    );
  }

  const cfg = await getTenantConfig(slug);
  if (!cfg) {
    return NextResponse.json(
      { error: `Unknown tenant '${slug}'.` },
      { status: 404 },
    );
  }
  return NextResponse.json(cfg);
}
