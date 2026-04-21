import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gate private routes behind HTTP Basic auth.
 *
 * MVP: one shared username/password read from env. Good enough to keep the
 * internal dashboards (pipeline, ops, weekly focus) off the public web.
 * Upgrade to magic-link + per-user roles once we have 3+ people needing access.
 */
const PRIVATE_PREFIXES = ["/client/polycloud"];

function needsAuth(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="PolyCloud internal", charset="UTF-8"',
    },
  });
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (!needsAuth(pathname)) {
    return NextResponse.next();
  }

  const expectedUser = process.env.PRIVATE_DASH_USER || "polycloud";
  const expectedPass = process.env.PRIVATE_DASH_PASS;

  // If no password set in env, refuse to serve — fail-closed.
  if (!expectedPass) {
    return new NextResponse(
      "Internal dashboards are not configured. Set PRIVATE_DASH_PASS in the environment.",
      { status: 503 }
    );
  }

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const decoded = atob(header.slice(6));
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/client/polycloud/:path*", "/client/polycloud"],
};
