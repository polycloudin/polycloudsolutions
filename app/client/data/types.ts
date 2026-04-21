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

// --- Outreach (drafts, queued, sent, replied) ---
export type OutreachChannel = "email" | "whatsapp" | "linkedin" | "x" | "in-person" | "phone";
export type OutreachStatus = "draft" | "queued" | "sent" | "opened" | "replied" | "booked" | "closed-won" | "closed-lost";

export interface OutreachTouch {
  id: string;
  channel: OutreachChannel;
  target: string; // lead name or handle
  subject?: string;
  preview: string;
  status: OutreachStatus;
  sentAt?: string;
  repliedAt?: string;
  notes?: string;
}

// --- Leads (the people we're targeting) ---
export type LeadTemperature = "cold" | "warm" | "engaged" | "qualified" | "disqualified";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  role?: string;
  vertical: string;
  city: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  source: string; // "scraped-maps" / "referral" / "website-form"
  temperature: LeadTemperature;
  lastTouchAt?: string;
  nextAction?: string;
}

// --- Draft templates (ready-to-fire content) ---
export interface DraftTemplate {
  id: string;
  type: "email" | "whatsapp" | "linkedin-post" | "linkedin-dm" | "x-tweet" | "x-thread" | "blog";
  title: string;
  audience: string; // "CA firms" / "textile traders" / "broad"
  preview: string; // first 120 chars
  length?: string; // "12 tweets" / "150 words" / "3 paragraphs"
  path?: string; // filesystem path to full text
  status: "ready" | "needs-edit" | "experiment";
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

// --- Live feed config (per-client) ---
// Each client declares which live data sources to pull from. Credentials stay
// in server-side env vars (shared across clients for now — e.g. one GA service
// account with Reader role on every property we manage). The client-specific
// IDs live in data/<slug>.ts so adding a new client is a copy-paste.
export interface LiveFeedConfig {
  ga4?: {
    propertyId: string; // e.g. "533972528"
  };
  vercelAnalytics?: {
    projectId: string; // e.g. "prj_o9xnq4hIB1xOByHQHyUqizDbXa6z"
    teamId?: string;   // e.g. "team_IOg3Xvssr5P5GKJ1fuLazWfO"
    siteUrl?: string;  // e.g. "polycloud.in" — for top-page path display
  };
}

export interface OutreachSection {
  kpis: KPI[];
  touches: OutreachTouch[]; // every outbound message (draft/queued/sent)
  drafts: DraftTemplate[];  // content ready to fire
}

export interface LeadsSection {
  kpis: KPI[];
  leads: Lead[];
}

// --- Full client record ---
export interface ClientData {
  meta: ClientMeta;
  auth: Auth;
  liveFeeds?: LiveFeedConfig;
  overview: OverviewSection;
  ads?: AdsSection;
  organic?: OrganicSection;
  social?: SocialSection;
  whatsapp?: WhatsAppSection;
  reviews?: ReviewsSection;
  pipeline?: PipelineSection;
  ops?: OpsSection;
  sources?: SourcesSection;
  outreach?: OutreachSection;
  leads?: LeadsSection;
}
