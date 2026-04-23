import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  getExpectedCredentials,
  signSession,
} from "../../../lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { user?: string; pass?: string; next?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { user: expectedUser, pass: expectedPass } = getExpectedCredentials();
  if (!expectedPass) {
    return NextResponse.json(
      {
        error:
          "Server not configured. PRIVATE_DASH_PASS must be set in the environment.",
      },
      { status: 503 }
    );
  }

  if (body.user !== expectedUser || body.pass !== expectedPass) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  const token = await signSession(body.user);
  const res = NextResponse.json({
    ok: true,
    next: body.next && body.next.startsWith("/") ? body.next : "/dashboard",
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
