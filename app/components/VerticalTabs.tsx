"use client";

import { useState } from "react";

const verticals = [
  {
    name: "SaaS",
    headline: "Conversion engines for product-led growth.",
    description:
      "Messaging automation that qualifies demo requests, CRM flows that route hot leads to founders within minutes, content engines that ship SEO-ready long-form weekly.",
    deliverables: ["Lead scoring + routing", "Cold email automation", "SEO long-form content", "Product-signup analytics"],
  },
  {
    name: "D2C brands",
    headline: "Full-funnel growth, from ad-click to repeat purchase.",
    description:
      "Google + Meta ad management, WhatsApp-first post-purchase flows, abandoned-cart recovery, and attribution pipelines that separate channel noise from channel truth.",
    deliverables: ["Google + Meta ads", "WhatsApp post-purchase", "Abandoned-cart recovery", "Multi-touch attribution"],
  },
  {
    name: "Fintech",
    headline: "Compliance + AI, built to ship under RBI scrutiny.",
    description:
      "RBI FREE-AI compliance workflows, KYC automation, bank-statement analysis pipelines, and audit-trail infrastructure that survives regulator review.",
    deliverables: ["RBI FREE-AI compliance", "Bank statement analysis", "KYC automation", "Audit trail infrastructure"],
  },
  {
    name: "Professional services",
    headline: "AI employees for CA firms, law firms, and advisories.",
    description:
      "GSTR-2B reconciliation, client communication automation, compliance tracking, and document processing — built on top of the tools your team already uses (Tally, Zoho, existing DMS).",
    deliverables: ["GSTR-2B reconciliation", "Client comms automation", "Compliance tracking", "Document processing"],
  },
  {
    name: "Healthcare",
    headline: "Appointment + billing automation that meets clinical standards.",
    description:
      "WhatsApp-based appointment booking, automated payment reminders, EHR integration patterns, and compliance-first patient-data handling.",
    deliverables: ["WhatsApp appointments", "Payment reminders", "EHR integration", "HIPAA-style data handling"],
  },
  {
    name: "Manufacturing",
    headline: "Invoice-to-reconciliation pipelines + vendor comms.",
    description:
      "Automated 3-way match (PO → GRN → invoice), vendor follow-up flows on WhatsApp, ERP integration (Tally, SAP, Zoho), and dashboards that replace monthly MIS grind.",
    deliverables: ["3-way match automation", "Vendor comms", "ERP integration", "Live MIS dashboards"],
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
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16">
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
          </div>
          <div>
            <p className="text-eyebrow text-[var(--color-text-muted)] mb-5">What we build</p>
            <ul className="space-y-3">
              {current.deliverables.map((d) => (
                <li
                  key={d}
                  className="text-[14px] text-[var(--color-text)] flex gap-3 items-baseline"
                >
                  <span className="text-[var(--color-primary-blue)] text-xs">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
