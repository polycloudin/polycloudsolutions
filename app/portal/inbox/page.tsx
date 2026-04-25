import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession } from "../../lib/auth";
import { listNotifications, type StoredNotification } from "../../lib/notifications";
import { listAllNotificationsImpl } from "../../lib/notifications-admin";
import SignOutButton from "../../dashboard/SignOutButton";
import InboxControls from "./InboxControls";
import NotificationItem from "./NotificationItem";

/**
 * Unified inbox — see INTEGRATION.md §3c.
 *
 * Auth: any authenticated user. Operators see all tenants; clients see
 * only the tenants in their JWT `ten` claim. proxy.ts carves out
 * /portal/inbox so non-ops users can reach this page.
 */

export const metadata: Metadata = {
  title: "Inbox · Notifications — PolyCloud",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    tenant?: string;
    severity?: string;
    unread?: string;
  }>;
}

const VALID_SEVERITIES = ["low", "medium", "high", "critical"] as const;
type Severity = (typeof VALID_SEVERITIES)[number];

export default async function InboxPage({ searchParams }: PageProps) {
  // Server-side auth (proxy passed us through, but we still need the claims
  // here to know WHICH tenants this user can see).
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("polycloud_session")?.value;
  const claims = await readSession(sessionToken);
  if (!claims) {
    redirect("/login?next=/portal/inbox");
  }

  const sp = await searchParams;
  const tenantFilter = sp.tenant?.trim() || undefined;
  const severityRaw = sp.severity?.trim() || undefined;
  const severity =
    severityRaw && (VALID_SEVERITIES as readonly string[]).includes(severityRaw)
      ? (severityRaw as Severity)
      : undefined;
  const unreadOnly = sp.unread === "1";

  // Determine which tenants this user is allowed to see.
  const isOps = claims.ops === true;
  const accessibleTenants: string[] = isOps ? [] : claims.ten ?? [];

  // If a tenant filter was passed but the user doesn't have access, treat
  // as "no results" rather than 403 — keeps URL-sharing sane.
  if (
    tenantFilter !== undefined &&
    !isOps &&
    !accessibleTenants.includes(tenantFilter)
  ) {
    return (
      <Layout>
        <NoAccess tenant={tenantFilter} />
      </Layout>
    );
  }

  // Fetch notifications.
  let notifications: StoredNotification[] = [];
  if (isOps && tenantFilter === undefined) {
    notifications = await listAllNotificationsImpl({
      severity,
      unread_only: unreadOnly,
      unread_for_email: claims.sub,
    });
  } else {
    const tenants = tenantFilter !== undefined ? [tenantFilter] : accessibleTenants;
    for (const t of tenants) {
      const rows = await listNotifications(t, {
        severity,
        unread_only: unreadOnly,
        unread_for_email: claims.sub,
      });
      notifications = notifications.concat(rows);
    }
    notifications.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }

  const tenantsSeen = Array.from(new Set(notifications.map((n) => n.tenant))).sort();
  const unreadCount = notifications.filter(
    (n) => !n.read_by.some((e) => e.toLowerCase() === claims.sub.toLowerCase()),
  ).length;

  return (
    <Layout
      headerRight={
        <span className="mono text-[10.5px] text-[var(--color-text-muted)]">
          {claims.sub}
        </span>
      }
    >
      <section className="px-5 md:px-8 py-8 md:py-10 max-w-[1280px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
          Inbox · {notifications.length} item{notifications.length === 1 ? "" : "s"}
          {unreadCount > 0 && ` · ${unreadCount} unread`}
        </p>
        <h1 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] mb-4 max-w-3xl">
          What needs you.
        </h1>
        <p className="text-[14.5px] md:text-[15.5px] text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
          Approval queue items, deadline warnings, alerts. Pushed by every
          product via <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">POST /api/notifications</code>.
        </p>
      </section>

      <InboxControls
        tenants={tenantsSeen}
        accessibleTenants={isOps ? null : accessibleTenants}
        currentTenant={tenantFilter}
        currentSeverity={severity}
        currentUnreadOnly={unreadOnly}
      />

      <main className="px-5 md:px-8 max-w-[1280px] mx-auto py-8 md:py-10">
        {notifications.length === 0 ? (
          <EmptyInbox
            filtered={Boolean(tenantFilter || severity || unreadOnly)}
            accessibleTenantCount={isOps ? -1 : accessibleTenants.length}
          />
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notif={n}
                isRead={n.read_by.some(
                  (e) => e.toLowerCase() === claims.sub.toLowerCase(),
                )}
              />
            ))}
          </ul>
        )}
      </main>
    </Layout>
  );
}

function Layout({
  children,
  headerRight,
}: {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-medium tracking-tight">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Inbox
            </span>
          </div>
          <div className="flex items-center gap-3">
            {headerRight}
            <Link
              href="/portal"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Portal
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

function EmptyInbox({
  filtered,
  accessibleTenantCount,
}: {
  filtered: boolean;
  accessibleTenantCount: number;
}) {
  return (
    <div className="bg-white border border-[var(--color-line)] rounded-xl p-8 md:p-12 text-center">
      <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
        {filtered ? "No matches" : "Inbox zero"}
      </p>
      <p className="text-[14px] text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
        {filtered ? (
          <>Nothing matches the current filters. Adjust them above.</>
        ) : accessibleTenantCount === 0 ? (
          <>
            You don&apos;t have any tenants in your scope yet. Operators see
            everything; clients see notifications for the tenants in their
            JWT <code className="font-mono">ten</code> claim.
          </>
        ) : (
          <>
            No active notifications. Apps push items via{" "}
            <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">
              POST /api/notifications
            </code>
            .
          </>
        )}
      </p>
    </div>
  );
}

function NoAccess({ tenant }: { tenant: string }) {
  return (
    <section className="px-5 md:px-8 py-12 max-w-[1280px] mx-auto">
      <div className="bg-white border border-[var(--color-line)] rounded-xl p-8 text-center">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
          No access
        </p>
        <p className="text-[14px] text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
          Tenant <code className="font-mono">{tenant}</code> isn&apos;t in your scope.
        </p>
        <Link
          href="/portal/inbox"
          className="inline-block mt-4 mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary-blue)]"
        >
          ← Back to inbox
        </Link>
      </div>
    </section>
  );
}
