import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "../../../../components/BookButton";
import SiteNav from "../../../../components/SiteNav";
import SiteFooter from "../../../../components/SiteFooter";
import {
  getCompanyBySlug,
  allCompanySlugs,
  INDIAN_PHARMA,
  type CliffExposure,
} from "../../../../../lib/labs/indian-pharma";

// Pre-build all 12 company pages at build time
export async function generateStaticParams() {
  return allCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: "Company not found — PolyCloud Labs" };
  return {
    title: `${company.name} — Labs company dossier`,
    description: `${company.legalName} · CIN ${company.cin} · ${company.cliffExposures.length} US patent cliff exposures · ${company.cdscoFilings90d.length} recent CDSCO filings · DD grade ${company.ddGrade}.`,
    alternates: { canonical: `/labs/dashboard/company/${slug}` },
  };
}

const actionColor = (a: CliffExposure["action"]) =>
  a === "urgent"
    ? "text-[var(--color-primary-orange)] font-semibold"
    : a === "hot"
    ? "text-[var(--color-primary-blue)] font-semibold"
    : a === "warm"
    ? "text-[var(--color-ink)] font-medium"
    : "text-[var(--color-text-secondary)]";

const gradeBadgeClass = (grade: string) => {
  if (grade.startsWith("A")) return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
  if (grade.startsWith("B")) return "bg-[var(--color-primary-blue)]/10 text-[var(--color-primary-blue)] border-[var(--color-primary-blue)]/30";
  if (grade.startsWith("C")) return "bg-[var(--color-primary-orange)]/10 text-[var(--color-primary-orange)] border-[var(--color-primary-orange)]/30";
  return "bg-gray-500/10 text-gray-600 border-gray-500/30";
};

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const age = 2026 - company.incorporatedYear;
  const relatedCompanies = INDIAN_PHARMA
    .filter((c) => c.slug !== company.slug && c.state === company.state)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="labs" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-40 pb-12 md:pb-16 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(244, 107, 44, 0.08) 0%, transparent 60%), radial-gradient(ellipse 45% 40% at 85% 100%, rgba(26, 95, 212, 0.04) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)] mono uppercase tracking-[0.15em] mb-6">
            <Link href="/labs" className="hover:text-[var(--color-ink)] transition-colors">Labs</Link>
            <span>·</span>
            <Link href="/labs/dashboard" className="hover:text-[var(--color-ink)] transition-colors">Dashboard</Link>
            <span>·</span>
            <span className="text-[var(--color-text-secondary)]">Company</span>
          </nav>

          <div className="flex flex-wrap items-start gap-4 mb-4">
            <h1 className="text-display text-[clamp(2rem,6.5vw,4.75rem)] leading-[0.98]">
              {company.name}
            </h1>
            <span
              className={`mono text-[11px] uppercase tracking-[0.18em] border px-3 py-1.5 rounded-md ${gradeBadgeClass(
                company.ddGrade,
              )}`}
            >
              DD {company.ddGrade} · {company.ddScore}/100
            </span>
          </div>

          <p className="text-[var(--color-text-secondary)] text-[15px] md:text-[17px] max-w-3xl leading-relaxed mb-2">
            {company.legalName} · <span className="mono text-[13px]">{company.cin}</span>
          </p>
          <p className="text-[var(--color-text-secondary)] text-[14px] max-w-3xl leading-relaxed">
            Incorporated {company.incorporatedYear} ({age} years) · Registered office: {company.registeredOffice} · {company.state}
          </p>

          <p className="text-[15px] text-[var(--color-ink)] max-w-3xl leading-relaxed mt-6">
            {company.strategicNote}
          </p>
        </div>
      </section>

      {/* Headline metrics */}
      <section className="px-6 md:px-10 pb-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
              <div className="w-10 h-1 mb-4 rounded-full bg-[var(--color-primary-blue)]" />
              <p className="text-display text-[clamp(1.5rem,2.25vw,2rem)] leading-none mb-2">₹{company.paidUpCapitalCr.toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr</p>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">Paid-up capital</p>
            </div>
            {company.marketCapEstimateCr && (
              <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
                <div className="w-10 h-1 mb-4 rounded-full bg-[var(--color-primary-orange)]" />
                <p className="text-display text-[clamp(1.5rem,2.25vw,2rem)] leading-none mb-2">
                  ₹{(company.marketCapEstimateCr / 1000).toFixed(0)}K Cr
                </p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">Market cap · est</p>
              </div>
            )}
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
              <div className="w-10 h-1 mb-4 rounded-full bg-[var(--color-primary-blue)]" />
              <p className="text-display text-[clamp(1.5rem,2.25vw,2rem)] leading-none mb-2">{company.directorsCount}</p>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">Directors on board</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
              <div className="w-10 h-1 mb-4 rounded-full bg-[var(--color-primary-orange)]" />
              <p className="text-display text-[clamp(1.5rem,2.25vw,2rem)] leading-none mb-2">{company.cliffExposures.length}</p>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">US patent cliffs (24mo)</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
              <div className="w-10 h-1 mb-4 rounded-full bg-[var(--color-primary-blue)]" />
              <p className="text-display text-[clamp(1.5rem,2.25vw,2rem)] leading-none mb-2">{company.cdscoFilings90d.length}</p>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">CDSCO filings · 90d</p>
            </div>
          </div>
        </div>
      </section>

      {/* § 1 Corporate profile */}
      <section className="px-6 md:px-10 py-12 md:py-20 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">§ 1 / Corporate profile · MCA21</p>
          <h2 className="text-[clamp(1.5rem,3.25vw,2.5rem)] mb-10 leading-[1.05]">
            Who runs it. What filings look clean.
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-6 md:p-8">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">Board composition</p>
              <div className="space-y-3">
                {company.notableDirectors.map((d) => (
                  <div key={d.name} className="flex justify-between items-baseline border-b border-[var(--color-line)] last:border-b-0 pb-3 last:pb-0">
                    <span className="text-[14px] text-[var(--color-text-secondary)]">{d.role}</span>
                    <span className="text-[14px] font-semibold text-[var(--color-ink)]">{d.name}</span>
                  </div>
                ))}
                <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] pt-2">
                  {company.directorsCount} total directors on record
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-6 md:p-8">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">Governance flags</p>
              <ul className="space-y-2.5">
                {company.governanceFlags.map((flag, i) => (
                  <li key={i} className="text-[13.5px] text-[var(--color-text-secondary)] leading-snug flex items-start gap-2">
                    <span className="text-[var(--color-primary-blue)] mt-1">→</span>
                    <span>{flag}</span>
                  </li>
                ))}
                {company.recentCharges90d > 0 && (
                  <li className="text-[13.5px] text-[var(--color-primary-orange)] leading-snug flex items-start gap-2">
                    <span className="mt-1">⚠</span>
                    <span className="font-semibold">
                      {company.recentCharges90d} new charges filed in last 90 days
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* § 2 Cliff exposure */}
      <section className="px-6 md:px-10 py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">§ 2 / US patent cliff exposure · 24-month window</p>
          <h2 className="text-[clamp(1.5rem,3.25vw,2.5rem)] mb-10 leading-[1.05]">
            Molecules they&apos;re <span className="text-serif-accent text-[var(--color-primary-orange)]">attacking</span>. Action-ordered.
          </h2>
          {company.cliffExposures.length > 0 ? (
            <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-[var(--color-line)]">
                      <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Active ingredient</th>
                      <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Originator</th>
                      <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Indian status</th>
                      <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] tabular-nums">Cliff</th>
                      <th className="text-left px-5 py-4 mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.15em]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.cliffExposures.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-surface-warm)]/40 transition-colors"
                      >
                        <td className="px-5 py-4 font-semibold text-[var(--color-ink)]">{row.activeIngredient}</td>
                        <td className="px-5 py-4 text-[var(--color-text-secondary)]">{row.originator} · <span className="italic">{row.tradeName}</span></td>
                        <td className="px-5 py-4 text-[var(--color-text-secondary)]">{row.indianStatus}</td>
                        <td className="px-5 py-4 mono text-[12px] text-[var(--color-text-secondary)] tabular-nums">{row.cliffDate}</td>
                        <td className={`px-5 py-4 ${actionColor(row.action)} uppercase tracking-tight text-[12.5px]`}>
                          {row.action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[var(--color-text-secondary)]">No direct matches in the current 24-month cliff window. This company&apos;s US exposure is below the noise floor for the Patent Cliff Calendar.</p>
          )}
        </div>
      </section>

      {/* § 3 Recent CDSCO filings */}
      <section className="px-6 md:px-10 py-12 md:py-20 bg-[#0A0A0A] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 15% 20%, rgba(26, 95, 212, 0.25) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 85% 80%, rgba(244, 107, 44, 0.15) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <p className="text-eyebrow text-white/40 mb-4">§ 3 / CDSCO India · last 90 days</p>
          <h2 className="text-[clamp(1.5rem,3.25vw,2.5rem)] mb-10 leading-[1.05]">
            Regulatory <span className="text-serif-accent text-[var(--color-primary-blue)]">pulse</span> from MCA-joined CDSCO feed.
          </h2>
          {company.cdscoFilings90d.length > 0 ? (
            <div className="grid gap-3">
              {company.cdscoFilings90d.map((f, i) => (
                <a
                  key={i}
                  href="https://cdsco.gov.in/opencms/opencms/en/Notifications/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/5 hover:bg-white/[0.09] border border-white/10 hover:border-white/25 rounded-lg px-5 py-4 transition-colors group"
                >
                  <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                    <span className="mono text-[11px] text-[var(--color-primary-orange)] uppercase tracking-[0.15em] whitespace-nowrap">
                      {f.date}
                    </span>
                    <span className="mono text-[10px] text-white/40 uppercase tracking-[0.15em] bg-white/5 px-2 py-0.5 rounded whitespace-nowrap">
                      {f.source}
                    </span>
                    <span className="text-white/85 text-[14px] flex-1 group-hover:text-white transition-colors">{f.title}</span>
                    <span className="text-white/30 text-[14px] group-hover:text-white/60 transition-colors">↗</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-[14px]">No CDSCO activity in the last 90 days. Watch the next refresh.</p>
          )}
        </div>
      </section>

      {/* § 4 Active clinical trials */}
      <section className="px-6 md:px-10 py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">§ 4 / Active CTRI trials · this sponsor</p>
          <h2 className="text-[clamp(1.5rem,3.25vw,2.5rem)] mb-10 leading-[1.05]">
            What they&apos;re running in <span className="text-serif-accent">India</span> right now.
          </h2>
          {company.activeCTRITrials.length > 0 ? (
            <div className="space-y-3">
              {company.activeCTRITrials.map((t, i) => (
                <div key={i} className="bg-white rounded-xl border border-[var(--color-line)] p-5">
                  <div className="grid md:grid-cols-[auto_1fr_auto] gap-4 items-start">
                    <span className="mono text-[12px] text-[var(--color-primary-blue)] font-semibold tabular-nums">{t.registration}</span>
                    <span className="text-[14px] text-[var(--color-text-secondary)]">
                      <span className="font-semibold text-[var(--color-ink)]">{t.phase}</span> · {t.indication}
                    </span>
                    <span className="mono text-[11px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-[var(--color-text-secondary)]">No active CTRI trials registered under this sponsor in the current window.</p>
          )}
        </div>
      </section>

      {/* § 5 Related — same state */}
      {relatedCompanies.length > 0 && (
        <section className="px-6 md:px-10 py-12 md:py-20 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
          <div className="max-w-[1440px] mx-auto">
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">§ 5 / Regional peers · {company.state}</p>
            <h2 className="text-[clamp(1.5rem,3.25vw,2.25rem)] mb-8 leading-[1.05]">
              Other {company.state}-registered pharma cos under monitoring.
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCompanies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/labs/dashboard/company/${c.slug}`}
                  className="group bg-white rounded-xl border border-[var(--color-line)] p-6 hover:border-[var(--color-primary-blue)]/40 transition-colors block"
                >
                  <p className="text-display text-[20px] leading-tight mb-2 group-hover:text-[var(--color-primary-blue)] transition-colors">{c.name}</p>
                  <p className="text-[12.5px] text-[var(--color-text-secondary)] mb-3">{c.legalName}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
                    <span>₹{c.paidUpCapitalCr.toFixed(0)} Cr</span>
                    <span>·</span>
                    <span>{c.cliffExposures.length} cliffs</span>
                    <span>·</span>
                    <span className="mono">{c.ddGrade}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-14 md:py-24 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.2) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-6">Engage</p>
          <h2 className="text-display text-[clamp(1.75rem,4.5vw,3.25rem)] mb-6 leading-[0.98]">
            Want the full dossier on {company.name}?
          </h2>
          <p className="text-white/60 text-[15px] max-w-2xl leading-relaxed mb-8">
            This public dossier is a snapshot. Commissioned engagements include: per-molecule DMF/ANDA status, Para IV timeline mapping, director-network cross-linkage across portfolio cos, charge-mortgage ledger, 5-year financial ratios, and live MCA21 filing alerts.
          </p>
          <div className="flex flex-wrap gap-5 items-center">
            <BookButton variant="light-primary">Request the full dossier ↗</BookButton>
            <Link href="/labs/dashboard" className="text-[14px] text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">
              ← Back to dashboard
            </Link>
          </div>
          <p className="mt-8 mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
            Sourced via BizAPI MCA connector · snapshot Apr 24 2026 · refreshed monthly
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
