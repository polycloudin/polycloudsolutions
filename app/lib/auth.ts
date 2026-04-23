import { SignJWT, jwtVerify } from "jose";

/**
 * Shared auth helpers — used by /api/auth/* routes and by proxy.ts.
 *
 * We replace Basic Auth with a signed, HttpOnly cookie session. One shared
 * password gates the whole surface (operator /dashboard + private
 * /client/<slug>) — no user DB. Multi-operator support is a later concern.
 */

const COOKIE_NAME = "polycloud_session";
const DEFAULT_TTL_DAYS = 14;

function getSecret(): Uint8Array {
  // Prefer a dedicated AUTH_SECRET; fall back to the existing password so
  // deployments don't need a new env var on day one.
  const s = process.env.AUTH_SECRET || process.env.PRIVATE_DASH_PASS;
  if (!s) throw new Error("No AUTH_SECRET / PRIVATE_DASH_PASS set");
  return new TextEncoder().encode(s.padEnd(32, "x"));
}

export function getExpectedCredentials(): { user: string; pass: string | undefined } {
  return {
    user: process.env.PRIVATE_DASH_USER || "polycloud",
    pass: process.env.PRIVATE_DASH_PASS,
  };
}

export async function signSession(sub: string = "operator"): Promise<string> {
  return await new SignJWT({ sub })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DEFAULT_TTL_DAYS}d`)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = DEFAULT_TTL_DAYS * 24 * 60 * 60;
