import type { Metadata } from "next";
import Link from "next/link";

import {
  APPROVALS_FIXTURE,
  EVENTS_FIXTURE,
  TENANTS_FIXTURE,
  formatRelativeTs,
  summaryStats,
} from "./data";

export const metadata: Metadata = {
  title: "CA Firm — Operator View · PolyCloud Portal",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-[#15803D]",
  PILOT: "bg-[var(--color-primary-blue)]",
  PILOT_PENDING: "bg-[var(--color-primary-orange)]",
};

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]",
  high: "text-[#B45309] bg-[#FFFBEB] border-[#FCD34D]",
  medium: "text-[#1A5FD4] bg-[#EFF6FF] border-[#93C5FD]",
  low: "text-[var(--color-text-muted)] bg-[var(--color-surface)] border-[var(--color-line)]",
};

export default function PortalCAFirmPage() {
  const stats = summaryStats();
  const sortedTenants = [...TENANTS_FIXTURE].sort((a, b) => {
    const order = { ACTIVE: 0, PILOT: 1, PILOT_PENDING: 2 } as Record<string, number>;
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });
  const recentEvents = [...EVENTS_FIXTURE].slice(0, 10);
  const criticalApprovals = APPROVALS_FIXTURE.filter(
    (a) => a.severity === "critical" || a.severity === "high",
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Top bar */}
      <header className="px-6 md:px-10 py-5 border-b border-[var(--color-line)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.15em] hover:text-[var(--color-ink)]">
            ← Portal
          </Link>
          <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.18em]">
            /portal/ca-firm
          </span>
        </div>
        <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.18em]">
          ops-only · noindex
        </span>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
            Operator surface · CA Firm Toolkit
          </p>
          <h1 className="text-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] max-w-3xl mb-3">
            CA firms,{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              one screen
            </span>
            .
          </h1>
          <p className="text-[15px] md:text-[17px] text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Every firm enrolled. Every recon, voucher, notice, approval crossing
            the toolkit. Today this reads from a fixture. Once `/api/v1/events`
            ships, it reads live — no UI change needed.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-2xl overflow-hidden bg-white mt-10">
            <Stat label="Firms enrolled" value={stats.enrolled.toString()} sub={`+ ${stats.pendingPilots} pilot pending`} />
            <Stat label="Recon runs (24h)" value={stats.recon24h.toString()} sub="across all firms" />
            <Stat label="Approvals pending" value={stats.approvalsPending.toString()} sub={`${stats.critical} critical`} />
            <Stat label="Toolkit version" value="v0.4" sub="37 tools · 353 tests" />
          </div>
        </div>
      </section>

      {/* Critical approvals — only render if any */}
      {criticalApprovals.length > 0 && (
        <section className="px-6 md:px-10 py-10 border-b border-[var(--color-line)] bg-[#FEF8F8]">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-baseline gap-3 mb-5">
              <p className="mono text-[10px] uppercase tracking-[0.22em] text-[#B91C1C]">
                Needs you · today
              </p>
              <span className="mono text-[10px] text-[var(--color-text-muted)]">
                {criticalApprovals.length} item
                {criticalApprovals.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-3">
              {criticalApprovals.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-[var(--color-line)] p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border ${SEVERITY_COLOR[a.severity]}`}
                      >
                        {a.severity}
                      </span>
                      <Link
                        href={`/portal/ca-firm/${a.tenant}`}
                        className="text-[13px] font-medium text-[var(--color-primary-blue)] link-underline"
                      >
                        {a.tenant}
                      </Link>
                    </div>
                    <span className="mono text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
                      {formatRelativeTs(a.ts)}
                    </span>
                  </div>
                  <p className="text-[15px] font-medium text-[var(--color-ink)] mb-1.5">
                    {a.title}
                  </p>
                  <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed">
                    {a.body}
                  </p>
                  {a.amount_inr !== undefined && a.amount_inr > 0 && (
                    <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.05em] mt-2">
                      ₹{a.amount_inr.toLocaleString("en-IN")} at stake
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tenants grid */}
      <section className="px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight">
              Firms enrolled
            </h2>
            <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.15em]">
              {sortedTenants.length} total
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {sortedTenants.map((t) => (
              <div
                key={t.slug}
                className="group bg-white rounded-2xl border border-[var(--color-line)] p-7 hover:border-[var(--color-ink)] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${STATUS_DOT[t.status]}`}
                    />
                    <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                  <span className="mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border border-[var(--color-line)] text-[var(--color-text-muted)]">
                    {t.bundle}
                  </span>
                </div>
                <h3 className="text-display text-[20px] md:text-[22px] leading-tight mb-2">
                  {t.name}
                </h3>
                <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.05em] mb-4">
                  {t.slug}
                  {t.tan ? ` · TAN ${t.tan}` : ""}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-[var(--color-line)]">
                  <MicroStat label="Partners" value={t.partner_count.toString()} />
                  <MicroStat label="Clients" value={t.client_count.toString()} />
                  <MicroStat
                    label="Retainer"
                    value={
                      t.retainer_monthly
                        ? `₹${(t.retainer_monthly / 1_000).toFixed(0)}K`
                        : "—"
                    }
                  />
                </div>

                <div className="flex items-center justify-between text-[12px] mb-3">
                  <span className="text-[var(--color-text-muted)]">
                    {t.last_event_ts
                      ? `Last event ${formatRelativeTs(t.last_event_ts)}`
                      : "No events yet"}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-line)]">
                  <Link
                    href={`/portal/ca-firm/${t.slug}`}
                    className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    Operator view →
                  </Link>
                  <span className="text-[var(--color-line)]">·</span>
                  <Link
                    href="/ca-firm/app/inbox"
                    className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-primary-blue)] hover:opacity-70 transition-opacity"
                  >
                    Open firm dashboard →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent activity feed (cross-firm) */}
      <section className="px-6 md:px-10 py-12 md:py-16 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-2">
                Activity feed
              </p>
              <h2 className="text-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight">
                Across every firm.
              </h2>
            </div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.15em]">
              showing last {recentEvents.length} · oldest 4 days
            </p>
          </div>

          <div className="space-y-3">
            {recentEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>

          <p className="mt-8 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.05em]">
            Source: fixture today. Will switch to{" "}
            <code className="font-mono text-[var(--color-text)]">
              GET /api/v1/events?since=
            </code>{" "}
            when that endpoint ships (build order item #4 in INTEGRATION.md).
          </p>
        </div>
      </section>

      {/* Tools quick-launcher */}
      <section className="px-6 md:px-10 py-12 md:py-16 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-3">
            37 tools · today CLI-only
          </p>
          <h2 className="text-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight mb-3">
            The toolkit.
          </h2>
          <p className="text-[14px] text-[var(--color-text-secondary)] max-w-2xl mb-8">
            Each tool is a CLI subcommand today (
            <code className="font-mono text-[var(--color-text)]">ca-firm &lt;name&gt;</code>
            ). Web launcher with `--demo` output preview is build-order item #
            in the portal sprint.
          </p>

          <div className="flex items-center gap-3 mb-8">
            <Link
              href="https://github.com/polycloudin/ca-firm-toolkit#the-stack"
              target="_blank"
              rel="noreferrer"
              className="mono text-[11px] text-[var(--color-primary-blue)] tracking-[0.05em] link-underline"
            >
              See full stack on GitHub →
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.15em]">
              · README has tool-by-tool spec
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {TOOL_TILES.map((t) => (
              <div
                key={t.cmd}
                className="bg-white border border-[var(--color-line)] rounded-lg p-4 hover:border-[var(--color-ink)] transition-colors"
              >
                <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.05em] mb-1">
                  ca-firm
                </p>
                <p className="mono text-[13px] font-medium text-[var(--color-ink)] mb-2">
                  {t.cmd}
                </p>
                <p className="text-[11.5px] text-[var(--color-text-secondary)] leading-snug">
                  {t.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer — what's next */}
      <section className="px-6 md:px-10 py-12 md:py-16 border-t border-[var(--color-line)] bg-[var(--color-ink)] text-white">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-white/50 mb-4">
            Wired to fixture today · live when these endpoints ship
          </p>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-6">
            <Endpoint
              path="GET /api/v1/events"
              status="planned · #4"
              note="Activity feed will switch to live in 1.5d of work."
            />
            <Endpoint
              path="POST /api/v1/notifications"
              status="planned · #5"
              note="Approval queue will surface here. /portal/inbox folds in."
            />
            <Endpoint
              path="POST /api/v1/keys"
              status="planned · #1"
              note="Per-tenant pck_live_* tokens. Unblocks all writes from toolkit."
            />
          </div>
          <p className="mt-8 text-[12px] text-white/50">
            Spec:{" "}
            <Link
              href="https://github.com/polycloudin/polycloudsolutions/blob/main/INTEGRATION.md"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 link-underline"
            >
              INTEGRATION.md v0.2
            </Link>
            . Build order in section 6.
          </p>
        </div>
      </section>
    </div>
  );
}

// ---- Subcomponents -----------------------------------------------------

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white p-5 md:p-7">
      <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-3">
        {label}
      </p>
      <p className="text-display text-[clamp(1.75rem,4vw,2.5rem)] leading-none text-[var(--color-ink)]">
        {value}
      </p>
      <p className="text-[12px] text-[var(--color-text-secondary)] mt-2">
        {sub}
      </p>
    </div>
  );
}

function MicroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1">
        {label}
      </p>
      <p className="text-[13px] font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function EventCard({ event: e }: { event: typeof EVENTS_FIXTURE[number] }) {
  const kindBadge: Record<string, string> = {
    "recon-run": "bg-[#EFF6FF] text-[#1A5FD4]",
    "vendor-followup": "bg-[#F0FDF4] text-[#15803D]",
    "ocr-result": "bg-[#FEF3C7] text-[#92400E]",
    "form-3cd": "bg-[#FEE2E2] text-[#B91C1C]",
    "tds-return": "bg-[#FEE2E2] text-[#B91C1C]",
    "udin-issued": "bg-[#F3E8FF] text-[#7C3AED]",
    "notice-drafted": "bg-[#FEE2E2] text-[#B91C1C]",
    "client-mis": "bg-[#EFF6FF] text-[#1A5FD4]",
    "review-approved": "bg-[#F0FDF4] text-[#15803D]",
    "review-pending": "bg-[#FEF3C7] text-[#92400E]",
    alert: "bg-[#FEE2E2] text-[#B91C1C]",
  };

  return (
    <div className="bg-white border border-[var(--color-line)] rounded-xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${kindBadge[e.kind] ?? "bg-[var(--color-surface)] text-[var(--color-text-muted)]"}`}
          >
            {e.kind}
          </span>
          <Link
            href={`/portal/ca-firm/${e.tenant}`}
            className="text-[12.5px] font-medium text-[var(--color-primary-blue)] link-underline"
          >
            {e.tenant}
          </Link>
          {e.tags?.includes("self") && (
            <span className="mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-[var(--color-primary-orange)] text-white">
              own LLP
            </span>
          )}
        </div>
        <span className="mono text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
          {formatRelativeTs(e.ts)}
        </span>
      </div>
      <p className="text-[14.5px] font-medium text-[var(--color-ink)] mb-3 leading-snug">
        {e.summary}
      </p>
      {(e.signal || e.action || e.outcome) && (
        <div className="grid md:grid-cols-3 gap-3 md:gap-4 text-[12.5px] leading-snug">
          {e.signal && (
            <NarrativeCol label="Signal" body={e.signal} />
          )}
          {e.action && (
            <NarrativeCol label="Action" body={e.action} />
          )}
          {e.outcome && (
            <NarrativeCol label="Outcome" body={e.outcome} />
          )}
        </div>
      )}
    </div>
  );
}

function NarrativeCol({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5">
        {label}
      </p>
      <p className="text-[var(--color-text)]">{body}</p>
    </div>
  );
}

function Endpoint({
  path,
  status,
  note,
}: {
  path: string;
  status: string;
  note: string;
}) {
  return (
    <div>
      <p className="mono text-[12px] text-white mb-1">{path}</p>
      <p className="mono text-[10px] tracking-[0.05em] text-[var(--color-primary-orange)] mb-2">
        {status}
      </p>
      <p className="text-[12px] text-white/70 leading-relaxed">{note}</p>
    </div>
  );
}

// 16 representative tools (out of 37) for the launcher tile grid.
const TOOL_TILES: { cmd: string; label: string }[] = [
  { cmd: "recon", label: "GSTR-2B ↔ Tally reconciliation" },
  { cmd: "followup", label: "WhatsApp vendor follow-up" },
  { cmd: "ocr", label: "Invoice photo → Tally voucher draft" },
  { cmd: "dashboard", label: "ITC risk dashboard (local)" },
  { cmd: "bank-voucher", label: "Bank statement → Tally Prime XML" },
  { cmd: "tds", label: "26Q + NSDL FVU + s.201(1A)" },
  { cmd: "compliance-calendar", label: "Per-client deadline machine" },
  { cmd: "tax-audit", label: "Form 3CD auto-doc (6 + 38 clauses)" },
  { cmd: "client-mis", label: "White-labeled monthly MIS" },
  { cmd: "udin", label: "ICAI UDIN ledger + generator" },
  { cmd: "payroll", label: "Form 16 + 24Q FVU + PF/ESI/PT" },
  { cmd: "notice", label: "12 IT/GST notice templates + cites" },
  { cmd: "statutory-audit", label: "CARO 2020 + Schedule III" },
  { cmd: "fema", label: "FC-GPR/FC-TRS/APR/ECB-2" },
  { cmd: "review-queue", label: "Partner review queue" },
  { cmd: "cpe", label: "ICAI CPE + articleship tracking" },
];
