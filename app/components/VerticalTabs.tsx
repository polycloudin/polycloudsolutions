"use client";

import { useState } from "react";

const verticals = [
  {
    name: "SaaS",
    headline: "Conversion engines for product-led growth.",
    description:
      "Messaging automation that qualifies demo requests, CRM flows that route hot leads to founders within minutes, and content engines that ship SEO-ready long-form weekly.",
    flagship: "Lead-routing pipeline",
    flagshipDetail: "Qualified demo request → enriched in 15 seconds → routed to the right founder's Slack. Sub-2-minute response SLA, measured.",
    tags: "Lead scoring · Cold outbound · Long-form SEO · Signup analytics",
  },
  {
    name: "D2C brands",
    headline: "Full-funnel growth, from ad-click to repeat purchase.",
    description:
      "Google and Meta ad management, WhatsApp-first post-purchase flows, abandoned-cart recovery, and attribution pipelines that separate channel noise from channel truth.",
    flagship: "WhatsApp post-purchase engine",
    flagshipDetail: "Order confirmation through review request, all on WhatsApp Business API. 40%+ reorder lift on the two brands we've shipped it to.",
    tags: "Paid ads · WhatsApp flows · Cart recovery · Attribution",
  },
  {
    name: "Fintech",
    headline: "Compliance and AI, built to ship under RBI scrutiny.",
    description:
      "RBI FREE-AI compliance workflows, KYC automation, bank-statement analysis pipelines, and audit-trail infrastructure that survives regulator review.",
    flagship: "Bank statement analyzer",
    flagshipDetail: "90+ Indian bank formats parsed, alternative credit signals computed, exception routing to human underwriters. Perfios quality at a tenth of the cost.",
    tags: "FREE-AI compliance · KYC · Statement analysis · Audit trails",
  },
  {
    name: "Professional services",
    headline: "AI employees for CA firms, law firms, and advisories.",
    description:
      "GSTR-2B reconciliation, client communication automation, compliance tracking, and document processing — sitting on top of the tools your team already uses (Tally, Zoho, existing DMS).",
    flagship: "GSTR-2B reconciliation engine",
    flagshipDetail: "Fuzzy invoice matching across GSTIN and amount tolerance. 10+ hours of manual work collapsed to under 2, per filing cycle. Flagship consulting engagement.",
    tags: "GSTR-2B · Client comms · Compliance · Docs",
  },
  {
    name: "Healthcare",
    headline: "Appointment and billing automation that meets clinical standards.",
    description:
      "WhatsApp-based appointment booking, automated payment reminders, EHR integration patterns, and compliance-first patient-data handling.",
    flagship: "WhatsApp appointment flow",
    flagshipDetail: "Patient books, reschedules, and pays entirely on WhatsApp. Receptionist gets a morning digest. No-shows down 30% on the clinics we've shipped this to.",
    tags: "Appointments · Payments · EHR · Patient privacy",
  },
  {
    name: "Manufacturing",
    headline: "Invoice-to-reconciliation pipelines and vendor comms.",
    description:
      "Automated 3-way match (PO → GRN → supplier invoice), vendor follow-up flows on WhatsApp, ERP integration (Tally, SAP, Zoho), and dashboards that replace monthly MIS grind.",
    flagship: "3-way match pipeline",
    flagshipDetail: "Purchase order, goods receipt, and supplier invoice matched automatically. Exceptions queued for finance review — not every line item, only the ones that actually need a human.",
    tags: "3-way match · Vendor comms · ERP · Live MIS",
  },
];

export default function VerticalTabs() {
  const [active, setActive] = useState(0);
  const current = verticals[active];

  return (
    <div>
      {/* Tab pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {verticals.map((v, i) => (
          <button
            key={v.name}
            onClick={() => setActive(i)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: active === i ? "#0A0A0A" : "transparent",
              color: active === i ? "white" : "var(--color-ink)",
              border: "1px solid",
              borderColor: active === i ? "#0A0A0A" : "rgba(10,10,10,0.15)",
            }}
          >
            {v.name}
          </button>
        ))}
      </div>

      {/* Expanded panel */}
      <div
        key={active}
        className="bg-white border border-[var(--color-line)] rounded-xl p-10 md:p-14 anim-fade-in"
      >
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16">
          <div>
            <p className="text-eyebrow text-[var(--color-primary-orange)] mb-5">
              For {current.name}
            </p>
            <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] mb-6">
              {current.headline}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed max-w-xl">
              {current.description}
            </p>
            <p className="mono text-[11px] text-[var(--color-text-muted)] mt-8 tracking-[0.08em]">
              {current.tags}
            </p>
          </div>
          <div className="md:border-l md:border-[var(--color-line)] md:pl-14">
            <p className="text-eyebrow text-[var(--color-text-muted)] mb-4">
              Flagship — {current.flagship}
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--color-text)]">
              {current.flagshipDetail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
