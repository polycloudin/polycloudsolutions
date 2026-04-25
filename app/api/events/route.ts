import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession } from "../../lib/auth";
import { validateApiKey } from "../../lib/api-keys";
import {
  EVENT_KINDS,
  listEvents,
  recordEvent,
  validateEventBody,
  type EventKind,
} from "../../lib/events";

export const runtime = "nodejs";

/**
 * Cross-product event firehose — see INTEGRATION.md §3a.
 *
 * POST  → write an event (machine-to-machine, requires API key + scope events:write)
 * GET   → read events (operator only — UI on /portal/feed)
 *
 * Auth precedence: x-polycloud-key for writes, polycloud_session cookie + ops cap for reads.
 */

export async function POST(request: Request) {
  // ---------- Auth ----------
  const ctx = await validateApiKey(request);
  if (!ctx) {
    return NextResponse.json(
      { error: "Missing or invalid x-polycloud-key / x-polycloud-tenant" },
      { status: 401 },
    );
  }
  if (!ctx.scopes.includes("events:write")) {
    return NextResponse.json(
      { error: "API key lacks events:write scope" },
      { status: 403 },
    );
  }

  // ---------- Body ----------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validateEventBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // ---------- Persist ----------
  const result = await recordEvent(ctx.tenant, parsed);
  if (!result) {
    // safeDb returns null when Turso is unconfigured/down — treat as 503,
    // not 500, so callers know to retry.
    return NextResponse.json(
      { error: "Event store unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
}

export async function GET(request: Request) {
  // Operator-only via session cookie.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("polycloud_session")?.value;
  const claims = await readSession(sessionToken);
  if (!claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!claims.ops) {
    return NextResponse.json({ error: "Operator capability required" }, { status: 403 });
  }

  // ---------- Query params ----------
  const url = new URL(request.url);
  const tenant = url.searchParams.get("tenant") ?? undefined;
  const kindParam = url.searchParams.get("kind") ?? undefined;
  const since = url.searchParams.get("since") ?? undefined;
  const limitParam = url.searchParams.get("limit");

  let kind: EventKind | undefined;
  if (kindParam) {
    if (!EVENT_KINDS.includes(kindParam as EventKind)) {
      return NextResponse.json(
        { error: `kind must be one of: ${EVENT_KINDS.join(", ")}` },
        { status: 400 },
      );
    }
    kind = kindParam as EventKind;
  }

  let limit: number | undefined;
  if (limitParam !== null) {
    const n = Number(limitParam);
    if (!Number.isFinite(n) || n < 1) {
      return NextResponse.json({ error: "limit must be a positive integer" }, { status: 400 });
    }
    limit = Math.min(Math.floor(n), 200);
  }

  if (since && Number.isNaN(Date.parse(since))) {
    return NextResponse.json({ error: "since must be ISO 8601" }, { status: 400 });
  }

  const events = await listEvents({ tenant, kind, since, limit });
  return NextResponse.json({ events, count: events.length });
}
