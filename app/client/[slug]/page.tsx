"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Pill } from "../components/primitives";
import {
  OverviewTab,
  AdsTab,
  OrganicTab,
  SocialTab,
  WhatsAppTab,
  ReviewsTab,
  PipelineTab,
  OpsTab,
  SourcesTab,
  OutreachTab,
  LeadsTab,
} from "../components/tabs";
import { getClient } from "../data/registry";
import type { ClientData } from "../data/types";

type TabId =
  | "overview"
  | "outreach"
  | "leads"
  | "ads"
  | "organic"
  | "social"
  | "whatsapp"
  | "reviews"
  | "pipeline"
  | "ops"
  | "sources";

/**
 * Build the list of available tabs for a client based on which data
 * sections exist. Order is consistent; empty sections are omitted.
 */
function tabsFor(data: ClientData): { id: TabId; label: string; count?: string }[] {
  const all: { id: TabId; label: string; count?: string; when: boolean }[] = [
    { id: "overview", label: "Overview", when: true },
    {
      id: "outreach",
      label: "Outreach",
      count: data.outreach ? String(data.outreach.drafts.length) : undefined,
      when: !!data.outreach,
    },
    {
      id: "leads",
      label: "Leads",
      count: data.leads ? String(data.leads.leads.length) : undefined,
      when: !!data.leads,
    },
    { id: "ads", label: "Ads", count: data.ads ? String(data.ads.campaigns.length) : undefined, when: !!data.ads },
    { id: "organic", label: "Organic", when: !!data.organic },
    { id: "social", label: "Social", count: data.social ? String(data.social.posts.length) : undefined, when: !!data.social },
    { id: "whatsapp", label: "WhatsApp", when: !!data.whatsapp },
    { id: "reviews", label: "Reviews", count: data.reviews ? String(data.reviews.stream.length) : undefined, when: !!data.reviews },
    { id: "pipeline", label: "Pipeline", when: !!data.pipeline },
    { id: "ops", label: "Ops", when: !!data.ops },
    { id: "sources", label: "Sources", when: !!data.sources },
  ];
  return all.filter((t) => t.when);
}

export default function ClientDashboardPage() {
  const { slug } = useParams<{ slug: string }>();
  const baseline = useMemo(() => getClient(slug), [slug]);
  const [data, setData] = useState<ClientData | null>(baseline);
  const [liveStatus, setLiveStatus] = useState<"idle" | "fetching" | "live" | "fallback">(
    baseline?.liveFeeds ? "fetching" : "idle"
  );
  const tabs = useMemo(() => (data ? tabsFor(data) : []), [data]);
  const [tab, setTab] = useState<TabId>("overview");

  // Fetch live-overlay data from /api/live/<slug> if the client has liveFeeds.
  // Falls back silently to the registry baseline if the API errors or returns
  // no overlay.
  useEffect(() => {
    if (!baseline?.liveFeeds) {
      setLiveStatus("idle");
      return;
    }
    let cancelled = false;
    setLiveStatus("fetching");
    fetch(`/api/live/${slug}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((live: ClientData | null) => {
        if (cancelled) return;
        if (live) {
          setData(live);
          setLiveStatus("live");
        } else {
          setLiveStatus("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setLiveStatus("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, [slug, baseline?.liveFeeds]);

  if (!data) notFound();

  const m = data.meta;

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
              {data.auth === "private" ? "Internal" : m.bundle === "internal" ? "Internal" : m.bundle.replace("-", " ") + " bundle"} · {m.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {liveStatus !== "idle" && (
              <span
                className="mono text-[10px] uppercase tracking-wider hidden md:inline"
                style={{
                  color:
                    liveStatus === "live"
                      ? "#15803D"
                      : liveStatus === "fetching"
                      ? "#B45309"
                      : "#DC2626",
                }}
              >
                {liveStatus === "live" ? "● live" : liveStatus === "fetching" ? "● fetching" : "● fallback"}
              </span>
            )}
            <span className="mono text-[11px] text-[var(--color-text-secondary)] hidden md:inline">
              Week of {m.weekLabel}
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
              {m.location}
            </p>
            <h1 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05]">{m.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            {m.healthLabel && (
              <Pill tone={data.auth === "private" ? "warn" : "success"}>{m.healthLabel}</Pill>
            )}
            <span className="mono text-[11px] text-[var(--color-text-muted)] hidden md:inline">
              {m.onboarded}
            </span>
          </div>
        </div>
        {m.bannerNote && (
          <p className="text-sm text-[var(--color-text-secondary)] max-w-2xl">{m.bannerNote}</p>
        )}
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
        {tab === "overview" && <OverviewTab data={data} />}
        {tab === "outreach" && <OutreachTab data={data} />}
        {tab === "leads" && <LeadsTab data={data} />}
        {tab === "ads" && <AdsTab data={data} />}
        {tab === "organic" && <OrganicTab data={data} />}
        {tab === "social" && <SocialTab data={data} />}
        {tab === "whatsapp" && <WhatsAppTab data={data} />}
        {tab === "reviews" && <ReviewsTab data={data} />}
        {tab === "pipeline" && <PipelineTab data={data} />}
        {tab === "ops" && <OpsTab data={data} />}
        {tab === "sources" && <SourcesTab data={data} />}

        <p className="mt-10 mono text-[10px] text-[var(--color-text-muted)] tracking-[0.14em] text-center">
          {data.auth === "private" ? (
            <>
              DOGFOOD — Data entered manually until connectors ship. Edit numbers in{" "}
              <code className="font-mono">app/client/data/{m.slug}.ts</code>, commit, merge.
            </>
          ) : (
            <>ILLUSTRATIVE — Client name + metrics anonymised. Structure and data ranges mirror real dashboards we ship weekly.</>
          )}
        </p>
      </main>
    </div>
  );
}
