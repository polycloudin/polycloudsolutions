import type { ClientData } from "./types";

const KEY = "kumar-textiles";

export const kumarTextiles: ClientData = {
  meta: {
    slug: KEY,
    name: "Kumar Textiles",
    location: "Hyderabad · Secunderabad",
    bundle: "growth",
    weekLabel: "14 – 21 April 2026",
    onboarded: "5 Feb 2026",
    healthLabel: "Strong · 87/100",
    bannerNote:
      "Demo client with anonymised numbers and names. Same structure and data ranges we ship to every Digital client.",
  },
  auth: "public",

  overview: {
    kpis: [
      { label: "Leads (7d)", value: "342", tone: "ink", delta: "+28%" },
      { label: "Blended CPL", value: "₹184", tone: "success", delta: "−19%" },
      { label: "Blended ROAS", value: "3.4×", tone: "success", delta: "+22%" },
      { label: "Avg rating", value: "4.7", tone: "ink", delta: "+0.2" },
      { label: "Needs you", value: "4", tone: "risk", delta: "2 urgent" },
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
      { time: "Mon 09:03", kind: "auto", text: "Paused Meta ad set 'Cold-IG-Carousel' — CPL ₹640 vs target ₹250" },
      { time: "Mon 09:04", kind: "auto", text: "Reallocated ₹8K/day from above to 'Lookalike-1%-Bridal' (CPL ₹138)" },
      { time: "Tue 11:20", kind: "needs", text: "Drafted response to Meera's 4-star JustDial review · Awaiting your approval" },
      { time: "Tue 14:07", kind: "urgent", text: "Flagged Vikram's 2-star review for direct owner callback" },
      { time: "Wed 09:00", kind: "auto", text: "Published 2 Instagram reels (silk saree try-on + Akshaya Tritiya promo)" },
      { time: "Wed 15:40", kind: "auto", text: "Updated GMB hours for Akshaya Tritiya weekend (11 May)" },
      { time: "Thu 16:12", kind: "auto", text: "Scheduled GMB post: 'Wedding Season Collection — now in store'" },
      { time: "Fri 10:22", kind: "needs", text: "Meta proposed Performance Max campaign — est. +15% leads · Needs approval" },
    ],
    weeklyFocus: [
      "Approve draft response to Meera (pending since Tue)",
      "Call Vikram back re: 2-star review — talking points drafted in CRM",
      "Sign off next week's content calendar (8 posts queued)",
      "Review Meta Performance Max proposal — est. +15% leads at similar CPL",
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
      { label: "Profile views", value: "4,280", delta: "+14%" },
      { label: "Direction requests", value: "186", delta: "+22%" },
      { label: "Website clicks", value: "94", delta: "+8%" },
      { label: "Phone calls", value: "71", delta: "+11%" },
    ],
    seoKeywords: [
      { kw: "silk sarees hyderabad", rank: 4, prev: 7, vol: "1.2K" },
      { kw: "banarasi saree secunderabad", rank: 2, prev: 7, vol: "880" },
      { kw: "bridal saree store near me", rank: 7, prev: 9, vol: "1.9K" },
      { kw: "cotton kurtis hyd", rank: 11, prev: 10, vol: "540" },
      { kw: "wedding saree hyderabad", rank: 6, prev: 8, vol: "2.4K" },
      { kw: "handloom saree store", rank: 14, prev: 18, vol: "310" },
    ],
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
    note: "Industry avg chat → booking is 8%. We're at 22%.",
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
};
