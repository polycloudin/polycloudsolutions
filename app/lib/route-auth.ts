import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE, type SessionClaims } from "./auth";

/**
 * Route Handler auth helpers. proxy.ts gates page routes; API routes
 * outside the proxy matcher (e.g. /api/keys) need their own gate.
 *
 * Two helpers:
 *   - requireOperator: hard 401/403 if the request isn't an operator.
 *     Returns the claims on success, a Response on failure (caller
 *     should `return` it directly).
 *   - currentClaims: best-effort, never throws — returns null when no
 *     valid session is present. Use for read-only "decorate UI"
 *     scenarios.
 *
 * Built on Next.js 16 async cookies(). All callers must `await` these.
 */

export interface AuthSuccess {
  ok: true;
  claims: SessionClaims;
}

export interface AuthFailure {
  ok: false;
  response: Response;
}

export type AuthResult = AuthSuccess | AuthFailure;

/**
 * Require an authenticated operator (caps.ops === true). Returns either
 * { ok: true, claims } or { ok: false, response } — never throws.
 *
 * On failure, response is a JSON 401/403 ready to be returned from the
 * route handler.
 */
export async function requireOperator(): Promise<AuthResult> {
  const claims = await currentClaims();
  if (!claims) {
    return {
      ok: false,
      response: Response.json(
        { error: "Authentication required." },
        { status: 401 },
      ),
    };
  }
  if (!claims.ops) {
    return {
      ok: false,
      response: Response.json(
        { error: "Operator capability required." },
        { status: 403 },
      ),
    };
  }
  return { ok: true, claims };
}

/** Best-effort session read. Returns null when no valid cookie exists. */
export async function currentClaims(): Promise<SessionClaims | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    return await readSession(token);
  } catch {
    // cookies() can throw inside non-route contexts (e.g. wrong runtime).
    // Treat as unauthenticated rather than crashing the request.
    return null;
  }
}
