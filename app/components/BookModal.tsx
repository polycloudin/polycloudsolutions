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
  defaultTopic?: "digital" | "consulting" | "labs" | "general";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  // Mount + unmount transitions — double-rAF so the browser paints the initial
  // off-screen state before flipping to the mounted state, guaranteeing the transition fires.
  useEffect(() => {
    if (open) {
      let frame2 = 0;
      const frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => setMounted(true));
      });
      return () => {
        cancelAnimationFrame(frame1);
        if (frame2) cancelAnimationFrame(frame2);
      };
    } else {
      setMounted(false);
      const t = setTimeout(() => {
        setStatus("idle");
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

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
      className="fixed inset-0 z-[100] h-screen w-screen flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-md transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] shadow-[0_50px_140px_-30px_rgba(10,10,10,0.6),0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.97]"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 0% 0%, rgba(26, 95, 212, 0.04) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(244, 107, 44, 0.03) 0%, transparent 55%)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-line)] hover:text-[var(--color-ink)] transition-all z-10"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="p-10 md:p-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-orange)]/10 border border-[var(--color-primary-orange)]/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-primary-orange)]">
                Received
              </span>
            </div>
            <h2
              id="book-modal-title"
              className="text-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] mb-6"
            >
              We'll be in touch within{" "}
              <span className="text-serif-accent text-[var(--color-primary-blue)]">24 hours</span>.
            </h2>
            <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed mb-8">
              We'll email you back with a short Calendly link and a couple of prep questions
              specific to what you shared. Senior team responds directly — no marketing
              autoresponder.
            </p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-11">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-orange)]/10 border border-[var(--color-primary-orange)]/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-primary-orange)]">
                Book a call
              </span>
            </div>
            <h2
              id="book-modal-title"
              className="text-display text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.05] mb-3"
            >
              Tell us a bit about your{" "}
              <span className="text-serif-accent text-[var(--color-primary-blue)]">operation</span>.
            </h2>
            <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed mb-8 max-w-[480px]">
              The more specific you are, the better the first call. We read everything.
            </p>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Your name" name="name" required placeholder="Your full name" />
                <Field
                  label="Work email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                />
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
                    { value: "labs", label: "Labs — research & technical DD" },
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
              <div className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  {errorMsg}. You can also email us directly at{" "}
                  <a href="mailto:hello@polycloud.in" className="underline font-medium">
                    hello@polycloud.in
                  </a>
                  .
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--color-line)] flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[var(--color-text-muted)] max-w-[280px] leading-relaxed">
                We reply from hello@polycloud.in. No newsletter, no CRM nurture.
              </p>
              <button
                type="submit"
                className="btn-primary inline-flex items-center gap-2 min-w-[140px] justify-center"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <>
                    <Spinner />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send it</span>
                    <span aria-hidden>↗</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
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
    <label className="block group">
      <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-secondary)] mb-2">
        {label}
        {required && (
          <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" aria-label="required" />
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white border border-[var(--color-line)] rounded-lg px-3.5 py-3 text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)]/70 transition-all duration-150 focus:outline-none focus:border-[var(--color-primary-blue)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary-blue)]/10 hover:border-[var(--color-text-muted)]/40"
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
      <span className="block text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-secondary)] mb-2">
        {label}
      </span>
      <div className="relative">
        <select
          name={name}
          defaultValue={defaultValue}
          className="w-full appearance-none bg-white border border-[var(--color-line)] rounded-lg pl-3.5 pr-10 py-3 text-[14px] text-[var(--color-ink)] transition-all duration-150 focus:outline-none focus:border-[var(--color-primary-blue)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary-blue)]/10 hover:border-[var(--color-text-muted)]/40 cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 4.5 6 7.5 9 4.5" />
          </svg>
        </span>
      </div>
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
      <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-secondary)] mb-2">
        {label}
        {required && (
          <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" aria-label="required" />
        )}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-white border border-[var(--color-line)] rounded-lg px-3.5 py-3 text-[14px] leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)]/70 transition-all duration-150 focus:outline-none focus:border-[var(--color-primary-blue)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary-blue)]/10 hover:border-[var(--color-text-muted)]/40 resize-none"
      />
    </label>
  );
}
