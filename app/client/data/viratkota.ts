import type { ClientData } from "./types";

/**
 * VK personal brand dashboard.
 * "I build the systems that run while you sleep."
 *
 * Gated (private) until there's something worth showing publicly.
 * Numbers are hand-curated. When X/LinkedIn API access lands, flip the
 * Social KPIs to live via /api/live/viratkota.
 */
export const viratkota: ClientData = {
  meta: {
    slug: "viratkota",
    name: "Virat Kota",
    location: "Hyderabad",
    bundle: "internal",
    weekLabel: "14 – 21 April 2026",
    onboarded: "Brand started 21 Apr 2026",
    healthLabel: "Ramp · 0 followers baseline",
    bannerNote:
      "Personal brand track — same operator approach we sell to SMBs, but aimed at founder distribution (X + LinkedIn). Eats our own dog food.",
  },

  auth: "private",

  // Shared with polycloud.in — site content lives on same property.
  liveFeeds: {
    ga4: {
      propertyId: "533972528",
    },
    vercelAnalytics: {
      projectId: "prj_o9xnq4hIB1xOByHQHyUqizDbXa6z",
      teamId: "team_IOg3Xvssr5P5GKJ1fuLazWfO",
      siteUrl: "polycloud.in",
    },
  },

  overview: {
    kpis: [
      { label: "X @viratkota followers", value: "—", tone: "ink", delta: "handle available · not claimed yet" },
      { label: "LinkedIn connections", value: "—", tone: "ink", delta: "existing profile" },
      { label: "Posts published (7d)", value: "0", tone: "neutral", delta: "target: 3/week" },
      { label: "Inbound DMs", value: "0", tone: "neutral" },
      { label: "Discovery calls", value: "0", tone: "neutral", delta: "brand → pipeline conversion" },
    ],
    weeklyFocus: [
      "Claim @viratkota on X — currently available, will go fast",
      "Publish first LinkedIn post from drafts (Surat textile or 50-CA-firms)",
      "Pin a bio thread on X establishing the 'operator not tool-builder' frame",
      "Cross-post one LinkedIn insight to X as a thread",
    ],
  },

  social: {
    stats: [
      { label: "Posts drafted", value: "4", tone: "ink", delta: "in marketing/content/" },
      { label: "Posts live", value: "0", tone: "neutral" },
      { label: "Best-performing", value: "—", tone: "neutral" },
      { label: "Avg engagement", value: "—", tone: "neutral" },
    ],
    posts: [
      {
        platform: "LinkedIn",
        account: "viratkota",
        caption:
          "Real money in Indian SMBs isn't the chatbot — it's the backend. Surat textile trader going from 6 hrs/day to 90 min on order entry.",
        when: "Drafted · ready to publish",
        status: "drafted",
      },
      {
        platform: "LinkedIn",
        account: "viratkota",
        caption:
          "I looked at 50 CA firms in Hyderabad last month. Pattern: 60% of partner time goes to admin. Here's what fixing it looks like.",
        when: "Drafted · ready to publish",
        status: "drafted",
      },
      {
        platform: "X",
        account: "viratkota",
        caption:
          "Indian SMBs will adopt AI employees before US SMBs. Thread on why labour-cost math + WhatsApp penetration + Tally stack makes India leapfrog.",
        when: "Drafted · 12-tweet thread",
        status: "drafted",
      },
      {
        platform: "LinkedIn",
        account: "viratkota",
        caption:
          "Most AI tools fail because they try to look smart. The best AI is the one you forget is running.",
        when: "Drafted · contrarian short post",
        status: "drafted",
      },
    ],
  },

  outreach: {
    kpis: [
      { label: "Drafts ready", value: "4", tone: "ink", delta: "marketing/content/linkedin-posts.md" },
      { label: "Touches sent", value: "0", tone: "neutral" },
      { label: "Replies", value: "0", tone: "neutral" },
    ],
    drafts: [
      {
        id: "vk-li-surat",
        type: "linkedin-post",
        title: "Surat textile trader: 6 hrs → 90 min",
        audience: "SMB operators, founders, product",
        preview:
          "Story-form post. Concrete before/after numbers, ends with 'backend > chatbot' as the frame. Drives follows on positioning.",
        length: "~220 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
      {
        id: "vk-li-50cas",
        type: "linkedin-post",
        title: "I analysed 50 CA firms last month",
        audience: "CA firms, professional services, B2B SaaS",
        preview:
          "Data-driven insight. Surprising stat lead (60% admin time), single firm case study, soft CTA.",
        length: "~180 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
      {
        id: "vk-x-india-smb",
        type: "x-thread",
        title: "Indian SMBs will adopt AI before US SMBs",
        audience: "Tech/startup India, HN-adjacent",
        preview:
          "12-tweet thread. Hook → labour-cost math → WhatsApp penetration → Tally stack argument → what's next.",
        length: "12 tweets",
        path: "~/projects/marketing/content/twitter-threads.md",
        status: "ready",
      },
      {
        id: "vk-li-invisibility",
        type: "linkedin-post",
        title: "The best AI is the one you forget is running",
        audience: "broad",
        preview: "Contrarian short post. 'Looking smart' vs 'being effective'.",
        length: "~160 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
    ],
    touches: [],
  },

  ops: {
    log: [
      { time: "Mon 21 Apr · 20:15", kind: "ship", text: "Added viratkota personal-brand dashboard as third client — onboarding-in-3-min proven" },
      { time: "Mon 21 Apr · 19:30", kind: "build", text: "Refactored /client/* into reusable template + ONBOARDING.md" },
      { time: "Mon 21 Apr · 19:00", kind: "ship", text: "GA4 live (G-SJ69BM14MB) + Vercel Analytics fetcher scaffolded" },
      { time: "Mon 21 Apr · 18:30", kind: "ship", text: "Outreach + Leads tabs on /client/polycloud" },
    ],
  },

  sources: {
    sources: [
      { label: "Google Analytics (shared w/ polycloud.in)", status: "live" },
      { label: "Vercel Analytics (shared w/ polycloud.in)", status: "pending" },
      { label: "X @viratkota", status: "not-yet" },
      { label: "LinkedIn /in/viratkota", status: "manual" },
    ],
  },
};
