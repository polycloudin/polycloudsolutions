"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "overview" | "content" | "site" | "pipeline" | "ops";

// =============================================================
// DOGFOOD CONFIG — Edit these numbers weekly as you collect data.
// Mark each source with its connection status so you know at a
// glance what's live-connected vs. entered by hand.
// =============================================================

const lastUpdated = "21 April 2026 · 14:42 IST";

const meta = {
  name: "PolyCloud Solutions",
  location: "Hyderabad · Secunderabad",
  label: "Internal dogfood",
  weekLabel: "14 – 21 April 2026",
  onboarded: "Site went live 7 Apr · Dashboard started 21 Apr",
};

// Data source status — drives the connection banner
type SourceStatusValue = "live" | "pending" | "manual" | "not-yet";

const sources: { label: string; status: SourceStatusValue }[] = [
  { label: "Vercel Analytics (polycloud.in)", status: "pending" },
  { label: "Formsubmit inbound (contact form)", status: "manual" },
  { label: "X @polycloudin", status: "pending" },
  { label: "X @viratkota", status: "pending" },
  { label: "LinkedIn · PolyCloud Solutions", status: "pending" },
  { label: "LinkedIn · Virat Kota", status: "pending" },
  { label: "Meta Ads (PolyCloud)", status: "not-yet" },
  { label: "Google Ads (PolyCloud)", status: "not-yet" },
  { label: "GMB", status: "not-yet" },
];

const overviewKpis = [
  { label: "polycloud.in visits (7d)", value: "—", tone: "ink", delta: "data pending" },
  { label: "Form submits (7d)", value: "0", tone: "ink", delta: "first pilot convo" },
  { label: "Discovery calls booked", value: "1", tone: "success", delta: "Aasrith network" },
  { label: "Pilots in discussion", value: "2", tone: "success", delta: "+2 this week" },
  { label: "Paying clients", value: "0", tone: "neutral", delta: "target: 5 by Q2 end" },
];

// Content posted this week — fill in manually after each post
const contentFeed: {
  platform: "X" | "LinkedIn";
  account: "polycloudin" | "viratkota" | "polycloud-company";
  caption: string;
  when: string;
  impressions?: number;
  engagement?: string;
  status: "live" | "drafted" | "scheduled";
}[] = [
  // Add real posts here as they go out
  {
    platform: "LinkedIn",
    account: "viratkota",
    caption: "Dropping the first cut of the PolyCloud dashboard — one URL, every channel, Autopilot running the ops...",
    when: "Drafted · needs publish",
    status: "drafted",
  },
];

// Site traffic — weekly numbers from Vercel Analytics when it's wired
const siteTraffic = {
  visits7d: 0, // fill in manually each Monday
  topPages: [
    { path: "/", pageviews: 0 },
    { path: "/digital", pageviews: 0 },
    { path: "/client/demo", pageviews: 0 },
    { path: "/consulting", pageviews: 0 },
  ],
  topReferrers: [
    { source: "direct", visits: 0 },
    { source: "linkedin.com", visits: 0 },
    { source: "t.co (X)", visits: 0 },
    { source: "google.com", visits: 0 },
  ],
};

// Pipeline — edit in plain English as conversations move
const pipelineStages: {
  stage: string;
  count: number;
  items: { name: string; note: string; since: string }[];
}[] = [
  {
    stage: "Cold / prospect",
    count: 0,
    items: [],
  },
  {
    stage: "Discovery scheduled",
    count: 1,
    items: [{ name: "Pilot #1 (Aasrith's network)", note: "First call this week", since: "21 Apr" }],
  },
  {
    stage: "Pilot negotiation",
    count: 2,
    items: [
      { name: "Hyderabad jewellery SMB", note: "Asked for sample dashboard → sent /client/demo", since: "18 Apr" },
      { name: "CA firm (warm intro)", note: "Interested in Local Starter · meeting Monday", since: "20 Apr" },
    ],
  },
  {
    stage: "Pilot active",
    count: 0,
    items: [],
  },
  {
    stage: "Paying client",
    count: 0,
    items: [],
  },
];

// Ops / internal — builds, deploys, what shipped this week
const opsLog = [
  { time: "Mon 21 Apr · 10:02", text: "Shipped /digital pricing alignment to live bundles (₹70K/₹1.5L/₹3L setup)", kind: "ship" },
  { time: "Mon 21 Apr · 13:18", text: "Added Meta + Google ads connector scaffolds (agentOS/digital/templates/ads-management)", kind: "build" },
  { time: "Mon 21 Apr · 14:02", text: "Embedded dashboard demo on /digital using GSTR-2B section pattern", kind: "ship" },
  { time: "Mon 21 Apr · 14:21", text: "Reframed /digital copy as product-led (operator positioning, 'we run it, you read it')", kind: "ship" },
  { time: "Mon 21 Apr · 14:40", text: "Shipped /client/demo full-screen dashboard with 6 interactive tabs", kind: "ship" },
];

// =============================================================
// UI
// =============================================================

function Pill({
  tone,
  children,
}: {
  tone: "success" | "warn" | "risk" | "neutral" | "pending";
  children: React.ReactNode;
}) {
  const styles = {
    success: { color: "#15803D", bg: "#ECFDF3" },
    warn: { color: "#B45309", bg: "#FFFBEB" },
    risk: { color: "#DC2626", bg: "#FEF2F2" },
    neutral: { color: "var(--color-text-secondary)", bg: "var(--color-surface-warm)" },
    pending: { color: "#1A5FD4", bg: "#EEF4FF" },
  }[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium mono"
      style={{ color: styles.color, backgroundColor: styles.bg }}
    >
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: styles.color }} />
      {children}
    </span>
  );
}

function SourceStatus({ status }: { status: "live" | "pending" | "manual" | "not-yet" }) {
  if (status === "live") return <Pill tone="success">Live</Pill>;
  if (status === "pending") return <Pill tone="pending">Connect</Pill>;
  if (status === "manual") return <Pill tone="warn">Manual</Pill>;
  return <Pill tone="neutral">Not yet</Pill>;
}

function KpiGrid({ kpis }: { kpis: typeof overviewKpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 border border-[var(--color-line)] rounded-xl overflow-hidden bg-white">
      {kpis.map((k, i) => (
        <div
          key={i}
          className={`p-4 md:p-5 ${i < kpis.length - 1 ? "md:border-r" : ""} ${
            i < kpis.length - Math.min(kpis.length, 2) ? "border-b md:border-b-0" : ""
          } border-[var(--color-line)]`}
        >
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
            {k.label}
          </p>
          <p
            className="text-display text-xl md:text-2xl mb-1"
            style={{
              color:
                k.tone === "success"
                  ? "#15803D"
                  : k.tone === "risk"
                  ? "#DC2626"
                  : "var(--color-ink)",
            }}
          >
            {k.value}
          </p>
          {k.delta && (
            <p className="text-[11px] text-[var(--color-text-secondary)]">{k.delta}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <KpiGrid kpis={overviewKpis} />

      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-5">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
              Data sources
            </p>
            <h2 className="text-base font-medium">Connection status</h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {sources.filter((s) => s.status === "live").length}/{sources.length} live · rest is manual
          </p>
        </div>
        <div className="divide-y divide-[var(--color-line)]">
          {sources.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="text-[13.5px]">{s.label}</span>
              <SourceStatus status={s.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-xl text-white" style={{ backgroundColor: "#0A0A0A" }}>
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-5">
          This week's focus
        </p>
        <div className="space-y-3">
          {[
            "Publish the first LinkedIn post drafted yesterday (VK personal)",
            "Wire up Vercel Analytics so site visits are automated",
            "Follow up on CA-firm pilot — meeting Monday, draft agenda",
            "Send sample dashboard (/client/demo) to jewellery SMB",
            "Connect @polycloudin + @viratkota to browser-harness queue",
          ].map((f, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="mono text-xs text-[var(--color-primary-orange)] mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[15px] leading-relaxed">{f}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-white/50 italic">
          Dogfooding means we fix the things we'd expect a client to want fixed.
        </p>
      </div>
    </div>
  );
}

function ContentTab() {
  if (contentFeed.length === 0) {
    return (
      <div className="p-10 border border-dashed border-[var(--color-line)] rounded-xl bg-white text-center">
        <p className="text-base font-medium mb-2">No posts logged yet</p>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
          Publish your first post on @polycloudin or VK LinkedIn, then add it here manually until the API connector ships.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-5">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
              Posts · This week
            </p>
            <h2 className="text-base font-medium">
              {contentFeed.length} post{contentFeed.length === 1 ? "" : "s"} tracked
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            X + LinkedIn · manual entries until API wired
          </p>
        </div>
        <div className="divide-y divide-[var(--color-line)]">
          {contentFeed.map((p, i) => (
            <div key={i} className="py-3 flex items-start gap-4">
              <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-surface-warm)] shrink-0 mt-0.5">
                {p.platform}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] mb-1">{p.caption}</p>
                <p className="mono text-[11px] text-[var(--color-text-muted)]">
                  @{p.account} · {p.when}
                  {p.impressions ? ` · ${p.impressions.toLocaleString("en-IN")} impressions` : ""}
                  {p.engagement ? ` · ${p.engagement} engagement` : ""}
                </p>
              </div>
              {p.status === "live" ? (
                <Pill tone="success">Live</Pill>
              ) : p.status === "scheduled" ? (
                <Pill tone="pending">Scheduled</Pill>
              ) : (
                <Pill tone="warn">Draft</Pill>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SiteTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Visits (7d)", value: siteTraffic.visits7d || "—", note: "Vercel Analytics · pending" },
          { label: "Form submits", value: "0", note: "manual · check inbox" },
          { label: "Avg session", value: "—", note: "connect GA4" },
          { label: "Bounce rate", value: "—", note: "connect GA4" },
        ].map((s, i) => (
          <div key={i} className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              {s.label}
            </p>
            <p className="text-display text-2xl mb-1">{s.value}</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-4">
            Top pages
          </p>
          {siteTraffic.topPages.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-[13px] border-t first:border-t-0 border-[var(--color-line)]">
              <span className="font-mono text-[12px] text-[var(--color-text-secondary)]">
                {p.path}
              </span>
              <span className="mono font-medium">{p.pageviews || "—"}</span>
            </div>
          ))}
        </div>

        <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-4">
            Top referrers
          </p>
          {siteTraffic.topReferrers.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-[13px] border-t first:border-t-0 border-[var(--color-line)]">
              <span className="text-[var(--color-text-secondary)]">{r.source}</span>
              <span className="mono font-medium">{r.visits || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineTab() {
  return (
    <div className="space-y-6">
      {pipelineStages.map((stage, i) => (
        <div key={i} className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
                Stage {i + 1}
              </p>
              <h3 className="text-base font-medium">{stage.stage}</h3>
            </div>
            <Pill tone={stage.count > 0 ? "success" : "neutral"}>{stage.count}</Pill>
          </div>
          {stage.items.length === 0 ? (
            <p className="text-[13px] text-[var(--color-text-muted)] italic">
              Nobody here yet.
            </p>
          ) : (
            <div className="divide-y divide-[var(--color-line)]">
              {stage.items.map((item, j) => (
                <div key={j} className="py-2.5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium">{item.name}</p>
                    <p className="text-[12px] text-[var(--color-text-secondary)]">
                      {item.note}
                    </p>
                  </div>
                  <span className="mono text-[11px] text-[var(--color-text-muted)] shrink-0">
                    {item.since}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OpsTab() {
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-end justify-between flex-wrap gap-2 mb-5">
        <div>
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
            What shipped · This week
          </p>
          <h2 className="text-base font-medium">{opsLog.length} actions logged</h2>
        </div>
      </div>
      <div className="divide-y divide-[var(--color-line)]">
        {opsLog.map((a, i) => (
          <div key={i} className="flex items-start gap-4 py-3">
            <span className="mono text-[11px] text-[var(--color-text-muted)] w-32 shrink-0">
              {a.time}
            </span>
            <p className="flex-1 text-[13.5px] leading-relaxed">{a.text}</p>
            {a.kind === "ship" ? (
              <Pill tone="success">Shipped</Pill>
            ) : (
              <Pill tone="pending">Built</Pill>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content" },
  { id: "site", label: "Site" },
  { id: "pipeline", label: "Pipeline" },
  { id: "ops", label: "Ops" },
];

export default function PolycloudInternalDashboard() {
  const [tab, setTab] = useState<Tab>("overview");

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
              {meta.label} · {meta.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="mono text-[11px] text-[var(--color-text-secondary)] hidden md:inline">
              Week of {meta.weekLabel}
            </span>
            <Link
              href="/client/demo"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              Demo client →
            </Link>
          </div>
        </div>
      </header>

      {/* Client header */}
      <section className="px-5 md:px-8 py-8 md:py-10 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              {meta.location}
            </p>
            <h1 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05]">
              {meta.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Pill tone="warn">Dogfooding · manual data</Pill>
            <span className="mono text-[11px] text-[var(--color-text-muted)] hidden md:inline">
              Updated {lastUpdated}
            </span>
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-2xl">
          {meta.onboarded}. We're using this dashboard before we sell it — if it
          doesn't make our Monday morning easier, it won't make a client's easier.
        </p>
      </section>

      {/* Tabs */}
      <nav className="sticky top-[56px] z-10 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-ink)]"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-blue)]" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="px-5 md:px-8 py-6 md:py-10 max-w-[1440px] mx-auto">
        {tab === "overview" && <OverviewTab />}
        {tab === "content" && <ContentTab />}
        {tab === "site" && <SiteTab />}
        {tab === "pipeline" && <PipelineTab />}
        {tab === "ops" && <OpsTab />}

        <p className="mt-10 mono text-[10px] text-[var(--color-text-muted)] tracking-[0.14em] text-center">
          DOGFOOD — Data entered manually until connectors ship. Edit numbers in{" "}
          <code className="font-mono">app/client/polycloud/page.tsx</code>, commit, merge.
        </p>
      </main>
    </div>
  );
}
