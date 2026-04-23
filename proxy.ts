import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gate private client dashboards + the operator dashboard behind HTTP Basic auth.
 *
 * The allowlist of private slugs is defined here (separately from the
 * data registry) because proxy.ts runs on the Edge runtime and can't
 * synchronously import the full registry module.
 *
 * Keep this list in sync with `auth: "private"` entries in
 * app/client/data/registry.ts.
 */
const PRIVATE_CLIENT_SLUGS = new Set<string>(["polycloud", "viratkota"]);

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="PolyCloud internal", charset="UTF-8"',
    },
  });
}

function misconfigured(): NextResponse {
  return new NextResponse(
    "Internal dashboards are not configured. Set PRIVATE_DASH_PASS in the environment.",
    { status: 503 }
  );
}

function checkBasicAuth(request: NextRequest): NextResponse {
  const expectedUser = process.env.PRIVATE_DASH_USER || "polycloud";
  const expectedPass = process.env.PRIVATE_DASH_PASS;
  if (!expectedPass) return misconfigured();

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    if (sep < 0) return unauthorized();
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }
  return unauthorized();
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Operator dashboard — always gated
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return checkBasicAuth(request);
  }

  // Per-client dashboards — gated only for private slugs
  const match = pathname.match(/^\/client\/([^/]+)(?:\/.*)?$/);
  if (match) {
    const slug = match[1];
    if (PRIVATE_CLIENT_SLUGS.has(slug)) {
      return checkBasicAuth(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/:slug",
    "/client/:slug/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
