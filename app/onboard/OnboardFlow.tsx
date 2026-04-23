"use client";

import { useState } from "react";

type Bundle = "local-starter" | "growth" | "total-growth";

interface IntakeData {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  vertical: string;
  bundle: Bundle;
  current_tools: string[];
  monthly_leads_now: string;
  monthly_ad_spend: string;
  pain_point: string;
}

const STEPS = ["About you", "Pick a bundle", "Current state"] as const;

const BUNDLES: { id: Bundle; name: string; setup: string; monthly: string; for: string }[] = [
  {
    id: "local-starter",
    name: "Local Starter",
    setup: "₹70K",
    monthly: "₹12K / mo",
    for: "Single-location shops getting online right",
  },
  {
    id: "growth",
    name: "Growth",
    setup: "₹1.5L",
    monthly: "₹32K / mo",
    for: "Multi-channel — ads, content, CRM running on one dashboard",
  },
  {
    id: "total-growth",
    name: "Total Growth",
    setup: "₹3L",
    monthly: "₹65K / mo",
    for: "Multi-location + video + dedicated operator",
  },
];

export default function OnboardFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    city: "Hyderabad",
    vertical: "",
    bundle: "growth",
    current_tools: [],
    monthly_leads_now: "",
    monthly_ad_spend: "",
    pain_point: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof IntakeData>(k: K, v: IntakeData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function toggleTool(tool: string) {
    setData((d) => ({
      ...d,
      current_tools: d.current_tools.includes(tool)
        ? d.current_tools.filter((t) => t !== tool)
        : [...d.current_tools, tool],
    }));
  }

  async function onSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Submission failed. Try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canAdvance = [
    Boolean(data.business_name && data.contact_name && data.email && data.phone && data.vertical),
    Boolean(data.bundle),
    Boolean(data.pain_point),
  ];

  if (submitted) {
    return <SuccessCard bundle={data.bundle} />;
  }

  return (
    <div>
      <Stepper step={step} total={STEPS.length} />

      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 md:p-8">
        <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-1">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="text-[20px] md:text-[24px] font-medium tracking-tight mb-6">
          {STEPS[step]}
        </h2>

        {step === 0 && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Business name"
                value={data.business_name}
                onChange={(v) => update("business_name", v)}
                placeholder="Kumar Textiles"
                required
              />
              <Field
                label="Your name"
                value={data.contact_name}
                onChange={(v) => update("contact_name", v)}
                placeholder="Rajesh Kumar"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Work email"
                type="email"
                value={data.email}
                onChange={(v) => update("email", v)}
                placeholder="owner@kumartextiles.in"
                required
              />
              <Field
                label="WhatsApp number"
                type="tel"
                value={data.phone}
                onChange={(v) => update("phone", v)}
                placeholder="+91 98xxxxxxx"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="City"
                value={data.city}
                onChange={(v) => update("city", v)}
                placeholder="Hyderabad"
              />
              <SelectField
                label="Industry"
                value={data.vertical}
                onChange={(v) => update("vertical", v)}
                required
                options={[
                  { value: "", label: "Pick one…" },
                  { value: "retail-textile", label: "Retail · Textile / Saree / Jewellery" },
                  { value: "retail-other", label: "Retail · Other" },
                  { value: "food-bev", label: "Food · Restaurant / Cafe" },
                  { value: "health", label: "Healthcare · Clinic / Dentist" },
                  { value: "education", label: "Education · Coaching / School" },
                  { value: "services", label: "Professional services · CA / Lawyer / Architect" },
                  { value: "beauty", label: "Beauty · Salon / Spa" },
                  { value: "real-estate", label: "Real estate · Broker / Developer" },
                  { value: "d2c", label: "D2C brand" },
                  { value: "other", label: "Something else" },
                ]}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {BUNDLES.map((b) => {
              const active = data.bundle === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => update("bundle", b.id)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all ${
                    active
                      ? "border-[var(--color-ink)] bg-[var(--color-surface)]"
                      : "border-[var(--color-line)] bg-white hover:border-[var(--color-text-secondary)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                          active
                            ? "border-[var(--color-ink)] bg-[var(--color-ink)]"
                            : "border-[var(--color-line)]"
                        }`}
                      />
                      <p className="text-[16px] md:text-[17px] font-medium tracking-tight">
                        {b.name}
                      </p>
                    </div>
                    <p className="mono text-[12px] font-medium text-right shrink-0">
                      {b.setup}
                      <span className="text-[var(--color-text-muted)]"> + {b.monthly}</span>
                    </p>
                  </div>
                  <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-snug ml-6">
                    {b.for}
                  </p>
                </button>
              );
            })}
            <p className="text-[12px] text-[var(--color-text-muted)] pt-2">
              Not sure? Most Hyderabad SMBs start at Growth. You can upgrade/downgrade month-to-month.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2 block">
                What tools are you using today? (tap all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Meta Ads",
                  "Google Ads",
                  "GMB",
                  "Instagram",
                  "WhatsApp Business",
                  "Tally",
                  "Zoho",
                  "Razorpay",
                  "Shopify",
                  "JustDial",
                  "Spreadsheets + paper",
                ].map((tool) => {
                  const on = data.current_tools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`px-3 py-1.5 rounded-full text-[12.5px] border transition-colors ${
                        on
                          ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                          : "bg-white text-[var(--color-text)] border-[var(--color-line)] hover:border-[var(--color-ink)]"
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Leads / month today (rough)"
                value={data.monthly_leads_now}
                onChange={(v) => update("monthly_leads_now", v)}
                placeholder="~100"
              />
              <Field
                label="Monthly ad spend (optional)"
                value={data.monthly_ad_spend}
                onChange={(v) => update("monthly_ad_spend", v)}
                placeholder="₹40,000"
              />
            </div>

            <div>
              <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5 block">
                What&apos;s the #1 thing wasting your time? *
              </label>
              <textarea
                value={data.pain_point}
                onChange={(e) => update("pain_point", e.target.value)}
                rows={3}
                placeholder="e.g. I reply to 40 WhatsApp enquiries a day. I miss the ones that come after 9pm."
                className="w-full px-4 py-3 border border-[var(--color-line)] rounded-lg bg-white text-[14px] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/10 resize-none"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-[var(--color-line)]">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-[13.5px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance[step]}
              className="px-5 py-2.5 bg-[var(--color-ink)] text-white rounded-lg text-[14px] font-medium hover:bg-[var(--color-primary-blue)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canAdvance[step] || submitting}
              className="px-5 py-2.5 bg-[var(--color-ink)] text-white rounded-lg text-[14px] font-medium hover:bg-[var(--color-primary-blue)] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit intake <span className="opacity-70">↗</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i <= step
              ? "bg-[var(--color-ink)]"
              : "bg-[var(--color-line)]"
          }`}
        />
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5 block">
        {label} {required && <span className="text-[var(--color-primary-orange)]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[var(--color-line)] rounded-lg bg-white text-[14px] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/10 transition-all"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5 block">
        {label} {required && <span className="text-[var(--color-primary-orange)]">*</span>}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-[var(--color-line)] rounded-lg bg-white text-[14px] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/10 transition-all appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SuccessCard({ bundle }: { bundle: Bundle }) {
  const b = BUNDLES.find((x) => x.id === bundle) ?? BUNDLES[1];
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-8 md:p-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-5">
        <span className="text-2xl">✓</span>
      </div>
      <h2 className="text-display text-[clamp(1.5rem,4vw,2rem)] leading-[1.1] mb-3">
        Got it. We&apos;re on it.
      </h2>
      <p className="text-[14.5px] text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto mb-6">
        Your intake is in our queue. We&apos;ll review within 24 hours and
        email you a signed scope for the{" "}
        <span className="font-medium text-[var(--color-ink)]">{b.name}</span>{" "}
        bundle ({b.setup} + {b.monthly}). Your dashboard goes live within
        5 working days of signature.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-[13px] text-[var(--color-text-muted)]">
        <a
          href="mailto:hello@polycloud.in"
          className="mono uppercase tracking-wider hover:text-[var(--color-ink)]"
        >
          hello@polycloud.in
        </a>
        <span className="hidden sm:inline">·</span>
        <a
          href="tel:+919999999999"
          className="mono uppercase tracking-wider hover:text-[var(--color-ink)]"
        >
          Book a call
        </a>
      </div>
    </div>
  );
}
