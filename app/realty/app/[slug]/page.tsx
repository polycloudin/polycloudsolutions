import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE } from "@/app/lib/auth";
import { aggregateUsage, type UsageAggregate } from "@/app/lib/usage";

/**
 * /realty/app/[slug] — per-builder cloud dashboard.
 *
 * Mirrors the local agent's six-card view (Land · Demand · Supply · Policy ·
 * Comps · Channel) but reads from `usage_events` on the portal side. The
 * local agent at the founding partner's laptop pushes events here via
 * /api/usage; this page renders the most recent of each kind.
 *
 * Auth gate (proxy.ts): `ops === true` OR `ten.includes(<slug>)`. A builder
 * exchanges their pck_live_<token> for a 14-day session at
 * /realty/app/login (handled by /api/realty/builder-session).
 *
 * Data-sovereignty: this page never queries the cohort table — it only
 * shows THIS tenant's events. Aggregated cohort metrics (≥5 contributors)
 * live at /admin/realty for operators only.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} · Realty cloud · PolyCloud`,
    robots: { index: false, follow: false, nocache: true },
  };
}

export const dynamic = "force-dynamic";

export default async function BuilderAppPage({ params }: PageProps) {
  const { slug } = await params;

  // ----- Auth gate -----
  const jar = await cookies();
  const claims = await readSession(jar.get(SESSION_COOKIE)?.value ?? null);
  if (!claims) {
    redirect(`/realty/app/login?slug=${encodeURIComponent(slug)}`);
  }
  const allowed = claims.ops || (claims.ten || []).includes(slug);
  if (!allowed) {
    redirect(`/realty/app/login?slug=${encodeURIComponent(slug)}&error=forbidden`);
  }

  // ----- Data: most-recent events per (module, event) for THIS tenant -----
  // Reuse aggregateUsage's group-by + filter to one tenant client-side
  const recent = await aggregateUsage({ limit: 500 });
  const mine = recent.filter((r) => r.tenant === slug);

  const cards = buildCards(mine);

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
              Realty · {slug}
            </span>
          </div>
          <Link
            href="/portal"
            className="text-[12px] font-medium text-[var(--color-primary-blue)]"
          >
            ← Portal
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 md:px-8 py-8 md:py-10 max-w-[1280px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
          Hybrid stack · cloud view · {mine.length} event types observed
        </p>
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-serif font-medium leading-tight tracking-tight">
          {slug}
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-3 max-w-2xl leading-relaxed">
          Cloud mirror of your laptop&apos;s six intel cards. Event stream is
          read-only here — your local agent is the write authority. Synthetic
          events are tagged so demos stay honest.
        </p>
      </section>

      {/* 6 cards */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {cards.map((c) => (
            <Card key={c.id} card={c} />
          ))}
        </div>

        {mine.length === 0 && (
          <div className="mt-12 border border-dashed border-[var(--color-line)] rounded-lg p-8 text-center bg-white">
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">
              No events yet
            </p>
            <p className="text-[14px] text-[var(--color-text)] max-w-xl mx-auto">
              Your local agent hasn&apos;t pushed any events to this tenant. On
              the laptop, run:{" "}
              <code className="mono text-[12px] bg-[var(--color-surface-warm)] px-2 py-0.5 rounded">
                realty portal ping --builder {slug}
              </code>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Card layout
// ─────────────────────────────────────────────────────────────────────

interface CardData {
  id: string;
  eyebrow: string;
  title: string;
  status: "live" | "quiet" | "alert";
  events: UsageAggregate[];
}

function buildCards(events: UsageAggregate[]): CardData[] {
  const byModule = new Map<string, UsageAggregate[]>();
  for (const e of events) {
    if (!byModule.has(e.module)) byModule.set(e.module, []);
    byModule.get(e.module)!.push(e);
  }

  const map: { id: string; eyebrow: string; title: string; modules: string[] }[] = [
    { id: "land",    eyebrow: "A1", title: "Land & Site Intel",    modules: ["intel.land"] },
    { id: "demand",  eyebrow: "A2", title: "Demand-Side Intel",    modules: ["intel.demand"] },
    { id: "supply",  eyebrow: "A3", title: "Supply-Side Intel",    modules: ["intel.supply"] },
    { id: "policy",  eyebrow: "A4", title: "Policy & Regulatory",  modules: ["intel.policy"] },
    { id: "comps",   eyebrow: "A5", title: "Comparables & Premium", modules: ["intel.comps"] },
    { id: "channel", eyebrow: "A6", title: "Channel + Risk",       modules: ["intel.channel"] },
  ];

  return map.map((m) => {
    const evts = m.modules.flatMap((mod) => byModule.get(mod) || []);
    const hasAlert = evts.some((e) => e.event.includes("high_alert") || e.event.includes("high_risk"));
    return {
      id: m.id,
      eyebrow: m.eyebrow,
      title: m.title,
      status: hasAlert ? "alert" : evts.length ? "live" : "quiet",
      events: evts.slice(0, 5),
    };
  });
}

function Card({ card }: { card: CardData }) {
  const statusStyles: Record<CardData["status"], string> = {
    live: "border-[var(--color-line)] bg-white",
    alert: "border-[#FECACA] bg-[#FEF2F2]",
    quiet: "border-dashed border-[var(--color-line)] bg-[var(--color-surface)]",
  };
  return (
    <div className={`rounded-lg border ${statusStyles[card.status]} p-5 flex flex-col`}>
      <div className="flex items-baseline justify-between mb-3">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-primary-orange)]">
          {card.eyebrow}
        </span>
        <span
          className={`mono text-[9px] uppercase tracking-[0.16em] ${
            card.status === "alert"
              ? "text-[#DC2626]"
              : card.status === "live"
              ? "text-[#15803D]"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          {card.status}
        </span>
      </div>
      <h2 className="text-[15px] font-serif font-medium leading-tight">{card.title}</h2>

      {card.events.length === 0 ? (
        <p className="mt-4 text-[12px] text-[var(--color-text-muted)]">
          No events yet for this module.
        </p>
      ) : (
        <ul className="mt-3 space-y-2 text-[12px]">
          {card.events.map((e) => (
            <li key={e.event} className="flex justify-between gap-3 border-t border-dashed border-[var(--color-line)] pt-2 first:border-0 first:pt-0">
              <span className="mono text-[11px] text-[var(--color-ink)] truncate">{e.event}</span>
              <span className="mono text-[10px] text-[var(--color-text-muted)] shrink-0">
                ×{e.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
