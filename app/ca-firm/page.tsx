import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { formatCompactRupees, formatRupees } from "../client/data/aggregates";
import {
  CASH_FLOW,
  DEMO_CLIENT,
  SNAPSHOTS,
  TIER_META,
  shortMonth,
} from "./data";
import DashboardCharts from "./DashboardCharts";

export const metadata: Metadata = {
  title: "CA Firm Portal — Monthly MIS Demo",
  description:
    "Live preview of the white-labeled client MIS dashboard generated monthly by PolyCloud's CA Firm AI Employee. Synthetic data; same engine that drives real client reports.",
  alternates: { canonical: "/ca-firm" },
  openGraph: {
    title: "CA Firm Portal — Monthly MIS Demo | PolyCloud",
    description:
      "White-labeled MIS for CA firms: Tally-native, multi-tenant, generated automatically every month.",
    url: "https://polycloud.in/ca-firm",
    type: "article",
  },
};

const WHATSAPP_LINK =
  "https://wa.me/919999999999?text=Hi%20PolyCloud%2C%20I%20want%20the%20CA%20Firm%20AI%20Employee%20for%20my%20practice";

// ─────────────────────────────────────────────────────────────────

function Masthead() {
  const c = DEMO_CLIENT;
  return (
    <section className="relative pt-28 md:pt-40 pb-10 md:pb-14 px-6 md:px-10 border-b border-[var(--color-line)]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 15% 0%, rgba(26, 95, 212, 0.05) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-[1440px] mx-auto relative">
        <div className="anim-fade-up delay-1 flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
          <p className="text-eyebrow text-[var(--color-text-secondary)]">
            CA Firm AI Employee · Client MIS Portal · Synthetic demo
          </p>
        </div>
        <h1 className="anim-fade-up delay-2 text-[42px] md:text-[56px] leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)] max-w-4xl">
          {c.name}
        </h1>
        <p className="anim-fade-up delay-3 mt-6 text-[17px] md:text-[19px] leading-[1.55] text-[var(--color-text-secondary)] max-w-3xl">
          Monthly financial snapshot prepared for the client&apos;s internal
          review. All figures are derived from books of account; subject to
          audit and adjustment. The CA firm generates this dashboard once a
          month from Tally, GSTR-2B and bank statements — PolyCloud runs the
          pipeline in the background.
        </p>
        <div className="anim-fade-up delay-4 mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-[var(--color-text-secondary)]">
          <MetaField label="GSTIN" value={c.gstin} mono />
          <MetaField label="PAN" value={c.pan} mono />
          <MetaField label="FY" value={c.fy} />
          <MetaField label="Industry" value={c.industry} />
          <MetaField label="As of" value={c.asOfDate} mono />
        </div>
      </div>
    </section>
  );
}

function MetaField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-eyebrow text-[var(--color-text-muted)] text-[10px]">
        {label}
      </span>
      <span className={mono ? "mono text-[13px]" : "text-[13px]"}>{value}</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────

function KpiSection() {
  const ytdRevenue = SNAPSHOTS.reduce((s, x) => s + x.revenue, 0);
  const ytdProfit = SNAPSHOTS.reduce((s, x) => s + x.netProfit, 0);
  const ytdGstPending = SNAPSHOTS.reduce(
    (s, x) => s + Math.max(0, x.gstLiability - x.gstPaid),
    0
  );
  const ytdTdsPending = SNAPSHOTS.reduce(
    (s, x) => s + Math.max(0, x.tdsDeducted - x.tdsDeposited),
    0
  );
  const margin = ytdRevenue ? (ytdProfit / ytdRevenue) * 100 : 0;

  const kpis = [
    { label: "YTD Revenue", value: formatCompactRupees(ytdRevenue), sub: "Gross turnover" },
    { label: "YTD Net Profit", value: formatCompactRupees(ytdProfit), sub: `Margin ${margin.toFixed(1)}%` },
    { label: "GST Pending", value: formatCompactRupees(ytdGstPending), sub: "Liability net of payment" },
    { label: "TDS Pending", value: formatCompactRupees(ytdTdsPending), sub: "Deducted, not yet deposited" },
  ];

  const lastMonth = shortMonth(SNAPSHOTS[SNAPSHOTS.length - 1].monthYear);

  return (
    <section className="py-12 md:py-16 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2 className="text-[24px] md:text-[28px] text-[var(--color-ink)]">
            Year-to-date
          </h2>
          <span className="text-eyebrow text-[var(--color-text-muted)] text-[10px]">
            {SNAPSHOTS.length} months through {lastMonth}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[var(--color-line)] rounded-sm bg-[var(--color-surface)]">
          {kpis.map((k, i) => (
            <div
              key={k.label}
              className={`anim-fade-up delay-${i + 1} p-6 md:p-7 ${
                i < kpis.length - 1
                  ? "lg:border-r border-b lg:border-b-0 border-[var(--color-line)]"
                  : ""
              } ${i < 2 ? "md:border-r border-b md:border-b-0 border-[var(--color-line)]" : ""}`}
            >
              <div className="text-eyebrow text-[var(--color-text-muted)] text-[10px]">
                {k.label}
              </div>
              <div className="mt-3 text-[32px] md:text-[36px] leading-none text-[var(--color-ink)]">
                {k.value}
              </div>
              <div className="mt-2 text-[13px] text-[var(--color-text-secondary)]">
                {k.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────

function CashFlowSection() {
  const cf = CASH_FLOW;
  const tier = TIER_META[cf.tier];

  const cells: Array<{
    label: string;
    value: string;
    sub?: string;
    delta?: number;
  }> = [
    {
      label: "Current cash",
      value: formatCompactRupees(cf.currentCash),
      sub:
        cf.runwayDays !== null
          ? `Runway · ${cf.runwayDays} days`
          : "No net burn observed",
    },
    {
      label: "In 30 days",
      value: formatCompactRupees(cf.projCash30),
      delta: cf.proj30Net,
    },
    {
      label: "In 60 days",
      value: formatCompactRupees(cf.projCash60),
      delta: cf.proj60Net,
    },
    {
      label: "In 90 days",
      value: formatCompactRupees(cf.projCash90),
      delta: cf.proj90Net,
    },
  ];

  return (
    <section className="pb-12 md:pb-16 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="anim-fade-up border border-[var(--color-line)] rounded-sm bg-[var(--color-surface-warm)] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 gap-3">
            <div>
              <h2 className="text-[22px] md:text-[26px] text-[var(--color-ink)]">
                Cash flow projection
              </h2>
              <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
                6-month rolling average · Indian business seasonality applied
              </p>
            </div>
            <span
              className="inline-flex items-center gap-2 self-start md:self-auto text-eyebrow text-[10px] px-3 py-1.5 rounded-full"
              style={{ color: tier.color, backgroundColor: tier.bg }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              {tier.label} · {(cf.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {cells.map((cell, i) => (
              <div key={cell.label} className={`anim-fade-up delay-${i + 1}`}>
                <div className="text-eyebrow text-[var(--color-text-muted)] text-[10px]">
                  {cell.label}
                </div>
                <div className="mt-2 text-[26px] md:text-[30px] leading-none text-[var(--color-ink)]">
                  {cell.value}
                </div>
                {cell.sub && (
                  <div className="mt-1.5 text-[13px] text-[var(--color-text-secondary)]">
                    {cell.sub}
                  </div>
                )}
                {cell.delta !== undefined && (
                  <div
                    className="mt-1.5 text-[13px]"
                    style={{
                      color:
                        cell.delta >= 0
                          ? "var(--color-success)"
                          : "var(--color-error)",
                    }}
                  >
                    Δ {cell.delta >= 0 ? "+" : "−"}
                    {formatCompactRupees(Math.abs(cell.delta))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────

function TrendsSection() {
  return (
    <section className="pb-12 md:pb-16 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2 className="text-[24px] md:text-[28px] text-[var(--color-ink)]">
            Trends
          </h2>
          <span className="text-eyebrow text-[var(--color-text-muted)] text-[10px]">
            Monthly · last 12 periods
          </span>
        </div>
        <DashboardCharts />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────

function HistoryTable() {
  return (
    <section className="pb-16 md:pb-20 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2 className="text-[24px] md:text-[28px] text-[var(--color-ink)]">
            12-month ledger
          </h2>
          <span className="text-eyebrow text-[var(--color-text-muted)] text-[10px]">
            All amounts in ₹
          </span>
        </div>
        <div className="anim-fade-up border border-[var(--color-line)] rounded-sm bg-[var(--color-surface)] overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-left">
                <Th>Month</Th>
                <Th align="right">Revenue</Th>
                <Th align="right">Expenses</Th>
                <Th align="right">Net profit</Th>
                <Th align="right">GST liab.</Th>
                <Th align="right">GST paid</Th>
                <Th align="right">TDS ded.</Th>
                <Th align="right">TDS dep.</Th>
                <Th align="right">Closing cash</Th>
              </tr>
            </thead>
            <tbody>
              {SNAPSHOTS.map((s) => (
                <tr
                  key={s.monthYear}
                  className="border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-surface-warm)] transition-colors"
                >
                  <Td>{shortMonth(s.monthYear)}</Td>
                  <Td align="right" mono>{formatRupees(s.revenue)}</Td>
                  <Td align="right" mono>{formatRupees(s.expenses)}</Td>
                  <Td align="right" mono>{formatRupees(s.netProfit)}</Td>
                  <Td align="right" mono>{formatRupees(s.gstLiability)}</Td>
                  <Td align="right" mono>{formatRupees(s.gstPaid)}</Td>
                  <Td align="right" mono>{formatRupees(s.tdsDeducted)}</Td>
                  <Td align="right" mono>{formatRupees(s.tdsDeposited)}</Td>
                  <Td align="right" mono>{formatRupees(s.closingCash)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
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
      className="text-eyebrow text-[10px] text-[var(--color-text-muted)] font-medium px-4 py-3"
      style={{ textAlign: align }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  mono,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  mono?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 text-[13px] ${mono ? "mono" : ""}`}
      style={{ textAlign: align }}
    >
      {children}
    </td>
  );
}

// ─────────────────────────────────────────────────────────────────

function Cta() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-[var(--color-surface-warm)] border-t border-[var(--color-line)]">
      <div className="max-w-[1100px] mx-auto text-center">
        <div className="anim-fade-up flex items-center gap-3 mb-6 justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
          <p className="text-eyebrow text-[var(--color-text-secondary)]">
            CA Firm AI Employee · Digital vertical
          </p>
        </div>
        <h2 className="anim-fade-up delay-1 text-[32px] md:text-[48px] leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)] mb-6">
          This dashboard is generated{" "}
          <span className="text-serif-accent text-[var(--color-primary-blue)]">
            monthly
          </span>{" "}
          for every client — automatically.
        </h2>
        <p className="anim-fade-up delay-2 text-[17px] md:text-[19px] leading-[1.55] text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
          We run the full CA firm stack in the background — GST reconciliation,
          bank-statement-to-Tally voucher automation, TDS 26Q prep, Form 3CD
          auto-documentation, receivables chasing, compliance calendar. You get
          the outcome.
        </p>
        <div className="anim-fade-up delay-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <BookButton variant="primary" className="!px-8 !py-3.5 !text-[15px]">
            Book a call
          </BookButton>
          <Link
            href="/solutions/ca-firm"
            className="text-[14px] text-[var(--color-text-secondary)] link-underline hover:text-[var(--color-ink)]"
          >
            See pricing + 30-day pilot →
          </Link>
          <Link
            href="/digital"
            className="text-[14px] text-[var(--color-text-secondary)] link-underline hover:text-[var(--color-ink)]"
          >
            Explore Digital →
          </Link>
        </div>
        <div className="anim-fade-up delay-4 mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            Retainer ₹35–45K/mo · Tax-audit SKU ₹15–25K/audit
          </span>
          <span className="hidden sm:inline text-[var(--color-text-muted)]">·</span>
          <span>Pilot-opening for CA firms in Hyderabad</span>
          <span className="hidden sm:inline text-[var(--color-text-muted)]">·</span>
          <span>
            <span className="mono text-[var(--color-primary-orange)]">37</span>{" "}
            tools live ·{" "}
            <a
              href="https://ca-firm-toolkit.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-[var(--color-primary-blue)]"
            >
              full operator console →
            </a>
          </span>
        </div>
        {/* WhatsApp quick link retained for field-team shares */}
        <div className="anim-fade-up delay-5 mt-6 text-[12px] text-[var(--color-text-muted)]">
          Or{" "}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            message us on WhatsApp
          </a>
          .
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────

export default function CaFirmPortalPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="digital" />
      <main>
        <Masthead />
        <KpiSection />
        <CashFlowSection />
        <TrendsSection />
        <HistoryTable />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  );
}
