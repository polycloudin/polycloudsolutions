import { NextResponse } from "next/server";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/app/lib/auth";
import { validateRealtyApiKey } from "@/app/lib/realty";

export const runtime = "nodejs";

/**
 * POST /api/realty/builder-session — builder self-login.
 *
 * Body (form-data or JSON):
 *   api_key:    pck_live_<token>
 *   next_slug:  optional — desired /realty/app/<slug> redirect
 *
 * Auth model: validates the api_key against realty_builders.api_key_hash
 * (same sha256 lookup the /api/usage gate uses). Mints a 14-day JWT with:
 *   { sub: "builder:<slug>", ops: false, ten: [<slug>], lab: false }
 *
 * Sets the standard polycloud_session cookie and redirects.
 *
 * Spec: INTEGRATION.md §2b · session class.
 */

interface FormBody {
  api_key?: string;
  next_slug?: string;
}

async function readBody(req: Request): Promise<FormBody> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return (await req.json()) as FormBody;
    } catch {
      return {};
    }
  }
  // form-data / x-www-form-urlencoded
  const fd = await req.formData();
  return {
    api_key: typeof fd.get("api_key") === "string" ? (fd.get("api_key") as string) : undefined,
    next_slug:
      typeof fd.get("next_slug") === "string" ? (fd.get("next_slug") as string) : undefined,
  };
}

export async function POST(req: Request) {
  const body = await readBody(req);
  const apiKey = (body.api_key || "").trim();
  const nextSlug = (body.next_slug || "").trim();

  if (!apiKey) {
    return _redirectToLogin(req, nextSlug, "invalid");
  }

  const ctx = await validateRealtyApiKey(apiKey);
  if (!ctx) {
    return _redirectToLogin(req, nextSlug, "invalid");
  }

  // Mint a session that allows access to THIS builder's slug only.
  const slug = ctx.builder_slug;
  const token = await signSession({
    email: `builder:${slug}`,
    caps: { ops: false, ten: [slug], lab: false },
  });

  const targetSlug = nextSlug || slug;
  const dest = new URL(`/realty/app/${encodeURIComponent(targetSlug)}`, req.url);
  const res = NextResponse.redirect(dest);
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

function _redirectToLogin(req: Request, nextSlug: string, errorCode: string) {
  const url = new URL("/realty/app/login", req.url);
  if (nextSlug) url.searchParams.set("slug", nextSlug);
  url.searchParams.set("error", errorCode);
  return NextResponse.redirect(url);
}
