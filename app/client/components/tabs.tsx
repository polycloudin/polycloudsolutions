import type { ClientData, ActivityEntry } from "../data/types";
import { Pill, KpiGrid, SectionHeader, SourceStatusPill } from "./primitives";
import { LeadsChart, CplChart, ChannelMix } from "./charts";

function ActivityKind({ kind }: { kind?: ActivityEntry["kind"] }) {
  if (kind === "urgent") return <Pill tone="risk">Urgent</Pill>;
  if (kind === "needs") return <Pill tone="warn">Needs you</Pill>;
  if (kind === "ship") return <Pill tone="success">Shipped</Pill>;
  if (kind === "build") return <Pill tone="neutral">Built</Pill>;
  return (
    <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
      Auto
    </span>
  );
}

export function OverviewTab({ data }: { data: ClientData }) {
  const o = data.overview;
  return (
    <div className="space-y-6">
      <KpiGrid kpis={o.kpis} />

      {o.charts?.leadsDaily || o.charts?.cplTrend ? (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          {o.charts?.leadsDaily && <LeadsChart data={o.charts.leadsDaily} />}
          {o.charts?.cplTrend && <CplChart data={o.charts.cplTrend} />}
        </div>
      ) : null}

      {o.charts?.channelMix && <ChannelMix channels={o.charts.channelMix} />}

      {o.autopilotActivity && o.autopilotActivity.length > 0 && (
        <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
          <SectionHeader
            eyebrow="Autopilot activity · This week"
            title="What we did while you slept"
            right={`${o.autopilotActivity.length} actions`}
          />
          <div className="divide-y divide-[var(--color-line)]">
            {o.autopilotActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-4 py-3">
                <span className="mono text-[11px] text-[var(--color-text-muted)] w-24 shrink-0">
                  {a.time}
                </span>
                <p className="flex-1 text-[13.5px] leading-relaxed">{a.text}</p>
                <ActivityKind kind={a.kind} />
              </div>
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
          <div key={i} className="flex items-start gap-4 py-3">
            <span className="mono text-[11px] text-[var(--color-text-muted)] w-32 shrink-0">
              {a.time}
            </span>
            <p className="flex-1 text-[13.5px] leading-relaxed">{a.text}</p>
            <ActivityKind kind={a.kind} />
          </div>
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
