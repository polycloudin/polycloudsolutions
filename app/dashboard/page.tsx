import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  operatorOverview,
  formatRupees,
  formatCompactRupees,
} from "../client/data/aggregates";

export const metadata: Metadata = {
  title: "Operator · PolyCloud Digital",
  description: "Every tenant, every urgent item, every rupee — on one screen.",
  robots: { index: false, follow: false },
};

export default function OperatorDashboard() {
  // Server-rendered. Auth is enforced by proxy.ts — by the time we reach here,
  // the request has valid Basic auth.
  const overview = operatorOverview();
  if (!overview.tenants.length) notFound();

  const last4 = overview.combinedActivity.slice(0, 4);
  const feed = overview.combinedActivity;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-medium tracking-tight">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Operator · All tenants
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="mono text-[11px] text-[var(--color-text-secondary)] hidden md:inline">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <Link
              href="/digital"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Site
            </Link>
          </div>
        </div>
      </header>

      {/* Hero KPI strip */}
      <section className="px-5 md:px-8 py-8 md:py-10 max-w-[1440px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
          Week at a glance
        </p>
        <h1 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] mb-8 md:mb-10 max-w-3xl">
          {overview.payingClients} paying · {overview.totalClients} active · {formatCompactRupees(overview.mrrRupees)} MRR
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-[var(--color-line)] rounded-xl bg-white overflow-hidden">
          <KpiCell
            label="Tenants"
            value={String(overview.totalClients)}
            delta={`${overview.payingClients} paying · ${overview.totalClients - overview.payingClients} internal`}
          />
          <KpiCell
            label="MRR"
            value={formatCompactRupees(overview.mrrRupees)}
            delta={formatRupees(overview.mrrRupees)}
            tone="success"
          />
          <KpiCell
            label="Leads · 7d"
            value={overview.totalLeads7d.toLocaleString("en-IN")}
            delta="Across all tenants"
          />
          <KpiCell
            label="Needs attention"
            value={String(overview.totalNeedsAttention)}
            delta={`${overview.totalUrgent} urgent`}
            tone={overview.totalUrgent > 0 ? "risk" : "warn"}
          />
          <KpiCell
            label="This Monday"
            value={approveQueueCount(overview)}
            delta="Items in your queue"
          />
        </div>
      </section>

      {/* Tenant grid */}
      <section className="px-5 md:px-8 pb-10 md:pb-14 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-5 md:mb-6 flex-wrap gap-4">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
              Every tenant
            </p>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight">
              Sorted by MRR · click to open the client view
            </h2>
          </div>
          <p className="mono text-[10.5px] text-[var(--color-text-muted)] uppercase tracking-wider">
            Add a tenant → `app/client/data/&lt;slug&gt;.ts`
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-xl border border-[var(--color-line)] bg-white overflow-hidden">
          <div className="grid grid-cols-[2fr_0.9fr_0.9fr_0.9fr_0.9fr_0.9fr_1fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
            <HeadCell>Tenant</HeadCell>
            <HeadCell>Bundle</HeadCell>
            <HeadCell right>Retainer</HeadCell>
            <HeadCell right>Leads · 7d</HeadCell>
            <HeadCell right>CPL</HeadCell>
            <HeadCell right>ROAS</HeadCell>
            <HeadCell right>Needs you</HeadCell>
          </div>
          {overview.tenants.map((t, i) => (
            <Link
              key={t.slug}
              href={`/client/${t.slug}`}
              className={`grid grid-cols-[2fr_0.9fr_0.9fr_0.9fr_0.9fr_0.9fr_1fr] items-center hover:bg-[var(--color-surface)] transition-colors ${
                i < overview.tenants.length - 1
                  ? "border-b border-[var(--color-line)]"
                  : ""
              }`}
            >
              <Cell>
                <div className="flex items-start gap-3 flex-col md:flex-row md:items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          t.auth === "public"
                            ? "#15803D"
                            : t.retainerMonthly > 0
                            ? "#1A5FD4"
                            : "#A1A1AA",
                      }}
                    />
                    <p className="text-[14px] font-medium tracking-tight">
                      {t.name}
                    </p>
                  </div>
                  <span className="mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    {t.auth === "public" ? "Public" : "Private"}
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--color-text-secondary)] mt-0.5">
                  {t.location}
                </p>
              </Cell>
              <Cell>
                <span className="mono text-[11px] px-2 py-1 rounded bg-[var(--color-surface-warm)] text-[var(--color-text-secondary)] capitalize">
                  {t.bundle.replace("-", " ")}
                </span>
              </Cell>
              <Cell right>
                <p className="text-[13px] font-medium">
                  {t.retainerMonthly > 0 ? formatCompactRupees(t.retainerMonthly) : "—"}
                </p>
                <p className="mono text-[10px] text-[var(--color-text-muted)]">
                  {t.retainerMonthly > 0 ? "/ mo" : "internal"}
                </p>
              </Cell>
              <Cell right>
                <p className="text-[13px] font-medium">
                  {t.leads7d !== null ? t.leads7d.toLocaleString("en-IN") : "—"}
                </p>
              </Cell>
              <Cell right>
                <p className="mono text-[12px]">{t.cpl ?? "—"}</p>
              </Cell>
              <Cell right>
                <p className="mono text-[12px]">{t.roas ?? "—"}</p>
              </Cell>
              <Cell right>
                <div className="inline-flex items-center gap-2">
                  <span
                    className="mono text-[11px] font-medium px-2 py-1 rounded"
                    style={{
                      color:
                        t.urgentCount > 0
                          ? "#DC2626"
                          : t.needsAttention > 0
                          ? "#B45309"
                          : "var(--color-text-muted)",
                      backgroundColor:
                        t.urgentCount > 0
                          ? "#FEF2F2"
                          : t.needsAttention > 0
                          ? "#FFFBEB"
                          : "var(--color-surface-warm)",
                    }}
                  >
                    {t.needsAttention}
                  </span>
                  <span className="text-[var(--color-primary-blue)] text-[14px]">
                    →
                  </span>
                </div>
              </Cell>
            </Link>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {overview.tenants.map((t) => (
            <Link
              key={t.slug}
              href={`/client/${t.slug}`}
              className="block rounded-xl border border-[var(--color-line)] bg-white p-4 hover:border-[var(--color-ink)]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          t.auth === "public"
                            ? "#15803D"
                            : t.retainerMonthly > 0
                            ? "#1A5FD4"
                            : "#A1A1AA",
                      }}
                    />
                    <p className="text-[14px] font-medium tracking-tight">
                      {t.name}
                    </p>
                  </div>
                  <p className="text-[11.5px] text-[var(--color-text-secondary)]">
                    {t.location} · {t.bundle.replace("-", " ")}
                  </p>
                </div>
                <p className="mono text-[12px] font-medium text-right">
                  {t.retainerMonthly > 0 ? formatCompactRupees(t.retainerMonthly) + "/mo" : "—"}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 text-left">
                <MiniStat label="Leads 7d" value={t.leads7d !== null ? String(t.leads7d) : "—"} />
                <MiniStat label="CPL" value={t.cpl ?? "—"} />
                <MiniStat label="ROAS" value={t.roas ?? "—"} />
                <MiniStat
                  label="Needs you"
                  value={String(t.needsAttention)}
                  tone={
                    t.urgentCount > 0
                      ? "risk"
                      : t.needsAttention > 0
                      ? "warn"
                      : "neutral"
                  }
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Two-column: urgent queue + activity feed */}
      <section className="px-5 md:px-8 pb-12 md:pb-16 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-5 md:gap-6">
          {/* Urgent queue */}
          <div className="rounded-xl border border-[var(--color-line)] bg-white p-5 md:p-6">
            <div className="flex items-baseline justify-between mb-4">
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
                Urgent queue
              </p>
              <span className="mono text-[10.5px] text-[var(--color-text-secondary)]">
                {overview.totalUrgent} urgent · {overview.totalNeedsAttention} total
              </span>
            </div>
            {feed.filter((e) => e.kind === "urgent" || e.kind === "needs").length === 0 ? (
              <p className="text-[13px] text-[var(--color-text-muted)] italic py-6 text-center">
                Nothing urgent. You can sleep.
              </p>
            ) : (
              <div className="divide-y divide-[var(--color-line)]">
                {feed
                  .filter((e) => e.kind === "urgent" || e.kind === "needs")
                  .slice(0, 6)
                  .map((e, i) => (
                    <div key={i} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="mono text-[9.5px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
                          style={{
                            color: e.kind === "urgent" ? "#DC2626" : "#B45309",
                            backgroundColor:
                              e.kind === "urgent" ? "#FEF2F2" : "#FFFBEB",
                          }}
                        >
                          {e.kind}
                        </span>
                        <Link
                          href={`/client/${e.tenantSlug}`}
                          className="mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-primary-blue)]"
                        >
                          {e.tenantName}
                        </Link>
                      </div>
                      <p className="text-[13px] leading-snug text-[var(--color-ink)]">
                        {e.text}
                      </p>
                      <p className="mono text-[10.5px] text-[var(--color-text-muted)] mt-1">
                        {e.time}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Unified activity feed */}
          <div className="rounded-xl border border-[var(--color-line)] bg-white p-5 md:p-6">
            <div className="flex items-baseline justify-between mb-4">
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
                Autopilot · all tenants
              </p>
              <span className="mono text-[10.5px] text-[var(--color-text-secondary)]">
                {feed.length} events
              </span>
            </div>
            <div className="divide-y divide-[var(--color-line)]">
              {feed.slice(0, 10).map((e, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                    style={{
                      backgroundColor:
                        e.kind === "urgent"
                          ? "#DC2626"
                          : e.kind === "needs"
                          ? "#B45309"
                          : e.kind === "ship"
                          ? "#15803D"
                          : e.kind === "build"
                          ? "#1A5FD4"
                          : "#A1A1AA",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <Link
                        href={`/client/${e.tenantSlug}`}
                        className="mono text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-primary-blue)]"
                      >
                        {e.tenantName}
                      </Link>
                      <span className="mono text-[10px] text-[var(--color-text-muted)]">·</span>
                      <span className="mono text-[10px] text-[var(--color-text-muted)]">
                        {e.time}
                      </span>
                    </div>
                    <p className="text-[12.5px] leading-snug text-[var(--color-ink)]">
                      {e.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 mono text-[10px] text-[var(--color-text-muted)] tracking-[0.14em] text-center uppercase">
          This is the operator view. To onboard a tenant: copy <code className="font-mono">app/client/data/_template.ts</code>, fill it in, register it, ship.
        </p>
      </section>
    </div>
  );
}

// ------------------------------------------------------------------
// Small presentational helpers (server components, no client needed)
// ------------------------------------------------------------------

function KpiCell({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "success" | "warn" | "risk";
}) {
  const color =
    tone === "success"
      ? "#15803D"
      : tone === "warn"
      ? "#B45309"
      : tone === "risk"
      ? "#DC2626"
      : "var(--color-ink)";
  return (
    <div className="p-4 md:p-5 border-[var(--color-line)] md:border-r last:border-r-0 odd:border-r first:md:!border-r even:border-b md:even:border-b-0">
      <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
        {label}
      </p>
      <p className="text-display text-xl md:text-2xl mb-1" style={{ color }}>
        {value}
      </p>
      {delta && (
        <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug">
          {delta}
        </p>
      )}
    </div>
  );
}

function HeadCell({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <div
      className={`px-4 md:px-5 py-3 mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] ${
        right ? "text-right" : ""
      }`}
    >
      {children}
    </div>
  );
}

function Cell({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <div className={`px-4 md:px-5 py-3.5 ${right ? "text-right" : ""}`}>
      {children}
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "risk" | "warn" | "neutral";
}) {
  const color =
    tone === "risk"
      ? "#DC2626"
      : tone === "warn"
      ? "#B45309"
      : "var(--color-ink)";
  return (
    <div>
      <p className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-text-muted)] mb-0.5">
        {label}
      </p>
      <p className="mono text-[12px] font-medium" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// Count of items across all tenants that explicitly call for owner action this week.
function approveQueueCount(overview: ReturnType<typeof operatorOverview>): string {
  const n = overview.combinedActivity.filter(
    (e) => e.kind === "needs" || e.kind === "urgent"
  ).length;
  return String(n);
}
