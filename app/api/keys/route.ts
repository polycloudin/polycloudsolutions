import { NextResponse } from "next/server";
import { requireOperator } from "../../lib/route-auth";
import {
  issueKey,
  listKeys,
  VALID_SCOPES,
  type ApiKeyScope,
} from "../../lib/api-keys";
import { CLIENT_REGISTRY } from "../../lib/tenants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Operator-only API key issuance + listing.
 *
 *   POST /api/keys
 *     body: { tenant: string, scopes: string[], label?: string }
 *     returns: { token, hash, tenant, scopes, label } — token shown ONCE
 *
 *   GET /api/keys
 *     returns: { keys: ApiKeyRow[] } — no plaintext, only persisted columns
 *
 * Both gated by requireOperator() — 401 on no session, 403 on non-ops.
 *
 * Tenant must be a known slug in CLIENT_REGISTRY. We don't auto-create
 * tenants from key issuance — adding a tenant goes via PR (see
 * app/lib/tenants.ts).
 */
export async function POST(request: Request) {
  const auth = await requireOperator();
  if (!auth.ok) return auth.response;

  let body: { tenant?: unknown; scopes?: unknown; label?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const tenant = typeof body.tenant === "string" ? body.tenant.trim() : "";
  const label =
    typeof body.label === "string" && body.label.trim() !== ""
      ? body.label.trim()
      : undefined;
  const scopes = normalizeScopes(body.scopes);

  if (!tenant) {
    return NextResponse.json({ error: "tenant is required." }, { status: 400 });
  }
  if (!CLIENT_REGISTRY[tenant]) {
    return NextResponse.json(
      { error: `Unknown tenant '${tenant}'. Add to CLIENT_REGISTRY first.` },
      { status: 400 },
    );
  }
  if (scopes.length === 0) {
    return NextResponse.json(
      {
        error: `scopes must be a non-empty array of: ${VALID_SCOPES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const issued = await issueKey({ tenant, scopes, label });
  if (!issued) {
    return NextResponse.json(
      {
        error:
          "Could not persist key — DB unconfigured (TURSO_DATABASE_URL) or write failed.",
      },
      { status: 503 },
    );
  }
  return NextResponse.json(issued, { status: 201 });
}

export async function GET() {
  const auth = await requireOperator();
  if (!auth.ok) return auth.response;
  const keys = await listKeys();
  return NextResponse.json({ keys });
}

function normalizeScopes(raw: unknown): ApiKeyScope[] {
  if (!Array.isArray(raw)) return [];
  const out: ApiKeyScope[] = [];
  for (const s of raw) {
    if (typeof s !== "string") continue;
    if (VALID_SCOPES.includes(s as ApiKeyScope)) {
      out.push(s as ApiKeyScope);
    }
  }
  // De-dupe.
  return [...new Set(out)];
}
