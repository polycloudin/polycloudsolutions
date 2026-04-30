"use client";

import { useEffect, useState } from "react";

/**
 * Builder-portal live intel grid. Fan-out fetch against the realty FastAPI
 * via /api/realty-proxy. Each widget is its own card; missing data returns
 * an "empty state" rather than blocking the whole page.
 *
 * Endpoints surfaced (all under /api/intel/v2/* on the backend):
 *
 *   1.  digest             — Monday-morning 5-bullet hero
 *   2.  price_map          — neighbor-relative over/under-priced table
 *   3.  rera/penalties     — top RERA enforcement orders (PDF-extracted)
 *   4.  materials          — cement / steel 4w-MA + brands
 *   5.  igrs               — paid-vs-floor gap per market (negotiation signal)
 *   6.  hedger/cement      — D3 live cement hedger recommendation
 *   7.  arbitrage          — D5 resale arbitrage opportunities
 *   8.  infra              — A4 future infra pipeline (metro/ORR/RRR/...)
 *   9.  nri                — A2 NRI search-trend pulse
 *  10.  hydraa             — A4 regulatory enforcement events
 *
 * Each panel degrades independently — backend off / empty data / 4xx shows
 * a per-panel message instead of failing the page.
 */

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

interface DigestBullet {
  rank: number;
  kind: string;
  headline: string;
  detail: string;
  severity: "info" | "warning" | "alert";
}

interface DigestResp {
  bullet_count: number;
  bullets: DigestBullet[];
  as_of: string;
}

interface PriceMapNeighbor {
  market: string;
  list_psf: number | null;
  distance_km: number;
}

interface PriceMapMarket {
  market: string;
  list_psf: number | null;
  neighbor_median_psf: number | null;
  rel_premium_pct: number | null;
  neighbors: PriceMapNeighbor[];
  verdict:
    | "underpriced"
    | "fair"
    | "overpriced"
    | "no_data"
    | "no_geo"
    | "isolated";
}

interface PriceMapResp {
  bhk: string;
  params: { neighbor_radius_km: number };
  markets: PriceMapMarket[];
}

interface PenaltyRow {
  case_number: string;
  promoter_name: string | null;
  micro_market: string | null;
  order_date: string | null;
  penalty_inr: number | null;
  daily_penalty_inr: number | null;
  pdf_extracted: number;
}

interface PenaltiesResp {
  orders: PenaltyRow[];
  n_orders: number;
  total_penalty_inr: number;
}

interface IgrsGapRow {
  market: string;
  regd_psy: number | null;
  list_psf: number | null;
  gap_pct: number | null;
}

interface IgrsResp {
  gaps_3bhk: IgrsGapRow[];
}

interface HedgerForwardPoint {
  tenor_days: number;
  implied_price_per_bag: number;
  basis_spot: number;
}

interface HedgerResp {
  spot_brands_n: number;
  spot_median_per_bag: number | null;
  forward_curve: HedgerForwardPoint[];
  recommendation: {
    recommendation: string;
    confidence_0_1: number;
    expected_savings_pct: number;
    expected_savings_rupees: number;
    reasoning: string;
  };
}

interface ArbitrageOpp {
  project_name: string;
  micro_market: string;
  bhk_config: string;
  listed_psf: number;
  primary_psf_median: number;
  gap_pct: number;
  deal_size_inr: number | null;
  action: string;
  portal: string;
}

interface ArbitrageResp {
  summary: {
    n_opportunities: number;
    by_action: Record<string, number>;
    total_potential_deal_inr: number;
  };
  opportunities: ArbitrageOpp[];
}

interface InfraEvent {
  kind: string;
  name: string;
  status: string;
  expected_year: number | null;
  micro_market: string | null;
}

interface InfraResp {
  summary: {
    by_kind: Record<string, number>;
    by_status: Record<string, number>;
    next_to_commission: InfraEvent[];
  };
  events: InfraEvent[];
}

interface NriMarket {
  micro_market: string;
  n_signals: number;
  avg_trend: number;
  peak_trend: number;
}

interface NriRegion {
  region: string;
  n_signals: number;
  avg_trend: number;
}

interface NriResp {
  by_market: NriMarket[];
  by_region: NriRegion[];
}

// ─────────────────────────────────────────────────────────────────────
// Per-endpoint hook with independent error/loading state
// ─────────────────────────────────────────────────────────────────────

type FetchState<T> = { data: T | null; error: string | null; loading: boolean };

function useV2<T>(builderSlug: string, path: string, query: string = ""): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });
  useEffect(() => {
    const ac = new AbortController();
    const qs = `?builder=${encodeURIComponent(builderSlug)}${query ? `&${query}` : ""}`;
    fetch(`/api/realty-proxy/${path}${qs}`, { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(`${path}: ${r.status}`);
        }
        return r.json();
      })
      .then((d: T) => setState({ data: d, error: null, loading: false }))
      .catch((e) => {
        if (e.name === "AbortError") return;
        setState({ data: null, error: String(e.message ?? e), loading: false });
      });
    return () => ac.abort();
  }, [builderSlug, path, query]);
  return state;
}

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

interface Props {
  builderSlug: string;
}

export default function LiveIntel({ builderSlug }: Props) {
  const digest = useV2<DigestResp>(builderSlug, "digest");
  const priceMap = useV2<PriceMapResp>(builderSlug, "price_map", "bhk=3BHK");
  const penalties = useV2<PenaltiesResp>(builderSlug, "rera/penalties");
  const igrs = useV2<IgrsResp>(builderSlug, "igrs");
  const hedger = useV2<HedgerResp>(builderSlug, "hedger/cement");
  const arb = useV2<ArbitrageResp>(builderSlug, "arbitrage");
  const infra = useV2<InfraResp>(builderSlug, "infra");
  const nri = useV2<NriResp>(builderSlug, "nri");

  // If the digest failed AND it's the proxy mis-config (503), show the
  // banner and don't bother rendering the rest.
  if (digest.error?.includes("503")) {
    return <ConfigError detail={digest.error} />;
  }

  return (
    <>
      {/* 1. DIGEST HERO ─────────────────────────────────────────── */}
      <Section title={`Live intel · weekly digest · ${digest.data?.bullet_count ?? 0} signals`}
        eyebrow={digest.data?.as_of?.slice(0, 16) ?? ""}
      >
        {digest.loading && <Loading />}
        {digest.error && !digest.loading && <PanelError msg={digest.error} />}
        {digest.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {digest.data.bullets.map((b) => (
              <div
                key={b.rank}
                className={`rounded-lg border-l-4 p-4 bg-white border-[var(--color-line)] ${
                  b.severity === "alert"
                    ? "!border-l-[#DC2626]"
                    : b.severity === "warning"
                    ? "!border-l-[#B45309]"
                    : "!border-l-[var(--color-primary-blue)]"
                }`}
              >
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1">
                  {b.kind} · {b.severity}
                </p>
                <p className="text-[13px] font-medium text-[var(--color-ink)] leading-snug">
                  {b.headline}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                  {b.detail}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 2. PRICE MAP — over/under-priced ─────────────────────────── */}
      <Section
        title="Over- & under-priced markets"
        eyebrow={`3BHK · ${priceMap.data?.params.neighbor_radius_km ?? 0} km neighbor radius`}
      >
        {priceMap.loading && <Loading />}
        {priceMap.error && !priceMap.loading && <PanelError msg={priceMap.error} />}
        {priceMap.data && (
          <div className="rounded-lg border border-[var(--color-line)] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-[var(--color-surface-warm)]">
                  <tr className="text-left">
                    <Th>Market</Th>
                    <Th align="right">Listed</Th>
                    <Th align="right">Neighbor med</Th>
                    <Th align="right">Δ vs neighbors</Th>
                    <Th>Verdict</Th>
                  </tr>
                </thead>
                <tbody>
                  {[...priceMap.data.markets]
                    .sort(
                      (a, b) =>
                        (b.rel_premium_pct ?? -99) - (a.rel_premium_pct ?? -99)
                    )
                    .slice(0, 10)
                    .map((m) => (
                      <tr key={m.market} className="border-t border-[var(--color-line)]">
                        <td className="px-4 py-2 font-medium">{m.market}</td>
                        <td className="px-4 py-2 mono text-right">
                          {m.list_psf != null
                            ? "₹" + Math.round(m.list_psf).toLocaleString("en-IN")
                            : "—"}
                        </td>
                        <td className="px-4 py-2 mono text-right">
                          {m.neighbor_median_psf != null
                            ? "₹" +
                              Math.round(m.neighbor_median_psf).toLocaleString(
                                "en-IN"
                              )
                            : "—"}
                        </td>
                        <td className="px-4 py-2 mono text-right">
                          {m.rel_premium_pct != null
                            ? (m.rel_premium_pct >= 0 ? "+" : "") +
                              (m.rel_premium_pct * 100).toFixed(0) +
                              "%"
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          <Verdict v={m.verdict} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      {/* 3 + 4. EC GAP & RERA PENALTIES — two-up grid ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-5 md:px-8 max-w-[1280px] mx-auto pb-6">
        {/* IGRS / EC paid-vs-floor */}
        <Card title="EC paid-vs-floor (negotiation signal)" eyebrow="A5 · IGRS">
          {igrs.loading && <Loading />}
          {igrs.error && !igrs.loading && <PanelError msg={igrs.error} />}
          {igrs.data && igrs.data.gaps_3bhk.length === 0 && (
            <Empty msg="No matching IGRS+listing pairs yet." />
          )}
          {igrs.data && igrs.data.gaps_3bhk.length > 0 && (
            <ul className="text-[12px] space-y-2">
              {igrs.data.gaps_3bhk.slice(0, 6).map((g) => (
                <li key={g.market} className="flex items-center justify-between">
                  <span className="font-medium">{g.market}</span>
                  <span className="mono text-[11px]">
                    +{((g.gap_pct ?? 0) * 100).toFixed(0)}% vs floor
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* RERA penalties */}
        <Card title="RERA enforcement — top penalty orders" eyebrow="A4 · TG-RERA">
          {penalties.loading && <Loading />}
          {penalties.error && !penalties.loading && <PanelError msg={penalties.error} />}
          {penalties.data && penalties.data.orders.length === 0 && (
            <Empty msg="No penalty orders matching the threshold." />
          )}
          {penalties.data && penalties.data.orders.length > 0 && (
            <ul className="text-[12px] space-y-2">
              {penalties.data.orders.slice(0, 5).map((o) => (
                <li key={o.case_number} className="flex justify-between gap-3">
                  <span className="truncate">
                    {o.promoter_name || "(unnamed)"} ·{" "}
                    <span className="mono text-[10px] text-[var(--color-text-muted)]">
                      {o.case_number}
                    </span>
                  </span>
                  <span className="mono text-[11px] whitespace-nowrap">
                    ₹
                    {o.penalty_inr
                      ? Math.round(o.penalty_inr).toLocaleString("en-IN")
                      : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* 5 + 6. MATERIALS HEDGER + INFRA — two-up ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-5 md:px-8 max-w-[1280px] mx-auto pb-6">
        {/* Cement hedger live */}
        <Card title="Cement hedger — buy / wait / ladder" eyebrow="D3 · live">
          {hedger.loading && <Loading />}
          {hedger.error && !hedger.loading && <PanelError msg={hedger.error} />}
          {hedger.data && (
            <>
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Median spot · {hedger.data.spot_brands_n} brands
                  </p>
                  <p className="font-serif text-[20px]">
                    {hedger.data.spot_median_per_bag != null
                      ? `₹${Math.round(hedger.data.spot_median_per_bag)}/bag`
                      : "—"}
                  </p>
                </div>
                <RecommendationPill rec={hedger.data.recommendation.recommendation} />
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                {hedger.data.recommendation.reasoning}
              </p>
            </>
          )}
        </Card>

        {/* Infra pipeline */}
        <Card title="Future infra pipeline" eyebrow="A4 · metro / ORR / RRR / Future-City">
          {infra.loading && <Loading />}
          {infra.error && !infra.loading && <PanelError msg={infra.error} />}
          {infra.data && (
            <>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                {Object.entries(infra.data.summary.by_kind).map(([k, n]) => (
                  <span key={k} className="mono text-[11px] text-[var(--color-text-secondary)]">
                    {k}=<span className="font-medium text-[var(--color-ink)]">{n}</span>
                  </span>
                ))}
              </div>
              <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1">
                Next to commission
              </p>
              <ul className="text-[12px] space-y-1">
                {infra.data.summary.next_to_commission.map((e) => (
                  <li key={e.name} className="flex justify-between">
                    <span>
                      {e.name} <span className="text-[var(--color-text-muted)]">({e.kind})</span>
                    </span>
                    <span className="mono text-[11px]">{e.expected_year}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      {/* 7 + 8. NRI PULSE + ARBITRAGE — two-up ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-5 md:px-8 max-w-[1280px] mx-auto pb-6">
        {/* NRI pulse */}
        <Card title="NRI demand pulse" eyebrow="A2 · search-trend index">
          {nri.loading && <Loading />}
          {nri.error && !nri.loading && <PanelError msg={nri.error} />}
          {nri.data && nri.data.by_market.length === 0 && (
            <Empty msg="No NRI signals ingested yet." />
          )}
          {nri.data && nri.data.by_market.length > 0 && (
            <ul className="text-[12px] space-y-2">
              {nri.data.by_market.slice(0, 5).map((r) => (
                <li key={r.micro_market} className="flex items-center justify-between">
                  <span className="font-medium">{r.micro_market}</span>
                  <span className="mono text-[11px]">avg {r.avg_trend.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Arbitrage */}
        <Card
          title="Resale arbitrage — below-primary listings"
          eyebrow="D5 · live scanner"
        >
          {arb.loading && <Loading />}
          {arb.error && !arb.loading && <PanelError msg={arb.error} />}
          {arb.data && arb.data.opportunities.length === 0 && (
            <Empty msg="No opportunities at current threshold." />
          )}
          {arb.data && arb.data.opportunities.length > 0 && (
            <ul className="text-[12px] space-y-2">
              {arb.data.opportunities.slice(0, 5).map((o) => (
                <li key={`${o.project_name}-${o.bhk_config}`} className="flex justify-between">
                  <span className="truncate">
                    {o.project_name} · {o.bhk_config}
                  </span>
                  <span className="mono text-[11px] text-[#B45309]">
                    -{(o.gap_pct * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Reusable subcomponents
// ─────────────────────────────────────────────────────────────────────

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-6">
      <div className="flex items-baseline justify-between mb-3">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
          {title}
        </p>
        {eyebrow && (
          <span className="mono text-[10px] text-[var(--color-text-muted)]">
            {eyebrow}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Card({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-line)] bg-white p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-serif text-[14px] font-medium">{title}</h3>
        {eyebrow && (
          <span className="mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            {eyebrow}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-2 text-[10px] mono uppercase tracking-[0.14em] text-[var(--color-text-muted)] font-medium ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Loading() {
  return (
    <p className="mono text-[11px] text-[var(--color-text-muted)]">Loading…</p>
  );
}

function PanelError({ msg }: { msg: string }) {
  return (
    <p className="mono text-[11px] text-[#B91C1C]">
      Unavailable: {msg}
    </p>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <p className="mono text-[11px] text-[var(--color-text-muted)]">{msg}</p>
  );
}

function Verdict({ v }: { v: PriceMapMarket["verdict"] }) {
  const cls =
    v === "overpriced"
      ? "bg-[#FEE2E2] text-[#B91C1C]"
      : v === "underpriced"
      ? "bg-[#DCFCE7] text-[#166534]"
      : v === "fair"
      ? "bg-[#E0F2FE] text-[#0C4A6E]"
      : "bg-[var(--color-surface-warm)] text-[var(--color-text-muted)]";
  return (
    <span
      className={`inline-block mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded ${cls}`}
    >
      {v}
    </span>
  );
}

function RecommendationPill({ rec }: { rec: string }) {
  const cls =
    rec === "buy_now"
      ? "bg-[#DCFCE7] text-[#166534]"
      : rec === "wait_30d" || rec === "wait_60d"
      ? "bg-[#FEF3C7] text-[#92400E]"
      : "bg-[var(--color-surface-warm)] text-[var(--color-text-secondary)]";
  return (
    <span
      className={`inline-block mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded ${cls}`}
    >
      {rec.replace(/_/g, " ")}
    </span>
  );
}

function ConfigError({ detail }: { detail: string }) {
  return (
    <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-8">
      <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-5">
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#DC2626] mb-2">
          Live intel unavailable
        </p>
        <p className="text-[13px] text-[var(--color-text)]">{detail}</p>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-2">
          Set <code className="mono">REALTY_API_URL</code> on the portal Vercel
          project.
        </p>
      </div>
    </section>
  );
}
