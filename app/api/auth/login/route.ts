import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  getLegacyCredentials,
  signSession,
} from "../../../lib/auth";
import { verifyUser, type UserCaps } from "../../../lib/users";

export const runtime = "nodejs";

/**
 * Login flow:
 *   1. Try the new RBAC user store (USERS in app/lib/users.ts)
 *   2. Fall back to the legacy single-shared-password (PRIVATE_DASH_USER/PASS env)
 *      — this keeps existing operator logins working until VK + Aasrith
 *      regenerate their hashes from scripts/hash-password.mjs.
 *
 * Successful login signs a 14-day JWT that carries the user's caps:
 *   { sub: email, ops: bool, ten: string[], lab: bool }
 *
 * proxy.ts reads those caps to enforce per-route + per-tenant gates.
 */
export async function POST(request: Request) {
  let body: { user?: string; email?: string; pass?: string; next?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Accept both `email` (new) and `user` (legacy).
  const email = (body.email || body.user || "").trim();
  const pass = body.pass || "";

  if (!email || !pass) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  // ---------- Path 1: RBAC user store ----------
  const matched = await verifyUser(email, pass);
  if (matched) {
    return await issueSession(matched.email, matched.caps, body.next);
  }

  // ---------- Path 2: legacy fallback (single shared password) ----------
  const { user: legacyUser, pass: legacyPass } = getLegacyCredentials();
  if (!legacyPass) {
    return NextResponse.json(
      { error: "Server not configured. Set AUTH_SECRET or PRIVATE_DASH_PASS." },
      { status: 503 }
    );
  }
  if (email === legacyUser && pass === legacyPass) {
    // Legacy operator gets full caps — same surface they had before.
    return await issueSession(legacyUser, { ops: true, ten: [], lab: true }, body.next);
  }

  return NextResponse.json(
    { error: "Invalid email or password." },
    { status: 401 }
  );
}

async function issueSession(email: string, caps: UserCaps, next: string | undefined) {
  const token = await signSession({ email, caps });
  // Default destination based on role
  const fallback = caps.ops ? "/dashboard" : caps.ten[0] ? `/client/${caps.ten[0]}` : caps.lab ? "/labs/dashboard" : "/";
  const redirect = next && next.startsWith("/") ? next : fallback;
  const res = NextResponse.json({ ok: true, next: redirect, caps });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
