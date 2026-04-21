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

  liveFeeds: {
    ga4: {
      propertyId: "533972528", // polycloud.in GA4 property
    },
    vercelAnalytics: {
      projectId: "prj_o9xnq4hIB1xOByHQHyUqizDbXa6z",
      teamId: "team_IOg3Xvssr5P5GKJ1fuLazWfO",
      siteUrl: "polycloud.in",
    },
  },

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
      { label: "X @Polycloudai (live)", status: "manual" },
      { label: "X @viratkota", status: "pending" },
      { label: "LinkedIn · PolyCloud Solutions", status: "pending" },
      { label: "LinkedIn · Virat Kota", status: "pending" },
      { label: "Google Analytics (G-SJ69BM14MB)", status: "live" },
      { label: "Meta Ads (PolyCloud)", status: "not-yet" },
      { label: "Google Ads (PolyCloud)", status: "not-yet" },
      { label: "GMB", status: "not-yet" },
    ],
  },

  outreach: {
    kpis: [
      { label: "Drafts ready", value: "8", tone: "ink", delta: "content/ folder" },
      { label: "Queued", value: "0", tone: "ink", delta: "waiting for green-light" },
      { label: "Sent (7d)", value: "0", tone: "neutral" },
      { label: "Replied", value: "0", tone: "neutral" },
      { label: "Booked calls", value: "1", tone: "success", delta: "Aasrith network" },
    ],
    drafts: [
      {
        id: "blog-ai-smb",
        type: "blog",
        title: "AI Automation for Small Businesses in India",
        audience: "broad",
        preview: "1.2K searches/mo. Outline complete — pillar piece covering AI employees, WhatsApp bots, Tally automation, GST filing. Ready to expand into 1500-word post.",
        length: "~1500 words",
        path: "~/projects/marketing/content/blog-seo-outlines.md",
        status: "ready",
      },
      {
        id: "blog-ca-firm",
        type: "blog",
        title: "How an AI Employee Works in a CA Firm",
        audience: "CA firms",
        preview: "800 searches/mo. Outline covers pain → architecture → ROI. Paired with GSTR-2B recon engine case study we've already built.",
        length: "~1200 words",
        path: "~/projects/marketing/content/blog-seo-outlines.md",
        status: "ready",
      },
      {
        id: "li-surat-textile",
        type: "linkedin-post",
        title: "Surat textile trader: 6 hrs/day → 90 min",
        audience: "SMB owners, textile traders",
        preview: "Real money is in automating backend workflows — not chatbots. Story format, ends with soft CTA to polycloud.in/digital.",
        length: "~220 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
      {
        id: "li-50-ca-firms",
        type: "linkedin-post",
        title: "I analysed 50 CA firms — 60% of their time is admin",
        audience: "CA firms, professional services",
        preview: "Data-driven insight post. Opens with surprising stat, ends with 'we fixed this for one firm, here's how'.",
        length: "~180 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
      {
        id: "li-invisibility",
        type: "linkedin-post",
        title: "Most AI tools fail because they try to look intelligent",
        audience: "broad",
        preview: "Contrarian take. Invisibility = signal of actual working software. Ends with 'the best AI is the one you forget is running'.",
        length: "~160 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
      {
        id: "x-thread-india-smb",
        type: "x-thread",
        title: "Indian SMBs will adopt AI employees before US SMBs",
        audience: "tech/startup India",
        preview: "12-tweet thread. Hook: WhatsApp penetration + Tally stack + labour cost math = India leapfrogs US in SMB AI.",
        length: "12 tweets",
        path: "~/projects/marketing/content/twitter-threads.md",
        status: "ready",
      },
      {
        id: "email-ca-gst",
        type: "email",
        title: "Is manual GST filing eating 10+ hours every month?",
        audience: "CA firms",
        preview: "Cold email template. Personalised intro + 3 bullets + 1 question CTA. 4-stage follow-up sequence.",
        length: "~120 words",
        path: "~/projects/marketing/outreach/cold-email-templates.md",
        status: "ready",
      },
      {
        id: "wa-ca-intro",
        type: "whatsapp",
        title: "CA firm WhatsApp intro (Hinglish)",
        audience: "CA firms",
        preview: "Namaste 👋 First message + 6 follow-up stages + rebuttal for 'already using Tally'. Hindi-English mix.",
        length: "7 stages",
        path: "~/projects/marketing/outreach/whatsapp-scripts.md",
        status: "ready",
      },
    ],
    touches: [
      // populate when we actually send anything
    ],
  },

  leads: {
    kpis: [
      { label: "Total leads", value: "25", tone: "ink", delta: "CA firms · Hyderabad" },
      { label: "With contact data", value: "0", tone: "risk", delta: "needs scraping" },
      { label: "Cold", value: "25", tone: "neutral" },
      { label: "Warm+", value: "2", tone: "success", delta: "from Aasrith network" },
    ],
    leads: [
      { id: "ca-001", name: "PKB Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", nextAction: "find decision-maker on LinkedIn", role: "Audit, Tax, Company Registration" },
      { id: "ca-002", name: "SGR & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", nextAction: "pitch GST automation", role: "GST, Startup Services, Tax Planning" },
      { id: "ca-003", name: "MNC Business Advisors", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Startup Registration, Tax Compliance" },
      { id: "ca-004", name: "KSN & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Audit, Taxation, Accounting" },
      { id: "ca-005", name: "Rajendra CA & Associates", vertical: "CA Firm", city: "Madhapur", source: "maps-scraped", temperature: "cold", role: "GST, Income Tax, Audit" },
      { id: "ca-006", name: "Sree Sai Chartered Accountants", vertical: "CA Firm", city: "Kondapur", source: "maps-scraped", temperature: "cold", role: "Company Law, Tax Audit, GST" },
      { id: "ca-007", name: "Sri Lakshmi Narasimha Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Startup Services, Tax Planning" },
      { id: "ca-008", name: "VBR & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Audit, Tax, Company Registration" },
      { id: "ca-009", name: "SMC & Associates", vertical: "CA Firm", city: "Madhapur", source: "maps-scraped", temperature: "cold", role: "GST, Accounting, Payroll" },
      { id: "ca-010", name: "Sri Krishna & Co", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Tax Audit, Accounting Services" },
      { id: "ca-011", name: "Ramesh Babu & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Company Registration, Tax" },
      { id: "ca-012", name: "Sudheer & Associates", vertical: "CA Firm", city: "HITEC City", source: "maps-scraped", temperature: "cold", role: "GST, Income Tax, Audit" },
      { id: "ca-013", name: "Prathibha & Associates", vertical: "CA Firm", city: "Madhapur", source: "maps-scraped", temperature: "cold", role: "Accounting, Tax, Audit" },
      { id: "ca-014", name: "Lakshmi & Company", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Company Law, Tax Planning" },
      { id: "ca-015", name: "Srinivas & Co", vertical: "CA Firm", city: "Kondapur", source: "maps-scraped", temperature: "cold", role: "GST, Startup Registration" },
      { id: "ca-016", name: "Sri Balaji Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Audit, Tax, Accounting" },
      { id: "ca-017", name: "Raghavendra & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Company Registration, Tax" },
      { id: "ca-018", name: "Sri Sai Lakshmi Associates", vertical: "CA Firm", city: "Madhapur", source: "maps-scraped", temperature: "cold", role: "GST, Accounting, Payroll" },
      { id: "ca-019", name: "Krishna & Co", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Tax, Audit, Company Law" },
      { id: "ca-020", name: "Sri Venkateshwara & Co", vertical: "CA Firm", city: "Kondapur", source: "maps-scraped", temperature: "cold", role: "Startup Services, Tax Planning" },
      { id: "ca-021", name: "Sree SRS & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "GST, Accounting, Audit" },
      { id: "ca-022", name: "Sri Lakshmi Associates", vertical: "CA Firm", city: "Madhapur", source: "maps-scraped", temperature: "cold", role: "Company Registration, Tax" },
      { id: "ca-023", name: "Sri Ramana & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Tax, Audit, Accounting" },
      { id: "ca-024", name: "Sri Tirumala & Co", vertical: "CA Firm", city: "HITEC City", source: "maps-scraped", temperature: "cold", role: "GST, Startup Services" },
      { id: "ca-025", name: "Sri Surya & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Company Registration, Tax Audit" },
      { id: "pilot-001", name: "Pilot #1 (Aasrith's network)", vertical: "TBD", city: "Hyderabad", source: "referral", temperature: "engaged", nextAction: "first call this week" },
      { id: "pilot-002", name: "Hyderabad jewellery SMB", vertical: "Jewellery", city: "Hyderabad", source: "inbound", temperature: "warm", nextAction: "follow up — sent sample /client/kumar-textiles" },
    ],
  },
};
