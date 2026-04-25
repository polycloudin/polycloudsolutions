import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession } from "../../lib/auth";
import {
  listNotifications,
  recordNotification,
  validateNotificationBody,
} from "../../lib/notifications";
import { listAllNotificationsImpl } from "../../lib/notifications-admin";

export const runtime = "nodejs";

/**
 * Unified inbox — see INTEGRATION.md §3c.
 *
 * POST  → create a notification (M2M, requires API key + scope notifications:write)
 * GET   → read notifications for the tenants the current user can see
 *
 * TODO: Lane A is building app/lib/api-keys.ts with the real validateApiKey().
 * Until that branch merges, the stub below accepts any non-empty x-polycloud-key
 * + x-polycloud-tenant pair and grants notifications:write. Replace this import
 * + drop the stub once Lane A's PR lands.
 */

interface ApiKeyContext {
  tenant: string;
  scopes: string[];
}

async function validateApiKey(req: Request): Promise<ApiKeyContext | null> {
  const key = req.headers.get("x-polycloud-key");
  const tenant = req.headers.get("x-polycloud-tenant");
  if (!key || !tenant) return null;
  return { tenant, scopes: ["notifications:write"] };
}
// END STUB — swap with `import { validateApiKey } from "@/app/lib/api-keys"` on integration.

export async function POST(request: Request) {
  const ctx = await validateApiKey(request);
  if (!ctx) {
    return NextResponse.json(
      { error: "Missing or invalid x-polycloud-key / x-polycloud-tenant" },
      { status: 401 },
    );
  }
  if (!ctx.scopes.includes("notifications:write")) {
    return NextResponse.json(
      { error: "API key lacks notifications:write scope" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validateNotificationBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // The body's `tenant` field MUST match the API key's tenant. Otherwise
  // a key for tenant A could spam tenant B's inbox — exactly the scope-leak
  // we want to prevent.
  if (parsed.tenant !== ctx.tenant) {
    return NextResponse.json(
      { error: "tenant in body must match the API key's tenant" },
      { status: 403 },
    );
  }

  const result = await recordNotification(parsed);
  if (!result) {
    return NextResponse.json(
      { error: "Notification store unavailable" },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
}

export async function GET(request: Request) {
  // Any authenticated user — they get notifications for tenants they can see.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("polycloud_session")?.value;
  const claims = await readSession(sessionToken);
  if (!claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const tenantFilter = url.searchParams.get("tenant") ?? undefined;
  const severity = url.searchParams.get("severity") ?? undefined;
  const unreadOnly = url.searchParams.get("unread") === "1";

  // Determine which tenants this user is allowed to see.
  // Operators (ops=true) see everything; otherwise restricted to claims.ten[].
  let allowedTenants: string[] | "all";
  if (claims.ops) {
    allowedTenants = "all";
  } else {
    allowedTenants = claims.ten ?? [];
  }

  if (allowedTenants !== "all" && allowedTenants.length === 0) {
    // Authenticated but no tenant access (e.g. labs-only user). Return empty.
    return NextResponse.json({ notifications: [], count: 0 });
  }

  if (tenantFilter && allowedTenants !== "all" && !allowedTenants.includes(tenantFilter)) {
    return NextResponse.json({ error: "Tenant not in your scope" }, { status: 403 });
  }

  const validSeverity =
    severity === "low" || severity === "medium" || severity === "high" || severity === "critical"
      ? severity
      : undefined;

  let merged: Awaited<ReturnType<typeof listNotifications>> = [];
  if (allowedTenants === "all" && tenantFilter === undefined) {
    // Operator + no filter: single query across all tenants via the admin helper.
    merged = await listAllNotificationsImpl({
      severity: validSeverity,
      unread_only: unreadOnly,
      unread_for_email: claims.sub,
    });
  } else {
    // Tenant filter (one tenant) OR client-scoped (their accessible tenants).
    // For our scale (tens of tenants per user, max), per-tenant fan-out is fine.
    const tenantsToQuery =
      tenantFilter !== undefined
        ? [tenantFilter]
        : (allowedTenants as string[]);
    for (const t of tenantsToQuery) {
      const rows = await listNotifications(t, {
        severity: validSeverity,
        unread_only: unreadOnly,
        unread_for_email: claims.sub,
      });
      merged = merged.concat(rows);
    }
    merged.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }

  return NextResponse.json({ notifications: merged, count: merged.length });
}
