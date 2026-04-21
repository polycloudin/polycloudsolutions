/**
 * Shared dashboard data shape.
 *
 * Every client has a slug + meta + auth level, then a subset of optional
 * sections (overview, ads, organic, social, whatsapp, reviews, content,
 * site, pipeline, ops, sources). The dashboard renders only the tabs that
 * have data — different bundles show different tabs.
 */

export type Bundle = "local-starter" | "growth" | "total-growth" | "internal";
export type Auth = "public" | "private";
export type Tone = "ink" | "success" | "risk" | "warn" | "neutral";
export type SourceStatus = "live" | "pending" | "manual" | "not-yet";

export interface ClientMeta {
  slug: string;
  name: string;
  location: string;
  bundle: Bundle;
  weekLabel: string;
  onboarded: string;
  healthLabel?: string;
  bannerNote?: string;
}

export interface KPI {
  label: string;
  value: string;
  tone?: Tone;
  delta?: string;
}

// --- Ads tab ---
export interface AdCampaign {
  name: string;
  spend: string;
  leads: number;
  cpl: string;
  roas: string;
  status: "winning" | "watch" | "paused";
  trend?: string;
}

// --- Charts ---
export interface ChartBundle {
  leadsDaily?: number[]; // 7 bars, Mon-Sun
  cplTrend?: number[]; // 7 points, weekly line
  channelMix?: { name: string; leads: number; color: string }[];
}

// --- Organic (SEO + GMB + site traffic) ---
export interface SeoKeyword {
  kw: string;
  rank: number;
  prev: number;
  vol: string;
}

export interface SiteTraffic {
  visits7d: number | null;
  topPages: { path: string; pageviews: number }[];
  topReferrers: { source: string; visits: number }[];
}

// --- Social ---
export interface SocialPost {
  platform: "IG" | "FB" | "LinkedIn" | "X" | "YouTube";
  account?: string;
  caption: string;
  reach?: number;
  engagement?: string;
  when: string;
  status?: "live" | "drafted" | "scheduled";
}

// --- WhatsApp funnel ---
export interface WaFunnelStage {
  stage: string;
  count: number;
  pct: number;
}

// --- Reviews ---
export interface Review {
  platform: string;
  author: string;
  rating: number;
  snippet: string;
  when: string;
  responded?: boolean;
  urgent?: boolean;
}

// --- Activity / ops log ---
export interface ActivityEntry {
  time: string;
  text: string;
  kind?: "auto" | "needs" | "urgent" | "ship" | "build";
}

// --- Pipeline (internal) ---
export interface PipelineStage {
  stage: string;
  count: number;
  items: { name: string; note: string; since: string }[];
}

// --- Connection status ---
export interface DataSource {
  label: string;
  status: SourceStatus;
}

// --- Tab sections ---
export interface OverviewSection {
  kpis: KPI[];
  charts?: ChartBundle;
  autopilotActivity?: ActivityEntry[];
  weeklyFocus?: string[];
  healthLabel?: string;
}

export interface AdsSection {
  kpis: KPI[];
  campaigns: AdCampaign[];
  charts?: ChartBundle;
}

export interface OrganicSection {
  gmbStats?: KPI[];
  seoKeywords?: SeoKeyword[];
  siteTraffic?: SiteTraffic;
}

export interface SocialSection {
  stats?: KPI[];
  posts: SocialPost[];
}

export interface WhatsAppSection {
  funnel: WaFunnelStage[];
  note?: string;
}

export interface ReviewsSection {
  stats: KPI[];
  stream: Review[];
}

export interface PipelineSection {
  stages: PipelineStage[];
}

export interface OpsSection {
  log: ActivityEntry[];
}

export interface SourcesSection {
  sources: DataSource[];
}

// --- Full client record ---
export interface ClientData {
  meta: ClientMeta;
  auth: Auth;
  overview: OverviewSection;
  ads?: AdsSection;
  organic?: OrganicSection;
  social?: SocialSection;
  whatsapp?: WhatsAppSection;
  reviews?: ReviewsSection;
  pipeline?: PipelineSection;
  ops?: OpsSection;
  sources?: SourcesSection;
}
