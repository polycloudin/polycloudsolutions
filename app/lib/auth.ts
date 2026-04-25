import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { UserCaps } from "./users";

/**
 * Shared auth helpers — used by /api/auth/* routes and by proxy.ts.
 *
 * RBAC capability flags ride along in the JWT payload (see SessionClaims):
 *   ops   — operator wildcard (sees everything)
 *   ten[] — tenant slug allowlist for /client/<slug>
 *   lab   — Labs intelligence access
 *
 * proxy.ts decodes the JWT on each request and enforces per-route rules.
 */

const COOKIE_NAME = "polycloud_session";
const DEFAULT_TTL_DAYS = 14;

export interface SessionClaims extends JWTPayload {
  sub: string;          // email
  ops: boolean;
  ten: string[];
  lab: boolean;
}

function getSecret(): Uint8Array {
  // Prefer a dedicated AUTH_SECRET; fall back to the existing password so
  // deployments don't need a new env var on day one.
  const s = process.env.AUTH_SECRET || process.env.PRIVATE_DASH_PASS;
  if (!s) throw new Error("No AUTH_SECRET / PRIVATE_DASH_PASS set");
  return new TextEncoder().encode(s.padEnd(32, "x"));
}

export function getLegacyCredentials(): { user: string; pass: string | undefined } {
  return {
    user: process.env.PRIVATE_DASH_USER || "polycloud",
    pass: process.env.PRIVATE_DASH_PASS,
  };
}

export async function signSession(claims: {
  email: string;
  caps: UserCaps;
}): Promise<string> {
  return await new SignJWT({
    sub: claims.email,
    ops: claims.caps.ops,
    ten: claims.caps.ten,
    lab: claims.caps.lab,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DEFAULT_TTL_DAYS}d`)
    .sign(getSecret());
}

/** Decode + verify a session cookie. Returns claims or null if invalid. */
export async function readSession(
  token: string | undefined | null
): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.ops !== "boolean" ||
      !Array.isArray(payload.ten) ||
      typeof payload.lab !== "boolean"
    ) {
      return null;
    }
    return payload as SessionClaims;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = DEFAULT_TTL_DAYS * 24 * 60 * 60;
