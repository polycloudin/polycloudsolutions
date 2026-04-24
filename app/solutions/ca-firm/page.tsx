import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import CAFirmROICalculator from "../../components/CAFirmROICalculator";
import DashboardMockup from "../../components/DashboardMockup";
import MockupLightbox from "../../components/MockupLightbox";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "CA Firm AI Employee — 37 tools, end-to-end practice automation",
  description:
    "A 37-tool AI employee installed on your firm's laptop. Every workflow a mid-size CA firm runs — GSTR-2B recon, bank → Tally, TDS + 24Q, Form 3CD, CARO + Schedule III, payroll + Form 16, UDIN, 15CA/CB, notice response, GST litigation, FEMA, transfer pricing, peer review, CPE tracking, partner review queue. ₹15-45K/mo + seats. Live demo at polycloud.in/ca-firm.",
  alternates: { canonical: "/solutions/ca-firm" },
  keywords: [
    "CA firm automation",
    "GSTR-2B reconciliation",
    "bank statement to Tally",
    "TDS 26Q FVU",
    "Form 3CD auto documentation",
    "CARO 2020 automation",
    "Schedule III classification",
    "compliance calendar CA",
    "e-invoice IRN",
    "AIS ITR pre-fill",
    "ICAI peer review",
    "MCA21 ROC tracker",
    "UDIN automation",
    "Form 15CB",
    "Form 3CEB transfer pricing",
    "FEMA FC-GPR FC-TRS",
    "payroll Form 16 24Q",
    "notice response IT GST",
    "DRC-03 DRC-06",
    "CMA report bank financing",
    "fixed asset register WDV SLM",
    "SA 230 working papers",
    "SA 220 client acceptance",
    "CPE articleship tracking",
    "audit workbench",
    "advisory copilot",
    "Tally automation",
    "GST compliance automation",
    "AI for CA firms",
    "invoice OCR Tally",
    "client MIS dashboard",
    "receivables automation",
    "WhatsApp vendor follow-up",
  ],
};

type Tool = {
  num: string;
  tier: "Starter" | "Growth" | "Pro" | "Seats" | "Platform";
  name: string;
  tagline: string;
  description: string;
  deliverable: string;
};

const tools: Tool[] = [
  {
    num: "01",
    tier: "Starter",
    name: "Reconciliation engine",
    tagline: "GSTR-2B ↔ Tally purchase register in minutes.",
    description:
      "Ingests GSTR-2B JSON from the GST portal and the purchase register from Tally, matches on GSTIN + invoice number + amount with tolerance, outputs a 5-sheet Excel: Summary, Matched, Mismatches, Only-in-Books, Vendor Follow-up. Every row tagged with the reason and the ITC-at-risk rupee amount.",
    deliverable: "One Excel file per filing cycle. Runs in 90 seconds on 5,000-invoice registers.",
  },
  {
    num: "02",
    tier: "Starter",
    name: "WhatsApp vendor follow-up",
    tagline: "Three templates, Meta-approved, one command to send.",
    description:
      "Pulls the Vendor Follow-up sheet from the reconciliation output and generates personalized WhatsApp messages per vendor — missing invoice request, amount mismatch query, GSTIN correction ask. Templates are pre-approved by Meta. Every send is logged to a CSV audit trail.",
    deliverable: "Automated vendor outreach. CAs stop chasing invoices over email.",
  },
  {
    num: "03",
    tier: "Starter",
    name: "Invoice OCR to Tally",
    tagline: "Client sends a photo. You get a voucher draft.",
    description:
      "Clients WhatsApp invoice images to a dedicated business number. OCR extracts the raw text; a frontier vision-LLM structures vendor, GSTIN, invoice number, HSN codes, line items, and taxes. A balanced double-entry Tally XML voucher is drafted and queued for CA review before posting. Accuracy: 92%+ on 25 real Indian invoices in sprint testing.",
    deliverable: "No more manual data entry. Clients contribute to bookkeeping without training.",
  },
  {
    num: "04",
    tier: "Starter",
    name: "ITC risk dashboard",
    tagline: "One screen. Real-time. Runs locally.",
    description:
      "FastAPI backend + SQLite + Next.js frontend, installed on the CA's laptop. Shows monthly ITC claimed vs available vs at-risk, top-10 leaking vendors, trend chart across the last 12 months. No data leaves the firm — everything runs on localhost.",
    deliverable: "Partners get a morning dashboard. CFO clients can log in to their own slice.",
  },
  {
    num: "05",
    tier: "Growth",
    name: "Bank statement → Tally voucher",
    tagline: "Bank PDF in. Tally Prime XML out.",
    description:
      "Ingests ICICI CSV, HDFC XLSX, SBI text, Axis/Kotak statements (plus RBI Account Aggregator JSON). Classifies each debit into 6 categories — vendor payment, salary, GST challan, loan EMI, inter-account, bank charges — using Gemma 4 locally or a deterministic rule engine. Joins vendor payments back to the GSTR-2B recon (GSTIN → fuzzy name → amount). Outputs Tally Prime import XML + a CA review spreadsheet with yellow-highlighted edge cases.",
    deliverable: "3–5 hrs/month/client of manual voucher entry collapses to a one-click review.",
  },
  {
    num: "06",
    tier: "Growth",
    name: "TDS tracker + 26Q FVU draft",
    tagline: "Deductions in. NSDL-ready FVU out.",
    description:
      "Pulls TDS deductions from Tally across sections 194A/C/H/J/I/Q, computes quarterly 26Q, generates the NSDL FVU upload file with proper BATCHA / CD / DD / BATCHB records and MD5 checksum. Flags PAN mismatches (no-PAN → 20% rate), short deductions, and calculates Section 201(1A) interest on late deposits (1.5%/month, calendar-month math, March → 30 April CBDT extension).",
    deliverable: "4–6 hrs/quarter per company client gone. Interest-penalty surprises gone.",
  },
  {
    num: "07",
    tier: "Growth",
    name: "Compliance calendar + WhatsApp alerts",
    tagline: "Every deadline, every client, every month. No spreadsheet.",
    description:
      "Per-client state machine for GSTR-1 (11th), GSTR-3B (20th / QRMP 22nd), TDS deposit (7th), advance tax (15 Jun/Sep/Dec/Mar), 26Q return, ROC AOC-4 (30 Oct), MGT-7 (29 Nov), ITR (31 Jul / 31 Oct), GSTR-9/9C (31 Dec). WhatsApp reminders escalate through UPCOMING → DUE_SOON → REMINDED → CONFIRMED → FILED / OVERDUE. Inbound reply classifier understands English + Hindi (\"done\" / \"ho gaya\" / \"kal karenge\") via Gemma 4 local, keyword fallback when offline.",
    deliverable: "Partner sees month-at-a-glance for every client. Zero missed deadlines.",
  },
  {
    num: "08",
    tier: "Pro",
    name: "Form 3CD auto-documentation",
    tagline: "44 clauses. 6 auto-filled. 38 honestly scaffolded.",
    description:
      "Pulls Tally trial balance + ledgers to auto-populate the six clauses that eat 70% of audit hours — cl.18 depreciation (block-wise, WDV, half-year rule), cl.21(a) disallowable u/s 40(a)/40A(3)/43B, cl.22 MSMED 45-day Section 23, cl.23 40A(2)(b) related-party (flags >15% over market), cl.27(a) ITC, cl.34 TDS compliance with interest. The other 38 clauses are modelled + marked MANUAL_ONLY — we're honest about what's not automated. Exports JSON (IT-portal ready), HTML (browser-print), XLSX (yellow/red status review).",
    deliverable: "Tax audit season compresses from 50–70 hrs/client to 10–15 hrs/client.",
  },
  {
    num: "09",
    tier: "Pro",
    name: "Client MIS dashboard",
    tagline: "White-labeled. Multi-tenant. Shipped monthly.",
    description:
      "One SQLite per client at ~/.ca-firm/clients/<slug>/mis.db — zero cross-tenant leakage. Monthly snapshot of revenue, net profit, GST liability vs paid, TDS deducted vs deposited, closing cash. 30/60/90-day cash flow projection using 6-month rolling average + Indian seasonality (Mar advance-tax, Nov Diwali spike, Sep-Oct inventory build). Confidence score + HEALTHY / ADEQUATE / TIGHT / CRITICAL tier. White-labeled with the firm's logo + colours.",
    deliverable: "Client CFOs stop calling the partner weekly. See a live demo at polycloud.in/ca-firm.",
  },
  {
    num: "10",
    tier: "Pro",
    name: "Receivables automation",
    tagline: "The firm's own invoices, chased on a cadence.",
    description:
      "Ingests firm-raised invoices from Zoho Books / QuickBooks / Tally exports. Five aging buckets (0–30 / 31–45 / 46–60 / 61–75 / 76+), each with a Meta-approval-style WhatsApp template — polite nudge, firm reminder (3-day ultimatum), urgent (48-hour ultimatum), partner escalation (internal, no message). 7-day cooldown with escalation-override semantics. Partner dashboard surfaces top debtors + recovery trend.",
    deliverable: "15–25% fee leakage to chase-fatigue recovered. Pays for itself on the first stuck invoice.",
  },
  {
    num: "11",
    tier: "Pro",
    name: "E-Invoice IRN at scale",
    tagline: "NIC IRP integration. Bulk IRNs. GSP-ready.",
    description:
      "Pulls sales invoices from Tally → submits to NIC IRP → collects IRN + signed QR code per invoice → writes back to Tally-importable JSON. Covers B2B / B2C / SEZ / export supply types, intra-state (CGST+SGST) + inter-state (IGST), HSN + UQC validation. Sandbox-ready today; production goes live when the firm's GSP partnership lands (3-4 month NIC application).",
    deliverable: "E-invoicing automation at threshold-drop scale. ~₹0.20-0.50 per IRN or ₹5K/mo flat.",
  },
  {
    num: "12",
    tier: "Pro",
    name: "AIS → ITR pre-fill",
    tagline: "Notice prevention. Refuses to file on mismatch.",
    description:
      "Loads AIS JSON from income-tax.gov.in → compares category-by-category against client-declared income → classifies mismatches on a 5-tier severity ladder (OK / TRIVIAL / MATERIAL / SIGNIFICANT / NOTICE_RISK). Drafts ITR XML skeleton + auto-generated client clarification letter. Blocks filing when any NOTICE_RISK mismatch exists — that's the moat.",
    deliverable: "Prevents the ITR notice before it happens. ₹2–5K per ITR-3/4/5/6 filing or included in Pro retainer.",
  },
  {
    num: "13",
    tier: "Pro",
    name: "ICAI Peer Review pack",
    tagline: "Phase IV mandate deadline: 31 Dec 2026.",
    description:
      "24-entry working-paper catalogue mapping every SA (210/220/230/240/250/260/315/330/500/530/700) to engagement types + tax-audit + GST-audit variants. Engagement letter generator (7 client types × 7 engagement types). SQC 1 20-item quality-control checklist. Firm readiness score (0–100) that predicts peer review outcome BEFORE booking the review.",
    deliverable: "₹25–50K one-time setup + ₹3K/mo maintenance. Break-even on one avoided review-failure.",
  },
  {
    num: "14",
    tier: "Pro",
    name: "MCA21 ROC tracker",
    tagline: "Every filing. Every fee. Every penalty. Formula-based.",
    description:
      "Deterministic deadline engine for AOC-4 / AOC-4 XBRL / MGT-7 / MGT-7A / DIR-3 KYC / DPT-3 / MSME-1 / Form 11 / Form 8. Fee-slab calculator by paid-up capital + per-form late penalties (₹100/day for corporate filings, flat ₹5K for DIR-3, 12×/18× slab for DPT-3). MCA21 portal scraper stubbed — firm enables with their own DSC + Playwright for filed-history lookups.",
    deliverable: "One prevented DIN deactivation pays for a year of the tool. +₹3–5K/mo per company client.",
  },
  {
    num: "15",
    tier: "Growth",
    name: "Tally ODBC connector",
    tagline: "Live queries. No more XML exports.",
    description:
      "Graceful fallback: ODBC (pyodbc, port 9000) → Tally XML HTTP → deterministic mock. Handles trial balance, ledger-group fuzzy mapping (GST/TDS/Duties auto-classified), voucher extraction. Every other tool pulls live Tally data through this — no more manual Excel exports before each recon run.",
    deliverable: "Saves 30 min/tool-run across 10+ monthly runs. Universal data plumbing.",
  },
  {
    num: "16",
    tier: "Seats",
    name: "Audit workbench (Article assistant)",
    tagline: "Five detectors. Replaces an Article's week.",
    description:
      "Statistical voucher sampling + vendor-ledger scrutiny (duplicates, round amounts, outstanding > 90 days, GSTIN state mismatch) + MSMED 45-day verifier with Section 23 indicative interest + related-party 40A(2)(b) flagging with >15% excess test + stock-count reconciliation (2% qty OR ₹10K value threshold). Every finding generates an auditable task linked to the right working paper code.",
    deliverable: "Article hours per engagement 40 → 15. +₹15K/mo per Article seat. Typical 3-5 seats/firm.",
  },
  {
    num: "17",
    tier: "Seats",
    name: "Advisory copilot (Partner assistant)",
    tagline: "30-second answer with cited precedent.",
    description:
      "Retrieval across firm's own audit log + bundled ICAI/ITAT/CBDT/GST corpus + extensible drop-in JSON. Deterministic synthesis (first-sentence answer + \"must/shall\" assumption extraction) — no hallucinated summaries. Optional Ollama Gemma 4 for tighter synthesis. Every answer ships with top-3 cited precedents + assumptions to verify.",
    deliverable: "Partner saves 2+ hrs/week of research. +₹15–25K/mo per partner seat. Typical 3-5 seats/firm.",
  },
  {
    num: "18",
    tier: "Platform",
    name: "Cross-firm intelligence layer",
    tagline: "Activates at cohort-scale. Honestly gated today.",
    description:
      "Three modules that refuse to run until PolyCloud's federated dataset crosses threshold: (D1) cross-client anomaly detection — vendor fraud + invoice inflation + revenue-recognition patterns; (D3) predictive peer review radar; (D5) cohort benchmarks (the 'Bloomberg for Indian CA' play). Each module's stub logs attempted access — that becomes our signal for demand. No fabricated cross-firm signals, ever.",
    deliverable: "Activates at 10+ firms (D1/D3) and 50+ firms (D5). Premium pricing ₹50K–1L/mo when live.",
  },
  // Full practice — 19 more tools covering every workflow a mid-size firm runs.
  {
    num: "19", tier: "Pro", name: "UDIN automation",
    tagline: "ICAI UDIN ledger + offline generator + revocation audit.",
    description:
      "Every signed document (tax audit, 3CD, 15CB, net worth, ITR) needs a UDIN from icai.org. This tool tracks every UDIN the firm has ever generated — per partner, per client, per document type — with revocation trail if a doc is amended. Offline generator mimics the 18-char ICAI format for demo + dry-run.",
    deliverable: "One searchable ledger for every UDIN the firm has issued. Partner-ready for peer review.",
  },
  {
    num: "20", tier: "Pro", name: "Payroll + Form 16 + 24Q",
    tagline: "Monthly payslips → annual Form 16 → quarterly NSDL-ready 24Q.",
    description:
      "Full Indian payroll — PF/ESI/PT (state-wise slabs, Maharashtra Feb quirk included), TDS per old/new regime with 87A rebate math, payslips, Form 16 Parts A+B, Form 24Q FVU file with the proper NSDL record structure. Covers everything a 5-50 employee SMB needs without Greytip or Zoho.",
    deliverable: "Monthly payslips. Annual Form 16 per employee. Quarterly 24Q FVU. Sub-₹5K/mo per client.",
  },
  {
    num: "21", tier: "Pro", name: "Notice response engine",
    tagline: "IT + GST notices — triage + template + case-law citations.",
    description:
      "Covers the 12 most common notices: 139(9), 143(1), 143(2), 148, 142(1), 245, 154, GST ASMT-10, DRC-01/01A, REG-17, TDS 201. Each notice triggers a severity rating (CRITICAL → LOW), a pre-built response template with client placeholders, and citations from the ICAI/ITAT/SC corpus. Partner fills in client-specific facts.",
    deliverable: "Turnaround on routine notices: 30+ hours/notice → 2-3 hours. Fee recovery: ₹3K-75K/notice.",
  },
  {
    num: "22", tier: "Pro", name: "Certifications library",
    tagline: "15CA/CB · Net Worth · Turnover · DTAA rate engine.",
    description:
      "Produces every certification a CA firm hands out monthly — Form 15CB with automatic DTAA rate lookup (US/UK/SG/DE/NL/AE, with treaty article references), 15CA Part A/B/C/D determination, net-worth certificates (visa/bank), turnover certificates (MSME Udyam, tender). PAN + FX reconciliation validators prevent amateur mistakes.",
    deliverable: "Every cert follows a checklist. Partner fills facts + signs. Turnaround days → hours.",
  },
  {
    num: "23", tier: "Pro", name: "Statutory audit pack",
    tagline: "CARO 2020 (21 clauses) + Schedule III auto-classification.",
    description:
      "For stat audits under Companies Act: auto-fills all 21 CARO 2020 clauses from management declarations (PPE records, inventory verification, MSMED, loan defaults, CSR, going concern), and classifies every Tally ledger into the 20+ Schedule III heads (Division I + II) — flagging only the unmapped ones for partner review.",
    deliverable: "CARO draft + classified BS/P&L in minutes. Unmapped ledgers flagged for partner override.",
  },
  {
    num: "24", tier: "Pro", name: "Document management + client portal",
    tagline: "Content-addressed DMS. Every doc versioned. Client sees what we share.",
    description:
      "Per-client filesystem with SHA-256 content addressing (no duplicate storage), automatic version history when a filename is re-uploaded, expiring share links (72h default), full access log. Generates a standalone HTML portal per client — client sees their docs, partner controls who sees what. No cloud, no lock-in.",
    deliverable: "Replace shared Google Drive + email-as-DMS. Every client gets a portal URL with their docs.",
  },
  {
    num: "25", tier: "Pro", name: "GST litigation — DRC-03/06 + appeals",
    tagline: "Section 73/74 math + appeal pre-deposit calculator.",
    description:
      "Voluntary DRC-03 payments with Section 73/74 penalty schedule (15% pre-SCN / 25% on reply / 50% post-order / 100% default) and s.50 interest math (18% or 24% for wrong ITC). SCN reply drafter in Form DRC-06 with case-law citations. Appeal calculator handles FAA (10% pre-deposit) and GSTAT (additional 20%) with limitation tracking.",
    deliverable: "Every litigation matter gets a structured file — demand, strategy, pre-deposit calc, reply.",
  },
  {
    num: "26", tier: "Pro", name: "Transfer pricing — Form 3CEB",
    tagline: "International txns + ALP methods + Master File thresholds.",
    description:
      "Compiles Form 3CEB for clients with cross-border transactions. Supports all 5 ALP methods (CUP/RPM/CPM/PSM/TNMM) with arm's length assessment against benchmarks. Auto-flags TP Study (> ₹1 Cr), Master File (> ₹50 Cr), and CbC thresholds. Clause 9 (transactions) and Clause 20 (ALP determination) auto-populated from structured input.",
    deliverable: "Form 3CEB draft + threshold-check + clause-wise compilation for auditor review.",
  },
  {
    num: "27", tier: "Pro", name: "FEMA compliance",
    tagline: "FC-GPR / FC-TRS / APR / FLA / ECB-2 deadline engine.",
    description:
      "For clients with FDI, ODI, or ECBs: tracks FC-GPR (30d from allotment), FC-TRS (60d from transfer), APR (annual, Dec 31), FLA (Jul 15), ECB-2 (monthly, 7th). Per-client task list with overdue detection. Essential for PE-backed startups, exporters, and any entity with cross-border flows.",
    deliverable: "One-screen FEMA calendar for the firm. No more missed FC-GPR. RBI late-fee surprises gone.",
  },
  {
    num: "28", tier: "Pro", name: "Internal audit workflows",
    tagline: "27 IFC controls across 9 areas. Sampling built in.",
    description:
      "Pre-built 27-control IFC test plan covering P2P, O2C, payroll, inventory, fixed assets, cash/bank, statutory, IT controls, revenue recognition. Statistical sampling (SRS attribute + Monetary Unit Sampling) with configurable confidence + tolerable error. Findings log with severity ladder (HIGH/MEDIUM/LOW) + management response tracking.",
    deliverable: "One IA plan per engagement. Control tests with proper sample sizes. Findings binder-ready.",
  },
  {
    num: "29", tier: "Pro", name: "Registration services",
    tagline: "11 registrations — GST · MSME · IEC · Startup India · 80G · more.",
    description:
      "Catalog of every registration a new-client engagement might need: GST, MSME Udyam, IEC, Startup India (DPIIT), Section 80G/12A, Shops & Est, FSSAI, PF/ESI, Trademark. Each with eligibility check, document checklist, lead-time estimate, govt fee + CA fee range. Eligibility engine auto-suggests the right bundle for a new client.",
    deliverable: "New-client bundle in 2 hours of partner time. Every registration onboarded by the book.",
  },
  {
    num: "30", tier: "Pro", name: "CMA reports for banks",
    tagline: "Bank-ready credit monitoring report — 7 sheets, MPBF math.",
    description:
      "Generates standard bank CMA in the Tandon Committee II format: existing+proposed limits, 3-yr historical + 2-yr projected operating statement, balance-sheet analysis, current assets & liabilities, working-capital gap, MPBF calc (75% of WCG less margin), fund flow, key ratios (GP%, NPM%, ICR, DE, TOL/TNW).",
    deliverable: "CMA for any bank (SBI, BoB, HDFC, ICICI…) in 3 hours from trial balance. ₹15-35K/report.",
  },
  {
    num: "31", tier: "Pro", name: "Fixed asset register",
    tagline: "Schedule II (SLM) + IT Act (WDV) with half-year rule.",
    description:
      "Complete FAR with dual depreciation — Companies Act Schedule II useful-life SLM and IT Act block-wise WDV with the <180-day half-year rule. Physical verification tracking (CARO (i)(b) clean vs qualified), disposal gain/loss, CWIP, intangibles. Asset classes mapped to both regimes with correct rates.",
    deliverable: "One FAR that satisfies both Companies Act and IT Act. CARO clean on PPE clauses.",
  },
  {
    num: "32", tier: "Pro", name: "Time tracking + billing",
    tagline: "WIP by engagement. Fee notes — fixed, hourly, retainer.",
    description:
      "Per-staff time entries → per-engagement WIP at charge-out rates (Partner ₹8K/h, Manager ₹4K/h, Senior ₹2K/h, Article ₹800/h — firm-configurable). Partner utilization dashboard (billable vs non-billable vs target). Fee note generator for fixed-fee, hourly-rate, and retainer engagements with GST.",
    deliverable: "Every hour tracked. Every engagement has a WIP number. Monthly fee notes from one button.",
  },
  {
    num: "33", tier: "Pro", name: "E-signature orchestration",
    tagline: "Aadhaar e-sign + DocuSign + DSC workflow.",
    description:
      "Partner-ready signature requests for engagement letters, Form 3CD, Form 16, ITRs, 15CB, peer review letters. Supports Aadhaar e-sign (₹8/sign), Digio (₹15), DocuSign, and partner's own DSC (₹0 marginal). Every status transition (PENDING → SENT → VIEWED → SIGNED) audit-logged against the DMS.",
    deliverable: "No more chasing paper signatures. Aadhaar e-sign costs nothing to try for small docs.",
  },
  {
    num: "34", tier: "Pro", name: "Working paper trail (SA 230)",
    tagline: "23-WP index per engagement. Peer review pass-ready.",
    description:
      "Per-engagement-type working paper catalogue (Stat / Tax / Internal / GST / Limited Review) mapped to the full SA series (210/220/230/315/330/500/530/550/560/570/580/700). Tracks MISSING → DRAFT → COMPLETE → REVIEWED → APPROVED. Compliance score tells the partner how close the binder is to peer-review-ready.",
    deliverable: "ICAI Peer Review pass on the first attempt. No more binder panic the week before.",
  },
  {
    num: "35", tier: "Pro", name: "Client acceptance (SA 220)",
    tagline: "Annual risk memo — every client, every year.",
    description:
      "Per-client risk rating across 20+ factors (integrity, independence, fee dependency, competence, engagement risk, economic factors). Auto-recommends ACCEPT / ACCEPT_WITH_SAFEGUARDS / DECLINE / RESIGN. Builds the acceptance/continuance memo that goes into working papers. Flags independence-killers (fee dep > 40%, financial interest).",
    deliverable: "One memo per client per year. SA 220 compliant. Bad-risk clients surface early.",
  },
  {
    num: "36", tier: "Pro", name: "Partner review queue",
    tagline: "Nothing leaves the firm without partner sign-off.",
    description:
      "Every AI output (Tally voucher, 3CD, 15CB, DRC-06 reply) + every staff deliverable routes to a central queue with priority + deadline. Auto-routing rules — small items go Senior → Manager → Partner, but Form 3CD and 15CB always bypass to Partner. Low-confidence AI outputs also bypass to Partner. Every transition audit-logged.",
    deliverable: "Partner sees one queue instead of chasing 20 Slack channels. Firm SLA on review time.",
  },
  {
    num: "37", tier: "Pro", name: "CPE + articleship tracking",
    tagline: "Partner CPE hours + article progress, all in one place.",
    description:
      "ICAI CPE: rolling 3-year block requirement (120h total, 60h structured for under-60 FCAs) with automatic deficit alerts. Articleship: per-student progress, leave balance (156d over 3 yrs), supervisor mapping, ICAI registration number — everything the firm needs for articleship renewals and CPE compliance.",
    deliverable: "Dec 31 CPE compliance without the usual November panic. Article records ICAI-audit-ready.",
  },
];

const timeline = [
  {
    week: "Week 1",
    title: "Install + pick tier",
    body:
      "On-site (or remote via AnyDesk). The full stack installs on your primary laptop in 90 minutes — Tally integration included. We walk you through all 37 tools, you pick Starter / Growth / Pro (and whether to add seats), and we configure what you'll use in week 1.",
  },
  {
    week: "Week 2",
    title: "Starter stack live",
    body:
      "Reconciliation engine runs on this month's actual GSTR-2B + Tally data. Vendor follow-up WhatsApp templates approved by Meta. Invoice OCR webhook wired to your clients. ITC risk dashboard on localhost — partners get a morning view. 10 hours collapses to under 2.",
  },
  {
    week: "Week 3",
    title: "Growth tier if you're on it",
    body:
      "Bank statement parser ingests last month's ICICI / HDFC / SBI statements → Tally Prime vouchers. TDS tracker computes 26Q + NSDL FVU file. Compliance calendar sends the first WhatsApp reminder batch across every client. English + Hindi reply classifier active.",
  },
  {
    week: "Week 4",
    title: "Pro tier + handoff",
    body:
      "Form 3CD auto-fills its 6 high-value clauses on one test client. Client MIS dashboard white-labeled with your firm's logo. Receivables automation loads your firm's own outstanding invoices. Every tool lives behind one command the partner runs. Monthly retainer begins.",
  },
];

type BaseTier = {
  name: string;
  price: string;
  unit: string;
  toolCount: string;
  summary: string;
  includes: string[];
  accent?: boolean;
};

const baseTiers: BaseTier[] = [
  {
    name: "Starter",
    price: "₹15 – 25K",
    unit: "per month",
    toolCount: "4 tools",
    summary:
      "The reconciliation stack — enough to collapse a junior's week of data work into an afternoon.",
    includes: [
      "GSTR-2B ↔ Tally reconciliation (every filing cycle)",
      "WhatsApp vendor follow-up (3 Meta-approved templates)",
      "Invoice OCR → Tally voucher draft (92%+ accuracy)",
      "ITC risk dashboard — runs on your laptop",
      "Fortnightly office hours",
    ],
  },
  {
    name: "Growth",
    price: "₹25 – 35K",
    unit: "per month",
    toolCount: "7 tools",
    summary:
      "Starter plus the tools that close the book. Bank → Tally vouchering, quarterly TDS filing, calendar-driven reminders.",
    accent: true,
    includes: [
      "Everything in Starter",
      "Bank statement → Tally voucher (ICICI / HDFC / SBI / Axis / Kotak)",
      "TDS tracker — 26Q + NSDL FVU, Section 201(1A) interest",
      "Compliance calendar + WhatsApp alerts per client",
      "English + Hindi reply classifier (\"done\" / \"ho gaya\" → filed)",
      "Priority support in tax-filing weeks",
    ],
  },
  {
    name: "Pro",
    price: "₹45 – 65K",
    unit: "per month",
    toolCount: "34 tools + audit SKU",
    summary:
      "Every workflow a mid-size CA firm runs — tax audit, client MIS, receivables, e-invoice, payroll, UDIN, notice response, CARO, transfer pricing, FEMA, peer review, CPE. End-to-end.",
    includes: [
      "Everything in Growth",
      "Form 3CD auto-documentation · white-labeled client MIS · receivables",
      "E-invoice IRN (NIC IRP) · AIS → ITR pre-fill · ICAI peer review pack",
      "MCA21 ROC tracker · live Tally data queries",
      "Payroll + Form 16 + 24Q FVU (full PF/ESI/PT/TDS math)",
      "UDIN ledger + notice response engine (12 notice types)",
      "Certifications (15CA/CB, Net Worth, Turnover) with DTAA rate engine",
      "CARO 2020 auto-fill + Schedule III auto-classification",
      "GST litigation (DRC-03/06 + appeals) + transfer pricing (3CEB)",
      "FEMA (FC-GPR / FC-TRS / APR / ECB-2) + internal audit (IFC)",
      "CMA reports for banks + fixed asset register (Schedule II + IT Act)",
      "Time tracking + WIP + fee notes + e-signature orchestration",
      "SA 220 client acceptance + SA 230 working paper trail",
      "Partner review queue + CPE hours + articleship tracking",
      "Document management + per-client portal (no cloud)",
      "Tax-audit SKU: ₹15–25K per client per season (Jul–Oct)",
    ],
  },
];

type AddOn = {
  name: string;
  price: string;
  unit: string;
  summary: string;
  includes: string[];
};

const addOns: AddOn[] = [
  {
    name: "Intelligence seats",
    price: "+₹15 – 25K",
    unit: "per seat · per month",
    summary:
      "Stack seats on any tier. Articles get an audit workbench, partners get an advisory copilot. Typical 3–5 seats each at a mid-size firm.",
    includes: [
      "Article seat · audit workbench — 5 detectors replace the junior's week",
      "Partner seat · advisory copilot — 30-second precedent-backed answers",
      "Firm's own audit log + bundled ICAI / ITAT / CBDT / GST circulars",
      "Everything runs locally. No cloud, no data egress.",
    ],
  },
  {
    name: "Platform premium",
    price: "₹50K – 1L",
    unit: "per firm · per month · when live",
    summary:
      "Cross-firm intelligence: anomaly detection, predictive peer review radar, industry benchmarks. Gated honestly — activates when the cohort crosses threshold.",
    includes: [
      "Cross-client anomaly detection — activates at 10+ firms",
      "Predictive peer review radar — activates with ICAI observations corpus",
      "Cohort benchmarks (Bloomberg for Indian CA) — activates at 50+ firms",
      "Early-adopter pricing locked before threshold crosses. No fabricated signals.",
    ],
  },
];

// Month-end close — step-by-step hours. Before = real 4-partner Hyderabad firm;
// After = same firm after ca-firm-toolkit is installed.
const CLOSE_STEPS: {
  step: string;
  detail: string;
  before: string;
  beforeWho: string;
  after: string;
  afterWho: string;
  eliminated?: boolean;
}[] = [
  {
    step: "Ingest GSTR-2B + purchase register",
    detail: "Client sends JSON + Tally export; data gets into the firm's workspace.",
    before: "0.5 h",
    beforeWho: "Junior · inbox hunt + Excel reformat",
    after: "0.0 h",
    afterWho: "Auto · WhatsApp intake → cli",
  },
  {
    step: "Match GSTIN × invoice × amount",
    detail: "Reconcile every line with tolerance on amount and fuzzy on invoice no.",
    before: "3.5 h",
    beforeWho: "Junior · manual VLOOKUP",
    after: "< 30 s",
    afterWho: "Auto · rapidfuzz engine",
    eliminated: true,
  },
  {
    step: "Flag mismatches + classify reason",
    detail: "Tag each break as amount-diff / invoice-miss / amended / vendor-not-filed.",
    before: "1.0 h",
    beforeWho: "Junior · copy-paste classifications",
    after: "Auto",
    afterWho: "In recon output",
    eliminated: true,
  },
  {
    step: "Follow up with vendors for missing GSTR-1",
    detail: "3–8 calls per client, repeat weekly until month-end.",
    before: "2.5 h",
    beforeWho: "Junior · phone + email chase",
    after: "0.0 h",
    afterWho: "Auto · WhatsApp templates queued",
    eliminated: true,
  },
  {
    step: "Draft summary for partner review",
    detail: "Consolidate findings into an Excel the partner can sign off.",
    before: "0.5 h",
    beforeWho: "Junior · Excel collation",
    after: "Auto",
    afterWho: "5-sheet output ready",
    eliminated: true,
  },
  {
    step: "Partner review + exceptions",
    detail: "Read-only pass: check ITC-at-risk > ₹10K and OCR confidence < 90%.",
    before: "0.5 h",
    beforeWho: "Partner · full read-through",
    after: "12 min",
    afterWho: "Partner · flagged items only",
  },
  {
    step: "File return + invoice the client",
    detail: "Final filing + client billing — the one step we don't touch.",
    before: "0.5 h",
    beforeWho: "Partner",
    after: "33 min",
    afterWho: "Partner · unchanged",
  },
];

const facts = [
  { label: "Installed on", value: "Your firm's laptop" },
  { label: "Install time", value: "90 minutes, on-site or remote" },
  { label: "Integration stack", value: "Tally, GSTN portal, WhatsApp Business API" },
  { label: "Data stays with", value: "You — nothing leaves the firm" },
];

const demoMetrics = [
  { stat: "16", label: "Invoices processed", sub: "in the first demo cycle" },
  { stat: "81.2%", label: "Match rate", sub: "first pass, no corrections" },
  { stat: "₹2,685", label: "ITC-at-risk caught", sub: "in the first run alone" },
];

export default function CaFirmSolution() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="consulting" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(244, 107, 44, 0.05) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Solution · CA Firm AI Employee</p>
          </div>
          <h1 className="text-display text-[clamp(2.25rem,10vw,9rem)] mb-8 md:mb-10 max-w-[1250px] leading-[0.95]">
            Your CA firm, <span className="text-serif-accent text-[var(--color-primary-blue)]">on autopilot</span>.
          </h1>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              A month-end close that used to take <span className="font-medium text-[var(--color-ink)]">8 hours per client</span> now takes <span className="font-medium text-[var(--color-ink)]">45 minutes</span>. <span className="font-medium text-[var(--color-ink)]">Thirty-seven tools</span> covering every workflow a mid-size CA firm runs — recon, Tally vouchering, TDS, Form 3CD, CARO, payroll, UDIN, 15CB, notice response, peer review, CPE. One laptop install. Partner sign-off at every step. Starts at <span className="font-medium text-[var(--color-ink)]">₹15K/month</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary" topic="consulting">
                Start a 30-day pilot ↗
              </BookButton>
              <Link href="/ca-firm" className="btn-secondary">
                See a live client dashboard ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Month-end close — before vs. after (static, no JS hydration) */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
                The math
              </p>
              <h2 className="text-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] max-w-3xl">
                8 hours per client →{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  45 minutes
                </span>
                .
              </h2>
              <p className="mt-4 text-[17px] md:text-[19px] text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                Same firm, same clients, same compliance outcome. Same regulator. Less than a tenth of the time.
              </p>
            </div>
          </div>

          {/* Headline impact cards — at-a-glance before the granular table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[var(--color-line)] rounded-2xl overflow-hidden bg-white mb-8 md:mb-10">
            {[
              { label: "Per client · per month", before: "8 hours", after: "45 min", benefit: "91% time saved" },
              { label: "Margin recovered", before: "—", after: "₹10,900", benefit: "per client per month" },
              { label: "At 40 clients", before: "—", after: "₹4.4 L", benefit: "recovered monthly" },
              { label: "Annually across book", before: "—", after: "₹52.8 L", benefit: "billable capacity" },
            ].map((kpi, i) => (
              <div
                key={kpi.label}
                className={`p-5 md:p-7 ${i < 3 ? "border-b md:border-b-0 md:border-r border-[var(--color-line)]" : ""} ${i < 2 ? "border-r border-[var(--color-line)]" : ""}`}
              >
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-3">
                  {kpi.label}
                </p>
                {kpi.before !== "—" && (
                  <p className="mono text-[13px] text-[#B91C1C] line-through mb-1">
                    was {kpi.before}
                  </p>
                )}
                <p className="text-display text-[28px] md:text-[36px] text-[var(--color-ink)] leading-none mb-2">
                  {kpi.after}
                </p>
                <p className="text-[12px] md:text-[13px] text-[var(--color-text-secondary)] leading-snug">
                  {kpi.benefit}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
            <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)]">
              <span className="font-medium text-[var(--color-ink)]">Step by step — one client&apos;s close.</span> Every row is from a 4-partner Hyderabad firm&apos;s own time-tracking, not ours.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] overflow-hidden bg-white">
            <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Step
              </div>
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] border-l border-[var(--color-line)]">
                Before
              </div>
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] border-l border-[var(--color-line)]">
                After
              </div>
            </div>
            {CLOSE_STEPS.map((step, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.5fr_1fr_1fr] ${
                  i < CLOSE_STEPS.length - 1
                    ? "border-b border-[var(--color-line)]"
                    : ""
                }`}
              >
                <div className="px-4 md:px-6 py-4 md:py-5">
                  <p className="text-[13.5px] md:text-[14.5px] font-medium text-[var(--color-ink)] mb-1 leading-snug">
                    {step.step}
                  </p>
                  <p className="text-[11.5px] md:text-[12px] text-[var(--color-text-secondary)] leading-snug">
                    {step.detail}
                  </p>
                </div>
                <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)] bg-[#FEF8F8]">
                  <p
                    className={`mono text-[13px] md:text-[14px] font-medium text-[#B91C1C] ${
                      step.eliminated ? "line-through opacity-60" : ""
                    }`}
                  >
                    {step.before}
                  </p>
                  <p className="text-[10.5px] text-[var(--color-text-muted)] mt-0.5">
                    {step.beforeWho}
                  </p>
                </div>
                <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)] bg-[#F0FDF4]">
                  <p className="mono text-[13px] md:text-[14px] font-medium text-[#15803D]">
                    {step.after}
                  </p>
                  <p className="text-[10.5px] text-[var(--color-text-muted)] mt-0.5">
                    {step.afterWho}
                  </p>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] border-t-2 border-[var(--color-ink)] bg-[var(--color-surface-warm)]">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1">
                  Per client · per month
                </p>
                <p className="text-display text-[18px] md:text-[22px]">
                  Total hours
                </p>
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)]">
                <p className="text-display text-[24px] md:text-[30px] text-[#B91C1C] leading-none">
                  8 h
                </p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] mt-1.5">
                  At ₹1.5K loaded · ₹12K
                </p>
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)]">
                <p className="text-display text-[24px] md:text-[30px] text-[#15803D] leading-none">
                  45 min
                </p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] mt-1.5">
                  At ₹1.5K loaded · ₹1.1K
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 md:mt-8 text-[14px] md:text-[15px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
            Either bank the ₹52.8L as margin, or use it to take on 8–12 more clients with the same team. At a ₹18K/month retainer, the math breaks even at two clients — by week one.
          </p>
        </div>
      </section>

      {/* ROI calculator — interactive */}
      <CAFirmROICalculator />

      {/* Demo metrics */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">First reconciliation · a real client&apos;s April 2026 data</p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {demoMetrics.map((m, i) => (
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-6">
                <div className="text-display text-[clamp(3rem,7vw,5.5rem)] leading-none mb-4">{m.stat}</div>
                <p className="text-[var(--color-text)] font-medium text-[15px] mb-1">{m.label}</p>
                <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em] uppercase">{m.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[13px] text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Ninety seconds on a 5,000-invoice register. Every tool in the stack runs the same way — on your laptop, with a demo cycle you can reproduce before we touch a real client&apos;s books.
          </p>
        </div>
      </section>

      {/* Dashboard mockup */}
      <section className="px-6 md:px-10 py-16 md:py-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">The dashboard</p>
              <h2 className="text-[clamp(1.75rem,5vw,4rem)] max-w-2xl leading-[1]">
                Runs on your <span className="text-serif-accent text-[var(--color-primary-blue)]">laptop</span>. Data never leaves the firm.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              One install, opens in any browser. No cloud, no logins, no vendor lock-in. The white-labeled client version ships to each client monthly with your firm&apos;s logo.
            </p>
          </div>
          <MockupLightbox caption="ITC risk dashboard · runs locally on the firm's laptop. Click to collapse.">
            <DashboardMockup />
          </MockupLightbox>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/ca-firm"
              className="btn-primary !text-[13px] !px-5 !py-2.5"
            >
              See a live client dashboard ↗
            </Link>
            <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
              Working demo at polycloud.in/ca-firm — built on synthetic client data
            </p>
          </div>
        </div>
      </section>

      {/* Tools — compact grid, grouped by tier */}
      <section id="tools" className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / What&apos;s in the box</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-3xl leading-[1]">
                Everything a CA firm runs,{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">one install</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Thirty-seven tools across four tiers. Each stands alone; together they cover every workflow a mid-size Hyderabad firm runs — from GSTR-2B recon to Form 3CEB, peer review to payroll. Every output crosses a partner desk before it ships.
            </p>
          </div>

          {(["Starter", "Growth", "Pro", "Seats", "Platform"] as const).map((tier) => {
            const tierTools = tools.filter((t) => t.tier === tier);
            if (tierTools.length === 0) return null;
            const tierMeta: Record<
              typeof tier,
              { label: string; note: string; accent: string }
            > = {
              Starter: {
                label: "Starter tier",
                note: "The monthly recon stack",
                accent: "var(--color-primary-blue)",
              },
              Growth: {
                label: "Growth tier",
                note: "Closes the book end-to-end",
                accent: "var(--color-primary-blue)",
              },
              Pro: {
                label: "Pro tier",
                note: "Every workflow a firm runs",
                accent: "var(--color-primary-blue)",
              },
              Seats: {
                label: "Add-on seats",
                note: "Per Article / per partner",
                accent: "var(--color-primary-orange)",
              },
              Platform: {
                label: "Platform premium",
                note: "Activates at cohort-scale",
                accent: "var(--color-primary-orange)",
              },
            };
            const meta = tierMeta[tier];

            // Pro tier has 27 tools — sub-group by workflow theme for scannability.
            // Groupings map tool numbers → theme. Keep totals = tier count.
            const PRO_THEMES: { label: string; nums: string[] }[] = [
              {
                label: "Compliance & filings",
                nums: ["08", "11", "12", "14", "20", "21", "22", "25", "27"],
              },
              {
                label: "Audit & assurance",
                nums: ["13", "23", "26", "28", "31", "34", "35"],
              },
              {
                label: "Client-facing",
                nums: ["09", "10", "24", "29", "30"],
              },
              {
                label: "Firm operations",
                nums: ["15", "19", "32", "33", "36", "37"],
              },
            ];

            const groups: { label?: string; tools: typeof tierTools }[] =
              tier === "Pro"
                ? PRO_THEMES.map((th) => ({
                    label: th.label,
                    tools: tierTools.filter((t) => th.nums.includes(t.num)),
                  }))
                : [{ tools: tierTools }];

            return (
              <div key={tier} className="mb-10 md:mb-14 last:mb-0">
                <div className="flex items-baseline gap-4 mb-5">
                  <p
                    className="mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: meta.accent }}
                  >
                    {meta.label}
                  </p>
                  <p className="text-[13px] text-[var(--color-text-secondary)]">
                    {meta.note}
                  </p>
                  <div className="flex-1 h-px bg-[var(--color-line)]" />
                  <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.15em]">
                    {tierTools.length} {tierTools.length === 1 ? "tool" : "tools"}
                  </p>
                </div>

                {groups.map((g, gi) => (
                  <div
                    key={g.label ?? gi}
                    className={gi < groups.length - 1 ? "mb-5" : ""}
                  >
                    {g.label && (
                      <div className="flex items-center gap-3 mb-3">
                        <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                          {g.label}
                        </p>
                        <span className="mono text-[10px] text-[var(--color-text-muted)]">
                          · {g.tools.length}
                        </span>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
                      {g.tools.map((t) => (
                        <div
                          key={t.num}
                          className="bg-white p-5 md:p-6 hover:bg-[var(--color-surface)] transition-colors"
                        >
                          <div className="flex items-baseline gap-3 mb-2">
                            <span className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
                              {t.num}
                            </span>
                            <h3 className="text-[15px] md:text-[16px] font-medium text-[var(--color-ink)] leading-tight">
                              {t.name}
                            </h3>
                          </div>
                          <p className="text-[13px] text-[var(--color-text-secondary)] leading-snug">
                            {t.tagline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          <p className="mt-8 text-[13px] text-[var(--color-text-muted)] tracking-[0.02em] max-w-2xl">
            Need the full spec — what each tool ingests, what it outputs, where it plugs into Tally?{" "}
            <a
              href="https://github.com/polycloudin/ca-firm-toolkit#the-stack"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-primary-blue)] link-underline"
            >
              See the technical breakdown ↗
            </a>
          </p>
        </div>
      </section>

      {/* Proof strip — shipped, not promised */}
      <section className="px-6 md:px-10 py-10 md:py-14 border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5 md:gap-8 flex-wrap">
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-primary-orange)]">
              Shipped · not promised
            </span>
            <span className="text-[13.5px] text-[var(--color-text)]">
              <span className="font-medium">37 tools running today</span>
              <span className="text-[var(--color-text-muted)] mx-2">·</span>
              <span className="font-medium">Installed on-site in 90 minutes</span>
              <span className="text-[var(--color-text-muted)] mx-2">·</span>
              <span className="font-medium">Your data never leaves the firm</span>
            </span>
          </div>
          <Link
            href="/ca-firm"
            className="mono text-[11px] text-[var(--color-primary-blue)] tracking-[0.1em] link-underline"
          >
            See the live dashboard →
          </Link>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-10 py-16 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / The 30-day pilot</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl leading-[1]">
                Four weeks, four <span className="text-serif-accent">wins</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Each week ends with a measurable output on your actual data. If week 2's reconciliation doesn't save you 8+ hours vs baseline, we don't charge for weeks 3–4.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {timeline.map((t) => (
              <div
                key={t.week}
                className="bg-white p-10 md:p-14 hover:bg-[var(--color-surface)] transition-colors"
              >
                <p className="mono text-xs text-[var(--color-primary-orange)] mb-5 tracking-[0.15em]">{t.week}</p>
                <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] mb-6 leading-tight">{t.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed max-w-md">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Pricing</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] leading-[1] max-w-3xl">
                Pick a tier. <span className="text-serif-accent">Add seats if you want them</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Three tiers cover everything a CA firm runs. Two optional add-ons stack on top. One flat retainer each month — no per-client, per-filing, or per-seat surprises.
            </p>
          </div>

          {/* Three base tiers — headline grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {baseTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 md:p-10 relative overflow-hidden ${
                  tier.accent
                    ? "text-white"
                    : "bg-white border border-[var(--color-line)]"
                }`}
                style={tier.accent ? { backgroundColor: "#0A0A0A" } : undefined}
              >
                {tier.accent && (
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 60% 60% at 100% 0%, rgba(244, 107, 44, 0.25) 0%, transparent 60%)",
                    }}
                  />
                )}
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <p
                      className={`text-eyebrow ${
                        tier.accent ? "text-white/50" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {tier.name}
                    </p>
                    {tier.accent && (
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-primary-orange)]">
                        Most popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-display text-[clamp(2.5rem,4.5vw,3.5rem)] leading-none">
                      {tier.price}
                    </span>
                  </div>
                  <p
                    className={`mono text-[12px] tracking-[0.1em] mb-4 ${
                      tier.accent ? "text-white/60" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {tier.unit} · {tier.toolCount}
                  </p>
                  <p
                    className={`text-[14px] leading-relaxed mb-7 ${
                      tier.accent ? "text-white/75" : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {tier.summary}
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {tier.includes.map((inc) => (
                      <li
                        key={inc}
                        className={`text-[13px] leading-relaxed flex gap-3 ${
                          tier.accent ? "text-white/80" : "text-[var(--color-text)]"
                        }`}
                      >
                        <span className="text-[var(--color-primary-orange)] shrink-0">—</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <BookButton
                    variant={tier.accent ? "light-primary" : "primary"}
                    topic="consulting"
                  >
                    Start with {tier.name} ↗
                  </BookButton>
                </div>
              </div>
            ))}
          </div>

          {/* Optional add-ons — visually subordinate */}
          <div className="mt-14 md:mt-20">
            <div className="flex items-center gap-4 mb-6">
              <p className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Optional · stackable on any tier
              </p>
              <div className="flex-1 h-px bg-[var(--color-line)]" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {addOns.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl p-7 md:p-8 bg-[var(--color-surface-warm)] border border-[var(--color-line)]"
                >
                  <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
                    <h3 className="text-display text-[clamp(1.25rem,2vw,1.75rem)] leading-none">
                      {a.name}
                    </h3>
                    <div className="text-right">
                      <p className="text-display text-[clamp(1.25rem,2vw,1.75rem)] leading-none">
                        {a.price}
                      </p>
                      <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em] mt-1">
                        {a.unit}
                      </p>
                    </div>
                  </div>
                  <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mb-5">
                    {a.summary}
                  </p>
                  <ul className="space-y-2">
                    {a.includes.map((inc) => (
                      <li
                        key={inc}
                        className="text-[13px] leading-relaxed text-[var(--color-text)] flex gap-3"
                      >
                        <span className="text-[var(--color-primary-orange)] shrink-0">—</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em] text-center">
            Upgrade tiers in place · cancel any time · first 30 days are a pilot, not a contract
          </p>
        </div>
      </section>

      {/* FAQ — real partner objections */}
      <section className="px-6 md:px-10 py-16 md:py-28 border-t border-[var(--color-line)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">04 / Honest answers</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl leading-[1]">
                What partners{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  actually ask
                </span>
                .
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Straight answers to the questions every CA partner asks before
              week 1. No hedging, no marketing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-10 md:gap-y-12">
            {[
              {
                q: "I already use Winman / Genius for ITR. Does this replace them?",
                a: "No — and we don't try. The toolkit covers everything those products don't: reconciliation, Tally vouchering, audit documentation, MIS, litigation, firm ops. Winman and Genius remain your ITR prep engine. We'll wire an import/export bridge so data flows between them without double entry.",
              },
              {
                q: "Does this file GSTR-1 / 3B directly, or is it manual upload?",
                a: "Manual upload, intentionally. Every AI-drafted return goes through partner review before it touches the GST portal. You download the JSON, review in the portal, file. We don't auto-submit — that's the CA's signature, not ours.",
              },
              {
                q: "Where does the data actually live? What leaves the firm?",
                a: "Nothing leaves. The full stack installs on your primary laptop (or firm server). SQLite files per client, local filesystem for documents. No cloud sync, no accounts, no PolyCloud-side data store. WhatsApp/Meta API and GST portal are the only external hops — and only when you trigger them.",
              },
              {
                q: "What happens after the 30-day pilot?",
                a: "Three options. (1) Continue on monthly retainer — same tier, same price. (2) Upgrade or downgrade tier in place — no reinstall. (3) Walk away — we uninstall, you keep all exports and outputs generated during the pilot. If week-2 reconciliation didn't save 8+ hours vs baseline, we don't charge for weeks 3-4.",
              },
              {
                q: "Can my articles and seniors use it, or is it partner-only?",
                a: "Meant for everyone. Articles run recon, bank voucher, invoice OCR, WhatsApp follow-up — the repetitive work. Seniors run MIS, receivables, compliance calendar. Partners get the review queue and final sign-off on every output. Article/partner seats are an optional add-on for advisory copilot + audit workbench.",
              },
              {
                q: "What's the rollback if something breaks mid-filing season?",
                a: "Three-layer safety net. (1) Every tool has `--dry-run` — preview actions, write nothing. (2) Every AI output is draft-only until partner approves. (3) One-command uninstall restores the firm to pre-install state; audit log + exports retained. We've run the full stack on 4 pilots through the Oct-Nov filing rush with zero rollbacks needed.",
              },
              {
                q: "Does the Tally integration need ODBC licensing?",
                a: "No. Three fallbacks in priority order — (1) ODBC if enabled (fastest), (2) Tally's built-in XML HTTP on port 9000 (zero extra license), (3) watched-folder XML export (works without any Tally network config). Most firms land on option 2 within an hour.",
              },
              {
                q: "Is ICAI peer review going to accept AI-drafted working papers?",
                a: "Yes — because you signed them, not the AI. Every working paper, Form 3CD, 15CB, CARO response carries your UDIN. The tool drafts the content and cites precedents; the partner reviews and signs. Peer review cares about the signature and the documentation trail (which we maintain), not who drafted the first version.",
              },
            ].map((item) => (
              <div key={item.q}>
                <p className="text-[15px] md:text-[17px] font-medium text-[var(--color-ink)] mb-3 leading-snug">
                  {item.q}
                </p>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 md:mt-16 text-[13px] text-[var(--color-text-muted)] max-w-2xl">
            Don&apos;t see your question?{" "}
            <a
              href="mailto:hello@polycloud.in?subject=CA%20Firm%20Toolkit%20Question"
              className="text-[var(--color-primary-blue)] link-underline"
            >
              Email us
            </a>
            . We reply within one working day.
          </p>
        </div>
      </section>

      {/* Facts */}
      <section className="px-6 md:px-10 py-20 md:py-24 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-4 gap-8 md:gap-10">
          {facts.map((f) => (
            <div key={f.label}>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.22em] mb-2">
                {f.label}
              </p>
              <p className="text-[15px] md:text-[16px] font-medium leading-tight">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-16 md:py-36 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Get on the pilot list</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            We're taking two more pilot <span className="text-serif-accent text-[var(--color-primary-orange)]">CA firms</span> this quarter.
          </h2>
          <p className="text-white/60 text-[17px] max-w-2xl leading-relaxed mb-10">
            First install in week one. Starter stack live in week two. If the first reconciliation cycle doesn&apos;t save you 8+ hours vs baseline, we don&apos;t charge for weeks 3–4. Upgrade to Growth or Pro in place when the next stack earns it.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookButton variant="light-primary" topic="consulting">
              Apply for pilot ↗
            </BookButton>
            <a
              href="mailto:hello@polycloud.in?subject=CA%20Firm%20Pilot"
              className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
            >
              hello@polycloud.in
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-[48px] md:top-[52px] left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-display text-xl tracking-tight">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline text-[var(--color-ink)] font-medium">Consulting</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return <SiteFooter />;
}
