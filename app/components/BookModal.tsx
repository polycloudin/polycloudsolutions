"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function BookModal({
  open,
  onClose,
  defaultTopic,
}: {
  open: boolean;
  onClose: () => void;
  defaultTopic?: "digital" | "consulting" | "general";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset form state when closed
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus("idle");
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm anim-fade-in"
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-line)] w-full max-w-[620px] max-h-[92vh] overflow-y-auto anim-fade-up shadow-[0_40px_120px_-30px_rgba(10,10,10,0.5)]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-line)] transition-colors z-10"
          aria-label="Close"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        {status === "success" ? (
          <div className="p-10 md:p-14">
            <p className="text-eyebrow text-[var(--color-primary-orange)] mb-5">Received</p>
            <h2 id="book-modal-title" className="text-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] mb-6">
              We'll be in touch within <span className="text-serif-accent text-[var(--color-primary-blue)]">24 hours</span>.
            </h2>
            <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed mb-8">
              We'll email you back with a short Calendly link and a couple of prep questions specific to what you shared. Senior team responds directly — no marketing autoresponder.
            </p>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-10 md:p-12">
            <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">Book a call</p>
            <h2 id="book-modal-title" className="text-display text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.05] mb-3">
              Tell us a bit about your <span className="text-serif-accent text-[var(--color-primary-blue)]">operation</span>.
            </h2>
            <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed mb-8">
              The more specific you are, the better the first call. We read everything.
            </p>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Your name" name="name" required placeholder="Your full name" />
                <Field label="Work email" name="email" type="email" required placeholder="you@company.com" />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Company" name="company" placeholder="Optional" />
                <Select
                  label="What brings you here"
                  name="topic"
                  defaultValue={defaultTopic || "general"}
                  options={[
                    { value: "digital", label: "Digital — websites, ads, automation" },
                    { value: "consulting", label: "Consulting — AI integration" },
                    { value: "general", label: "Not sure yet" },
                  ]}
                />
              </div>

              <Select
                label="Where you are"
                name="stage"
                defaultValue="exploring"
                options={[
                  { value: "exploring", label: "Just exploring" },
                  { value: "scoping", label: "Ready to scope a pilot" },
                  { value: "urgent", label: "Active need — this quarter" },
                ]}
              />

              <Textarea
                label="What you're trying to build"
                name="message"
                required
                placeholder="One or two paragraphs on the workflow, team size, or outcome you have in mind."
                rows={4}
              />

              {/* Honeypot */}
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                className="absolute left-[-9999px]"
                aria-hidden="true"
              />
            </div>

            {status === "error" && (
              <p className="mt-5 text-sm text-[var(--color-error)]">
                {errorMsg}. You can also email us directly at{" "}
                <a href="mailto:hello@polycloud.in" className="underline">hello@polycloud.in</a>.
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="submit" className="btn-primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : "Send it ↗"}
              </button>
              <p className="text-xs text-[var(--color-text-muted)]">
                We reply from hello@polycloud.in. No newsletter, no CRM nurture.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">
        {label}
        {required && <span className="text-[var(--color-primary-orange)] ml-1">·</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white border border-[var(--color-line)] rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-white border border-[var(--color-line)] rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  name,
  required = false,
  placeholder,
  rows = 4,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">
        {label}
        {required && <span className="text-[var(--color-primary-orange)] ml-1">·</span>}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-white border border-[var(--color-line)] rounded-md px-3 py-2.5 text-[14px] leading-relaxed focus:outline-none focus:border-[var(--color-ink)] transition-colors resize-none"
      />
    </label>
  );
}
