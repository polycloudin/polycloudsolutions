"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "overview" | "ads" | "organic" | "social" | "whatsapp" | "reviews";

const clientMeta = {
  name: "Kumar Textiles",
  location: "Hyderabad · Secunderabad",
  bundle: "Growth",
  onboarded: "5 Feb 2026",
  weekLabel: "14 – 21 April 2026",
};

const overviewKpis = [
  { label: "Leads (7d)", value: "342", tone: "ink", delta: "+28%" },
  { label: "Blended CPL", value: "₹184", tone: "success", delta: "−19%" },
  { label: "Blended ROAS", value: "3.4×", tone: "success", delta: "+22%" },
  { label: "Avg rating", value: "4.7", tone: "ink", delta: "+0.2" },
  { label: "Needs you", value: "4", tone: "risk", delta: "2 urgent" },
];

const adKpis = [
  { label: "Meta spend", value: "₹32,400", tone: "ink" },
  { label: "Meta leads", value: "148", tone: "ink" },
  { label: "Meta CPL", value: "₹219", tone: "success" },
  { label: "Google spend", value: "₹28,700", tone: "ink" },
  { label: "Google leads", value: "112", tone: "ink" },
  { label: "Google CPL", value: "₹256", tone: "ink" },
];

const adCampaigns = [
  { name: "Meta · Bridal-LAL-1%", spend: "₹18,400", leads: 86, cpl: "₹214", roas: "4.1×", status: "winning", trend: "+32%" },
  { name: "Meta · Retargeting-30d", spend: "₹9,800", leads: 41, cpl: "₹239", roas: "3.6×", status: "winning", trend: "+12%" },
  { name: "Meta · Cold-IG-Carousel", spend: "₹4,100", leads: 7, cpl: "₹640", roas: "0.8×", status: "paused", trend: "−47%" },
  { name: "Google · Search-Brand", spend: "₹8,200", leads: 54, cpl: "₹152", roas: "5.2×", status: "winning", trend: "+14%" },
  { name: "Google · Search-Generic", spend: "₹12,300", leads: 38, cpl: "₹324", roas: "2.8×", status: "watch", trend: "−4%" },
  { name: "Google · Shopping", spend: "₹8,200", leads: 20, cpl: "₹410", roas: "3.1×", status: "watch", trend: "+3%" },
];

const leadsDaily = [42, 51, 48, 56, 63, 58, 24];
const leadsMax = Math.max(...leadsDaily);
const days = ["M", "T", "W", "T", "F", "S", "S"];

const cplTrend = [320, 294, 268, 241, 220, 198, 184];
const cplMax = Math.max(...cplTrend);
const cplMin = Math.min(...cplTrend);
const cplPoints = cplTrend
  .map((v, i) => {
    const x = (i / (cplTrend.length - 1)) * 100;
    const y = 100 - ((v - cplMin) / (cplMax - cplMin)) * 100;
    return `${x},${y}`;
  })
  .join(" ");
const cplArea = `0,100 ${cplPoints} 100,100`;

const channelMix = [
  { name: "Meta Ads", leads: 148, color: "#1A5FD4" },
  { name: "Google Ads", leads: 112, color: "#F46B2C" },
  { name: "Organic / SEO", leads: 48, color: "#15803D" },
  { name: "WhatsApp direct", leads: 21, color: "#7C3AED" },
  { name: "GMB / Local", leads: 13, color: "#B45309" },
];
const channelMax = Math.max(...channelMix.map((c) => c.leads));

const seoKeywords = [
  { kw: "silk sarees hyderabad", rank: 4, prev: 7, vol: "1.2K" },
  { kw: "banarasi saree secunderabad", rank: 2, prev: 7, vol: "880" },
  { kw: "bridal saree store near me", rank: 7, prev: 9, vol: "1.9K" },
  { kw: "cotton kurtis hyd", rank: 11, prev: 10, vol: "540" },
  { kw: "wedding saree hyderabad", rank: 6, prev: 8, vol: "2.4K" },
  { kw: "handloom saree store", rank: 14, prev: 18, vol: "310" },
];

const gmbStats = [
  { label: "Profile views", value: "4,280", delta: "+14%" },
  { label: "Direction requests", value: "186", delta: "+22%" },
  { label: "Website clicks", value: "94", delta: "+8%" },
  { label: "Phone calls", value: "71", delta: "+11%" },
];

const socialPosts = [
  { platform: "IG", caption: "Akshaya Tritiya collection reveal — 22K silk sarees starting ₹45K", reach: 12400, eng: "4.2%", when: "Mon 10:30" },
  { platform: "FB", caption: "Bridal trunk show · Saturday preview · DM to book", reach: 8120, eng: "3.1%", when: "Tue 18:00" },
  { platform: "IG", caption: "Behind the loom · how a Banarasi saree is made", reach: 18900, eng: "5.8%", when: "Wed 12:00" },
  { platform: "LinkedIn", caption: "Why we switched from Tally to Zoho — a story", reach: 2410, eng: "2.4%", when: "Thu 09:00" },
  { platform: "IG", caption: "Customer reel · Priya's wedding lehenga", reach: 24100, eng: "7.1%", when: "Fri 19:00" },
];

const waFunnel = [
  { stage: "Inbound chats", count: 184, pct: 100 },
  { stage: "Auto-replied <2 min", count: 178, pct: 96 },
  { stage: "Captured as lead", count: 98, pct: 53 },
  { stage: "Booked visit / purchase", count: 41, pct: 22 },
];

const reviewStream = [
  { platform: "Google", author: "Rahul S.", rating: 5, snippet: "Amazing collection. Staff was helpful. Priya spent 2 hours with us.", when: "2d ago", responded: true },
  { platform: "JustDial", author: "Meera P.", rating: 4, snippet: "Good variety but parking is limited. Will return.", when: "3d ago", responded: true },
  { platform: "Google", author: "Vikram K.", rating: 2, snippet: "Sizing was off, had to return. Refund was quick though.", when: "3d ago", responded: false, urgent: true },
  { platform: "Facebook", author: "Anjali M.", rating: 5, snippet: "Bought my wedding lehenga here. Absolutely loved it.", when: "5d ago", responded: true },
  { platform: "Google", author: "Rohan D.", rating: 5, snippet: "Second time buying. Quality is consistent. Staff remembers us.", when: "6d ago", responded: true },
];

const autopilotActions = [
  { time: "Mon 09:03", text: "Paused Meta ad set 'Cold-IG-Carousel' — CPL ₹640 vs target ₹250", kind: "auto" },
  { time: "Mon 09:04", text: "Reallocated ₹8K/day from above to 'Lookalike-1%-Bridal' (CPL ₹138)", kind: "auto" },
  { time: "Tue 11:20", text: "Drafted response to Meera's 4-star JustDial review · Awaiting your approval", kind: "needs" },
  { time: "Tue 14:07", text: "Flagged Vikram's 2-star review for direct owner callback", kind: "urgent" },
  { time: "Wed 09:00", text: "Published 2 Instagram reels (silk saree try-on + Akshaya Tritiya promo)", kind: "auto" },
  { time: "Wed 15:40", text: "Updated GMB hours for Akshaya Tritiya weekend (11 May)", kind: "auto" },
  { time: "Thu 16:12", text: "Scheduled GMB post: 'Wedding Season Collection — now in store'", kind: "auto" },
  { time: "Fri 10:22", text: "Meta proposed Performance Max campaign — est. +15% leads · Needs approval", kind: "needs" },
];

const weeklyFocus = [
  { step: "01", text: "Approve draft response to Meera (pending since Tue)" },
  { step: "02", text: "Call Vikram back re: 2-star review — talking points drafted in CRM" },
  { step: "03", text: "Sign off next week's content calendar (8 posts queued)" },
  { step: "04", text: "Review Meta Performance Max proposal — est. +15% leads at similar CPL" },
];

function Pill({
  tone,
  children,
}: {
  tone: "success" | "warn" | "risk" | "neutral";
  children: React.ReactNode;
}) {
  const styles = {
    success: { color: "#15803D", bg: "#ECFDF3" },
    warn: { color: "#B45309", bg: "#FFFBEB" },
    risk: { color: "#DC2626", bg: "#FEF2F2" },
    neutral: { color: "var(--color-text-secondary)", bg: "var(--color-surface-warm)" },
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

function SectionHeader({ eyebrow, title, right }: { eyebrow: string; title: string; right?: string }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
      <div>
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
          {eyebrow}
        </p>
        <h2 className="text-xl md:text-2xl font-medium tracking-tight">{title}</h2>
      </div>
      {right && <p className="text-xs text-[var(--color-text-secondary)]">{right}</p>}
    </div>
  );
}

function KpiGrid({ kpis }: { kpis: { label: string; value: string; tone: string; delta?: string }[] }) {
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

function LeadsChart() {
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-4">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
          Leads · This week
        </p>
        <p className="mono text-[10px] text-[#15803D] font-medium">+28% vs last week</p>
      </div>
      <div>
        <div className="flex items-end gap-2 h-32">
          {leadsDaily.map((v, i) => {
            const h = (v / leadsMax) * 100;
            const isPeak = v === leadsMax;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm relative group"
                style={{
                  height: `${h}%`,
                  backgroundColor: isPeak ? "var(--color-primary-blue)" : "rgba(26, 95, 212, 0.35)",
                }}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity mono text-[10px] font-medium">
                  {v}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-2">
          {days.map((d, i) => (
            <span key={i} className="flex-1 text-center mono text-[10px] text-[var(--color-text-muted)]">
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CplChart() {
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-4">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
          Blended CPL · 7 weeks
        </p>
        <p className="mono text-[10px] text-[#15803D] font-medium">₹320 → ₹184 (−43%)</p>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-28">
        <defs>
          <linearGradient id="cplDemoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={cplArea} fill="url(#cplDemoGrad)" />
        <polyline
          points={cplPoints}
          fill="none"
          stroke="#15803D"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {cplTrend.map((v, i) => {
          const x = (i / (cplTrend.length - 1)) * 100;
          const y = 100 - ((v - cplMin) / (cplMax - cplMin)) * 100;
          const isLast = i === cplTrend.length - 1;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isLast ? "2" : "1"}
              fill={isLast ? "#15803D" : "#fff"}
              stroke="#15803D"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}

function ChannelMix() {
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-4">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
          Leads by channel · 7 days
        </p>
        <p className="mono text-[10px] text-[var(--color-text-muted)]">342 total</p>
      </div>
      <div className="space-y-2.5">
        {channelMix.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[11px] text-[var(--color-text-secondary)]">
              {c.name}
            </span>
            <div className="flex-1 h-5 bg-[var(--color-surface-warm)] rounded-sm overflow-hidden relative">
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${(c.leads / channelMax) * 100}%`,
                  backgroundColor: c.color,
                  opacity: 0.85,
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 mono text-[10px] text-[var(--color-ink)] font-medium">
                {c.leads}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <KpiGrid kpis={overviewKpis} />

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <LeadsChart />
        <CplChart />
      </div>

      <ChannelMix />

      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="Autopilot activity · This week"
          title="What we did while you slept"
          right="47 actions · 41 auto · 6 needs you"
        />
        <div className="divide-y divide-[var(--color-line)]">
          {autopilotActions.map((a, i) => (
            <div key={i} className="flex items-start gap-4 py-3">
              <span className="mono text-[11px] text-[var(--color-text-muted)] w-20 shrink-0">
                {a.time}
              </span>
              <p className="flex-1 text-[13.5px] leading-relaxed">{a.text}</p>
              {a.kind === "urgent" ? (
                <Pill tone="risk">Urgent</Pill>
              ) : a.kind === "needs" ? (
                <Pill tone="warn">Needs you</Pill>
              ) : (
                <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                  Auto
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-xl text-white" style={{ backgroundColor: "#0A0A0A" }}>
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-5">
          Your four decisions this week
        </p>
        <div className="space-y-3">
          {weeklyFocus.map((f) => (
            <div key={f.step} className="flex gap-4 items-start">
              <span className="mono text-xs text-[var(--color-primary-orange)] mt-0.5 shrink-0">
                {f.step}
              </span>
              <p className="text-[15px] leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-white/50 italic">
          Everything else runs on autopilot. These four need your judgement.
        </p>
      </div>
    </div>
  );
}

function AdsTab() {
  return (
    <div className="space-y-6">
      <KpiGrid kpis={adKpis} />

      <div className="p-0 border border-[var(--color-line)] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
              Campaign performance · 7 days
            </p>
            <p className="text-base font-medium">Meta + Google · 6 active campaigns</p>
          </div>
          <Pill tone="success">All tracked</Pill>
        </div>

        <div className="grid grid-cols-[2fr_1fr_0.8fr_0.9fr_0.8fr_0.9fr] gap-3 px-5 py-2.5 bg-[var(--color-surface-warm)] border-b border-[var(--color-line)] mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          <span>Campaign</span>
          <span className="text-right">Spend</span>
          <span className="text-right">Leads</span>
          <span className="text-right">CPL</span>
          <span className="text-right">ROAS</span>
          <span className="text-right">Status</span>
        </div>

        {adCampaigns.map((c, i) => (
          <div
            key={i}
            className={`grid grid-cols-[2fr_1fr_0.8fr_0.9fr_0.8fr_0.9fr] gap-3 px-5 py-3 text-[13px] border-b border-[var(--color-line)] last:border-b-0 items-center ${
              i % 2 === 1 ? "bg-[var(--color-surface)]" : "bg-white"
            }`}
          >
            <span className="font-medium truncate">{c.name}</span>
            <span className="mono text-right">{c.spend}</span>
            <span className="mono text-right">{c.leads}</span>
            <span className="mono text-right">{c.cpl}</span>
            <span className="mono text-right font-medium" style={{ color: c.status === "paused" ? "#DC2626" : "#15803D" }}>
              {c.roas}
            </span>
            <span className="flex justify-end">
              <Pill tone={c.status === "winning" ? "success" : c.status === "paused" ? "risk" : "warn"}>
                {c.status === "winning" ? `Winning ${c.trend}` : c.status === "paused" ? "Paused" : "Watch"}
              </Pill>
            </span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <LeadsChart />
        <CplChart />
      </div>
    </div>
  );
}

function OrganicTab() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-3">
        {gmbStats.map((s, i) => (
          <div key={i} className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              {s.label}
            </p>
            <p className="text-display text-2xl mb-1">{s.value}</p>
            <p className="text-[11px] text-[#15803D]">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="SEO · Rank tracking"
          title="Top keywords"
          right="Google India · Mobile"
        />
        <div className="grid grid-cols-[2fr_0.8fr_0.8fr_0.8fr] gap-3 pb-2 mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          <span>Keyword</span>
          <span className="text-right">Rank</span>
          <span className="text-right">Prev</span>
          <span className="text-right">Vol / mo</span>
        </div>
        {seoKeywords.map((k, i) => {
          const improved = k.rank < k.prev;
          return (
            <div
              key={i}
              className="grid grid-cols-[2fr_0.8fr_0.8fr_0.8fr] gap-3 py-3 text-[13px] border-t border-[var(--color-line)] items-center"
            >
              <span className="font-mono text-[12px] truncate">{k.kw}</span>
              <span className="mono text-right font-medium">#{k.rank}</span>
              <span
                className="mono text-right"
                style={{ color: improved ? "#15803D" : "#DC2626" }}
              >
                {improved ? "↑" : "↓"} #{k.prev}
              </span>
              <span className="mono text-right text-[var(--color-text-secondary)]">{k.vol}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SocialTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Posts (7d)", value: "5" },
          { label: "Total reach", value: "65,930" },
          { label: "Avg engagement", value: "4.5%" },
          { label: "Follower growth", value: "+128" },
        ].map((s, i) => (
          <div key={i} className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              {s.label}
            </p>
            <p className="text-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="Posts · This week"
          title="What we published"
          right="5 posts · 4 platforms"
        />
        <div className="divide-y divide-[var(--color-line)]">
          {socialPosts.map((p, i) => (
            <div key={i} className="py-3 flex items-start gap-4">
              <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-surface-warm)] shrink-0 mt-0.5">
                {p.platform}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] mb-1 truncate">{p.caption}</p>
                <p className="mono text-[11px] text-[var(--color-text-muted)]">
                  {p.when} · {p.reach.toLocaleString("en-IN")} reach · {p.eng} engagement
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhatsAppTab() {
  return (
    <div className="space-y-6">
      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="WhatsApp funnel · 7 days"
          title="From chat to booking"
          right="Auto-reply fires <2 min"
        />
        <div className="space-y-3">
          {waFunnel.map((f) => (
            <div key={f.stage}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{f.stage}</span>
                <span className="font-medium">
                  {f.count}{" "}
                  <span className="text-xs text-[var(--color-text-muted)]">({f.pct}%)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-[var(--color-surface-warm)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary-blue)] rounded-full"
                  style={{ width: `${f.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-4 italic">
          Industry avg chat → booking is 8%. We're at 22%.
        </p>
      </div>
    </div>
  );
}

function ReviewsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg rating", value: "4.7" },
          { label: "New reviews (7d)", value: "6" },
          { label: "Response rate", value: "100%" },
          { label: "Avg response", value: "3.2h" },
        ].map((s, i) => (
          <div key={i} className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              {s.label}
            </p>
            <p className="text-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="Review stream"
          title="Recent reviews · across platforms"
          right="1 needs your callback"
        />
        <div className="grid md:grid-cols-2 gap-3">
          {reviewStream.map((r, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                r.urgent ? "border-[#DC2626]/40 bg-[#FEF2F2]" : "border-[var(--color-line)] bg-[var(--color-surface-warm)]"
              }`}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] shrink-0">
                    {r.platform}
                  </span>
                  <span className="text-xs font-medium truncate">{r.author}</span>
                  <span className="text-xs text-[var(--color-primary-orange)] shrink-0">
                    {"★".repeat(r.rating)}
                    <span className="text-[var(--color-line)]">{"★".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                {r.urgent ? (
                  <Pill tone="risk">Owner needed</Pill>
                ) : r.responded ? (
                  <Pill tone="success">Responded</Pill>
                ) : (
                  <Pill tone="warn">Pending</Pill>
                )}
              </div>
              <p className="text-sm leading-relaxed mb-1">"{r.snippet}"</p>
              <p className="mono text-[10px] text-[var(--color-text-muted)]">{r.when}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tabs: { id: Tab; label: string; count?: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "ads", label: "Ads", count: "6" },
  { id: "organic", label: "Organic" },
  { id: "social", label: "Social", count: "5" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "reviews", label: "Reviews", count: "6" },
];

export default function DashboardDemoPage() {
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
              Live demo · Growth bundle · Kumar Textiles
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="mono text-[11px] text-[var(--color-text-secondary)] hidden md:inline">
              Week of {clientMeta.weekLabel}
            </span>
            <Link
              href="/digital"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Back to Digital
            </Link>
          </div>
        </div>
      </header>

      {/* Client header */}
      <section className="px-5 md:px-8 py-8 md:py-10 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              {clientMeta.location}
            </p>
            <h1 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05]">
              {clientMeta.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Pill tone="success">Health · Strong · 87/100</Pill>
            <span className="mono text-[11px] text-[var(--color-text-muted)] hidden md:inline">
              {clientMeta.bundle} · onboarded {clientMeta.onboarded}
            </span>
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-2xl">
          Demo client with anonymised numbers and names. Same structure and data ranges we ship to every Digital client.
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
              {t.count && (
                <span className="ml-1.5 mono text-[10px] text-[var(--color-text-muted)]">
                  {t.count}
                </span>
              )}
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
        {tab === "ads" && <AdsTab />}
        {tab === "organic" && <OrganicTab />}
        {tab === "social" && <SocialTab />}
        {tab === "whatsapp" && <WhatsAppTab />}
        {tab === "reviews" && <ReviewsTab />}

        <p className="mt-10 mono text-[10px] text-[var(--color-text-muted)] tracking-[0.14em] text-center">
          ILLUSTRATIVE — Client name + metrics anonymised. Structure and data ranges mirror real dashboards we ship weekly.
        </p>
      </main>
    </div>
  );
}
