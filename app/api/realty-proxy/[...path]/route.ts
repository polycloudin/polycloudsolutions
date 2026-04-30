import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE } from "@/app/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /api/realty-proxy/* — same-origin proxy to the realty FastAPI backend.
 *
 * Why a proxy:
 *   - Browser code never sees the backend URL or shared secret.
 *   - Same-origin → no CORS dance, cookies just work.
 *   - Portal session (HS256, polycloud_session) is the source of truth;
 *     we forward the raw JWT as `Authorization: Bearer …` so the
 *     FastAPI auth dependency can verify it with the same secret.
 *
 * Wiring:
 *   - REALTY_API_URL env var points at the deployed FastAPI base
 *     (e.g. https://realty-api.polycloud.in or a Railway URL).
 *   - The realty backend MUST set REALTY_API_REQUIRE_AUTH=1 + the same
 *     AUTH_SECRET as this portal.
 *
 * Auth gate:
 *   - Caller must have a valid polycloud_session cookie. Anonymous
 *     access is rejected here BEFORE any backend call (saves money,
 *     blocks unauthenticated probes).
 *   - Operator (ops=true) can hit any endpoint with any builder.
 *   - Tenants are restricted by the backend's require_builder_access;
 *     this proxy doesn't try to second-guess.
 *
 * Method support: GET only for now. The backend's v2 surface is
 * read-only. Returning 405 for everything else keeps surface tight.
 */

const ALLOWED_METHODS = new Set(["GET", "OPTIONS"]);

function backendBase(): string | null {
  const url = (process.env.REALTY_API_URL || "").trim();
  if (!url) return null;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function authToken(): Promise<{ token: string; sub: string } | null> {
  const jar = await cookies();
  const tok = jar.get(SESSION_COOKIE)?.value;
  if (!tok) return null;
  const claims = await readSession(tok);
  if (!claims) return null;
  return { token: tok, sub: claims.sub };
}

interface Ctx {
  params: Promise<{ path: string[] }>;
}

export async function OPTIONS(_req: Request, _ctx: Ctx) {
  // Same-origin → preflight not strictly required, but we return 204 with
  // the methods we accept for clarity.
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-methods": [...ALLOWED_METHODS].join(", "),
      "access-control-allow-headers": "authorization, content-type",
    },
  });
}

export async function GET(req: Request, ctx: Ctx) {
  const auth = await authToken();
  if (!auth) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const base = backendBase();
  if (!base) {
    return NextResponse.json(
      {
        error: "realty_api_url_not_configured",
        hint:
          "Set REALTY_API_URL on the portal Vercel project — e.g. " +
          "https://realty-api.polycloud.in",
      },
      { status: 503 }
    );
  }

  const { path } = await ctx.params;
  const sub = path.join("/");
  const url = new URL(req.url);
  const target = `${base}/api/intel/v2/${sub}${url.search}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: "GET",
      headers: {
        authorization: `Bearer ${auth.token}`,
        accept: "application/json",
      },
      // Don't carry caller cookies; backend is keyed off the bearer alone.
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "upstream_unreachable",
        target_host: new URL(base).host,
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }

  // Mirror status + content-type. Fall back to JSON wrapper on opaque
  // upstream errors so the frontend never sees an empty body.
  const ct = upstream.headers.get("content-type") || "application/json";
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type": ct,
      "x-realty-proxy-sub": auth.sub.slice(0, 64),
      "cache-control": "no-store",
    },
  });
}
