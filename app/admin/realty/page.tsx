import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { readSession, SESSION_COOKIE } from "@/app/lib/auth";
import { listBuilders, listCohort } from "@/app/lib/realty";
import { topModulesPerTenant } from "@/app/lib/usage";
import SignOutButton from "@/app/dashboard/SignOutButton";

/**
 * /admin/realty — operator-only dashboard for the Realty cohort feed.
 *
 * Spec: INTEGRATION.md §4c.
 *
 * Privacy posture:
 *   - Cohort table shows aggregates only (n_contributors >= 5 enforced
 *     at insert time by the DB CHECK constraint).
 *   - Per-builder usage table is anonymized to the opaque tenant id
 *     the local agent already mints — never the builder name from the
 *     `realty_builders` row, never any contributor identity.
 *   - "We cannot show you a single builder's data even if subpoenaed"
 *     stays true because we literally don't have the data to show.
 *
 * Auth: cookie session with `ops === true`. proxy.ts doesn't gate
 * /admin/* yet — re-checked here. If you wire /admin/* into proxy.ts
 * later, this check is harmless redundancy.
 */

export const metadata: Metadata = {
  title: "Realty cohort · operator",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

function fmtTs(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

function fmtNumber(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 100000) return n.toLocaleString("en-IN");
  return String(n);
}

function maskTenant(t: string): string {
  // Tenant is already an anonymized hash from the local agent. We
  // mask further on display so a screenshot can't even reveal the
  // hash — only first 6 chars + ellipsis.
  if (t.length <= 8) return t;
  return `${t.slice(0, 6)}…`;
}

export default async function AdminRealtyPage() {
  // ----- Auth -----
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value ?? null;
  const claims = await readSession(token);
  if (!claims || !claims.ops) {
    notFound();
  }

  // ----- Data -----
  const [builders, cohort, perTenant] = await Promise.all([
    listBuilders(),
    listCohort({ limit: 100 }),
    topModulesPerTenant({ limit: 50 }),
  ]);

  const setupTokens = (process.env.REALTY_SETUP_TOKENS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  const totalPushes = cohort.length;
  const distinctModules = new Set(cohort.map((c) => c.module)).size;
  const distinctWindows = new Set(cohort.map((c) => c.ts_window)).size;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-medium tracking-tight">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Admin · Realty cohort
            </span>
          </div>
          <div className="flex items-center gap-3">
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

      {/* Hero */}
      <section className="px-5 md:px-8 py-8 md:py-10 max-w-[1280px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
          Cohort feed · ≥5 contributors gate · per-builder telemetry
        </p>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-medium tracking-tight leading-[1.05] mb-4 max-w-3xl">
          Realty admin · what the cohort sees, what the operator sees.
        </h1>
        <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
          Builders push anonymized cohort metrics from their local agents.
          Every row below cleared the ≥5-contributors gate (DB CHECK constraint).
          Per-builder usage is shown as opaque tenant ids only — we cannot
          map them back to a builder name even from this page.
        </p>

        {/* KPI strip */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-0 border border-[var(--color-line)] rounded-xl bg-white overflow-hidden">
          <KpiCell label="Builders" value={String(builders.length)} hint="provisioned" />
          <KpiCell label="Cohort rows" value={String(totalPushes)} hint="last 100 shown" />
          <KpiCell label="Modules" value={String(distinctModules)} hint="with data" />
          <KpiCell label="Time windows" value={String(distinctWindows)} hint="distinct" />
        </div>
      </section>

      <main className="px-5 md:px-8 max-w-[1280px] mx-auto pb-16 space-y-12 md:space-y-14">
        {/* ----- Builders ----- */}
        <section>
          <div className="mb-4 md:mb-5 flex items-end justify-between flex-wrap gap-3">
            <div>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
                01
              </p>
              <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                Builders &amp; last push
              </h2>
            </div>
            <p className="mono text-[10.5px] text-[var(--color-text-muted)] uppercase tracking-wider">
              POST /api/realty/builders to provision · setup tokens in{" "}
              <code className="font-mono normal-case">REALTY_SETUP_TOKENS</code>
            </p>
          </div>

          {builders.length === 0 ? (
            <EmptyState
              title="0 builders provisioned yet"
              hint={
                setupTokens === 0
                  ? "Generate setup tokens in REALTY_SETUP_TOKENS env (comma-separated, single-use)"
                  : `${setupTokens} setup token${setupTokens === 1 ? "" : "s"} ready in env. Aasrith's onboarding flow can call POST /api/realty/builders.`
              }
            />
          ) : (
            <div className="rounded-xl border border-[var(--color-line)] bg-white overflow-hidden">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
                <HeadCell>Builder</HeadCell>
                <HeadCell>Region</HeadCell>
                <HeadCell>Signed up</HeadCell>
                <HeadCell>Last push</HeadCell>
                <HeadCell right>Status</HeadCell>
              </div>
              {builders.map((b, i) => (
                <div
                  key={b.slug}
                  className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr] items-center ${
                    i < builders.length - 1
                      ? "border-b border-[var(--color-line)]"
                      : ""
                  }`}
                >
                  <Cell>
                    <p className="text-[14px] font-medium tracking-tight">{b.name}</p>
                    <p className="mono text-[10.5px] text-[var(--color-text-muted)] mt-0.5">
                      {b.slug}
                    </p>
                  </Cell>
                  <Cell>
                    <span className="text-[13px] text-[var(--color-text-secondary)]">
                      {b.region}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="mono text-[11.5px] text-[var(--color-text-secondary)]">
                      {fmtTs(b.signed_up_at)}
                    </span>
                  </Cell>
                  <Cell>
                    <span
                      className={`mono text-[11.5px] ${
                        b.last_push_at
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {fmtTs(b.last_push_at)}
                    </span>
                  </Cell>
                  <Cell right>
                    <StatusPill status={b.status} />
                  </Cell>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ----- Cohort metrics ----- */}
        <section>
          <div className="mb-4 md:mb-5">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              02
            </p>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
              Cohort metrics · last 100
            </h2>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
              Every row below has{" "}
              <code className="font-mono text-[12px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">
                n_contributors ≥ 5
              </code>{" "}
              (enforced by DB CHECK constraint on{" "}
              <code className="font-mono text-[12px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">
                realty_cohort
              </code>
              ). No way to recover individual builder values from these aggregates.
            </p>
          </div>

          {cohort.length === 0 ? (
            <EmptyState
              title="No cohort metrics yet"
              hint="Builders push via POST /api/realty/cohort/push once their local agent has 5+ contributors in a window."
            />
          ) : (
            <div className="rounded-xl border border-[var(--color-line)] bg-white overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_0.9fr_0.7fr_0.9fr_1fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
                <HeadCell>Module</HeadCell>
                <HeadCell>Metric key</HeadCell>
                <HeadCell right>Cohort value</HeadCell>
                <HeadCell right>n</HeadCell>
                <HeadCell>Window</HeadCell>
                <HeadCell>Received</HeadCell>
              </div>
              {cohort.map((c, i) => (
                <div
                  key={c.id}
                  className={`grid grid-cols-[1fr_2fr_0.9fr_0.7fr_0.9fr_1fr] items-center ${
                    i < cohort.length - 1
                      ? "border-b border-[var(--color-line)]"
                      : ""
                  }`}
                >
                  <Cell>
                    <span className="mono text-[11.5px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                      {c.module}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="font-mono text-[12px] text-[var(--color-ink)] leading-snug break-all">
                      {c.metric_key}
                    </span>
                  </Cell>
                  <Cell right>
                    <span className="text-[13.5px] font-medium tabular-nums">
                      {fmtNumber(c.cohort_value)}
                    </span>
                  </Cell>
                  <Cell right>
                    <span
                      className={`mono text-[12px] tabular-nums ${
                        c.n_contributors >= 5
                          ? "text-[var(--color-text-secondary)]"
                          : "text-red-600"
                      }`}
                    >
                      {c.n_contributors}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="mono text-[11.5px] text-[var(--color-text-secondary)]">
                      {c.ts_window}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="mono text-[11.5px] text-[var(--color-text-muted)]">
                      {fmtTs(c.received_at)}
                    </span>
                  </Cell>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ----- Per-tenant usage (anonymized) ----- */}
        <section>
          <div className="mb-4 md:mb-5">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              03
            </p>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
              Engagement · top modules per tenant
            </h2>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
              Tenant id is the opaque hash the local agent mints — not a
              builder name, not a slug. The operator sees that{" "}
              <em>some</em> builder is heavy on land-intel without knowing
              which one. This is the &quot;cannot show even if subpoenaed&quot;
              promise made operational.
            </p>
          </div>

          {perTenant.length === 0 ? (
            <EmptyState
              title="No usage events yet"
              hint="Local agents push via POST /api/usage with the X-PolyCloud-Key header (usage:write scope)."
            />
          ) : (
            <div className="rounded-xl border border-[var(--color-line)] bg-white overflow-hidden">
              <div className="grid grid-cols-[1fr_1.2fr_1fr_0.7fr_1fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
                <HeadCell>Tenant (opaque)</HeadCell>
                <HeadCell>Module</HeadCell>
                <HeadCell>Event</HeadCell>
                <HeadCell right>Count</HeadCell>
                <HeadCell>Last seen</HeadCell>
              </div>
              {perTenant.map((row, i) => (
                <div
                  key={`${row.tenant}-${row.module}-${row.event}-${i}`}
                  className={`grid grid-cols-[1fr_1.2fr_1fr_0.7fr_1fr] items-center ${
                    i < perTenant.length - 1
                      ? "border-b border-[var(--color-line)]"
                      : ""
                  }`}
                >
                  <Cell>
                    <span className="font-mono text-[12px] text-[var(--color-text-secondary)]">
                      {maskTenant(row.tenant)}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="mono text-[11.5px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                      {row.module}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="text-[13px] text-[var(--color-ink)]">
                      {row.event}
                    </span>
                  </Cell>
                  <Cell right>
                    <span className="text-[13px] font-medium tabular-nums">
                      {row.count.toLocaleString("en-IN")}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="mono text-[11.5px] text-[var(--color-text-muted)]">
                      {fmtTs(row.last_ts)}
                    </span>
                  </Cell>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tiny presentational helpers (kept inline — page-specific, not exported)
// ---------------------------------------------------------------------------

function KpiCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="px-4 py-4 border-r last:border-r-0 border-[var(--color-line)]">
      <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-1">
        {label}
      </p>
      <p className="text-[1.5rem] md:text-[1.75rem] font-medium tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="mono text-[10.5px] text-[var(--color-text-muted)] mt-0.5">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function HeadCell({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <div
      className={`px-3 md:px-4 py-2.5 mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] ${
        right ? "text-right" : "text-left"
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
    <div
      className={`px-3 md:px-4 py-3 ${right ? "text-right" : "text-left"}`}
    >
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    active: { bg: "#ECFDF3", color: "#15803D" },
    suspended: { bg: "#FFFBEB", color: "#B45309" },
    revoked: { bg: "#FEF2F2", color: "#B91C1C" },
  };
  const s = styles[status] ?? { bg: "#F3F4F6", color: "#6B7280" };
  return (
    <span
      className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-line)] bg-white px-5 py-10 md:py-12 text-center">
      <p className="text-[15px] font-medium text-[var(--color-ink)] mb-2">{title}</p>
      <p className="text-[13px] text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
        {hint}
      </p>
    </div>
  );
}
