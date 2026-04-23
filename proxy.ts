import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Gate private client dashboards + the operator dashboard behind a
 * signed HttpOnly cookie session (set by POST /api/auth/login).
 *
 * Basic Auth is kept as a fallback — useful for curl tests and for
 * bookmarked `https://user:pass@site/path` URLs. If neither works,
 * unauthenticated visitors are redirected to /login?next=<path>.
 *
 * Keep PRIVATE_CLIENT_SLUGS in sync with `auth: "private"` entries in
 * app/client/data/registry.ts — proxy.ts runs on the Edge runtime and
 * cannot synchronously import the full registry module.
 */
const PRIVATE_CLIENT_SLUGS = new Set<string>(["polycloud", "viratkota"]);
const SESSION_COOKIE = "polycloud_session";

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET || process.env.PRIVATE_DASH_PASS || "";
  return new TextEncoder().encode(s.padEnd(32, "x"));
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

function hasValidBasicAuth(request: NextRequest): boolean {
  const expectedUser = process.env.PRIVATE_DASH_USER || "polycloud";
  const expectedPass = process.env.PRIVATE_DASH_PASS;
  if (!expectedPass) return false;

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    if (sep < 0) return false;
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    return user === expectedUser && pass === expectedPass;
  } catch {
    return false;
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  const next = url.pathname + (url.search || "");
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

function misconfigured(): NextResponse {
  return new NextResponse(
    "Internal dashboards are not configured. Set PRIVATE_DASH_PASS in the environment.",
    { status: 503 }
  );
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (!process.env.PRIVATE_DASH_PASS) return misconfigured();

  const isOperator = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const clientMatch = pathname.match(/^\/client\/([^/]+)(?:\/.*)?$/);
  const isPrivateClient =
    clientMatch !== null && PRIVATE_CLIENT_SLUGS.has(clientMatch[1]);

  if (!isOperator && !isPrivateClient) return NextResponse.next();

  // 1. Cookie session — preferred path (set by /api/auth/login)
  if (await hasValidSession(request)) return NextResponse.next();

  // 2. Basic Auth fallback — for curl tests + bookmarked creds URLs
  if (hasValidBasicAuth(request)) return NextResponse.next();

  // 3. No valid auth → branded login page
  return redirectToLogin(request);
}

export const config = {
  matcher: [
    "/client/:slug",
    "/client/:slug/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
