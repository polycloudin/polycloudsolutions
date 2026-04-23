import type { ClientData } from "./types";

const KEY = "kumar-textiles";

/**
 * Kumar Textiles — public demo dashboard. Structure mirrors real Growth-bundle
 * clients; numbers and names anonymised. This is the main sales artefact —
 * every prospect evaluating PolyCloud Digital lands here, so every block needs
 * to tell part of the story: "before / what Autopilot does / ROI / hands-off".
 */
export const kumarTextiles: ClientData = {
  meta: {
    slug: KEY,
    name: "Kumar Textiles",
    location: "Hyderabad · Secunderabad",
    bundle: "growth",
    weekLabel: "14 – 21 April 2026",
    onboarded: "5 Feb 2026 · 76 days ago",
    healthLabel: "Strong · 87/100",
    bannerNote:
      "Live demo · data shape identical to production · names and numbers anonymised. Scroll through to see what a Growth-bundle client sees every Monday morning.",
    retainerMonthly: 32000,
    setupFee: 150000,
    startedAt: "2026-02-05",
  },
  auth: "public",

  overview: {
    transformation: {
      window: "Feb → Apr 2026 · 76 days since onboarding",
      headline: "From 4 hrs/day on marketing to 28 minutes. Leads tripled.",
      story:
        "Owner was running Meta ads himself, replying on WhatsApp between customers, posting to IG whenever he remembered. Autopilot took over the repetitive work; the owner now approves 3–4 decisions per week and sells more sarees.",
      metrics: [
        { label: "Leads / week", before: "104", after: "342", delta: "+228%", tone: "success" },
        { label: "Blended CPL", before: "₹380", after: "₹184", delta: "−52%", tone: "success" },
        { label: "Owner's time on marketing", before: "4 hrs/day", after: "28 min/day", delta: "−88%", tone: "success" },
        { label: "WhatsApp reply time", before: "3 hrs", after: "< 2 min", delta: "−98%", tone: "success" },
        { label: "Walk-ins attributed to digital", before: "42/week", after: "137/week", delta: "+226%", tone: "success" },
      ],
    },

    money: {
      adSpend: "₹61,100",
      attributedRevenue: "₹2,08,700",
      margin: "₹1,47,600",
      blendedRoas: "3.4×",
      benchmark: "Indian retail textile avg: 1.8×",
      note: "Weekly. Attribution: first-touch + store visit tag. Conservative — only counts purchases where the WhatsApp/lead chain is traceable.",
    },

    kpis: [
      { label: "Leads (7d)", value: "342", tone: "ink", delta: "+28% w/w" },
      { label: "Blended CPL", value: "₹184", tone: "success", delta: "−19% w/w · benchmark ₹420" },
      { label: "Blended ROAS", value: "3.4×", tone: "success", delta: "+22% w/w · industry 1.8×" },
      { label: "Avg rating", value: "4.7", tone: "ink", delta: "+0.2 vs start · 93 reviews" },
      { label: "Needs you", value: "4", tone: "risk", delta: "2 urgent · est. 12 min" },
    ],
    charts: {
      leadsDaily: [42, 51, 48, 56, 63, 58, 24],
      cplTrend: [320, 294, 268, 241, 220, 198, 184],
      channelMix: [
        { name: "Meta Ads", leads: 148, color: "#1A5FD4" },
        { name: "Google Ads", leads: 112, color: "#F46B2C" },
        { name: "Organic / SEO", leads: 48, color: "#15803D" },
        { name: "WhatsApp direct", leads: 21, color: "#7C3AED" },
        { name: "GMB / Local", leads: 13, color: "#B45309" },
      ],
    },

    autopilotActivity: [
      {
        time: "Mon 09:03",
        kind: "auto",
        text: "Paused Meta ad set 'Cold-IG-Carousel' · reallocated budget to winning LAL-1% set",
        signal: "CPL on Cold-IG-Carousel hit ₹640 over 3 days — 2.9× target. Retargeting-30d was at ₹239 with headroom.",
        action: "Paused Cold-IG-Carousel · shifted ₹8K/day to LAL-1%-Bridal · added UTM guard to prevent re-enable.",
        outcome: "Saved ~₹9,600/day in dead spend. LAL-1%-Bridal CPL dropped from ₹214 → ₹199 with the added budget.",
      },
      {
        time: "Tue 11:20",
        kind: "needs",
        text: "Drafted response to Meera's 4-star JustDial review · awaiting your approval",
        signal: "Meera P. posted 4-star on JustDial mentioning parking — pattern: 3 of last 8 reviews mention parking.",
        action: "Drafted empathetic reply + flagged parking as theme. Proposed WhatsApp auto-reply for first-time bookers with parking map.",
        outcome: "Pending your one-tap approve. Response SLA stays under 4h if approved today.",
      },
      {
        time: "Tue 14:07",
        kind: "urgent",
        text: "Flagged Vikram's 2-star review for direct owner callback within 24h",
        signal: "2-star · sizing issue · wedding party · customer name matches lead in WhatsApp log 5 days ago.",
        action: "Pulled full purchase history + WhatsApp thread. Built a callback brief with name, purchase, and a ₹2K goodwill discount code.",
        outcome: "Brief in your Tuesday evening queue. Every 2-star recovered to 4+ has historically become a repeat customer within 90 days.",
      },
      {
        time: "Wed 09:00",
        kind: "auto",
        text: "Published 2 Instagram reels (silk saree try-on + Akshaya Tritiya promo)",
        signal: "Wed 9am = highest reach slot based on your last 8 weeks of analytics (48% avg reach uplift).",
        action: "Auto-published scheduled reels. Generated + posted 3-tag hashtag set pulled from your top-performing captions.",
        outcome: "Try-on reel: 18.9K reach, 5.8% engagement (vs 4.5% account avg). Akshaya Tritiya reel: 12.4K reach, 4.2% engagement.",
      },
      {
        time: "Wed 15:40",
        kind: "auto",
        text: "Updated GMB hours for Akshaya Tritiya weekend (11 May)",
        signal: "Google Business Profile had default hours for May 11 — but you've historically opened 9am–10pm for Akshaya Tritiya.",
        action: "Updated special hours for May 10–12. Scheduled a GMB post announcing extended hours.",
        outcome: "GMB shows correct hours 20 days in advance. Last year 34 walk-ins traced to 'directions' between 8–10pm on this weekend.",
      },
      {
        time: "Thu 16:12",
        kind: "auto",
        text: "Scheduled GMB post: 'Wedding Season Collection — now in store'",
        signal: "Wedding-season keywords spiking in your local search impressions (+61% MoM).",
        action: "Drafted + scheduled a GMB post with 3 CTAs: Call, Directions, Book appointment.",
        outcome: "Published Fri 9am. Tracks to your Monday briefing — we'll see click-throughs by next week.",
      },
      {
        time: "Fri 10:22",
        kind: "needs",
        text: "Meta proposed Performance Max campaign — est. +15% leads at similar CPL · needs approval",
        signal: "Meta's algorithm flagged your account as eligible for PMax with 73% confidence based on 90-day data.",
        action: "Built the creative set (12 images, 4 videos, 8 headlines from your top posts). Budget ring-fenced at ₹5K/day for 7-day test.",
        outcome: "One-tap approve in your queue. If it underperforms by day 4, Autopilot auto-pauses and rolls budget back.",
      },
    ],

    weeklyFocus: [
      "Approve draft response to Meera · 1 tap · queued since Tuesday",
      "Call Vikram back re: 2-star review · talking points + goodwill code ready",
      "Sign off next week's content calendar · 8 posts queued · 3 min skim",
      "Approve Meta Performance Max test · ₹5K/day × 7 days · auto-pause rule set",
    ],
  },

  ads: {
    kpis: [
      { label: "Meta spend", value: "₹32,400" },
      { label: "Meta leads", value: "148" },
      { label: "Meta CPL", value: "₹219", tone: "success" },
      { label: "Google spend", value: "₹28,700" },
      { label: "Google leads", value: "112" },
      { label: "Google CPL", value: "₹256" },
    ],
    campaigns: [
      { name: "Meta · Bridal-LAL-1%", spend: "₹18,400", leads: 86, cpl: "₹214", roas: "4.1×", status: "winning", trend: "+32%" },
      { name: "Meta · Retargeting-30d", spend: "₹9,800", leads: 41, cpl: "₹239", roas: "3.6×", status: "winning", trend: "+12%" },
      { name: "Meta · Cold-IG-Carousel", spend: "₹4,100", leads: 7, cpl: "₹640", roas: "0.8×", status: "paused", trend: "−47%" },
      { name: "Google · Search-Brand", spend: "₹8,200", leads: 54, cpl: "₹152", roas: "5.2×", status: "winning", trend: "+14%" },
      { name: "Google · Search-Generic", spend: "₹12,300", leads: 38, cpl: "₹324", roas: "2.8×", status: "watch", trend: "−4%" },
      { name: "Google · Shopping", spend: "₹8,200", leads: 20, cpl: "₹410", roas: "3.1×", status: "watch", trend: "+3%" },
    ],
  },

  organic: {
    gmbStats: [
      { label: "Profile views", value: "4,280", delta: "+14% w/w" },
      { label: "Direction requests", value: "186", delta: "+22% w/w" },
      { label: "Website clicks", value: "94", delta: "+8% w/w" },
      { label: "Phone calls", value: "71", delta: "+11% w/w" },
    ],
    seoKeywords: [
      { kw: "silk sarees hyderabad", rank: 4, prev: 7, vol: "1.2K" },
      { kw: "banarasi saree secunderabad", rank: 2, prev: 7, vol: "880" },
      { kw: "bridal saree store near me", rank: 7, prev: 9, vol: "1.9K" },
      { kw: "cotton kurtis hyd", rank: 11, prev: 10, vol: "540" },
      { kw: "wedding saree hyderabad", rank: 6, prev: 8, vol: "2.4K" },
      { kw: "handloom saree store", rank: 14, prev: 18, vol: "310" },
    ],
    siteTraffic: {
      visits7d: 3184,
      topPages: [
        { path: "/collections/bridal", pageviews: 1240 },
        { path: "/", pageviews: 892 },
        { path: "/collections/banarasi", pageviews: 611 },
        { path: "/visit-us", pageviews: 248 },
        { path: "/story", pageviews: 193 },
      ],
      topReferrers: [
        { source: "Google organic", visits: 1420 },
        { source: "Instagram", visits: 608 },
        { source: "Direct", visits: 541 },
        { source: "Google Ads", visits: 412 },
        { source: "Meta Ads", visits: 203 },
      ],
    },
  },

  social: {
    stats: [
      { label: "Posts (7d)", value: "5" },
      { label: "Total reach", value: "65,930" },
      { label: "Avg engagement", value: "4.5%" },
      { label: "Follower growth", value: "+128" },
    ],
    posts: [
      { platform: "IG", caption: "Akshaya Tritiya collection reveal — 22K silk sarees starting ₹45K", reach: 12400, engagement: "4.2%", when: "Mon 10:30" },
      { platform: "FB", caption: "Bridal trunk show · Saturday preview · DM to book", reach: 8120, engagement: "3.1%", when: "Tue 18:00" },
      { platform: "IG", caption: "Behind the loom · how a Banarasi saree is made", reach: 18900, engagement: "5.8%", when: "Wed 12:00" },
      { platform: "LinkedIn", caption: "Why we switched from Tally to Zoho — a story", reach: 2410, engagement: "2.4%", when: "Thu 09:00" },
      { platform: "IG", caption: "Customer reel · Priya's wedding lehenga", reach: 24100, engagement: "7.1%", when: "Fri 19:00" },
    ],
  },

  whatsapp: {
    funnel: [
      { stage: "Inbound chats", count: 184, pct: 100 },
      { stage: "Auto-replied <2 min", count: 178, pct: 96 },
      { stage: "Captured as lead", count: 98, pct: 53 },
      { stage: "Booked visit / purchase", count: 41, pct: 22 },
    ],
    note: "Industry avg chat → booking is 8%. Kumar Textiles is at 22% — because auto-reply + lead-capture + visit-booking all happen in the same thread, in the first 3 minutes.",
  },

  reviews: {
    stats: [
      { label: "Avg rating", value: "4.7" },
      { label: "New reviews (7d)", value: "6" },
      { label: "Response rate", value: "100%" },
      { label: "Avg response", value: "3.2h" },
    ],
    stream: [
      { platform: "Google", author: "Rahul S.", rating: 5, snippet: "Amazing collection. Staff was helpful. Priya spent 2 hours with us.", when: "2d ago", responded: true },
      { platform: "JustDial", author: "Meera P.", rating: 4, snippet: "Good variety but parking is limited. Will return.", when: "3d ago", responded: true },
      { platform: "Google", author: "Vikram K.", rating: 2, snippet: "Sizing was off, had to return. Refund was quick though.", when: "3d ago", responded: false, urgent: true },
      { platform: "Facebook", author: "Anjali M.", rating: 5, snippet: "Bought my wedding lehenga here. Absolutely loved it.", when: "5d ago", responded: true },
      { platform: "Google", author: "Rohan D.", rating: 5, snippet: "Second time buying. Quality is consistent. Staff remembers us.", when: "6d ago", responded: true },
    ],
  },

  pipeline: {
    stages: [
      {
        stage: "Inbound (this week)",
        count: 342,
        items: [
          { name: "Meta → WhatsApp", note: "148 leads · auto-qualified 96%", since: "rolling 7d" },
          { name: "Google → form", note: "112 leads · avg time-to-reply 1m 42s", since: "rolling 7d" },
          { name: "Organic → DM", note: "82 leads · all replied within 5 min", since: "rolling 7d" },
        ],
      },
      {
        stage: "Booked visit / call",
        count: 41,
        items: [
          { name: "Wedding trunk show · Sat", note: "18 bookings · 3 cancellations expected", since: "closes Fri 6pm" },
          { name: "Bridal consult · next week", note: "14 bookings · avg ticket ₹85K", since: "rolling" },
          { name: "Phone follow-ups", note: "9 scheduled · 3 urgent", since: "this week" },
        ],
      },
      {
        stage: "Walked in (attributed)",
        count: 137,
        items: [
          { name: "Converted", note: "48 purchases · avg ticket ₹42,300", since: "this week" },
          { name: "Browsed, on WA follow-up", note: "62 warm leads in 14-day window", since: "this week" },
          { name: "Gathering quotes", note: "27 in 7-day nurture sequence", since: "this week" },
        ],
      },
    ],
  },

  ops: {
    log: [
      { time: "Mon 21 Apr · 09:03", kind: "auto", text: "Paused Cold-IG-Carousel · saved ₹9,600/day" },
      { time: "Mon 21 Apr · 09:04", kind: "auto", text: "Reallocated budget to LAL-1%-Bridal · CPL fell ₹214 → ₹199" },
      { time: "Tue 22 Apr · 11:20", kind: "needs", text: "Drafted Meera review reply · pending owner approval" },
      { time: "Tue 22 Apr · 14:07", kind: "urgent", text: "Vikram 2-star flagged · callback brief built" },
      { time: "Wed 23 Apr · 09:00", kind: "auto", text: "Published 2 IG reels · 31.3K combined reach" },
      { time: "Wed 23 Apr · 15:40", kind: "auto", text: "Updated GMB hours for Akshaya Tritiya (May 11)" },
      { time: "Thu 24 Apr · 16:12", kind: "auto", text: "Scheduled GMB post · wedding season collection" },
      { time: "Fri 25 Apr · 10:22", kind: "needs", text: "Proposed Meta PMax test · ₹5K/day × 7 days" },
    ],
  },

  sources: {
    sources: [
      { label: "Meta Ads Manager", status: "live" },
      { label: "Google Ads", status: "live" },
      { label: "Google Business Profile", status: "live" },
      { label: "Google Analytics (GA4)", status: "live" },
      { label: "WhatsApp Business API", status: "live" },
      { label: "JustDial", status: "manual" },
      { label: "Instagram Insights", status: "live" },
      { label: "Tally (walk-in attribution)", status: "manual" },
    ],
  },
};
