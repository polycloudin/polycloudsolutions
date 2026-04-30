"use client";

import { useEffect, useState } from "react";

/**
 * Client-side embed of the realty FastAPI intel surface, talking through
 * /api/realty-proxy. Renders three things in order:
 *
 *   1. The 5-bullet Monday-morning digest (hero strip)
 *   2. Listed-vs-IGRS gap table (the over/under-priced lens)
 *   3. Iframe to the standalone Leaflet price map (full visual)
 *
 * The proxy attaches the portal session JWT before forwarding to the
 * backend. If REALTY_API_URL isn't configured this component shows a
 * clear "configure deployment" empty state instead of breaking.
 */

interface DigestBullet {
  rank: number;
  kind: string;
  headline: string;
  detail: string;
  severity: "info" | "warning" | "alert";
  payload: Record<string, unknown>;
}

interface DigestResponse {
  builder_slug: string;
  as_of: string;
  bullet_count: number;
  bullets: DigestBullet[];
}

interface PriceMapMarket {
  market: string;
  list_psf: number | null;
  regd_psf: number | null;
  regd_psy: number | null;
  gap_pct: number | null;
  verdict: "underpriced" | "fair" | "overpriced" | "no_data";
  lat: number | null;
  lon: number | null;
}

interface PriceMapResponse {
  builder: string;
  bhk: string;
  median_gap_pct: number | null;
  n_markets: number;
  markets: PriceMapMarket[];
}

interface Props {
  builderSlug: string;
}

export default function LiveIntel({ builderSlug }: Props) {
  const [digest, setDigest] = useState<DigestResponse | null>(null);
  const [priceMap, setPriceMap] = useState<PriceMapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    const qs = `?builder=${encodeURIComponent(builderSlug)}`;

    Promise.all([
      fetch(`/api/realty-proxy/digest${qs}`, { signal: ac.signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`digest: ${r.status}`))
      ),
      fetch(`/api/realty-proxy/price_map${qs}&bhk=3BHK`, { signal: ac.signal }).then(
        (r) => (r.ok ? r.json() : Promise.reject(new Error(`price_map: ${r.status}`)))
      ),
    ])
      .then(([d, p]: [DigestResponse, PriceMapResponse]) => {
        setDigest(d);
        setPriceMap(p);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e.message ?? e));
      });

    return () => ac.abort();
  }, [builderSlug]);

  if (error) {
    return (
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-8">
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-5">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#DC2626] mb-2">
            Live intel unavailable
          </p>
          <p className="text-[13px] text-[var(--color-text)]">{error}</p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-2">
            Check that <code className="mono">REALTY_API_URL</code> is set on
            the portal Vercel project and the backend is reachable.
          </p>
        </div>
      </section>
    );
  }

  if (!digest || !priceMap) {
    return (
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-8">
        <p className="mono text-[11px] text-[var(--color-text-muted)]">
          Loading live intel…
        </p>
      </section>
    );
  }

  return (
    <>
      {/* 1. Digest hero */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-6">
        <div className="flex items-baseline justify-between mb-3">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
            Live intel · weekly digest · {digest.bullet_count} signals
          </p>
          <span className="mono text-[10px] text-[var(--color-text-muted)]">
            as of {digest.as_of?.slice(0, 16)}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {digest.bullets.map((b) => (
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
      </section>

      {/* 2. Listed vs registered table */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-6">
        <div className="rounded-lg border border-[var(--color-line)] bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--color-line)] flex items-baseline justify-between">
            <h2 className="font-serif text-[16px] font-medium">
              Over- &amp; under-priced markets ·{" "}
              <span className="text-[var(--color-text-muted)] font-normal text-[13px]">
                3BHK · cohort median gap{" "}
                {priceMap.median_gap_pct != null
                  ? (priceMap.median_gap_pct * 100).toFixed(0) + "%"
                  : "—"}
              </span>
            </h2>
            <a
              href={`/realty/app/${encodeURIComponent(builderSlug)}#price-map`}
              className="mono text-[11px] text-[var(--color-primary-blue)]"
            >
              ↓ map view
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-[var(--color-surface-warm)]">
                <tr className="text-left">
                  <th className="px-4 py-2 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] font-medium">
                    Market
                  </th>
                  <th className="px-4 py-2 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] font-medium text-right">
                    Listed
                  </th>
                  <th className="px-4 py-2 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] font-medium text-right">
                    Registered
                  </th>
                  <th className="px-4 py-2 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] font-medium text-right">
                    Premium
                  </th>
                  <th className="px-4 py-2 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] font-medium">
                    Verdict
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...priceMap.markets]
                  .sort((a, b) => (b.gap_pct ?? -1) - (a.gap_pct ?? -1))
                  .map((m) => (
                    <tr
                      key={m.market}
                      className="border-t border-[var(--color-line)]"
                    >
                      <td className="px-4 py-2 font-medium">{m.market}</td>
                      <td className="px-4 py-2 mono text-right">
                        {m.list_psf != null ? "₹" + Math.round(m.list_psf).toLocaleString("en-IN") : "—"}
                      </td>
                      <td className="px-4 py-2 mono text-right">
                        {m.regd_psf != null ? "₹" + Math.round(m.regd_psf).toLocaleString("en-IN") : "—"}
                      </td>
                      <td className="px-4 py-2 mono text-right">
                        {m.gap_pct != null
                          ? "+" + (m.gap_pct * 100).toFixed(0) + "%"
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
      </section>

      {/* 3. Map placeholder — full Leaflet view lives at the backend's
           /pricemap route. Operators can reach it directly; embedding it
           in this React shell needs a same-origin Leaflet component
           (Phase 4 — react-leaflet integration). */}
      <section
        id="price-map"
        className="px-5 md:px-8 max-w-[1280px] mx-auto pb-12"
      >
        <div className="rounded-lg border border-dashed border-[var(--color-line)] p-5 bg-[var(--color-surface)]">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5">
            Map view · operator-only for now
          </p>
          <p className="text-[13px] text-[var(--color-text)]">
            The full Leaflet price map renders at the backend&apos;s{" "}
            <code className="mono text-[12px] bg-[var(--color-surface-warm)] px-2 py-0.5 rounded">
              /pricemap
            </code>{" "}
            route. Builder-side embed via react-leaflet ships in Phase 4.
          </p>
        </div>
      </section>
    </>
  );
}

function Verdict({ v }: { v: PriceMapMarket["verdict"] }) {
  const cls =
    v === "overpriced"
      ? "bg-[#FEE2E2] text-[#B91C1C]"
      : v === "underpriced"
      ? "bg-[#DCFCE7] text-[#15803D]"
      : v === "fair"
      ? "bg-[#FEF3C7] text-[#B45309]"
      : "bg-[var(--color-surface-warm)] text-[var(--color-text-muted)]";
  const label = v === "no_data" ? "?" : v;
  return (
    <span
      className={`mono text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded ${cls}`}
    >
      {label}
    </span>
  );
}
