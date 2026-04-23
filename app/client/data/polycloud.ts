import type { ClientData } from "./types";

/**
 * PolyCloud's own-brand dogfood dashboard.
 *
 * Hand-curated. Update weekly (or after a shipped change) by editing this
 * file and pushing. Phase 2 will wire Vercel Analytics, Resend, and
 * X/LinkedIn APIs to hydrate these sections automatically.
 */
export const polycloud: ClientData = {
  meta: {
    slug: "polycloud",
    name: "PolyCloud Solutions",
    location: "Hyderabad · Secunderabad",
    bundle: "internal",
    weekLabel: "21 – 28 April 2026",
    onboarded: "Site live 7 Apr · Dashboard started 21 Apr",
    healthLabel: "Dogfooding · one paying pilot",
    bannerNote:
      "We use this dashboard before we sell it — if it doesn't make our Monday morning easier, it won't make a client's easier.",
    // Internal — zero retainer, but we carry the build cost in operator time.
  },
  auth: "private",

  liveFeeds: {
    ga4: { propertyId: "533972528" },
    vercelAnalytics: {
      projectId: "prj_o9xnq4hIB1xOByHQHyUqizDbXa6z",
      teamId: "team_IOg3Xvssr5P5GKJ1fuLazWfO",
      siteUrl: "polycloud.in",
    },
  },

  overview: {
    kpis: [
      { label: "polycloud.in visits (7d)", value: "—", tone: "ink", delta: "GA4 / Vercel Analytics · env var pending" },
      { label: "Intake forms (7d)", value: "0", tone: "ink", delta: "/onboard went live today" },
      { label: "Pilot calls booked", value: "1", tone: "success", delta: "Aasrith network · Monday" },
      { label: "Pilots in discussion", value: "2", tone: "success", delta: "jewellery SMB + CA firm" },
      { label: "Paying clients", value: "1", tone: "success", delta: "Kumar Textiles · ₹32K/mo · 76 days in" },
    ],
    weeklyFocus: [
      "Capture /onboard intake volume → first paid pilot starter scope signed",
      "Monday call with CA-firm pilot — send sample /solutions/ca-firm beforehand",
      "Set GA4_SERVICE_ACCOUNT_KEY + VERCEL_ACCESS_TOKEN in Vercel env so live numbers land",
      "Publish first LinkedIn post drafted yesterday (VK personal) · target Thursday 8am",
      "Land second paying client by end of April — retainer doubles MRR",
    ],
    autopilotActivity: [
      {
        time: "Wed 23 · 22:45",
        kind: "ship",
        text: "Shipped /dashboard operator cockpit + /login branded cookie session + /onboard intake flow",
        signal: "Every operator surface lived behind a browser Basic Auth prompt. Three broken demo pages were eating trust (42 / 31 / 58 scores per adversarial panel).",
        action: "Rewrote proxy.ts to JWT cookie auth with Basic fallback · built three production pages · deleted depth-3d + workflow-demo · added 301 redirects · pivoted chips to client-shaped proof.",
        outcome: "One branded sign-in flow. One operator view showing every tenant + urgent queue. One self-serve intake. SLA: dashboard live within 5 working days of intake.",
      },
      {
        time: "Wed 23 · 14:20",
        kind: "build",
        text: "Cross-tenant aggregates landed — /dashboard computes MRR + leads + urgent count from registry",
        signal: "Per-client dashboards existed but no operator view. Needed a cockpit to track every tenant on one screen.",
        action: "Built aggregates.ts walking CLIENT_REGISTRY, extended ClientMeta with retainerMonthly. Tenants sort by MRR, urgent items aggregate across clients.",
        outcome: "Scales as new paying clients onboard — just populate data/<slug>.ts with retainer and they appear on /dashboard.",
      },
      {
        time: "Tue 22 · 17:10",
        kind: "ship",
        text: "Kumar Textiles demo overhaul — transformation hero + money strip + narrative Autopilot cards",
        signal: "Public demo was a data dump. Prospects couldn't see the ROI picture, before/after, or what makes Autopilot different.",
        action: "Added 76-day transformation band (104→342 leads/wk, ₹380→₹184 CPL), money strip with industry benchmark, signal→action→outcome cards on each Autopilot event.",
        outcome: "Prospects now see the money story above the fold. Still needs real client + un-redacted numbers to fully convert.",
      },
      {
        time: "Tue 22 · 10:30",
        kind: "ship",
        text: "Mobile menu + rhythm pass across 5 pages — hero/section padding, heading clamp mins, min-h on cards",
        signal: "Mobile users saw logo + 'Book' only — the 5 nav links were all `hidden md:flex`. Heroes were 144px top padding on 375px screens.",
        action: "Added MobileMenu with hamburger + slide-down panel (ARIA, body-scroll lock). Tuned pt-36→pt-28, py-24→py-16, clamp mins down 20–30% across /, /digital, /consulting, /about, /labs, /solutions/*.",
        outcome: "Desktop output byte-identical. Mobile feels like it was designed for mobile, not scaled down from desktop.",
      },
      {
        time: "Mon 21 · 20:22",
        kind: "ship",
        text: "ca-firm-toolkit shipped to polycloudin/ca-firm-toolkit (private) · GSTR-2B recon engine production-ready",
        signal: "CA-firm pitch needed provenance — 'we have the code' not 'we have decks'. Recon tool was sanitised + tested via --demo (81.2% match, ₹2,685 ITC-at-risk caught).",
        action: "Extracted 41 files (296 KB) from source tree, sanitised hardcoded paths, wrote fresh README + .gitignore + proprietary LICENSE, pushed to private GitHub repo.",
        outcome: "Linked from /solutions/ca-firm line-by-line comparison (8h→45min per client). Ready to open to first CA-firm pilot under NDA.",
      },
    ],
  },

  social: {
    stats: [
      { label: "Posts published", value: "0", delta: "first drops this week" },
      { label: "Drafts ready", value: "8", delta: "in marketing/content/" },
      { label: "Followers (X)", value: "—", delta: "@polycloudin claimed · @viratkota pending" },
      { label: "Followers (LI)", value: "—", delta: "page pending claim" },
    ],
    posts: [
      {
        platform: "LinkedIn",
        account: "viratkota",
        caption:
          "Most Indian SMB marketing stacks are a junk drawer — Meta ads in one tab, GMB in another, WhatsApp on a phone, Tally on a laptop. We built one dashboard that pulls them together...",
        when: "Drafted · publish Thu 8am",
        status: "drafted",
      },
      {
        platform: "LinkedIn",
        account: "viratkota",
        caption:
          "I analysed 50 CA firms in Hyderabad. 60% of junior-associate time is manual reconciliation that a script can close in 4 minutes. Here's what fixing it looks like.",
        when: "Drafted · ready",
        status: "drafted",
      },
      {
        platform: "X",
        account: "polycloudin",
        caption:
          "Indian SMBs will adopt AI employees before US SMBs. 12-tweet thread on labour-cost math + WhatsApp penetration + Tally stack.",
        when: "Drafted · ready",
        status: "drafted",
      },
      {
        platform: "LinkedIn",
        account: "viratkota",
        caption:
          "A Surat textile trader went from 6 hours/day on order entry to 90 minutes. Not via a chatbot. Via a backend that autoparses WhatsApp photos into Tally vouchers.",
        when: "Drafted · ready",
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
        { path: "/solutions/ca-firm", pageviews: 0 },
        { path: "/consulting", pageviews: 0 },
        { path: "/onboard", pageviews: 0 },
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
      {
        stage: "Cold · Hyderabad list",
        count: 33,
        items: [
          { name: "25 CA firms · Gachibowli + Madhapur + HITEC + Kondapur", note: "Scraped from Google Maps · need contact data", since: "13 Apr" },
          { name: "8 textile wholesalers · Secunderabad + Begum Bazar", note: "IndiaMART listings · most have GST registered", since: "13 Apr" },
        ],
      },
      {
        stage: "Reached out",
        count: 2,
        items: [
          { name: "SGR & Associates (Gachibowli)", note: "WhatsApp sent 22 Apr · awaits reply", since: "22 Apr" },
          { name: "Prithvi Textiles (Hyderabad)", note: "IndiaMART inquiry · owner seen 20 Apr", since: "20 Apr" },
        ],
      },
      {
        stage: "Discovery scheduled",
        count: 1,
        items: [{ name: "CA firm (warm intro from Aasrith)", note: "Monday 28 Apr · 11am · send /solutions/ca-firm before call", since: "20 Apr" }],
      },
      {
        stage: "Pilot negotiation",
        count: 2,
        items: [
          { name: "Hyderabad jewellery SMB", note: "Reviewed /client/kumar-textiles sample · waiting on scope", since: "18 Apr" },
          { name: "Pilot #1 (Aasrith's network)", note: "Verbal agreement · scope signing this week", since: "21 Apr" },
        ],
      },
      {
        stage: "Pilot active",
        count: 0,
        items: [],
      },
      {
        stage: "Paying client",
        count: 1,
        items: [
          { name: "Kumar Textiles (demo)", note: "₹32K/mo · 76 days in · ₹1.5L setup banked", since: "5 Feb" },
        ],
      },
    ],
  },

  ops: {
    log: [
      { time: "Wed 23 · 22:45", kind: "ship", text: "Shipped /login cookie session + /onboard intake flow (#68)" },
      { time: "Wed 23 · 19:30", kind: "ship", text: "Added /dashboard — operator view with cross-tenant aggregates (#67)" },
      { time: "Wed 23 · 16:40", kind: "ship", text: "301-redirect the three retired demo URLs → live adjacent pages (#66)" },
      { time: "Wed 23 · 16:15", kind: "ship", text: "Removed /digital/demos/3d-product — hero chip repointed to /client/kumar-textiles (#65)" },
      { time: "Wed 23 · 15:00", kind: "ship", text: "Demo pivot — killed depth-3d + workflow-demo, shipped pure-CSS 3D + static CA-firm table (#64)" },
      { time: "Wed 23 · 12:10", kind: "ship", text: "Consulting demo + PipelineTab funnel view (#63) — then deprecated after VK feedback" },
      { time: "Wed 23 · 10:45", kind: "ship", text: "Digital depth-3d demo (#62) — deprecated same day after adversarial review 42/100" },
      { time: "Tue 22 · 22:30", kind: "ship", text: "Mobile rhythm pass across 5 pages — heroes/padding/clamp-mins/min-h (#61)" },
      { time: "Tue 22 · 21:15", kind: "ship", text: "Added mobile hamburger menu (#60) — nav was hidden below md breakpoint" },
      { time: "Tue 22 · 19:00", kind: "ship", text: "Kumar Textiles demo overhaul — transformation hero + money strip + narrative cards (#59)" },
      { time: "Tue 22 · 17:30", kind: "build", text: "Added ca-firm-toolkit README status table + live workflow demo link (polycloudin repo)" },
      { time: "Mon 21 · 20:30", kind: "ship", text: "Added viratkota personal-brand dashboard as 3rd tenant — onboarding in 3 min proven (#57)" },
      { time: "Mon 21 · 20:15", kind: "ship", text: "ca-firm-toolkit → private repo polycloudin/ca-firm-toolkit" },
      { time: "Mon 21 · 19:30", kind: "build", text: "Reusable _template.ts + ONBOARDING.md so new clients take one minute" },
      { time: "Mon 21 · 19:00", kind: "ship", text: "GA4 tracking live (G-SJ69BM14MB) + Vercel Analytics fetcher scaffolded" },
      { time: "Mon 21 · 18:30", kind: "ship", text: "Outreach + Leads tabs on /client/polycloud · clipboard-only, no external jumps" },
    ],
  },

  sources: {
    sources: [
      { label: "Google Analytics (G-SJ69BM14MB · polycloud.in)", status: "live" },
      { label: "Vercel Analytics (polycloud.in)", status: "pending" },
      { label: "Contact form (Formsubmit)", status: "manual" },
      { label: "/onboard intake → structured logs", status: "live" },
      { label: "X @polycloudin", status: "manual" },
      { label: "X @viratkota", status: "not-yet" },
      { label: "LinkedIn · PolyCloud Solutions page", status: "not-yet" },
      { label: "LinkedIn · Virat Kota profile", status: "manual" },
      { label: "Meta Ads (PolyCloud)", status: "not-yet" },
      { label: "Google Ads (PolyCloud)", status: "not-yet" },
      { label: "GMB", status: "not-yet" },
      { label: "GitHub · polycloudin org", status: "live" },
    ],
  },

  outreach: {
    kpis: [
      { label: "Drafts ready", value: "8", tone: "ink", delta: "content/ folder" },
      { label: "Queued", value: "2", tone: "ink", delta: "scheduled for this week" },
      { label: "Sent (7d)", value: "2", tone: "success" },
      { label: "Replied", value: "1", tone: "success", delta: "50% reply rate on n=2" },
      { label: "Booked calls", value: "1", tone: "success", delta: "CA firm · Monday 28 Apr" },
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
        preview: "800 searches/mo. Paired with GSTR-2B recon engine case study. Covers pain → architecture → 8h→45min collapse → ROI math.",
        length: "~1200 words",
        path: "~/projects/marketing/content/blog-seo-outlines.md",
        status: "ready",
      },
      {
        id: "li-surat-textile",
        type: "linkedin-post",
        title: "Surat textile trader: 6 hrs/day → 90 min",
        audience: "SMB owners, textile traders",
        preview: "Real money is in automating backend workflows — not chatbots. Story format with before/after numbers, ends with soft CTA to /digital.",
        length: "~220 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
      {
        id: "li-50-ca-firms",
        type: "linkedin-post",
        title: "I analysed 50 CA firms — 60% of their time is admin",
        audience: "CA firms, professional services",
        preview: "Data-driven insight post. Opens with surprising stat, builds to single firm case study (the one from /solutions/ca-firm).",
        length: "~180 words",
        path: "~/projects/marketing/content/linkedin-posts.md",
        status: "ready",
      },
      {
        id: "li-invisibility",
        type: "linkedin-post",
        title: "Most AI tools fail because they try to look intelligent",
        audience: "broad",
        preview: "Contrarian. Invisibility = signal of actual working software. Ends with 'the best AI is the one you forget is running'.",
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
        preview: "Cold email. Personalised intro + 3 bullets + 1 question CTA. 4-stage follow-up sequence.",
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
      {
        id: "touch-001",
        channel: "whatsapp",
        target: "SGR & Associates (Gachibowli)",
        subject: "GSTR-2B reconciliation — 10 hrs/mo → < 1 hr",
        preview: "Namaste 👋 CA sir, quick question — do you run GSTR-2B recon manually in Excel, or does your team do it line-by-line with Tally export? We built a toolkit that collapses that to 45 min/client...",
        status: "sent",
        sentAt: "22 Apr · 14:30",
        notes: "First contact from Aasrith's warm intro",
      },
      {
        id: "touch-002",
        channel: "linkedin",
        target: "Pilot #1 (Aasrith's network)",
        subject: "LinkedIn DM — pilot scope follow-up",
        preview: "Scope draft attached — starter bundle (₹70K setup + ₹12K/mo), covers GMB + WhatsApp catalog + 2 landing pages + 8 posts/mo + weekly dashboard. Propose kickoff Monday.",
        status: "replied",
        sentAt: "22 Apr · 10:00",
        repliedAt: "22 Apr · 15:12",
        notes: "Said 'let me check with partner, get back by Thursday'",
      },
      {
        id: "touch-003",
        channel: "email",
        target: "Hyderabad jewellery SMB (warm inbound)",
        subject: "Re: sample dashboard — your feedback + next step",
        preview: "Attached the live demo at /client/kumar-textiles — it's anonymised but the structure + data ranges mirror what you'd see on day 30. Happy to walk you through for 20 min?",
        status: "queued",
        notes: "Ready to send Thursday 9am",
      },
      {
        id: "touch-004",
        channel: "whatsapp",
        target: "Prithvi Textiles (Hyderabad)",
        subject: "IndiaMART inquiry follow-up",
        preview: "Sir, saw your IndiaMART listing — if WhatsApp catalog + auto-reply interests you for incoming buyer enquiries, we ship one for ₹70K setup. 2 pages live in 7 days. Free first-month trial.",
        status: "queued",
        notes: "Waiting on market-hours window (10am–8pm)",
      },
      {
        id: "touch-005",
        channel: "email",
        target: "KSN & Associates (Gachibowli)",
        subject: "Your Friday hours back — GSTR-2B automated",
        preview: "Template #1 from the CA cold-email sequence. Personalised opening line pulled from their About page (mentions audit specialisation).",
        status: "draft",
        notes: "Waiting for decision-maker email — LinkedIn research pending",
      },
    ],
  },

  leads: {
    kpis: [
      { label: "Total leads", value: "33", tone: "ink", delta: "25 CA firms + 8 textile traders" },
      { label: "With contact data", value: "10", tone: "warn", delta: "8 textile (IndiaMART) + 2 CA (LinkedIn)" },
      { label: "Cold", value: "29", tone: "neutral" },
      { label: "Warm+", value: "4", tone: "success", delta: "2 active conversations + 2 inbound" },
    ],
    leads: [
      // --- CA firms · Hyderabad (scraped via Google Maps + LinkedIn) ---
      { id: "ca-001", name: "PKB Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", nextAction: "find decision-maker on LinkedIn", role: "Audit, Tax, Company Registration" },
      { id: "ca-002", name: "SGR & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "engaged", lastTouchAt: "22 Apr", nextAction: "await WhatsApp reply", role: "GST, Startup Services, Tax Planning" },
      { id: "ca-003", name: "MNC Business Advisors", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", role: "Startup Registration, Tax Compliance" },
      { id: "ca-004", name: "KSN & Associates", vertical: "CA Firm", city: "Gachibowli", source: "maps-scraped", temperature: "cold", nextAction: "send email template #1", role: "Audit, Taxation, Accounting" },
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

      // --- Textile wholesalers · Secunderabad + Begum Bazar (IndiaMART verified) ---
      { id: "tx-001", name: "Prithvi Textiles", company: "Prithvi Textiles", vertical: "Textile Wholesale", city: "Hyderabad", source: "indiamart", temperature: "engaged", lastTouchAt: "20 Apr", phone: "+91 80-4456-6628", nextAction: "follow-up WhatsApp 24 Apr", role: "Wholesale · 8 years · fabric + lining" },
      { id: "tx-002", name: "Navya Fabrics", company: "Navya Fabrics", vertical: "Textile Wholesale", city: "Hyderabad", source: "indiamart", temperature: "cold", phone: "+91 80-4101-2962", role: "Wholesale · 15 years" },
      { id: "tx-003", name: "Pooja Impex", company: "Pooja Impex", vertical: "Textile Wholesale", city: "Old Malakpet · Hyderabad", source: "indiamart", temperature: "cold", phone: "+91 80-4782-1223", role: "Wholesale · 18 years" },
      { id: "tx-004", name: "Southern Distributors", company: "Southern Distributors", vertical: "Textile Wholesale", city: "Secunderabad", source: "indiamart", temperature: "cold", phone: "+91 80-4401-6150", role: "Wholesale · 14 years" },
      { id: "tx-005", name: "Krishna Exclusive", company: "Krishna Exclusive", vertical: "Textile Wholesale", city: "Banjara Hills · Hyderabad", source: "indiamart", temperature: "cold", phone: "+91 80-4446-4896", role: "Wholesale · 10 years · premium" },
      { id: "tx-006", name: "Kedarnath Enterprises", company: "Kedarnath Enterprises", vertical: "Textile Wholesale", city: "Hyderabad", source: "indiamart", temperature: "cold", phone: "+91 80-4456-6973", role: "Wholesale · 16 years" },
      { id: "tx-007", name: "Sai Ram Textiles", company: "Sai Ram Textiles", vertical: "Textile Wholesale", city: "Secunderabad", source: "indiamart", temperature: "cold", phone: "+91 80-4765-1360", role: "Wholesale · 12 years" },
      { id: "tx-008", name: "Deepa Textiles", company: "Deepa Textiles", vertical: "Textile Wholesale", city: "Begum Bazar · Hyderabad", source: "indiamart", temperature: "cold", role: "Manufacturer + wholesale · est. 1989 · 5-25 Cr turnover · 4.0 rating" },

      // --- Active pilots + inbound warm ---
      { id: "pilot-001", name: "Pilot #1 (Aasrith's network)", vertical: "TBD", city: "Hyderabad", source: "referral", temperature: "qualified", nextAction: "scope signing this week · starter bundle" },
      { id: "pilot-002", name: "Hyderabad jewellery SMB", vertical: "Jewellery", city: "Hyderabad", source: "website-form", temperature: "warm", nextAction: "send follow-up email Thu 9am", lastTouchAt: "18 Apr" },
    ],
  },
};
