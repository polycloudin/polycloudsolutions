import type { ClientData } from "./types";

/**
 * PolyCloud's own-brand dogfood dashboard.
 *
 * Numbers here are HAND-CURATED, not live yet. Update weekly (or after
 * each shipped change) by editing this file and pushing.
 *
 * Phase 2 will wire Vercel Analytics (site traffic), Resend (form submits),
 * and X/LinkedIn APIs (social) to populate these sections automatically.
 */
export const polycloud: ClientData = {
  meta: {
    slug: "polycloud",
    name: "PolyCloud Solutions",
    location: "Hyderabad · Secunderabad",
    bundle: "internal",
    weekLabel: "14 – 21 April 2026",
    onboarded: "Site live 7 Apr · Dashboard started 21 Apr",
    healthLabel: "Dogfooding · manual data",
    bannerNote:
      "We use this dashboard before we sell it — if it doesn't make our Monday morning easier, it won't make a client's easier.",
  },
  auth: "private",

  overview: {
    kpis: [
      { label: "polycloud.in visits (7d)", value: "—", tone: "ink", delta: "Vercel Analytics · pending" },
      { label: "Form submits (7d)", value: "0", tone: "ink", delta: "first pilot convo" },
      { label: "Discovery calls booked", value: "1", tone: "success", delta: "Aasrith network" },
      { label: "Pilots in discussion", value: "2", tone: "success", delta: "+2 this week" },
      { label: "Paying clients", value: "0", tone: "neutral", delta: "Q2 target: 5" },
    ],
    weeklyFocus: [
      "Publish the first LinkedIn post drafted yesterday (VK personal)",
      "Wire up Vercel Analytics so site visits are automated",
      "Follow up on CA-firm pilot — meeting Monday, draft agenda",
      "Send sample dashboard (/client/kumar-textiles) to jewellery SMB",
      "Connect @polycloudin + @viratkota to browser-harness queue",
    ],
  },

  social: {
    stats: [
      { label: "Posts published", value: "0", delta: "first drops this week" },
      { label: "Drafts queued", value: "1" },
      { label: "Followers (X)", value: "—", delta: "handle unclaimed" },
      { label: "Followers (LI)", value: "—", delta: "page unclaimed" },
    ],
    posts: [
      {
        platform: "LinkedIn",
        account: "viratkota",
        caption:
          "Dropping the first cut of the PolyCloud dashboard — one URL, every channel, Autopilot running the ops...",
        when: "Drafted · needs publish",
        status: "drafted",
      },
    ],
  },

  organic: {
    siteTraffic: {
      visits7d: null,
      topPages: [
        { path: "/", pageviews: 0 },
        { path: "/digital", pageviews: 0 },
        { path: "/client/kumar-textiles", pageviews: 0 },
        { path: "/consulting", pageviews: 0 },
      ],
      topReferrers: [
        { source: "direct", visits: 0 },
        { source: "linkedin.com", visits: 0 },
        { source: "t.co (X)", visits: 0 },
        { source: "google.com", visits: 0 },
      ],
    },
  },

  pipeline: {
    stages: [
      { stage: "Cold / prospect", count: 0, items: [] },
      {
        stage: "Discovery scheduled",
        count: 1,
        items: [{ name: "Pilot #1 (Aasrith's network)", note: "First call this week", since: "21 Apr" }],
      },
      {
        stage: "Pilot negotiation",
        count: 2,
        items: [
          { name: "Hyderabad jewellery SMB", note: "Asked for sample dashboard → sent /client/kumar-textiles", since: "18 Apr" },
          { name: "CA firm (warm intro)", note: "Interested in Local Starter · meeting Monday", since: "20 Apr" },
        ],
      },
      { stage: "Pilot active", count: 0, items: [] },
      { stage: "Paying client", count: 0, items: [] },
    ],
  },

  ops: {
    log: [
      { time: "Mon 21 Apr · 10:02", kind: "ship", text: "Shipped /digital pricing alignment to live bundles (₹70K/₹1.5L/₹3L setup)" },
      { time: "Mon 21 Apr · 13:18", kind: "build", text: "Added Meta + Google ads connector scaffolds (agentOS/digital/templates/ads-management)" },
      { time: "Mon 21 Apr · 14:02", kind: "ship", text: "Embedded dashboard demo on /digital using GSTR-2B section pattern" },
      { time: "Mon 21 Apr · 14:21", kind: "ship", text: "Reframed /digital copy as product-led ('we run it, you read it')" },
      { time: "Mon 21 Apr · 14:40", kind: "ship", text: "Shipped /client/kumar-textiles full-screen dashboard with 6 interactive tabs" },
      { time: "Mon 21 Apr · 17:15", kind: "ship", text: "Claude → Autopilot scrub + auth gate on /client/polycloud" },
      { time: "Mon 21 Apr · 18:30", kind: "ship", text: "Added Nano Banana + Kling AI to Social Content module" },
      { time: "Mon 21 Apr · 19:00", kind: "ship", text: "GA4 tracking wired (env-gated) + social handles in site footer" },
      { time: "Mon 21 Apr · 19:30", kind: "build", text: "Refactored /client/* into data-driven [slug] route with type-safe ClientData" },
    ],
  },

  sources: {
    sources: [
      { label: "Vercel Analytics (polycloud.in)", status: "pending" },
      { label: "Formsubmit inbound (contact form)", status: "manual" },
      { label: "X @polycloudin", status: "pending" },
      { label: "X @viratkota", status: "pending" },
      { label: "LinkedIn · PolyCloud Solutions", status: "pending" },
      { label: "LinkedIn · Virat Kota", status: "pending" },
      { label: "Meta Ads (PolyCloud)", status: "not-yet" },
      { label: "Google Ads (PolyCloud)", status: "not-yet" },
      { label: "GMB", status: "not-yet" },
    ],
  },
};
