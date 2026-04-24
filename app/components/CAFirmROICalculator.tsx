"use client";

import { useMemo, useState } from "react";

// Retainer tiers for "net margin" calculation.
const TIERS = [
  { name: "Starter", monthly: 20_000, min: 15_000, max: 25_000, tools: 4 },
  { name: "Growth", monthly: 30_000, min: 25_000, max: 35_000, tools: 7 },
  { name: "Pro", monthly: 55_000, min: 45_000, max: 65_000, tools: 34 },
] as const;

function formatINR(n: number): string {
  if (n >= 1_00_00_000) return `${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(2)} L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${Math.round(n).toLocaleString("en-IN")}`;
}

export default function CAFirmROICalculator() {
  const [clients, setClients] = useState(40);
  const [hoursPerClient, setHoursPerClient] = useState(8);
  const [loadedRate, setLoadedRate] = useState(1500);
  const [selectedTier, setSelectedTier] = useState<0 | 1 | 2>(2); // Pro by default

  const math = useMemo(() => {
    const beforeHoursPerMonth = clients * hoursPerClient;
    const afterHoursPerMonth = clients * 0.75; // 45 min per client post-toolkit
    const hoursSaved = beforeHoursPerMonth - afterHoursPerMonth;

    const beforeCost = beforeHoursPerMonth * loadedRate;
    const afterCost = afterHoursPerMonth * loadedRate;
    const grossMonthlySavings = beforeCost - afterCost;

    const tier = TIERS[selectedTier];
    const retainer = tier.monthly;
    const netMonthlySavings = grossMonthlySavings - retainer;
    const netAnnualSavings = netMonthlySavings * 12;

    // Capacity freed: reinvest saved hours into new clients at same hours/client
    const additionalClientCapacity = Math.floor(hoursSaved / hoursPerClient);
    const additionalRevenueAtRetainer = additionalClientCapacity * 18_000; // ₹18K/mo/client assumption

    const breakevenClients = Math.ceil(retainer / (hoursPerClient * 0.906 * loadedRate));
    // 0.906 = fraction of hours saved (8h → 45min is 90.6%)

    return {
      beforeHoursPerMonth,
      afterHoursPerMonth,
      hoursSaved,
      grossMonthlySavings,
      netMonthlySavings,
      netAnnualSavings,
      additionalClientCapacity,
      additionalRevenueAtRetainer,
      breakevenClients,
      tierName: tier.name,
      tierPrice: `${formatINR(tier.min)}–${formatINR(tier.max)}`,
      roiMultiple: retainer > 0 ? grossMonthlySavings / retainer : 0,
    };
  }, [clients, hoursPerClient, loadedRate, selectedTier]);

  return (
    <section className="px-6 md:px-10 py-16 md:py-28 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
          <div>
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
              Calculate your ROI
            </p>
            <h2 className="text-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] max-w-3xl">
              Your numbers.{" "}
              <span className="text-serif-accent text-[var(--color-primary-blue)]">
                Our math.
              </span>
            </h2>
            <p className="mt-4 text-[15px] md:text-[17px] text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Slide to your book size. See monthly savings, annual margin, and
              the capacity you could sell next season. Defaults are from a
              real 4-partner Hyderabad firm.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6 lg:gap-10">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-[var(--color-line)] p-7 md:p-9">
            <p className="text-eyebrow text-[var(--color-text-muted)] mb-7">
              Your firm
            </p>

            <div className="space-y-8">
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-[14px] font-medium text-[var(--color-ink)]">
                    Active clients
                  </label>
                  <span className="mono text-[20px] text-[var(--color-ink)]">
                    {clients}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={1}
                  value={clients}
                  onChange={(e) => setClients(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary-blue)]"
                  aria-label="Active clients"
                />
                <div className="flex justify-between mono text-[10px] text-[var(--color-text-muted)] mt-1">
                  <span>5</span>
                  <span>60</span>
                  <span>120+</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-[14px] font-medium text-[var(--color-ink)]">
                    Hours/client/month today
                  </label>
                  <span className="mono text-[20px] text-[var(--color-ink)]">
                    {hoursPerClient}h
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={hoursPerClient}
                  onChange={(e) => setHoursPerClient(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary-blue)]"
                  aria-label="Hours per client per month"
                />
                <div className="flex justify-between mono text-[10px] text-[var(--color-text-muted)] mt-1">
                  <span>3h</span>
                  <span>10h</span>
                  <span>20h</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-[14px] font-medium text-[var(--color-ink)]">
                    Loaded cost/hour
                  </label>
                  <span className="mono text-[20px] text-[var(--color-ink)]">
                    ₹{loadedRate.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={600}
                  max={3500}
                  step={100}
                  value={loadedRate}
                  onChange={(e) => setLoadedRate(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary-blue)]"
                  aria-label="Loaded cost per hour"
                />
                <div className="flex justify-between mono text-[10px] text-[var(--color-text-muted)] mt-1">
                  <span>Article ₹600</span>
                  <span>Senior ₹1.5K</span>
                  <span>Partner ₹3.5K</span>
                </div>
              </div>

              <div>
                <p className="text-[14px] font-medium text-[var(--color-ink)] mb-3">
                  Tier
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TIERS.map((t, i) => {
                    const active = i === selectedTier;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelectedTier(i as 0 | 1 | 2)}
                        className={
                          "rounded-lg px-3 py-3 text-left transition-all border " +
                          (active
                            ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                            : "bg-white text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-ink)]")
                        }
                      >
                        <p
                          className={
                            "text-[12px] font-medium mb-0.5 " +
                            (active ? "text-white" : "text-[var(--color-ink)]")
                          }
                        >
                          {t.name}
                        </p>
                        <p
                          className={
                            "mono text-[10px] tracking-[0.05em] " +
                            (active
                              ? "text-white/70"
                              : "text-[var(--color-text-muted)]")
                          }
                        >
                          ₹{(t.min / 1000).toFixed(0)}–{(t.max / 1000).toFixed(0)}K/mo
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div
            className="rounded-2xl p-7 md:p-9 relative overflow-hidden text-white"
            style={{ backgroundColor: "#0A0A0A" }}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 100% 0%, rgba(26, 95, 212, 0.30) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 0% 100%, rgba(244, 107, 44, 0.20) 0%, transparent 60%)",
              }}
            />
            <div className="relative">
              <p className="text-eyebrow text-white/50 mb-7">
                Results · on {math.tierName}
              </p>

              {/* Hero result — net monthly savings */}
              <div className="mb-8">
                <p className="mono text-[11px] tracking-[0.18em] uppercase text-white/50 mb-3">
                  Net monthly savings
                </p>
                <p
                  className={
                    "text-display leading-none " +
                    (math.netMonthlySavings >= 0
                      ? "text-white"
                      : "text-[#F46B2C]")
                  }
                  style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
                >
                  {math.netMonthlySavings >= 0 ? "₹" : "-₹"}
                  {formatINR(Math.abs(math.netMonthlySavings))}
                </p>
                <p className="mt-3 text-[14px] text-white/70 leading-relaxed">
                  {math.netMonthlySavings >= 0 ? (
                    <>
                      That&apos;s{" "}
                      <span className="text-white font-medium">
                        ₹{formatINR(math.netAnnualSavings)}/year
                      </span>{" "}
                      after paying {math.tierName} retainer ({math.tierPrice}
                      /mo).
                    </>
                  ) : (
                    <>
                      {math.tierName} costs more than this book saves. Drop a
                      tier, or grow the book before upgrading.
                    </>
                  )}
                </p>
              </div>

              {/* Secondary stats grid */}
              <div className="grid grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden mb-8">
                <div className="bg-black/40 p-4 md:p-5">
                  <p className="mono text-[9px] uppercase tracking-[0.18em] text-white/50 mb-2">
                    Hours saved/mo
                  </p>
                  <p className="text-display text-[22px] md:text-[28px] leading-none text-white">
                    {Math.round(math.hoursSaved)}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1.5 leading-tight">
                    {math.beforeHoursPerMonth}h → {Math.round(math.afterHoursPerMonth)}h
                  </p>
                </div>
                <div className="bg-black/40 p-4 md:p-5">
                  <p className="mono text-[9px] uppercase tracking-[0.18em] text-white/50 mb-2">
                    ROI multiple
                  </p>
                  <p className="text-display text-[22px] md:text-[28px] leading-none text-white">
                    {math.roiMultiple.toFixed(1)}×
                  </p>
                  <p className="text-[11px] text-white/60 mt-1.5 leading-tight">
                    vs retainer cost
                  </p>
                </div>
                <div className="bg-black/40 p-4 md:p-5">
                  <p className="mono text-[9px] uppercase tracking-[0.18em] text-white/50 mb-2">
                    Break-even
                  </p>
                  <p className="text-display text-[22px] md:text-[28px] leading-none text-white">
                    {math.breakevenClients}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1.5 leading-tight">
                    client
                    {math.breakevenClients !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Capacity */}
              <div className="border-t border-white/15 pt-6">
                <p className="mono text-[11px] tracking-[0.18em] uppercase text-white/50 mb-2">
                  Capacity freed
                </p>
                <p className="text-[14px] text-white leading-relaxed">
                  Same team could take{" "}
                  <span className="font-medium text-[var(--color-primary-orange)]">
                    {math.additionalClientCapacity} more clients
                  </span>{" "}
                  at current workload. At a ₹18K retainer, that&apos;s
                  another{" "}
                  <span className="font-medium text-[var(--color-primary-orange)]">
                    ₹{formatINR(math.additionalRevenueAtRetainer * 12)}/year
                  </span>{" "}
                  top-line.
                </p>
              </div>

              {/* Method disclosure */}
              <p className="mt-6 mono text-[10px] tracking-[0.1em] text-white/35 leading-relaxed">
                Assumes 45-min post-toolkit close per client (firm benchmark).
                Retainer shown at tier midpoint. Capacity math assumes reinvested
                hours at same hours/client rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
