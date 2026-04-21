/**
 * TEMPLATE — copy this file to <slug>.ts and fill it in for a new client.
 *
 * Slug convention: kebab-case, no spaces. Used in URL (/client/<slug>) and
 * as the map key in registry.ts.
 *
 * The TypeScript type system tells you what's required. Every optional
 * section you delete = one fewer tab on the dashboard.
 *
 * After creating <slug>.ts:
 *   1. Register it in data/registry.ts   (one-line import + entry)
 *   2. If private, add slug to PRIVATE_CLIENT_SLUGS in proxy.ts (root)
 *   3. Visit /client/<slug>
 *
 * Live data (optional): fill the liveFeeds block with the client's
 * GA4 property id + Vercel project id. Add our shared service-account
 * email as Reader on their GA property. Done.
 */

// --- ACTIVATE: rename this import alias + export to the client's slug --- //
import type { ClientData } from "./types";

export const _template: ClientData = {
  meta: {
    slug: "REPLACE-ME-slug",
    name: "Client Display Name",
    location: "City · Area",
    bundle: "growth", // "local-starter" | "growth" | "total-growth" | "internal"
    weekLabel: "14 – 21 April 2026",
    onboarded: "Onboarded DD MMM YYYY",
    healthLabel: "Healthy · 78/100",
    bannerNote: "One-line framing — appears under the dashboard title.",
  },

  auth: "public", // "public" = anyone with link. "private" = gated by proxy.ts

  // --- LIVE DATA (optional, delete block if not ready) ---------------- //
  // Each fetcher pulls real numbers and overlays them onto the hardcoded
  // values below. See app/client/data/fetchers/README.md.
  liveFeeds: {
    ga4: {
      propertyId: "REPLACE-with-GA4-numeric-property-id",
    },
    vercelAnalytics: {
      projectId: "REPLACE-with-prj_XXX",
      teamId: "REPLACE-or-remove",
      siteUrl: "client.com",
    },
  },

  // --- OVERVIEW (required, drives Overview tab) ----------------------- //
  overview: {
    kpis: [
      { label: "Leads (7d)", value: "0", tone: "ink" },
      { label: "Blended CPL", value: "—", tone: "ink" },
      { label: "Needs you", value: "0", tone: "neutral" },
    ],
    // Optional: leave any of these out to hide that part of the Overview
    charts: {
      leadsDaily: [0, 0, 0, 0, 0, 0, 0],
      cplTrend: [0, 0, 0, 0, 0, 0, 0],
      channelMix: [
        { name: "Meta Ads", leads: 0, color: "#1A5FD4" },
        { name: "Google Ads", leads: 0, color: "#F46B2C" },
      ],
    },
    weeklyFocus: ["Add first this-week focus item"],
  },

  // --- ADS TAB (optional, delete if not running ads yet) -------------- //
  ads: {
    kpis: [
      { label: "Meta spend", value: "₹0" },
      { label: "Google spend", value: "₹0" },
    ],
    campaigns: [
      // { name: "Meta · Campaign", spend: "₹0", leads: 0, cpl: "₹0", roas: "0x", status: "winning", trend: "+0%" }
    ],
  },

  // --- ORGANIC TAB (optional: GMB / SEO / site traffic) --------------- //
  organic: {
    // gmbStats: [{ label: "Profile views", value: "0", delta: "—" }],
    // seoKeywords: [{ kw: "keyword", rank: 0, prev: 0, vol: "0" }],
    siteTraffic: {
      visits7d: null, // null = "—"; will populate from GA4 if liveFeeds configured
      topPages: [{ path: "/", pageviews: 0 }],
      topReferrers: [{ source: "direct", visits: 0 }],
    },
  },

  // --- SOCIAL TAB (optional) ------------------------------------------ //
  // social: {
  //   stats: [{ label: "Posts (7d)", value: "0" }],
  //   posts: [],
  // },

  // --- WHATSAPP TAB (optional — only for clients with WA business) ---- //
  // whatsapp: {
  //   funnel: [
  //     { stage: "Inbound chats", count: 0, pct: 100 },
  //     { stage: "Captured as lead", count: 0, pct: 0 },
  //   ],
  //   note: "—",
  // },

  // --- REVIEWS TAB (optional — for clients with GMB / JustDial) ------- //
  // reviews: {
  //   stats: [{ label: "Avg rating", value: "—" }],
  //   stream: [],
  // },

  // --- OUTREACH TAB (optional — for clients doing outbound) ----------- //
  // outreach: {
  //   kpis: [{ label: "Drafts ready", value: "0", tone: "ink" }],
  //   drafts: [],
  //   touches: [],
  // },

  // --- LEADS TAB (optional — pipeline prospects) ---------------------- //
  // leads: {
  //   kpis: [{ label: "Total leads", value: "0", tone: "ink" }],
  //   leads: [],
  // },

  // --- SOURCES TAB (optional — data-source connection status) --------- //
  sources: {
    sources: [
      { label: "Google Analytics", status: "not-yet" }, // "live" | "pending" | "manual" | "not-yet"
      { label: "Vercel Analytics", status: "not-yet" },
      { label: "Meta Ads", status: "not-yet" },
      { label: "Google Ads", status: "not-yet" },
    ],
  },
};
