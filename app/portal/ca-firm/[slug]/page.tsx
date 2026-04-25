import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  approvalsForTenant,
  eventsForTenant,
  formatRelativeTs,
  TENANTS_FIXTURE,
  tenantBySlug,
} from "../data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenant = tenantBySlug(slug);
  return {
    title: tenant
      ? `${tenant.name} · CA Firm Operator View`
      : "Firm not found · PolyCloud Portal",
    robots: { index: false, follow: false, nocache: true },
  };
}

export async function generateStaticParams() {
  return TENANTS_FIXTURE.map((t) => ({ slug: t.slug }));
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]",
  high: "text-[#B45309] bg-[#FFFBEB] border-[#FCD34D]",
  medium: "text-[#1A5FD4] bg-[#EFF6FF] border-[#93C5FD]",
  low: "text-[var(--color-text-muted)] bg-[var(--color-surface)] border-[var(--color-line)]",
};

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-[#15803D]",
  PILOT: "bg-[var(--color-primary-blue)]",
  PILOT_PENDING: "bg-[var(--color-primary-orange)]",
};

const KEY_STATUS_PILL: Record<string, string> = {
  ACTIVE: "bg-[#F0FDF4] text-[#15803D]",
  PENDING: "bg-[#FEF3C7] text-[#92400E]",
  REVOKED: "bg-[#FEF2F2] text-[#B91C1C]",
};

export default async function PortalCAFirmTenantPage({ params }: Props) {
  const { slug } = await params;
  const tenant = tenantBySlug(slug);
  if (!tenant) notFound();

  const events = eventsForTenant(slug, 50);
  const approvals = approvalsForTenant(slug);

  // Compute per-firm summary
  const oneDayAgo = Date.now() - 24 * 3600 * 1000;
  const events24h = events.filter(
    (e) => new Date(e.ts).getTime() > oneDayAgo,
  );
  const reconCount = events.filter((e) => e.kind === "recon-run").length;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Top bar */}
      <header className="px-6 md:px-10 py-5 border-b border-[var(--color-line)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/portal/ca-firm"
            className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.15em] hover:text-[var(--color-ink)]"
          >
            ← All firms
          </Link>
          <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.18em]">
            /portal/ca-firm/{tenant.slug}
          </span>
        </div>
        <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.18em]">
          ops-only · noindex
        </span>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-[var(--color-line)]">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[tenant.status]}`} />
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              {tenant.status.replace("_", " ")}
            </span>
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border border-[var(--color-line)] text-[var(--color-text-muted)]">
              {tenant.bundle}
            </span>
          </div>

          <h1 className="text-display text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.05] mb-3">
            {tenant.name}
          </h1>
          <p className="mono text-[12px] text-[var(--color-text-muted)] tracking-[0.05em] mb-8">
            {tenant.slug}
            {tenant.tan ? ` · TAN ${tenant.tan}` : ""}
            {tenant.gstin ? ` · GSTIN ${tenant.gstin}` : ""}
            {` · enrolled ${tenant.enrolled_at}`}
          </p>

          {tenant.notes && (
            <p className="text-[14.5px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed mb-10 italic">
              {tenant.notes}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-2xl overflow-hidden bg-white">
            <Stat
              label="Retainer"
              value={
                tenant.retainer_monthly
                  ? `₹${(tenant.retainer_monthly / 1_000).toFixed(0)}K`
                  : "—"
              }
              sub={tenant.retainer_monthly ? "per month" : "internal · dogfood"}
            />
            <Stat
              label="Partners / clients"
              value={`${tenant.partner_count} / ${tenant.client_count}`}
              sub={
                tenant.client_count
                  ? `${(tenant.client_count / Math.max(1, tenant.partner_count)).toFixed(1)} per partner`
                  : "no clients yet"
              }
            />
            <Stat
              label="Events (24h)"
              value={events24h.length.toString()}
              sub={`${reconCount} recon · ${approvals.length} pending`}
            />
            <Stat
              label="Toolkit"
              value={tenant.toolkit_version}
              sub={
                tenant.last_event_ts
                  ? `last ${formatRelativeTs(tenant.last_event_ts)}`
                  : "never"
              }
            />
          </div>
        </div>
      </section>

      {/* API key status bar */}
      <section className="px-6 md:px-10 py-6 border-b border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              API key
            </span>
            <span
              className={`mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${KEY_STATUS_PILL[tenant.api_key_status]}`}
            >
              {tenant.api_key_status}
            </span>
            <span className="text-[12px] text-[var(--color-text-secondary)]">
              {tenant.api_key_status === "PENDING"
                ? "Issuing endpoint not built yet (build-order item #1). Toolkit currently runs local-only."
                : tenant.api_key_status === "ACTIVE"
                  ? "Toolkit can push events. Token: pck_live_***"
                  : "Token revoked. Re-issue from /portal/keys when up."}
            </span>
          </div>
          <Link
            href="https://github.com/polycloudin/polycloudsolutions/blob/main/INTEGRATION.md#2b-external-apps-planned--needs-a-sprint"
            target="_blank"
            rel="noreferrer"
            className="mono text-[11px] text-[var(--color-primary-blue)] tracking-[0.05em] link-underline"
          >
            Spec →
          </Link>
        </div>
      </section>

      {/* Approval queue */}
      {approvals.length > 0 && (
        <section className="px-6 md:px-10 py-12 md:py-14 border-b border-[var(--color-line)]">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-eyebrow text-[var(--color-text-secondary)] mb-2">
                  Approval queue
                </p>
                <h2 className="text-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight">
                  {approvals.length} item
                  {approvals.length !== 1 ? "s" : ""} awaiting partner.
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {approvals.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-[var(--color-line)] p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border ${SEVERITY_COLOR[a.severity]}`}
                      >
                        {a.severity}
                      </span>
                      <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.05em]">
                        {a.id}
                      </span>
                    </div>
                    <span className="mono text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
                      {formatRelativeTs(a.ts)}
                    </span>
                  </div>
                  <p className="text-[15px] font-medium text-[var(--color-ink)] mb-2">
                    {a.title}
                  </p>
                  <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed">
                    {a.body}
                  </p>
                  {a.amount_inr !== undefined && a.amount_inr > 0 && (
                    <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.05em] mt-3">
                      ₹{a.amount_inr.toLocaleString("en-IN")} at stake
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Activity feed for this tenant */}
      <section className="px-6 md:px-10 py-12 md:py-16 bg-[var(--color-surface-warm)]">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-2">
                Activity feed
              </p>
              <h2 className="text-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight">
                Recent toolkit events.
              </h2>
            </div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.15em]">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
          </div>

          {events.length === 0 ? (
            <div className="bg-white border border-dashed border-[var(--color-line)] rounded-xl p-10 text-center">
              <p className="text-[14px] text-[var(--color-text-muted)] mb-2">
                No events yet.
              </p>
              <p className="text-[12px] text-[var(--color-text-muted)]">
                {tenant.status === "PILOT_PENDING"
                  ? "Toolkit hasn't been installed on this firm's laptop yet."
                  : "Toolkit installed but events flow only when /api/v1/events ships."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="bg-white border border-[var(--color-line)] rounded-xl p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-line)]">
                        {e.kind}
                      </span>
                      <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.05em]">
                        {e.actor}
                      </span>
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
              ))}
            </div>
          )}

          <p className="mt-8 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.05em]">
            Source: fixture · will read from{" "}
            <code className="font-mono text-[var(--color-text)]">
              GET /api/v1/events?tenant={tenant.slug}
            </code>{" "}
            once that endpoint ships.
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
      <p className="text-display text-[clamp(1.5rem,3vw,2rem)] leading-none text-[var(--color-ink)]">
        {value}
      </p>
      <p className="text-[12px] text-[var(--color-text-secondary)] mt-2">
        {sub}
      </p>
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
