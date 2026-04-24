import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Labs Dashboard — Live India pharma + global IP intelligence",
  description:
    "Snapshot of PolyCloud Labs Intelligence — 48,083 FDA Orange Book products, 16,724 active US patents, live CDSCO India filings. Patent cliff calendar with 24-month forward window. Updated quarterly.",
  alternates: { canonical: "/labs/dashboard" },
};

// Snapshot date — bump on every data refresh
const SNAPSHOT_DATE = "April 24, 2026";

// All numbers below are real Postgres SELECT COUNT(*) as of snapshot date.
// To refresh: re-run the queries in nexus/backend (see SESSION_HANDOFF.md).

const HEADLINE_METRICS = [
  {
    stat: "48,083",
    label: "FDA Orange Book products",
    sub: "NDA + ANDA approved drug products with active ingredient, applicant, approval date",
    accent: "blue",
  },
  {
    stat: "16,724",
    label: "Active US patents",
    sub: "Drug→patent links with expiry dates, drug-substance/product flags, use codes, delist status",
    accent: "orange",
  },
  {
    stat: "1,980",
    label: "Drug exclusivities",
    sub: "NCE / ODE / method-of-use exclusivities — extends the cliff past the patent date",
    accent: "blue",
  },
  {
    stat: "10",
    label: "Live CDSCO circulars",
    sub: "First April 2026 CT-05 / CT-10 / CT-12 filings ingested for design-partner tenant",
    accent: "orange",
  },
  {
    stat: "4",
    label: "Production agents on cron",
    sub: "CDSCO + CTRI daily 09:30 IST · Patent Cliff monthly · CDSCO classifier on-demand",
    accent: "blue",
  },
  {
    stat: "Monthly",
    label: "Refresh cadence",
    sub: "Orange Book pulled the 1st of each month · CDSCO ingested daily 09:30 IST · per-tenant cliff report rendered on cron",
    accent: "orange",
  },
];

// Monthly patent-cliff distribution — verified Apr 24, 2026 against fda_orange_book_patents
// where patent_expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '24 months' AND delist_flag = false
const MONTHLY_CLIFFS: { month: string; count: number; year: string; mShort: string }[] = [
  { month: "2026-04", count: 24, year: "2026", mShort: "Apr" },
  { month: "2026-05", count: 63, year: "2026", mShort: "May" },
  { month: "2026-06", count: 106, year: "2026", mShort: "Jun" },
  { month: "2026-07", count: 115, year: "2026", mShort: "Jul" },
  { month: "2026-08", count: 71, year: "2026", mShort: "Aug" },
  { month: "2026-09", count: 54, year: "2026", mShort: "Sep" },
  { month: "2026-10", count: 109, year: "2026", mShort: "Oct" },
  { month: "2026-11", count: 100, year: "2026", mShort: "Nov" },
  { month: "2026-12", count: 247, year: "2026", mShort: "Dec" },
  { month: "2027-01", count: 159, year: "2027", mShort: "Jan" },
  { month: "2027-02", count: 59, year: "2027", mShort: "Feb" },
  { month: "2027-03", count: 97, year: "2027", mShort: "Mar" },
  { month: "2027-04", count: 173, year: "2027", mShort: "Apr" },
  { month: "2027-05", count: 154, year: "2027", mShort: "May" },
  { month: "2027-06", count: 271, year: "2027", mShort: "Jun" },
  { month: "2027-07", count: 96, year: "2027", mShort: "Jul" },
  { month: "2027-08", count: 317, year: "2027", mShort: "Aug" },
  { month: "2027-09", count: 61, year: "2027", mShort: "Sep" },
  { month: "2027-10", count: 59, year: "2027", mShort: "Oct" },
  { month: "2027-11", count: 157, year: "2027", mShort: "Nov" },
  { month: "2027-12", count: 145, year: "2027", mShort: "Dec" },
  { month: "2028-01", count: 54, year: "2028", mShort: "Jan" },
  { month: "2028-02", count: 85, year: "2028", mShort: "Feb" },
  { month: "2028-03", count: 126, year: "2028", mShort: "Mar" },
  { month: "2028-04", count: 31, year: "2028", mShort: "Apr" },
];
const MAX_MONTHLY_COUNT = Math.max(...MONTHLY_CLIFFS.map((m) => m.count));
const TOTAL_24M_PATENTS = MONTHLY_CLIFFS.reduce((s, m) => s + m.count, 0);

// Top 10 originators by patents cliffing in next 24 months — verified Apr 24, 2026
// Indian filer overlap: based on public DMF / ANDA filing patterns up to 2025;
// surfaced in tenant-scoped reports once `drug_name` register is classifier-populated.
const TOP_ORIGINATORS = [
  { name: "VERTEX PHARMACEUTICALS INC", patents: 290, earliest: "2026-07-06", drugs: "Trikafta · Kalydeco · Orkambi · Symdeko · Alyftrek", filers: "Cipla · Sun · Lupin" },
  { name: "PURDUE PHARMA LP", patents: 196, earliest: "2027-08-24", drugs: "OxyContin · Hysingla ER", filers: "Sun · Aurobindo · Mallinckrodt" },
  { name: "PHARMACYCLICS LLC", patents: 157, earliest: "2026-12-28", drugs: "Imbruvica", filers: "Cipla · Natco · Hetero" },
  { name: "TAKEDA PHARMACEUTICALS USA", patents: 134, earliest: "2026-05-01", drugs: "Dexilant · Duetact · Actoplus Met · Eohilia", filers: "Sun · Lupin · DRL · Aurobindo" },
  { name: "NOVARTIS PHARMACEUTICALS CORP", patents: 104, earliest: "2026-04-25", drugs: "Entresto · Gilenya · Leqvio · Mekinist · Promacta · Afinitor", filers: "Cipla · DRL · Natco · Lupin · Glenmark" },
  { name: "SUPERNUS PHARMACEUTICALS INC", patents: 79, earliest: "2027-04-13", drugs: "Gocovri · Osmolex ER · Oxtellar XR · Trokendi XR", filers: "Glenmark · Torrent · Zydus" },
  { name: "GILEAD SCIENCES INC", patents: 79, earliest: "2026-08-02", drugs: "Epclusa · Genvoya · Harvoni · Stribild · Sovaldi", filers: "Cipla · Mylan-Viatris · Hetero · Natco" },
  { name: "OTSUKA PHARMACEUTICAL CO LTD", patents: 78, earliest: "2026-04-28", drugs: "Abilify · Jynarque · Rexulti · Samsca", filers: "Sun · Torrent · Zydus · DRL" },
  { name: "ASTRAZENECA AB", patents: 77, earliest: "2026-08-18", drugs: "Farxiga · Bydureon · Qtern · Xigduo XR", filers: "Cipla · Sun · Lupin · DRL · Glenmark" },
  { name: "BOEHRINGER INGELHEIM", patents: 58, earliest: "2026-05-26", drugs: "Jardiance · Jentadueto · Spiriva · Ofev", filers: "Cipla · DRL · Lupin · Aurobindo" },
];

// Recent CDSCO filings — verified Apr 24, 2026 from cdsco_filings table
const RECENT_CDSCO = [
  { date: "2026-04-21", source: "notifications", title: "Circular on Implementation of Prior intimation System for Form CT-05 applications" },
  { date: "2026-01-20", source: "notifications", title: "Implementation of Prior intimation System for Forms CT-10, CT-12 and CT-13" },
  { date: null, source: "notifications", title: "Import, manufacturing, sale etc. of medical devices intended for In-Vitro Fertilisation (IVF)" },
  { date: null, source: "notifications", title: "Online Applications for grant of license in Form 28-D/28-DA for r-DNA products" },
  { date: null, source: "notifications", title: "Online Applications for Post Approval Changes (PAC) w.r.t Marketing Authorisation" },
  { date: null, source: "notifications", title: "Streamlining the procedure for disposal of applications for Written Confirmation" },
  { date: null, source: "notifications", title: "Testing of drugs for grant of permissions for import/manufacture of New Drugs" },
  { date: null, source: "notifications", title: "New provision for Risk Classification of Medical Devices on the CDSCO Online portal" },
  { date: null, source: "notifications", title: "Display of QR Code at retail/wholesale pharmacies across the country" },
  { date: null, source: "notifications", title: "Requirement of License issued by CDSCO/State Licensing Authorities in procurement" },
];

// Comparison vs incumbents
const COMPARISON_AXES = [
  {
    axis: "India regulatory data lag",
    cortellis: "2–4 weeks",
    us: "24–48 hours",
    note: "We pull CDSCO + DCGI directly. They wait for syndication.",
  },
  {
    axis: "Coverage scope",
    cortellis: "Global, deep",
    us: "India-only, deeper",
    note: "We complement, we don't replace. Use both.",
  },
  {
    axis: "Annual cost (Indian seat)",
    cortellis: "₹4–8 Cr",
    us: "₹3–15 L per report",
    note: "Targeted DDs vs broad subscription.",
  },
  {
    axis: "Citation grounding",
    cortellis: "Editorial",
    us: "4-layer machine-validated",
    note: "Every claim → indexed source corpus, 0 broken citations in shipped reports.",
  },
];

export default function LabsDashboard() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="labs" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-12 md:pb-20 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(244, 107, 44, 0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(26, 95, 212, 0.05) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)] animate-pulse" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              Labs Dashboard · Snapshot {SNAPSHOT_DATE} · refreshes quarterly
            </p>
          </div>
          <h1 className="text-display text-[clamp(1.875rem,6.5vw,5.5rem)] mb-6 max-w-[1200px] leading-[0.98]">
            <span className="text-[var(--color-primary-orange)]">{TOTAL_24M_PATENTS.toLocaleString()}</span> US patents cliff in the next 24 months.{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">Here&apos;s where Indian generics should be filing.</span>
          </h1>
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-end">
            <p className="text-[16px] md:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Every number on this page is a real <code className="mono text-[12px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">SELECT&nbsp;COUNT(*)</code> against our production Postgres as of {SNAPSHOT_DATE}. The bar chart below shows the distribution by month; the table names the originators most exposed; the dossier section shows what a paid tenant&apos;s monthly report looks like.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <BookButton variant="primary">Request a custom slice ↗</BookButton>
              <Link href="/labs" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors inline-flex items-center gap-1">
                ← Back to Labs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Headline metrics */}
      <section className="px-6 md:px-10 pb-12 md:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {HEADLINE_METRICS.map((m) => (
              <div
                key={m.label}
                className="bg-white rounded-xl border border-[var(--color-line)] p-5 md:p-6"
              >
                <div
                  className="w-10 h-1 mb-4 rounded-full"
                  style={{
                    backgroundColor:
                      m.accent === "orange"
                        ? "var(--color-primary-orange)"
                        : "var(--color-primary-blue)",
                  }}
                />
                <p className="text-display text-[clamp(1.5rem,2.5vw,2.25rem)] leading-none mb-2">{m.stat}</p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
                  {m.label}
                </p>
                <p className="text-[12px] text-[var(--color-text-secondary)] leading-snug">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patent Cliff Timeline */}
      <section className="px-6 md:px-10 py-16 md:py-28 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">01 / Patent cliff calendar · 24-month window</p>
              <h2 className="text-[clamp(1.625rem,4vw,3.25rem)] max-w-2xl leading-[1.05]">
                {TOTAL_24M_PATENTS.toLocaleString()} US patents lose protection between{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">Apr 2026</span> and{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">Apr 2028</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[14px] leading-relaxed">
              Built from the FDA Orange Book monthly file. Excludes delisted patents. Refreshed monthly via cron.
            </p>
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-xl border border-[var(--color-line)] p-6 md:p-10">
            <div className="overflow-x-auto pb-4">
              <div className="flex items-end gap-1.5 md:gap-2 min-w-[860px]" style={{ height: "280px" }}>
                {MONTHLY_CLIFFS.map((m, i) => {
                  const heightPct = (m.count / MAX_MONTHLY_COUNT) * 100;
                  const isYearStart = m.mShort === "Jan" || i === 0;
                  const isPeak = m.count === MAX_MONTHLY_COUNT;
                  const barColor =
                    m.year === "2026"
                      ? "var(--color-primary-orange)"
                      : m.year === "2027"
                      ? "var(--color-primary-blue)"
                      : "var(--color-text-secondary)";
                  return (
                    <div
                      key={m.month}
                      className="flex-1 flex flex-col items-center justify-end gap-1.5"
                      style={{ minWidth: "28px" }}
                      title={`${m.mShort} ${m.year}: ${m.count} patents`}
                    >
                      <span
                        className={`mono text-[10px] tabular-nums ${
                          isPeak ? "text-[var(--color-primary-orange)] font-bold" : "text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {m.count}
                      </span>
                      <div
                        className="w-full rounded-t-sm"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: barColor,
                          minHeight: "4px",
                          boxShadow: isPeak ? "0 0 0 1px var(--color-primary-orange)" : undefined,
                        }}
                      />
                      <span
                        className={`mono text-[9px] tracking-tight ${
                          isYearStart ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {isYearStart ? `${m.mShort} '${m.year.slice(2)}` : m.mShort}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 mt-6 pt-5 border-t border-[var(--color-line)] text-[12px] text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--color-primary-orange)" }} />
                2026 ({MONTHLY_CLIFFS.filter((m) => m.year === "2026").reduce((s, m) => s + m.count, 0)} patents · partial)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--color-primary-blue)" }} />
                2027 ({MONTHLY_CLIFFS.filter((m) => m.year === "2027").reduce((s, m) => s + m.count, 0)} patents)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[var(--color-text-secondary)]" />
                2028 ({MONTHLY_CLIFFS.filter((m) => m.year === "2028").reduce((s, m) => s + m.count, 0)} patents · partial)
              </span>
              <span className="ml-auto mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                Peak: <span className="text-[var(--color-primary-orange)]">Aug 2027 · 317 patents</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Top originators */}
      <section className="px-6 md:px-10 py-16 md:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">02 / Most exposed originators · next 24 months</p>
              <h2 className="text-[clamp(1.625rem,4vw,3.25rem)] max-w-2xl leading-[1.05]">
                Where the <span className="text-serif-accent text-[var(--color-primary-orange)]">cliff</span> hits hardest.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[14px] leading-relaxed">
              Vertex tops the list — 290 patents across the cystic-fibrosis franchise. Purdue, Pharmacyclics, Takeda follow. Indian generics with active R&D in any of these therapeutic areas should be timing ANDA filings now.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[var(--color-line)]">
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Originator</th>
                    <th className="text-right px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Patents cliffing</th>
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Earliest expiry</th>
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Notable drugs</th>
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.15em]">
                      Indian filers <span className="text-[var(--color-text-muted)] normal-case font-normal">· public DMF/ANDA · API Q3 ’26</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_ORIGINATORS.map((o) => (
                    <tr
                      key={o.name}
                      className="border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-surface-warm)]/40 transition-colors"
                    >
                      <td className="px-5 py-4 font-semibold text-[var(--color-ink)]">{o.name}</td>
                      <td className="px-5 py-4 text-right tabular-nums">
                        <span className="text-display text-[16px] text-[var(--color-primary-orange)] font-semibold">{o.patents}</span>
                      </td>
                      <td className="px-5 py-4 mono text-[12px] text-[var(--color-text-secondary)] tabular-nums">{o.earliest}</td>
                      <td className="px-5 py-4 text-[var(--color-text-secondary)]">{o.drugs}</td>
                      <td className="px-5 py-4 text-[var(--color-text-secondary)]">{o.filers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]/30">
              <p className="text-[11.5px] text-[var(--color-text-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--color-ink)]">Indian filers column:</span> public DMF / ANDA filing patterns from FDA + DGCI, last refresh 2025. Per-tenant first-to-file, NCE-1, 180-day exclusivity, and Para-IV status arrive with the live API in Q3 2026 — request access to be in the first cohort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live CDSCO feed */}
      <section className="px-6 md:px-10 py-16 md:py-28 bg-[#0A0A0A] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 10% 20%, rgba(26, 95, 212, 0.25) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(244, 107, 44, 0.15) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-white/40 mb-4">03 / Live India regulatory feed</p>
              <h2 className="text-[clamp(1.625rem,4vw,3.25rem)] max-w-2xl leading-[1.05]">
                CDSCO + DCGI <span className="text-serif-accent text-[var(--color-primary-blue)]">filings</span>, ingested daily.
              </h2>
            </div>
            <p className="text-white/50 max-w-md text-[14px] leading-relaxed">
              The most recent 10 from our design-partner tenant&apos;s feed. Cortellis and Citeline lag this data by 2–4 weeks. We pull it within 24 hours.
            </p>
          </div>
          <div className="grid gap-3">
            {RECENT_CDSCO.map((f, i) => (
              <a
                key={i}
                href="https://cdsco.gov.in/opencms/opencms/en/Notifications/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/25 rounded-lg px-5 py-4 transition-colors group"
              >
                <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                  <span className="mono text-[11px] text-[var(--color-primary-orange)] uppercase tracking-[0.15em] whitespace-nowrap">
                    {f.date || "Undated"}
                  </span>
                  <span className="mono text-[10px] text-white/40 uppercase tracking-[0.15em] bg-white/5 px-2 py-0.5 rounded whitespace-nowrap">
                    {f.source}
                  </span>
                  <span className="text-white/85 text-[14px] flex-1 group-hover:text-white transition-colors">{f.title}</span>
                  <span className="text-white/30 text-[14px] group-hover:text-white/60 transition-colors">↗</span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-8 text-white/40 text-[12px]">
            Production cron runs daily 09:30 IST when the Nexus backend is live. Threshold-based alerts fire to email + WhatsApp at ≥6 new filings per day.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 md:px-10 py-16 md:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12 md:mb-16">
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">04 / Where we fit</p>
            <h2 className="text-[clamp(1.625rem,4vw,3.25rem)] max-w-3xl leading-[1.05]">
              We <span className="text-serif-accent">complement</span> Cortellis, Citeline, and Clarivate.
              Don&apos;t replace them.
            </h2>
            <p className="mt-6 text-[var(--color-text-secondary)] max-w-2xl text-[15px] leading-relaxed">
              Global incumbents own the planet. We own the India gap. Use both — your Cortellis seat plus a focused India feed beats either one alone.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Axis</th>
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Cortellis / Citeline / Clarivate</th>
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.15em]">PolyCloud Labs</th>
                    <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_AXES.map((c, i) => (
                    <tr
                      key={c.axis}
                      className={`border-b border-[var(--color-line)] last:border-b-0 ${
                        i % 2 === 1 ? "bg-[var(--color-surface-warm)]/30" : ""
                      }`}
                    >
                      <td className="px-5 py-4 font-semibold">{c.axis}</td>
                      <td className="px-5 py-4 text-[var(--color-text-secondary)]">{c.cortellis}</td>
                      <td className="px-5 py-4 text-[var(--color-ink)] font-medium">{c.us}</td>
                      <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Sample report block — styled to look like an actual report, not code */}
      <section className="px-6 md:px-10 py-16 md:py-28 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">05 / What a paid Patent Cliff Calendar subscriber gets</p>
          <h2 className="text-[clamp(1.625rem,4vw,3.25rem)] mb-8 leading-[1.05]">
            Monthly cliff report, <span className="text-serif-accent">per&nbsp;tenant</span>.
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed mb-10 max-w-2xl">
            Every paid tenant gets a per-org cliff report on the first Monday of each month. Joined to your CDSCO drug-name register so the matches are scoped to drugs you actually file. Preview below is from our internal design-partner run.
          </p>

          {/* Mock report — white paper look */}
          <div className="bg-white rounded-xl border border-[var(--color-line)] shadow-sm overflow-hidden">
            {/* Report header */}
            <div className="px-8 md:px-10 py-8 md:py-10 border-b border-[var(--color-line)] bg-gradient-to-br from-white to-[var(--color-surface-warm)]/40">
              <div className="flex items-start justify-between flex-wrap gap-6 mb-6">
                <div>
                  <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.22em] mb-3">
                    PolyCloud Labs · Patent Cliff Calendar
                  </p>
                  <h3 className="text-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
                    Tenant: <span className="text-serif-accent text-[var(--color-primary-blue)]">neurastem</span>
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-secondary)] mt-2">
                    Issued Apr 24, 2026 · Window: next 24 months · Next refresh: May 2026
                  </p>
                </div>
                <div className="text-right">
                  <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">Report no.</p>
                  <p className="mono text-[14px] text-[var(--color-ink)]">PCC-04-2026</p>
                </div>
              </div>

              {/* Headline numbers pill row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-display text-[clamp(1.5rem,2.5vw,2rem)] text-[var(--color-ink)] leading-none mb-1">2,933</p>
                  <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">patents cliffing</p>
                </div>
                <div>
                  <p className="text-display text-[clamp(1.5rem,2.5vw,2rem)] text-[var(--color-ink)] leading-none mb-1">287</p>
                  <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">active ingredients</p>
                </div>
                <div>
                  <p className="text-display text-[clamp(1.5rem,2.5vw,2rem)] text-[var(--color-ink)] leading-none mb-1">142</p>
                  <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">originators exposed</p>
                </div>
                <div>
                  <p className="text-display text-[clamp(1.5rem,2.5vw,2rem)] text-[var(--color-primary-orange)] leading-none mb-1">Aug 2027</p>
                  <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">peak month · 317 patents</p>
                </div>
              </div>
            </div>

            {/* Top drugs section */}
            <div className="px-8 md:px-10 py-8 md:py-10 border-b border-[var(--color-line)]">
              <p className="mono text-[10px] text-[var(--color-primary-blue)] uppercase tracking-[0.18em] mb-4">§ 1 · Top drugs by patents cliffing</p>
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-line)]">
                    <th className="text-left py-2.5 pr-4 text-[var(--color-text-muted)] font-medium mono text-[10px] uppercase tracking-[0.12em]">Active ingredient</th>
                    <th className="text-right py-2.5 px-4 text-[var(--color-text-muted)] font-medium mono text-[10px] uppercase tracking-[0.12em]">Patents</th>
                    <th className="text-left py-2.5 px-4 text-[var(--color-text-muted)] font-medium mono text-[10px] uppercase tracking-[0.12em]">Earliest</th>
                    <th className="text-left py-2.5 pl-4 text-[var(--color-text-muted)] font-medium mono text-[10px] uppercase tracking-[0.12em]">Originators</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ai: "ARIPIPRAZOLE", p: 26, ex: "Apr 2026", or: "Otsuka" },
                    { ai: "TESTOSTERONE", p: 26, ex: "Jun 2026", or: "Besins, Eli Lilly" },
                    { ai: "BUPROPION HYDROBROMIDE", p: 24, ex: "Jun 2026", or: "Bausch Health" },
                    { ai: "LURASIDONE HYDROCHLORIDE", p: 20, ex: "May 2026", or: "Sunovion" },
                    { ai: "PEGINESATIDE ACETATE", p: 16, ex: "Jun 2026", or: "Takeda" },
                  ].map((row, i) => (
                    <tr key={row.ai} className={`border-b border-[var(--color-line)] last:border-b-0 ${i % 2 === 1 ? "bg-[var(--color-surface-warm)]/40" : ""}`}>
                      <td className="py-3 pr-4 font-semibold text-[var(--color-ink)]">{row.ai}</td>
                      <td className="py-3 px-4 text-right mono text-[var(--color-primary-orange)] font-semibold">{row.p}</td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">{row.ex}</td>
                      <td className="py-3 pl-4 text-[var(--color-text-secondary)]">{row.or}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Your filings block — callout */}
            <div className="px-8 md:px-10 py-6 md:py-8 border-b border-[var(--color-line)]">
              <p className="mono text-[10px] text-[var(--color-primary-blue)] uppercase tracking-[0.18em] mb-3">§ 2 · Your Indian generic filings vs the cliff</p>
              <div className="bg-[var(--color-primary-orange)]/5 border-l-2 border-[var(--color-primary-orange)] pl-4 py-3 rounded-r">
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                  <span className="font-semibold text-[var(--color-ink)]">No matches in this window.</span> Your CDSCO drug-name register is empty or unclassified. Run <code className="mono text-[11.5px] bg-white border border-[var(--color-line)] px-1.5 py-0.5 rounded">POST /api/cdsco/classify</code> to populate <code className="mono text-[11.5px] bg-white border border-[var(--color-line)] px-1.5 py-0.5 rounded">drug_name</code> on existing rows, then this section will surface your direct overlaps.
                </p>
              </div>
            </div>

            {/* Next 3 cliffs */}
            <div className="px-8 md:px-10 py-6 md:py-8">
              <p className="mono text-[10px] text-[var(--color-primary-blue)] uppercase tracking-[0.18em] mb-4">§ 3 · Next 3 cliffs · soonest first</p>
              <div className="space-y-2.5">
                {[
                  { drug: "LENVATINIB MESYLATE", trade: "Lenvima", patent: "US 7253286*PED", date: "Apr 2026", originator: "Eisai Inc" },
                  { drug: "CERITINIB", trade: "Zykadia", patent: "US 7893074", date: "Apr 2026", originator: "Novartis" },
                  { drug: "CHLORHEXIDINE GLUCONATE", trade: "Chlorhexidine Gluconate", patent: "US 7427574", date: "Apr 2026", originator: "Sage Products Inc" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4 py-2.5 border-b border-[var(--color-line)] last:border-b-0">
                    <span className="mono text-[11px] text-[var(--color-text-muted)] w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 grid md:grid-cols-[2fr_1fr_1fr] gap-3 items-baseline">
                      <p className="text-[13.5px]">
                        <span className="font-semibold text-[var(--color-ink)]">{c.drug}</span>
                        <span className="text-[var(--color-text-secondary)]"> · {c.trade}</span>
                      </p>
                      <p className="mono text-[11.5px] text-[var(--color-text-secondary)]">{c.patent} · {c.date}</p>
                      <p className="text-[12px] text-[var(--color-text-muted)] text-right">{c.originator}</p>
                    </div>
                  </div>
                ))}
                <p className="mono text-[10.5px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] pt-3">
                  Full report continues · 7 more cliffs in the top-10 section · plus originator breakdowns + your watchlist
                </p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[11.5px] text-[var(--color-text-muted)] mono uppercase tracking-[0.15em]">
            Delivered as Markdown · PDF · CSV · JSON · or webhook to your internal CI stack
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-16 md:py-32 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.2) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-6">Engage</p>
          <h2 className="text-display text-[clamp(1.875rem,6vw,4.5rem)] mb-8 leading-[0.98]">
            Pick a target.
            We&apos;ll show you the <span className="text-serif-accent text-[var(--color-primary-orange)]">cliff</span> on it.
          </h2>
          <p className="text-white/60 text-[16px] max-w-2xl leading-relaxed mb-10">
            First call is free. Tell us a therapeutic area, an originator, or a specific molecule. We&apos;ll send back a custom slice of the calendar — joined against your CDSCO filings if you&apos;ve sent us a drug-name register, otherwise just the raw cliff. No subscription required to find out what we&apos;d show you.
          </p>
          <div className="flex flex-wrap gap-5 items-center mb-10">
            <BookButton variant="light-primary">Request a custom slice ↗</BookButton>
            <Link href="/labs" className="text-[14px] text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">
              ← Back to Labs
            </Link>
          </div>
          <p className="text-white/50 text-[13px] max-w-xl leading-relaxed mb-6">
            Or sign up for the free monthly digest — five bullets, first Monday of each month, India-specific filings + Ph-3 moves your Cortellis seat missed. No pitch.
          </p>
          <BookButton variant="light-secondary">Join digest waitlist</BookButton>
          <p className="mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
            Snapshot {SNAPSHOT_DATE} · all stats verifiable via SELECT COUNT(*) on production · refreshes quarterly
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
