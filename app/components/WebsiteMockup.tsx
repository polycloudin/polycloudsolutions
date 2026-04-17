"use client";

// Stylized mockup of a Local Starter SMB site — clinic/salon/interior-studio style.
// Illustrative — structure shows what we ship on /digital Local Starter bundle.

export default function WebsiteMockup() {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden shadow-[0_24px_80px_-30px_rgba(10,10,10,0.18)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-5 py-3 bg-[#F6F3EA] border-b border-[var(--color-line)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
        </div>
        <span className="mono text-[11px] text-[var(--color-text-muted)] ml-3 flex items-center gap-2">
          <span>yourbusiness.in</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" />
          <span>secure</span>
        </span>
        <span className="ml-auto flex items-center gap-1">
          <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em]">LIGHTHOUSE</span>
          <span className="mono text-[10px] bg-[#15803D] text-white px-1.5 py-0.5 rounded tracking-[0.08em]">98</span>
        </span>
      </div>

      {/* Site nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-line)] bg-white">
        <span className="text-display text-[13px] tracking-tight text-[var(--color-ink)]">
          [Your Business]
          <span className="text-[var(--color-primary-orange)]">.</span>
        </span>
        <div className="hidden md:flex gap-5 text-[10px] text-[var(--color-text-secondary)]">
          <span>Services</span>
          <span>About</span>
          <span>Team</span>
          <span>Contact</span>
        </div>
        <span className="mono text-[10px] bg-[var(--color-ink)] text-white px-2 py-1 rounded tracking-[0.05em]">
          Book now →
        </span>
      </div>

      {/* Hero */}
      <div
        className="px-6 py-10 md:px-10 md:py-14 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 10% 30%, rgba(26, 95, 212, 0.06) 0%, transparent 55%), var(--color-surface)",
        }}
      >
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 items-center">
          <div>
            <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.22em] mb-3 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" />
              Trusted in Hyderabad since 2018
            </p>
            <h3
              className="text-display leading-[0.98] mb-4"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)" }}
            >
              Expert care,<br />
              <span className="text-serif-accent text-[var(--color-primary-blue)]">close to home</span>.
            </h3>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed max-w-md mb-5">
              Book an appointment in under a minute. Six specialists, one clinic. Pediatrics through orthopedics, all under one roof.
            </p>
            <div className="flex gap-2">
              <span className="mono text-[10px] bg-[var(--color-ink)] text-white px-2.5 py-1.5 rounded tracking-[0.05em]">
                Book appointment →
              </span>
              <span className="mono text-[10px] border border-[var(--color-ink)]/30 px-2.5 py-1.5 rounded tracking-[0.05em]">
                WhatsApp
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div
              className="aspect-[3/4] rounded-md relative overflow-hidden border border-[var(--color-line)]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26, 95, 212, 0.1), rgba(244, 107, 44, 0.08))",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1 w-[70%]">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded bg-[var(--color-ink)]/10"
                      style={{ opacity: 0.3 + (i % 3) * 0.2 }}
                    />
                  ))}
                </div>
              </div>
              <span className="absolute bottom-3 left-3 mono text-[8px] text-[var(--color-text-muted)] tracking-[0.1em]">
                IMG_CLINIC_HERO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="px-6 py-8 md:px-10 border-t border-[var(--color-line)]">
        <div className="flex items-baseline justify-between mb-5">
          <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.22em]">
            Services
          </p>
          <span className="mono text-[9px] text-[var(--color-text-muted)]">6 of 12 →</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {[
            { name: "General physician", detail: "Morning + evening slots" },
            { name: "Pediatrics", detail: "Kids under 14" },
            { name: "Dental", detail: "Cleanings · implants" },
            { name: "Dermatology", detail: "Skin · hair · laser" },
            { name: "Orthopedics", detail: "Bone · joint · sports" },
            { name: "Diagnostics", detail: "Blood · imaging · ECG" },
          ].map((s, i) => (
            <div
              key={i}
              className="p-3 rounded border border-[var(--color-line)] bg-[var(--color-surface)]"
            >
              <p className="text-[11px] font-medium text-[var(--color-ink)] mb-1 leading-tight">
                {s.name}
              </p>
              <p className="mono text-[8px] text-[var(--color-text-muted)] tracking-[0.05em]">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="px-6 py-4 md:px-10 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.22em]">
            Google reviews · 4.8 ★ · 284 reviews
          </p>
          <div className="flex gap-4 text-[10px] text-[var(--color-text-secondary)]">
            <span>12,400+ patients</span>
            <span className="text-[var(--color-text-muted)]">·</span>
            <span>6 years</span>
            <span className="text-[var(--color-text-muted)]">·</span>
            <span>2 locations</span>
          </div>
        </div>
      </div>

      {/* Footer w/ WhatsApp */}
      <div className="px-6 py-4 md:px-10 bg-[var(--color-ink)] text-white/70 flex items-center justify-between">
        <span className="mono text-[10px] tracking-[0.1em]">
          [Your Business] · Hyderabad
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#25D366" }}
          >
            <span className="text-white text-[9px]">✓</span>
          </span>
          <span className="mono text-[10px] tracking-[0.08em]">
            Chat on WhatsApp
          </span>
        </span>
      </div>
    </div>
  );
}
