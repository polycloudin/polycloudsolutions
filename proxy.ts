import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * RBAC gate. Cookie-session-first; legacy Basic Auth still accepted as a
 * fallback (curl tests, bookmarked creds-in-URL). Unauthenticated visitors
 * to gated routes are redirected to /login?next=<path>.
 *
 * Capability flags (carried in JWT payload):
 *   ops   — operator wildcard (sees everything)
 *   ten[] — tenant slug allowlist for /client/<slug>
 *   lab   — Labs intelligence subscriber
 *
 * Per-route enforcement:
 *   /dashboard, /portal               → ops === true
 *   /client/<slug>                    → ops || ten.includes(slug)  (slug must also be private — public slugs unauth)
 *   /labs/dashboard, /labs/dashboard/* → ops || lab === true
 *   everything else                    → public, no check
 *
 * Edge runtime: cannot import the full users module (Node-only crypto).
 * proxy.ts only needs the JWT verify path, which jose covers.
 */

const PRIVATE_CLIENT_SLUGS = new Set<string>(["polycloud", "viratkota"]);
const SESSION_COOKIE = "polycloud_session";

interface SessionClaims {
  sub: string;
  ops: boolean;
  ten: string[];
  lab: boolean;
  exp?: number;
  iat?: number;
}

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET || process.env.PRIVATE_DASH_PASS || "";
  return new TextEncoder().encode(s.padEnd(32, "x"));
}

async function readSession(request: NextRequest): Promise<SessionClaims | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.ops !== "boolean" ||
      !Array.isArray(payload.ten) ||
      typeof payload.lab !== "boolean"
    ) {
      // Legacy session cookie (no caps) — treat as full operator for back-compat.
      // Drop this branch once every cookie issued before RBAC has expired (14d TTL).
      if (typeof payload.sub === "string") {
        return { sub: payload.sub, ops: true, ten: [], lab: true };
      }
      return null;
    }
    return {
      sub: payload.sub,
      ops: payload.ops,
      ten: payload.ten as string[],
      lab: payload.lab,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch {
    return null;
  }
}

function legacyBasicAuthCaps(request: NextRequest): SessionClaims | null {
  const expectedUser = process.env.PRIVATE_DASH_USER || "polycloud";
  const expectedPass = process.env.PRIVATE_DASH_PASS;
  if (!expectedPass) return null;

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    if (sep < 0) return null;
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === expectedUser && pass === expectedPass) {
      // Legacy creds = full operator
      return { sub: user, ops: true, ten: [], lab: true };
    }
  } catch {
    return null;
  }
  return null;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  const next = url.pathname + (url.search || "");
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

function forbidden(_request: NextRequest, claims: SessionClaims, _path: string): NextResponse {
  // 403 — authenticated but lacks the cap. Don't leak which surfaces exist;
  // send to the user's own home (most likely useful destination).
  const home = claims.ops
    ? "/dashboard"
    : claims.ten[0]
    ? `/client/${claims.ten[0]}`
    : claims.lab
    ? "/labs/dashboard"
    : "/";
  return new NextResponse(
    `Forbidden — your account does not have access to this surface. Returning to ${home}.`,
    {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    }
  );
}

function misconfigured(): NextResponse {
  return new NextResponse(
    "Internal dashboards are not configured. Set AUTH_SECRET or PRIVATE_DASH_PASS in the environment.",
    { status: 503 }
  );
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (!process.env.PRIVATE_DASH_PASS && !process.env.AUTH_SECRET) {
    return misconfigured();
  }

  // ---------- Identify the gate this request is asking for ----------
  const isOperator =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/portal" ||
    pathname.startsWith("/portal/");

  const clientMatch = pathname.match(/^\/client\/([^/]+)(?:\/.*)?$/);
  const clientSlug = clientMatch ? clientMatch[1] : null;
  const isPrivateClient = clientSlug !== null && PRIVATE_CLIENT_SLUGS.has(clientSlug);

  const isLabsDashboard =
    pathname === "/labs/dashboard" || pathname.startsWith("/labs/dashboard/");

  if (!isOperator && !isPrivateClient && !isLabsDashboard) {
    return NextResponse.next();
  }

  // ---------- Read auth ----------
  const claims = (await readSession(request)) ?? legacyBasicAuthCaps(request);
  if (!claims) return redirectToLogin(request);

  // ---------- Enforce per-route caps ----------
  if (isOperator && !claims.ops) return forbidden(request, claims, pathname);

  if (isPrivateClient && clientSlug) {
    if (!(claims.ops || claims.ten.includes(clientSlug))) {
      return forbidden(request, claims, pathname);
    }
  }

  if (isLabsDashboard && !(claims.ops || claims.lab)) {
    return forbidden(request, claims, pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/:slug",
    "/client/:slug/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/portal",
    "/portal/:path*",
    "/labs/dashboard",
    "/labs/dashboard/:path*",
  ],
};
