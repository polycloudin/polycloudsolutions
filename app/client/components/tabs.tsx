"use client";

import { useState } from "react";
import type {
  ClientData,
  DraftTemplate,
  Lead,
  OutreachTouch,
} from "../data/types";
import { Pill, KpiGrid, SectionHeader, SourceStatusPill } from "./primitives";
import { LeadsChart, CplChart, ChannelMix } from "./charts";
import { TransformationHero, MoneyStrip, ActivityCard } from "./demo-blocks";

export function OverviewTab({ data }: { data: ClientData }) {
  const o = data.overview;
  return (
    <div className="space-y-6">
      {o.transformation && <TransformationHero t={o.transformation} />}

      {o.money && <MoneyStrip m={o.money} />}

      <KpiGrid kpis={o.kpis} />

      {o.charts?.leadsDaily || o.charts?.cplTrend ? (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          {o.charts?.leadsDaily && <LeadsChart data={o.charts.leadsDaily} />}
          {o.charts?.cplTrend && <CplChart data={o.charts.cplTrend} />}
        </div>
      ) : null}

      {o.charts?.channelMix && <ChannelMix channels={o.charts.channelMix} />}

      {o.autopilotActivity && o.autopilotActivity.length > 0 && (
        <div className="p-5 md:p-6 border border-[var(--color-line)] rounded-xl bg-white">
          <SectionHeader
            eyebrow="Autopilot activity · This week"
            title="What we did while you slept"
            right={`${o.autopilotActivity.length} actions`}
          />
          <div className="divide-y divide-[var(--color-line)]">
            {o.autopilotActivity.map((a, i) => (
              <ActivityCard key={i} a={a} />
            ))}
          </div>
        </div>
      )}

      {o.weeklyFocus && o.weeklyFocus.length > 0 && (
        <div className="p-6 md:p-8 rounded-xl text-white" style={{ backgroundColor: "#0A0A0A" }}>
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-5">
            {data.auth === "private" ? "This week's focus" : "Your decisions this week"}
          </p>
          <div className="space-y-3">
            {o.weeklyFocus.map((f, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="mono text-xs text-[var(--color-primary-orange)] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/50 italic">
            {data.auth === "private"
              ? "Dogfooding means we fix the things we'd expect a client to want fixed."
              : "Everything else runs on autopilot. These need your judgement."}
          </p>
        </div>
      )}
    </div>
  );
}

export function AdsTab({ data }: { data: ClientData }) {
  if (!data.ads) return <EmptyState label="Ads" />;
  return (
    <div className="space-y-6">
      <KpiGrid kpis={data.ads.kpis} />
      <div className="p-0 border border-[var(--color-line)] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
              Campaign performance · 7 days
            </p>
            <p className="text-base font-medium">
              Meta + Google · {data.ads.campaigns.length} campaigns
            </p>
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
        {data.ads.campaigns.map((c, i) => (
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
            <span
              className="mono text-right font-medium"
              style={{ color: c.status === "paused" ? "#DC2626" : "#15803D" }}
            >
              {c.roas}
            </span>
            <span className="flex justify-end">
              <Pill tone={c.status === "winning" ? "success" : c.status === "paused" ? "risk" : "warn"}>
                {c.status === "winning" ? `Winning ${c.trend ?? ""}` : c.status === "paused" ? "Paused" : "Watch"}
              </Pill>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrganicTab({ data }: { data: ClientData }) {
  if (!data.organic) return <EmptyState label="Organic" />;
  const { gmbStats, seoKeywords, siteTraffic } = data.organic;
  return (
    <div className="space-y-6">
      {gmbStats && gmbStats.length > 0 && <KpiGrid kpis={gmbStats} />}

      {seoKeywords && seoKeywords.length > 0 && (
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
                <span className="mono text-right" style={{ color: improved ? "#15803D" : "#DC2626" }}>
                  {improved ? "↑" : "↓"} #{k.prev}
                </span>
                <span className="mono text-right text-[var(--color-text-secondary)]">{k.vol}</span>
              </div>
            );
          })}
        </div>
      )}

      {siteTraffic && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-4">
              Top pages
            </p>
            {siteTraffic.topPages.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 text-[13px] border-t first:border-t-0 border-[var(--color-line)]"
              >
                <span className="font-mono text-[12px] text-[var(--color-text-secondary)]">{p.path}</span>
                <span className="mono font-medium">{p.pageviews || "—"}</span>
              </div>
            ))}
          </div>
          <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-4">
              Top referrers
            </p>
            {siteTraffic.topReferrers.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 text-[13px] border-t first:border-t-0 border-[var(--color-line)]"
              >
                <span className="text-[var(--color-text-secondary)]">{r.source}</span>
                <span className="mono font-medium">{r.visits || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SocialTab({ data }: { data: ClientData }) {
  if (!data.social) return <EmptyState label="Social" />;
  const { stats, posts } = data.social;
  return (
    <div className="space-y-6">
      {stats && <KpiGrid kpis={stats} />}
      {posts.length === 0 ? (
        <EmptyState label="No posts logged yet" sub="Publish one, add it here." />
      ) : (
        <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
          <SectionHeader
            eyebrow="Posts · This week"
            title="What we published"
            right={`${posts.length} posts · ${new Set(posts.map((p) => p.platform)).size} platforms`}
          />
          <div className="divide-y divide-[var(--color-line)]">
            {posts.map((p, i) => (
              <div key={i} className="py-3 flex items-start gap-4">
                <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-surface-warm)] shrink-0 mt-0.5">
                  {p.platform}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] mb-1 truncate">{p.caption}</p>
                  <p className="mono text-[11px] text-[var(--color-text-muted)]">
                    {p.account ? `@${p.account} · ` : ""}
                    {p.when}
                    {p.reach ? ` · ${p.reach.toLocaleString("en-IN")} reach` : ""}
                    {p.engagement ? ` · ${p.engagement} engagement` : ""}
                  </p>
                </div>
                {p.status === "drafted" ? (
                  <Pill tone="warn">Draft</Pill>
                ) : p.status === "scheduled" ? (
                  <Pill tone="neutral">Scheduled</Pill>
                ) : p.status === "live" ? (
                  <Pill tone="success">Live</Pill>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function WhatsAppTab({ data }: { data: ClientData }) {
  if (!data.whatsapp) return <EmptyState label="WhatsApp" />;
  return (
    <div className="space-y-6">
      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="WhatsApp funnel · 7 days"
          title="From chat to booking"
          right="Auto-reply fires <2 min"
        />
        <div className="space-y-3">
          {data.whatsapp.funnel.map((f) => (
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
        {data.whatsapp.note && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-4 italic">{data.whatsapp.note}</p>
        )}
      </div>
    </div>
  );
}

export function ReviewsTab({ data }: { data: ClientData }) {
  if (!data.reviews) return <EmptyState label="Reviews" />;
  const { stats, stream } = data.reviews;
  return (
    <div className="space-y-6">
      <KpiGrid kpis={stats} />
      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="Review stream"
          title="Recent reviews · across platforms"
          right={stream.some((r) => r.urgent) ? "1 needs your callback" : "All responded"}
        />
        <div className="grid md:grid-cols-2 gap-3">
          {stream.map((r, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                r.urgent
                  ? "border-[#DC2626]/40 bg-[#FEF2F2]"
                  : "border-[var(--color-line)] bg-[var(--color-surface-warm)]"
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
              <p className="text-sm leading-relaxed mb-1">&quot;{r.snippet}&quot;</p>
              <p className="mono text-[10px] text-[var(--color-text-muted)]">{r.when}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PipelineTab({ data }: { data: ClientData }) {
  if (!data.pipeline) return <EmptyState label="Pipeline" />;
  return (
    <div className="space-y-6">
      {data.pipeline.stages.map((stage, i) => (
        <div key={i} className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
                Stage {i + 1}
              </p>
              <h3 className="text-base font-medium">{stage.stage}</h3>
            </div>
            <Pill tone={stage.count > 0 ? "success" : "neutral"}>{String(stage.count)}</Pill>
          </div>
          {stage.items.length === 0 ? (
            <p className="text-[13px] text-[var(--color-text-muted)] italic">Nobody here yet.</p>
          ) : (
            <div className="divide-y divide-[var(--color-line)]">
              {stage.items.map((item, j) => (
                <div key={j} className="py-2.5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium">{item.name}</p>
                    <p className="text-[12px] text-[var(--color-text-secondary)]">{item.note}</p>
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

export function OpsTab({ data }: { data: ClientData }) {
  if (!data.ops) return <EmptyState label="Ops" />;
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <SectionHeader
        eyebrow="What shipped · This week"
        title={`${data.ops.log.length} actions logged`}
      />
      <div className="divide-y divide-[var(--color-line)]">
        {data.ops.log.map((a, i) => (
          <ActivityCard key={i} a={a} />
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("copied");
          setTimeout(() => setState("idle"), 1500);
        } catch {}
      }}
      className="mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-[var(--color-line)] hover:border-[var(--color-primary-blue)]/40 hover:bg-[var(--color-surface-warm)] transition-colors"
    >
      {state === "copied" ? "Copied ✓" : label}
    </button>
  );
}

function DraftCard({ draft }: { draft: DraftTemplate }) {
  const [queued, setQueued] = useState(false);
  const typeStyle: Record<DraftTemplate["type"], string> = {
    email: "bg-[#EEF4FF] text-[#1A5FD4]",
    whatsapp: "bg-[#ECFDF3] text-[#15803D]",
    "linkedin-post": "bg-[#EEF4FF] text-[#1A5FD4]",
    "linkedin-dm": "bg-[#EEF4FF] text-[#1A5FD4]",
    "x-tweet": "bg-black/5 text-black",
    "x-thread": "bg-black/5 text-black",
    blog: "bg-[#FFFBEB] text-[#B45309]",
  };
  return (
    <div className="p-4 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${typeStyle[draft.type]}`}
          >
            {draft.type}
          </span>
          <span className="mono text-[10px] text-[var(--color-text-muted)]">→ {draft.audience}</span>
          {draft.length && (
            <span className="mono text-[10px] text-[var(--color-text-muted)]">· {draft.length}</span>
          )}
        </div>
        {draft.status === "ready" ? (
          <Pill tone="success">Ready</Pill>
        ) : draft.status === "needs-edit" ? (
          <Pill tone="warn">Needs edit</Pill>
        ) : (
          <Pill tone="neutral">Experiment</Pill>
        )}
      </div>
      <h4 className="text-[14px] font-medium mb-1.5">{draft.title}</h4>
      <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {draft.preview}
      </p>
      <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-line)]">
        <CopyButton text={draft.preview} label="Copy preview" />
        <button
          type="button"
          onClick={() => setQueued(!queued)}
          className={`mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border transition-colors ${
            queued
              ? "border-[#15803D]/40 bg-[#ECFDF3] text-[#15803D]"
              : "border-[var(--color-line)] hover:border-[var(--color-primary-blue)]/40 hover:bg-[var(--color-surface-warm)]"
          }`}
        >
          {queued ? "✓ Queued to send" : "Queue to send"}
        </button>
        {draft.path && (
          <span className="ml-auto mono text-[10px] text-[var(--color-text-muted)] truncate">
            {draft.path.split("/").slice(-2).join("/")}
          </span>
        )}
      </div>
    </div>
  );
}

function TouchRow({ touch }: { touch: OutreachTouch }) {
  const channelIcon: Record<OutreachTouch["channel"], string> = {
    email: "✉",
    whatsapp: "WA",
    linkedin: "in",
    x: "X",
    "in-person": "◉",
    phone: "☎",
  };
  return (
    <div className="flex items-center gap-4 py-2.5 border-b border-[var(--color-line)] last:border-b-0 text-[13px]">
      <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] w-10">
        {channelIcon[touch.channel]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{touch.target}</p>
        <p className="text-[11px] text-[var(--color-text-secondary)] truncate">{touch.preview}</p>
      </div>
      <span className="mono text-[10px] text-[var(--color-text-muted)] shrink-0">
        {touch.sentAt || "—"}
      </span>
      <Pill
        tone={
          touch.status === "replied" || touch.status === "booked" || touch.status === "closed-won"
            ? "success"
            : touch.status === "sent" || touch.status === "opened"
            ? "neutral"
            : touch.status === "closed-lost"
            ? "risk"
            : "warn"
        }
      >
        {touch.status}
      </Pill>
    </div>
  );
}

export function OutreachTab({ data }: { data: ClientData }) {
  if (!data.outreach) return <EmptyState label="Outreach" />;
  const { kpis, drafts, touches } = data.outreach;

  const byType = drafts.reduce<Record<string, DraftTemplate[]>>((acc, d) => {
    acc[d.type] = acc[d.type] || [];
    acc[d.type].push(d);
    return acc;
  }, {});
  const typeOrder: DraftTemplate["type"][] = [
    "linkedin-post",
    "x-tweet",
    "x-thread",
    "email",
    "whatsapp",
    "blog",
    "linkedin-dm",
  ];

  return (
    <div className="space-y-6">
      <KpiGrid kpis={kpis} />

      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="Drafts ready to fire"
          title="Everything stays in this tab"
          right={`${drafts.length} drafts · copy or queue — no external apps open`}
        />
        {typeOrder
          .filter((t) => byType[t]?.length)
          .map((t) => (
            <div key={t} className="mb-6 last:mb-0">
              <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-3">
                {t.replace("-", " ")}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {byType[t].map((d) => (
                  <DraftCard key={d.id} draft={d} />
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
        <SectionHeader
          eyebrow="Outbound log"
          title="Every touch we've sent"
          right={touches.length === 0 ? "nothing sent yet" : `${touches.length} touches`}
        />
        {touches.length === 0 ? (
          <EmptyState label="No touches yet" sub="Queue a draft above, then green-light the send from Overview." />
        ) : (
          <div>
            {touches.map((t) => (
              <TouchRow key={t.id} touch={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);
  const tempColor: Record<Lead["temperature"], Parameters<typeof Pill>[0]["tone"]> = {
    cold: "neutral",
    warm: "warn",
    engaged: "success",
    qualified: "success",
    disqualified: "risk",
  };
  return (
    <div className="border-b border-[var(--color-line)] last:border-b-0">
      <div
        className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.6fr] gap-3 px-5 py-3 text-[13px] items-center cursor-pointer hover:bg-[var(--color-surface-warm)]"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-medium truncate">{lead.name}</span>
        <span className="mono text-[11px] text-[var(--color-text-secondary)] truncate">
          {lead.role || lead.vertical}
        </span>
        <span className="mono text-[11px] text-[var(--color-text-secondary)] truncate">
          {lead.city}
        </span>
        <Pill tone={tempColor[lead.temperature]}>{lead.temperature}</Pill>
        <span className="text-right mono text-[10px] text-[var(--color-text-muted)]">
          {expanded ? "▾" : "▸"}
        </span>
      </div>
      {expanded && (
        <div className="px-5 pb-4 bg-[var(--color-surface-warm)] grid md:grid-cols-[1fr_1fr] gap-4 text-[12.5px]">
          <div className="space-y-1">
            <p>
              <span className="text-[var(--color-text-muted)]">Email:</span>{" "}
              {lead.email ? (
                <>
                  <span className="font-mono">{lead.email}</span>{" "}
                  <CopyButton text={lead.email} label="Copy" />
                </>
              ) : (
                <span className="text-[#DC2626]">missing — scrape from GMB / website</span>
              )}
            </p>
            <p>
              <span className="text-[var(--color-text-muted)]">Phone:</span>{" "}
              {lead.phone ? (
                <>
                  <span className="font-mono">{lead.phone}</span>{" "}
                  <CopyButton text={lead.phone} label="Copy" />
                </>
              ) : (
                <span className="text-[#DC2626]">missing</span>
              )}
            </p>
            <p>
              <span className="text-[var(--color-text-muted)]">LinkedIn:</span>{" "}
              {lead.linkedin ? (
                <>
                  <span className="font-mono">{lead.linkedin}</span>{" "}
                  <CopyButton text={lead.linkedin} label="Copy" />
                </>
              ) : (
                <span className="text-[#DC2626]">missing</span>
              )}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <span className="text-[var(--color-text-muted)]">Source:</span> {lead.source}
            </p>
            <p>
              <span className="text-[var(--color-text-muted)]">Next action:</span>{" "}
              {lead.nextAction || "—"}
            </p>
            <p>
              <span className="text-[var(--color-text-muted)]">Last touch:</span>{" "}
              {lead.lastTouchAt || "never"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function LeadsTab({ data }: { data: ClientData }) {
  if (!data.leads) return <EmptyState label="Leads" />;
  const { kpis, leads } = data.leads;
  const [filter, setFilter] = useState<"all" | Lead["temperature"]>("all");
  const visible = filter === "all" ? leads : leads.filter((l) => l.temperature === filter);
  const temps: ("all" | Lead["temperature"])[] = [
    "all",
    "cold",
    "warm",
    "engaged",
    "qualified",
  ];
  return (
    <div className="space-y-6">
      <KpiGrid kpis={kpis} />

      <div className="border border-[var(--color-line)] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
              Lead list · click a row to expand
            </p>
            <h3 className="text-base font-medium">
              {visible.length} lead{visible.length === 1 ? "" : "s"}
              {filter !== "all" && (
                <span className="ml-2 mono text-[11px] text-[var(--color-text-muted)]">
                  (filter: {filter})
                </span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {temps.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border ${
                  filter === t
                    ? "border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]/10 text-[var(--color-primary-blue)]"
                    : "border-[var(--color-line)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-warm)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.6fr] gap-3 px-5 py-2 bg-[var(--color-surface-warm)] border-b border-[var(--color-line)] mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          <span>Name</span>
          <span>Role / vertical</span>
          <span>City</span>
          <span>Temp</span>
          <span />
        </div>

        {visible.map((l) => (
          <LeadRow key={l.id} lead={l} />
        ))}
      </div>
    </div>
  );
}

export function SourcesTab({ data }: { data: ClientData }) {
  if (!data.sources) return <EmptyState label="Sources" />;
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <SectionHeader
        eyebrow="Data sources"
        title="Connection status"
        right={`${data.sources.sources.filter((s) => s.status === "live").length}/${data.sources.sources.length} live`}
      />
      <div className="divide-y divide-[var(--color-line)]">
        {data.sources.sources.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2.5">
            <span className="text-[13.5px]">{s.label}</span>
            <SourceStatusPill status={s.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="p-10 border border-dashed border-[var(--color-line)] rounded-xl bg-white text-center">
      <p className="text-base font-medium mb-2">{label} — no data yet</p>
      {sub && <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">{sub}</p>}
    </div>
  );
}
