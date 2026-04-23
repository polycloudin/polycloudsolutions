import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Real Estate OS — the operating system for Indian developers | PolyCloud",
  description:
    "A 10-phase platform for Indian real-estate developers. Phase 0 ships first — a 49-module market-intelligence layer that pays for itself by preventing one bad land deal. Founding-partner terms open to the first five builders.",
  alternates: { canonical: "/solutions/real-estate" },
  keywords: [
    "real estate CRM India",
    "developer platform India",
    "Dharani land due diligence",
    "builder CRM Hyderabad",
    "GSTR RERA real estate",
  ],
};

const phases = [
  { num: "PH 0", name: "Market Intel", when: "Day 0–30", wedge: true },
  { num: "PH 1", name: "Land DD", when: "Day 30+" },
  { num: "PH 2", name: "Approvals", when: "Day 60+" },
  { num: "PH 3", name: "Pre-Launch", when: "Day 60–90" },
  { num: "PH 4", name: "Sales", when: "Day 90–180" },
  { num: "PH 5", name: "Construction", when: "Day 180+" },
  { num: "PH 6", name: "Handover", when: "Year 1+" },
  { num: "PH 7", name: "Asset Mgmt", when: "Year 2" },
  { num: "PH 8", name: "Operations", when: "Year 2" },
  { num: "PH 9", name: "Strategic", when: "Year 2+" },
];

const painStats = [
  { num: "12", label: "Tools the average mid-tier developer runs" },
  { num: "63%", label: "Leads lost between WhatsApp, CRM, and site visit" },
  { num: "18mo", label: "Typical construction delay vs RERA promise" },
];

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="consulting" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-28 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1280px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">For real-estate developers · Hyderabad 2026</p>
          </div>
          <h1 className="text-display text-[clamp(2.25rem,8vw,7rem)] mb-8 md:mb-10 max-w-[1100px] leading-[0.95]">
            The operating system{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">for Indian real-estate developers</span>.
          </h1>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              One platform replaces twelve tools. Built for how India actually buys, sells and approves real estate — not how Silicon Valley imagines it does. Phase 0 — the intelligence layer — ships in 30 days. The rest follows demand.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/realty/pitch.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Download the deck (PDF)
              </a>
              <BookButton variant="secondary" topic="consulting">
                Talk to the team ↗
              </BookButton>
            </div>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="px-6 md:px-10 py-14 md:py-20 border-t border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">Where the leakage happens</p>
              <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] max-w-2xl leading-[1.05]">
                A dozen disconnected tools that don&apos;t talk to each other.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              CRM here, WhatsApp there, an agency for ads, a vendor for tours, spreadsheets for inventory, email for everything else. Lead leakage at every handoff. No single source of truth. No accountability when something breaks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {painStats.map((p, i) => (
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-5">
                <div className="text-display text-[clamp(3rem,7vw,5.5rem)] leading-none mb-3 text-[var(--color-primary-orange)]">
                  {p.num}
                </div>
                <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sequence */}
      <section className="px-6 md:px-10 py-16 md:py-28 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">How we earn the platform</p>
              <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] max-w-2xl leading-[1.05]">
                Phase 0 ships first.{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">The rest follows demand.</span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              We don&apos;t ask you to migrate your stack on day one. We ask you to plug in the intelligence layer for ninety days. If it pays for itself, we earn the right to phase two.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-10 gap-1.5 min-w-[900px]">
              {phases.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-md p-3 ${
                    p.wedge
                      ? "bg-[var(--color-ink)] text-white"
                      : "bg-white border border-[var(--color-line)]"
                  }`}
                >
                  <p
                    className={`mono text-[9px] uppercase tracking-[0.14em] mb-1 ${
                      p.wedge ? "text-[var(--color-primary-orange)]" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {p.num}
                  </p>
                  <p
                    className={`text-[12.5px] font-medium leading-tight mb-1 ${
                      p.wedge ? "text-white" : "text-[var(--color-ink)]"
                    }`}
                  >
                    {p.name}
                  </p>
                  <p
                    className={`mono text-[9.5px] tracking-[0.04em] ${
                      p.wedge ? "text-white/60" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {p.when}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-20 md:py-32 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 100%, rgba(26, 95, 212, 0.28) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">The offer · first 5 builders only</p>
          <h2 className="text-display text-[clamp(2rem,6vw,5rem)] mb-10 leading-[0.95]">
            Are we right about your pain?{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">Will Phase 0 prove it in 90 days?</span>
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            Book a 30-minute meeting with the team. No deck. No pre-prep. We&apos;ll demo the intel dashboard with your closest competitor&apos;s data already loaded.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookButton variant="light-primary" topic="consulting">
              WhatsApp the team ↗
            </BookButton>
            <a
              href="/realty/pitch.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
            >
              Download the full deck
            </a>
            <Link
              href="/consulting"
              className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
            >
              ← Back to consulting
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
