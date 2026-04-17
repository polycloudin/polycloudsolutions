// Portfolio of real client-builds shipped by PolyCloud.
// Each entry maps to a project in ~/projects/client-builds/ or ~/projects/
// Update `liveUrl` when a project is publicly deployed; leave null for private engagements.

export type Project = {
  slug: string;
  name: string;
  vertical: string;
  verticalSlug: string; // for filtering/grouping
  tagline: string;
  description: string;
  stack: string[];
  delivered: string[];
  year: string;
  liveUrl: string | null;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "gold-store",
    name: "D2C Jewelry — luxury storefront",
    vertical: "D2C · Jewelry",
    verticalSlug: "d2c",
    tagline: "Premium dark-luxury e-commerce reference build for a jewelry D2C brand.",
    description:
      "A luxury-grade storefront with monotone-to-gold product reveals, cursor-tracked magnetic interactions, and a dense product catalog. Brand aesthetic: Bloomberg-terminal meets editorial jewelry magazine.",
    stack: ["Next.js", "GSAP", "Tailwind", "Stripe", "Sanity CMS"],
    delivered: [
      "Storefront + product catalog",
      "Cart + payments (Stripe + Razorpay)",
      "Monotone-to-gold hover reveals",
      "Custom brand-kit design system",
    ],
    year: "2026",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "likhita-group",
    name: "Industrial holding-company",
    vertical: "Enterprise · Conglomerate",
    verticalSlug: "enterprise",
    tagline: "Industrial-luxury holding-company site with scrubbed scroll parallax.",
    description:
      "A multi-business conglomerate presence — scrubbed GSAP scroll timelines, char-stagger hero reveals, asymmetric bento grid for business units, mesh-gradient dividers between sections.",
    stack: ["Next.js", "GSAP ScrollTrigger", "Lenis", "TypeScript"],
    delivered: [
      "8-business holding-company structure",
      "Scrubbed parallax hero + section transitions",
      "Awwwards-reference-level motion design",
      "CMS-driven business-unit pages",
    ],
    year: "2026",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "clinic-hyderabad",
    name: "Multi-specialty clinic",
    vertical: "Healthcare · Clinic",
    verticalSlug: "healthcare",
    tagline: "Multi-specialty clinic reference build with appointment booking + WhatsApp intake.",
    description:
      "Patient-facing clinic site with online appointment booking, WhatsApp-based triage intake, doctor profiles, and a receptionist dashboard for the morning schedule.",
    stack: ["Next.js", "Tailwind", "WhatsApp Business API", "Postgres"],
    delivered: [
      "Appointment booking system",
      "WhatsApp intake flow",
      "Doctor + specialty directory",
      "Receptionist operations dashboard",
    ],
    year: "2026",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "law-firm",
    name: "Law firm directory",
    vertical: "Professional services · Legal",
    verticalSlug: "professional-services",
    tagline: "Authoritative law-firm site with practice-area depth + secure client intake.",
    description:
      "Editorial-serif typography, practice-area landing pages with expert attribution, secure client intake forms, case-study library, and CMS-managed attorney profiles.",
    stack: ["Next.js", "Tailwind", "MDX", "Sanity CMS"],
    delivered: [
      "9 practice-area pages",
      "Attorney profiles + case studies",
      "Secure intake form with document upload",
      "Editorial brand system",
    ],
    year: "2026",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "real-estate",
    name: "Real estate portal",
    vertical: "Real estate",
    verticalSlug: "real-estate",
    tagline: "Property-listing platform with interactive maps + agent dashboard.",
    description:
      "Search-first real-estate portal — filterable by area, budget, amenity. Interactive Mapbox integration. Agent-facing dashboard for lead tracking. WhatsApp-first lead capture.",
    stack: ["Next.js", "Mapbox", "Tailwind", "Prisma", "Postgres"],
    delivered: [
      "Search + filter + map listings",
      "Agent dashboard for inquiries",
      "WhatsApp lead routing",
      "Admin CMS for properties",
    ],
    year: "2026",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "interior-design",
    name: "Interior design studio",
    vertical: "Local business · Interiors",
    verticalSlug: "local-business",
    tagline: "Portfolio-led interior design studio site with project gallery + lead intake.",
    description:
      "Photography-first gallery with categorized projects (residential / commercial / boutique), service menu with transparent starting prices, and WhatsApp-first consultation booking.",
    stack: ["Next.js", "Tailwind", "Cloudinary"],
    delivered: [
      "Project gallery with filters",
      "Service menu + starting prices",
      "Consultation booking flow",
      "Client testimonials",
    ],
    year: "2026",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "stepin-interiors",
    name: "Turnkey interior service",
    vertical: "Local business · Interiors",
    verticalSlug: "local-business",
    tagline: "Turnkey home-interior service with transparent pricing calculator.",
    description:
      "Service-first site with an interactive pricing calculator (bedrooms × style × finishes), testimonial wall, and booked-in-30-days CTA.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    delivered: [
      "Interactive pricing calculator",
      "Testimonial wall",
      "Before/after gallery",
      "Consultation booking",
    ],
    year: "2026",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "landscape",
    name: "Landscape design studio",
    vertical: "Local business · Landscaping",
    verticalSlug: "local-business",
    tagline: "Nature-forward design studio site with seasonal portfolio + garden planner.",
    description:
      "Muted forest-green palette, seasonal project showcase, a garden-planner intake form that captures plot size + climate + budget to generate a starter proposal brief.",
    stack: ["Next.js", "Tailwind", "MDX"],
    delivered: [
      "Seasonal project portfolio",
      "Garden-planner intake form",
      "Service + pricing menu",
      "Sustainability-focused brand",
    ],
    year: "2026",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "voiceforge",
    name: "Voice-AI SaaS",
    vertical: "SaaS · Voice AI",
    verticalSlug: "saas",
    tagline: "Voice-AI SaaS with live demo + usage dashboard.",
    description:
      "B2B voice-AI platform site with an inline voice demo (record + synthesize), usage-tier pricing, team-seat billing, and an admin dashboard for API usage and voice-clone management.",
    stack: ["Next.js", "Web Audio API", "Tailwind", "Stripe billing"],
    delivered: [
      "Inline voice demo on home",
      "Usage-tier pricing page",
      "Team-seat billing + admin",
      "API docs portal",
    ],
    year: "2026",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "brandforge",
    name: "Creative agency portal",
    vertical: "Agency · Creative",
    verticalSlug: "agency",
    tagline: "Creative agency site with case-study-driven narrative + client portal.",
    description:
      "Brand agency site where every case study is a scroll-driven narrative. Client portal for project handoffs, asset libraries, and delivery milestones.",
    stack: ["Next.js", "GSAP", "Tailwind", "MDX"],
    delivered: [
      "Scroll-narrative case studies",
      "Client asset portal",
      "Project milestone tracking",
      "Editorial-grade motion system",
    ],
    year: "2026",
    liveUrl: null,
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const verticals = Array.from(
  new Set(projects.map((p) => p.verticalSlug))
).map((slug) => ({
  slug,
  label: projects.find((p) => p.verticalSlug === slug)?.vertical.split(" · ")[0] || slug,
  count: projects.filter((p) => p.verticalSlug === slug).length,
}));
