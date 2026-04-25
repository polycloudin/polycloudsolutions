import type { Metadata } from "next";
import Link from "next/link";
import { listEvents, type StoredEvent, EVENT_KINDS } from "../../lib/events";
import SignOutButton from "../../dashboard/SignOutButton";
import FeedFilters from "./FeedFilters";

/**
 * Operator-only events firehose UI.
 *
 * Server component — auth is enforced by proxy.ts (/portal/* requires ops).
 * Reads up to 50 most recent events, renders narrative cards
 * (signal -> action -> outcome) per INTEGRATION.md §3a.
 *
 * Auto-refresh every 30s via the client-side <FeedFilters> component
 * (router.refresh on interval). Polling, not SSE — see §8 in the brief.
 */

export const metadata: Metadata = {
  title: "Feed · Cross-product events — PolyCloud",
  robots: { index: false, follow: false, nocache: true },
};

// Render fresh on every request — events feed changes constantly.
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    tenant?: string;
    kind?: string;
  }>;
}

export default async function FeedPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tenant = sp.tenant?.trim() || undefined;
  const kindParam = sp.kind?.trim() || undefined;
  const kind =
    kindParam && (EVENT_KINDS as readonly string[]).includes(kindParam)
      ? (kindParam as StoredEvent["kind"])
      : undefined;

  const events = await listEvents({ tenant, kind, limit: 50 });

  // Build the unique tenants + kinds seen so the filter chips reflect reality.
  // (For v1 we only show kinds from the constant list, since some kinds may
  // never have appeared yet.)
  const tenantsSeen = Array.from(new Set(events.map((e) => e.tenant))).sort();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-medium tracking-tight">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Portal · Feed
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Portal
            </Link>
            <Link
              href="/portal/inbox"
              className="text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-ink)]"
            >
              Inbox
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 md:px-8 py-8 md:py-10 max-w-[1280px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
          Cross-product event firehose · 50 latest
        </p>
        <h1 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] mb-4 max-w-3xl">
          Every action across every product.
        </h1>
        <p className="text-[14.5px] md:text-[15.5px] text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
          Recon runs, vendor follow-ups, OCR results, memo shipments,
          scrape completions. Pushed by the CA Firm Toolkit, Nexus, and
          the Realty agent via <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">POST /api/events</code>.
          Auto-refreshes every 30s.
        </p>
      </section>

      {/* Filters (client component) */}
      <FeedFilters
        tenants={tenantsSeen}
        currentTenant={tenant}
        currentKind={kind}
      />

      {/* Feed */}
      <main className="px-5 md:px-8 max-w-[1280px] mx-auto py-8 md:py-10">
        {events.length === 0 ? (
          <EmptyState filtered={Boolean(tenant || kind)} />
        ) : (
          <div className="space-y-3">
            {events.map((evt) => (
              <EventCard key={evt.id} evt={evt} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------
// Components
// ----------------------------------------------------------------

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="bg-white border border-[var(--color-line)] rounded-xl p-8 md:p-12 text-center">
      <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
        {filtered ? "No matches" : "No events yet"}
      </p>
      <p className="text-[14px] text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
        {filtered ? (
          <>Nothing matched the current filters. Clear them above to see all events.</>
        ) : (
          <>
            The firehose is empty. Apps push events via{" "}
            <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">
              POST /api/events
            </code>{" "}
            with a tenant API key.
          </>
        )}
      </p>
    </div>
  );
}

const KIND_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  "recon-run": { label: "Recon", color: "#1A5FD4", bg: "#EEF4FF" },
  "vendor-followup": { label: "Vendor", color: "#7C3AED", bg: "#F3E8FF" },
  "ocr-result": { label: "OCR", color: "#0891B2", bg: "#ECFEFF" },
  "memo-shipped": { label: "Memo", color: "#15803D", bg: "#ECFDF3" },
  "agent-run": { label: "Agent", color: "#0E3E96", bg: "#EEF4FF" },
  "scrape-completed": { label: "Scrape", color: "#0E3E96", bg: "#EEF4FF" },
  "user-action": { label: "User", color: "#6B7280", bg: "#F3F4F6" },
  alert: { label: "Alert", color: "#DC2626", bg: "#FEF2F2" },
  "signal-detected": { label: "Signal", color: "#F46B2C", bg: "#FFF4ED" },
};

function EventCard({ evt }: { evt: StoredEvent }) {
  const style = KIND_STYLE[evt.kind] ?? KIND_STYLE["user-action"];
  const ts = formatTs(evt.payload.ts);
  return (
    <article className="bg-white border border-[var(--color-line)] rounded-xl p-4 md:p-5 hover:border-[var(--color-ink)] transition-colors">
      {/* Header row: kind chip · tenant · timestamp */}
      <div className="flex items-center gap-2.5 mb-3 flex-wrap">
        <span
          className="mono text-[9.5px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
          style={{ color: style.color, backgroundColor: style.bg }}
        >
          {style.label}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)]">
          {evt.tenant}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)]">·</span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)]">
          {evt.payload.actor}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)] ml-auto" title={evt.payload.ts}>
          {ts}
        </span>
      </div>

      {/* Summary headline */}
      <p className="text-[14.5px] font-medium tracking-tight leading-snug mb-3">
        {evt.payload.summary}
      </p>

      {/* Signal -> action -> outcome narrative */}
      {(evt.payload.signal || evt.payload.action || evt.payload.outcome) && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[12.5px] mb-3">
          {evt.payload.signal && (
            <>
              <dt className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] pt-0.5">
                Signal
              </dt>
              <dd className="text-[var(--color-text-secondary)] leading-relaxed">
                {evt.payload.signal}
              </dd>
            </>
          )}
          {evt.payload.action && (
            <>
              <dt className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] pt-0.5">
                Action
              </dt>
              <dd className="text-[var(--color-text-secondary)] leading-relaxed">
                {evt.payload.action}
              </dd>
            </>
          )}
          {evt.payload.outcome && (
            <>
              <dt className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] pt-0.5">
                Outcome
              </dt>
              <dd className="text-[var(--color-text-secondary)] leading-relaxed">
                {evt.payload.outcome}
              </dd>
            </>
          )}
        </dl>
      )}

      {/* Links + tags */}
      {(evt.payload.links?.length || evt.payload.tags?.length) && (
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-[var(--color-line)]">
          {evt.payload.links?.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[var(--color-primary-blue)] hover:underline"
            >
              {link.label} ↗
            </a>
          ))}
          {evt.payload.tags?.map((tag) => (
            <span
              key={tag}
              className="mono text-[10px] text-[var(--color-text-muted)] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function formatTs(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: now.getFullYear() === d.getFullYear() ? undefined : "numeric",
  });
}
