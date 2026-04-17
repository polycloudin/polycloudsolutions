"use client";

// Stylized mockup of a D2C storefront + WhatsApp post-purchase flow.
// Illustrative — shows what we ship on /solutions/d2c.

export default function EcommerceMockup() {
  return (
    <div className="grid md:grid-cols-[1.5fr_1fr] gap-5 items-stretch">
      {/* Storefront */}
      <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden shadow-[0_24px_80px_-30px_rgba(10,10,10,0.18)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-5 py-3 bg-[#F6F3EA] border-b border-[var(--color-line)]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
          </div>
          <span className="mono text-[11px] text-[var(--color-text-muted)] ml-3 flex items-center gap-2">
            <span>shop.yourbrand.in</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" />
            <span>store</span>
          </span>
        </div>

        {/* Store nav */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-line)]">
          <span className="text-display text-[12px] tracking-tight">
            [Brand]
            <span className="text-[var(--color-primary-orange)]">.</span>
          </span>
          <div className="hidden md:flex gap-4 text-[10px] text-[var(--color-text-secondary)]">
            <span>Shop</span>
            <span>Collections</span>
            <span>Story</span>
          </div>
          <span className="mono text-[10px] text-[var(--color-text-secondary)] tracking-[0.08em]">
            Cart · 2
          </span>
        </div>

        {/* Hero strip */}
        <div
          className="px-5 py-6 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 30% 50%, rgba(244, 107, 44, 0.08) 0%, transparent 60%), var(--color-surface)",
          }}
        >
          <p className="mono text-[9px] text-[var(--color-primary-orange)] tracking-[0.22em] uppercase mb-2">
            New · Spring '26 drop
          </p>
          <h3
            className="text-display leading-[0.95] mb-3"
            style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)" }}
          >
            Small batch.<br />
            <span className="text-serif-accent text-[var(--color-primary-blue)]">Shipped fast</span>.
          </h3>
          <div className="flex gap-2">
            <span className="mono text-[10px] bg-[var(--color-ink)] text-white px-2.5 py-1.5 rounded">
              Shop the drop →
            </span>
          </div>
        </div>

        {/* Product grid */}
        <div className="px-5 py-5 border-t border-[var(--color-line)]">
          <div className="flex items-baseline justify-between mb-4">
            <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.22em]">
              Bestsellers
            </p>
            <span className="mono text-[9px] text-[var(--color-text-muted)]">View all →</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { name: "Kesari", price: "₹2,480", hue: "rgba(244, 107, 44, 0.18)" },
              { name: "Indigo", price: "₹3,120", hue: "rgba(26, 95, 212, 0.18)" },
              { name: "Mint", price: "₹1,980", hue: "rgba(15, 128, 61, 0.14)" },
            ].map((p, i) => (
              <div key={i}>
                <div
                  className="aspect-[4/5] rounded-md mb-2 border border-[var(--color-line)] relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${p.hue}, transparent 80%), var(--color-surface-warm)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1 w-[55%]">
                      {[...Array(4)].map((_, j) => (
                        <div
                          key={j}
                          className="aspect-square rounded-sm bg-[var(--color-ink)]/10"
                          style={{ opacity: 0.3 + (j % 2) * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 mono text-[8px] text-[var(--color-primary-orange)] bg-white/80 backdrop-blur px-1 py-0.5 rounded tracking-[0.05em]">
                    NEW
                  </span>
                </div>
                <p className="text-[10px] font-medium text-[var(--color-ink)] leading-tight">
                  {p.name}
                </p>
                <p className="mono text-[10px] text-[var(--color-text-secondary)]">{p.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="px-5 py-3 bg-[var(--color-surface-warm)] border-t border-[var(--color-line)] flex justify-between flex-wrap gap-2">
          <span className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
            Razorpay · Ships all-India · 7-day returns
          </span>
          <span className="mono text-[9px] text-[var(--color-primary-orange)] uppercase tracking-[0.15em]">
            ★ 4.8 · 1,284 reviews
          </span>
        </div>
      </div>

      {/* WhatsApp post-purchase */}
      <div className="flex flex-col">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
            Post-purchase → WhatsApp
          </p>
        </div>
        <div
          className="rounded-xl border-[10px] border-[var(--color-ink)] bg-[#E5DDD5] overflow-hidden flex-1"
          style={{ maxHeight: "520px" }}
        >
          {/* WhatsApp header */}
          <div
            className="px-3 py-2.5 flex items-center gap-2"
            style={{ backgroundColor: "#075E54" }}
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">[B]</span>
            </div>
            <div>
              <p className="text-white text-[11px] font-medium leading-tight">[Brand]</p>
              <p className="text-white/70 mono text-[8px] tracking-[0.08em]">online · verified business</p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-3 space-y-2 overflow-y-auto h-full bg-[#E5DDD5]">
            {/* System */}
            <div className="flex justify-center">
              <span className="mono text-[8px] text-[var(--color-text-muted)] bg-white/50 px-2 py-0.5 rounded">
                Today · 9:42 AM
              </span>
            </div>

            {/* Brand msg — order confirmation */}
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white rounded-md px-2.5 py-1.5 shadow-sm">
                <p className="text-[10px] leading-relaxed text-[var(--color-ink)]">
                  Hi [Name], your order <span className="mono text-[9px]">#4821</span> is confirmed.
                </p>
                <p className="text-[10px] leading-relaxed text-[var(--color-ink)] mt-1">
                  2 items · ₹4,460 · shipping Tue Apr 21
                </p>
                <p className="mono text-[8px] text-[var(--color-text-muted)] mt-1 text-right">
                  9:42 AM ✓✓
                </p>
              </div>
            </div>

            {/* Brand msg — shipping */}
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white rounded-md px-2.5 py-1.5 shadow-sm">
                <p className="text-[10px] leading-relaxed text-[var(--color-ink)]">
                  Shipped! Track here: <span className="text-[var(--color-primary-blue)] underline">bit.ly/tr-4821</span>
                </p>
                <p className="mono text-[8px] text-[var(--color-text-muted)] mt-1 text-right">
                  Apr 20 · 11:15 AM ✓✓
                </p>
              </div>
            </div>

            {/* User reply */}
            <div className="flex justify-end">
              <div
                className="max-w-[70%] rounded-md px-2.5 py-1.5"
                style={{ backgroundColor: "#DCF8C6" }}
              >
                <p className="text-[10px] leading-relaxed text-[var(--color-ink)]">
                  Received, love the packaging 🧡
                </p>
                <p className="mono text-[8px] text-[var(--color-text-muted)] mt-1 text-right">
                  Apr 22 · 4:08 PM
                </p>
              </div>
            </div>

            {/* Brand msg — review request */}
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white rounded-md px-2.5 py-1.5 shadow-sm">
                <p className="text-[10px] leading-relaxed text-[var(--color-ink)]">
                  So glad! Quick favor — a line about your experience?
                </p>
                <div className="flex gap-1 mt-1.5">
                  <span className="mono text-[9px] border border-[var(--color-primary-blue)]/40 text-[var(--color-primary-blue)] px-1.5 py-0.5 rounded">
                    Leave review
                  </span>
                  <span className="mono text-[9px] border border-[var(--color-line)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded">
                    Later
                  </span>
                </div>
                <p className="mono text-[8px] text-[var(--color-text-muted)] mt-1 text-right">
                  Apr 22 · 4:10 PM ✓✓
                </p>
              </div>
            </div>

            {/* Brand msg — reorder nudge */}
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white rounded-md px-2.5 py-1.5 shadow-sm">
                <p className="text-[10px] leading-relaxed text-[var(--color-ink)]">
                  Running low? Kesari is back in stock 🧡
                </p>
                <span className="inline-block mt-1.5 mono text-[9px] bg-[var(--color-primary-blue)] text-white px-1.5 py-0.5 rounded">
                  Reorder · 15% off →
                </span>
                <p className="mono text-[8px] text-[var(--color-text-muted)] mt-1 text-right">
                  Day 45 · automated ✓✓
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.08em] mt-3">
          Confirmation · tracking · review · reorder — all automated on WhatsApp Business API.
        </p>
      </div>
    </div>
  );
}
