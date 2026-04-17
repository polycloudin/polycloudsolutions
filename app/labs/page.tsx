import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Labs — AI infrastructure products | PolyCloud",
  description:
    "BizAPI, HILA, AgentIAM, PromptCI, ModelRoute. The infrastructure layer between models and production AI systems.",
};

const products = [
  {
    num: "01",
    name: "BizAPI",
    domain: "bizapi.in",
    tagline: "The API layer Indian AI was waiting for.",
    description:
      "Clean, typed, versioned REST endpoints for India's business systems — GSTN, Tally, MCA21, EPFO, eCourts, NSDL. Sandbox mode. Agent-consumable schemas. We maintain the connectors so you don't.",
    capabilities: ["GSTN", "Tally", "MCA21", "EPFO", "eCourts", "NSDL", "TRACES", "UPI"],
    pricing: "₹4,999 → ₹49,999+/mo",
    status: "70% built",
  },
  {
    num: "02",
    name: "HILA",
    domain: "hila.so",
    tagline: "Where AI outputs go to get approved.",
    description:
      "A structured database purpose-built for human-AI collaboration. Agents write rows. Humans review, correct, approve. Corrections are captured as training data. Webhooks close the loop back to the agent.",
    capabilities: ["Schema inference", "Review states", "Correction diffs", "Webhooks", "Fine-tune export"],
    pricing: "$0 → $999+/mo",
    status: "Design phase",
  },
  {
    num: "03",
    name: "AgentIAM",
    domain: "agentiam.dev",
    tagline: "Okta for AI agents.",
    description:
      "Identity and access management built for agents, not humans. Scoped token minting. Instant revocation. Audit logs. Cross-tenant auth. The authorization layer every production agent system will need.",
    capabilities: ["Agent registry", "Scoped tokens", "Instant revocation", "MCP integration", "Budget controls"],
    pricing: "$0 → $1,999+/mo",
    status: "Spec complete",
  },
  {
    num: "04",
    name: "PromptCI",
    domain: "promptci.dev",
    tagline: "dbt for prompts.",
    description:
      "Version control, testing, CI/CD, and canary deployment for the prompt layer. Open-source core. Hosted infrastructure. The prompt layer deserves the same rigor SQL transformations got a decade ago.",
    capabilities: ["Version control", "Eval suite", "CI/CD gates", "Canary deploys", "A/B testing"],
    pricing: "OSS + $49 → $999+/mo",
    status: "Pre-launch",
  },
  {
    num: "05",
    name: "ModelRoute",
    domain: "modelroute.io",
    tagline: "Stop paying GPT-4 prices for GPT-3.5 tasks.",
    description:
      "OpenAI-compatible proxy that classifies each request and routes to the cheapest capable model. 70-80% of LLM spend shifts to free-tier models without quality loss. Revenue share aligned with your savings.",
    capabilities: ["Auto-classify", "Multi-tier routing", "Drop-in replacement", "Cost analytics", "Savings dashboard"],
    pricing: "15-25% of savings",
    status: "MVP ready",
  },
];

const moat = [
  {
    label: "Permanently off frontier roadmaps",
    body: "BizAPI requires Tally ODBC, GSTN XML quirks, and Indian regulatory maintenance. Frontier labs will not build this — zero strategic incentive, every reason to avoid it.",
  },
  {
    label: "Opposite goal = defensible product",
    body: "HILA keeps humans in the loop. Anthropic, OpenAI, Google are optimizing for agent autonomy. They cannot ship infrastructure that works against their own product direction.",
  },
  {
    label: "Direct revenue conflict",
    body: "ModelRoute routes away from Claude. No frontier lab can ship a router that moves traffic to cheaper competitors. This is the strongest moat of the five.",
  },
];

export default function Labs() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(26, 95, 212, 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(244, 107, 44, 0.04) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Labs — AI Infrastructure · In Development</p>
          </div>

          <h1 className="text-display text-[clamp(2.75rem,10vw,9rem)] mb-10 max-w-[1250px] leading-[0.95]">
            The connective tissue of{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">production AI</span>.
          </h1>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              Models are cheap. Frameworks are solved. What's missing is the infrastructure layer between them — the connectors, the human-review systems, the agent authorization, the prompt supply chain, the cost routers. We're building all five.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:labs@polycloud.in" className="btn-primary">
                Request early access ↗
              </a>
              <Link href="#products" className="btn-secondary">
                View products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Thesis */}
      <section className="px-6 md:px-10 py-24 md:py-32 border-t border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">01 / Strategic frame</p>
          <p className="text-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.15] tracking-tight">
            The AI ecosystem is at{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">1994 internet</span>.
            Models exist. Frameworks exist. Applications exist. The infrastructure layer between them{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">does not</span>.
          </p>
          <p className="mt-10 text-[var(--color-text-secondary)] text-[15px] leading-relaxed max-w-2xl">
            Frontier labs won't build it — wrong incentives. Cloud giants haven't colonized this space yet — they're 12-18 months behind. India-specific infrastructure is permanently defensible. The window is open now.
          </p>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / The five products</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                Each one <span className="text-serif-accent">feeds</span> the others.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              BizAPI supplies data. Agents process it. HILA approves outputs. AgentIAM controls access. ModelRoute optimizes cost. PromptCI manages it all.
            </p>
          </div>

          <div className="space-y-5">
            {products.map((p) => (
              <div
                key={p.num}
                className="bg-white rounded-xl border border-[var(--color-line)] p-8 md:p-12 card-hover"
              >
                <div className="grid md:grid-cols-[0.5fr_1.2fr_1fr] gap-10">
                  {/* Index + name */}
                  <div>
                    <p className="mono text-xs text-[var(--color-primary-orange)] mb-4">{p.num}</p>
                    <h3 className="text-display text-[clamp(2rem,3vw,2.75rem)] leading-none mb-3">
                      {p.name}
                    </h3>
                    <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
                      {p.domain}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
                      <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                        {p.status}
                      </span>
                    </div>
                  </div>

                  {/* Tagline + description */}
                  <div>
                    <p className="text-display text-[clamp(1.25rem,1.8vw,1.6rem)] text-[var(--color-primary-blue)] leading-[1.3] mb-4 text-serif-accent">
                      {p.tagline}
                    </p>
                    <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Features + pricing */}
                  <div>
                    <p className="text-eyebrow text-[var(--color-text-muted)] mb-4">Capabilities</p>
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {p.capabilities.map((c) => (
                        <span
                          key={c}
                          className="mono text-[11px] px-2.5 py-1 rounded border border-[var(--color-line)] text-[var(--color-text-secondary)]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-eyebrow text-[var(--color-text-muted)] mb-2">Pricing</p>
                    <p className="mono text-[13px] text-[var(--color-primary-blue)]">{p.pricing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moat */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Why this compounds</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                What frontier labs <span className="text-serif-accent">cannot</span> build.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Three structural reasons why this infrastructure layer stays open — long enough to build a real business inside it.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {moat.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[var(--color-line)] p-10 card-hover"
              >
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-5">0{i + 1}</p>
                <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] mb-5 leading-tight">
                  {m.label}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-24 md:py-36 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 10% 100%, rgba(26, 95, 212, 0.2) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">04 / Engage</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            We're hiring early{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">design partners</span>.
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            Building AI infrastructure for India or running AI in production? We want to understand your workflow before we ship. In exchange: first access, influence on the roadmap, and our stack at cost.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:labs@polycloud.in"
              className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)] hover:!text-white"
            >
              labs@polycloud.in ↗
            </a>
            <Link
              href="/"
              className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
            >
              Back to PolyCloud
            </Link>
          </div>
          <p className="mono text-[11px] text-white/40 tracking-[0.15em] mt-14 uppercase">
            Launching as a separate brand at polycloud.ai · Target Q3 2026
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-display text-xl tracking-tight">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline">Consulting</Link>
          <Link href="/labs" className="link-underline text-[var(--color-ink)] font-medium">Labs</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
          <a href="https://cal.com/polycloud/intro" className="btn-primary !py-2 !px-4 !text-[13px]">
            Book a call
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="px-6 md:px-10 py-14 bg-[var(--color-ink)] border-t border-white/10 text-white/60">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-display text-lg text-white">
            Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
          </span>
          <span className="text-white/30">·</span>
          <span>© 2026 · Est. 2020</span>
        </div>
        <div className="flex gap-8">
          <Link href="/digital" className="hover:text-white transition-colors">Digital</Link>
          <Link href="/consulting" className="hover:text-white transition-colors">Consulting</Link>
          <Link href="/labs" className="hover:text-white transition-colors">Labs</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
