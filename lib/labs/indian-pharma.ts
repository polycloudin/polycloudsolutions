// Indian pharma company registry — baked-in MCA snapshot data.
//
// Raw data lives in `indian-pharma.json` alongside this file. This module
// imports it, types it, and exposes helpers. The separation lets the
// `~/projects/agentOS/intelligence/bizapi/scripts/labs_pharma_brief.py`
// script read the same snapshot without round-tripping through TypeScript.
//
// Snapshot: Apr 24, 2026. Data sourced via BizAPI MCA connector
// (~/projects/agentOS/intelligence/bizapi/). Numbers are illustrative for
// the public marketing dashboard; per-tenant production data is live-fetched
// once the BizAPI FastAPI is deployed.
//
// All CINs are real and publicly verifiable at
// https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do

import pharmaData from "./indian-pharma.json";
import unlistedData from "./indian-pharma-unlisted.json";

export type DDGrade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D";

export interface CDSCOFilingRef {
  date: string;
  source: string;
  title: string;
}

export interface CliffExposure {
  activeIngredient: string;
  tradeName: string;
  originator: string;
  cliffDate: string;
  indianStatus: string;
  action: "urgent" | "hot" | "warm" | "scout";
}

export interface CTRITrialRef {
  registration: string;
  phase: string;
  indication: string;
  status: string;
}

export interface IndianPharmaCompany {
  slug: string;
  name: string;
  legalName: string;
  cin: string;
  incorporatedYear: number;
  registeredOffice: string;
  state: string;
  paidUpCapitalCr: number;
  marketCapEstimateCr: number | null;
  directorsCount: number;
  notableDirectors: Array<{ role: string; name: string }>;
  ddGrade: DDGrade;
  ddScore: number;
  recentCharges90d: number;
  governanceFlags: string[];
  cdscoFilings90d: CDSCOFilingRef[];
  cliffExposures: CliffExposure[];
  activeCTRITrials: CTRITrialRef[];
  strategicNote: string;
}

export const INDIAN_PHARMA = pharmaData as IndianPharmaCompany[];
export const INDIAN_PHARMA_UNLISTED = unlistedData as IndianPharmaCompany[];
export const INDIAN_PHARMA_ALL: IndianPharmaCompany[] = [
  ...INDIAN_PHARMA,
  ...INDIAN_PHARMA_UNLISTED,
];

// --------------------------------------------------------
// Helpers
// --------------------------------------------------------

export function getCompanyBySlug(slug: string): IndianPharmaCompany | undefined {
  return INDIAN_PHARMA_ALL.find((c) => c.slug === slug);
}

export function allCompanySlugs(): string[] {
  return INDIAN_PHARMA_ALL.map((c) => c.slug);
}

// Maps display names (as they appear in the originator table filer column)
// to slugs, so the dashboard can turn "Cipla · Sun · DRL" text into links.
export const COMPANY_NAME_TO_SLUG: Record<string, string> = {
  "Cipla": "cipla",
  "Sun": "sun-pharma",
  "Sun Pharma": "sun-pharma",
  "DRL": "dr-reddys",
  "Dr Reddy's": "dr-reddys",
  "Lupin": "lupin",
  "Aurobindo": "aurobindo",
  "Biocon": "biocon",
  "Glenmark": "glenmark",
  "Torrent": "torrent-pharma",
  "Zydus": "zydus",
  "Alkem": "alkem",
  "Natco": "natco",
  "Hetero": "hetero",
};

// --------------------------------------------------------
// Sector aggregates — used by the /labs/dashboard MCA section
// --------------------------------------------------------

export function sectorHealthSummary() {
  const total = INDIAN_PHARMA.length;
  const paidUpTotal = INDIAN_PHARMA.reduce((s, c) => s + c.paidUpCapitalCr, 0);
  const marketCapListed = INDIAN_PHARMA
    .filter((c) => c.marketCapEstimateCr !== null)
    .reduce((s, c) => s + (c.marketCapEstimateCr ?? 0), 0);
  const listedCount = INDIAN_PHARMA.filter((c) => c.marketCapEstimateCr !== null).length;
  const uniqueStates = new Set(INDIAN_PHARMA.map((c) => c.state)).size;
  const chargeTotal = INDIAN_PHARMA.reduce((s, c) => s + c.recentCharges90d, 0);
  const avgDDScore = INDIAN_PHARMA.reduce((s, c) => s + c.ddScore, 0) / total;
  const oldestYear = Math.min(...INDIAN_PHARMA.map((c) => c.incorporatedYear));
  const avgAge = 2026 - (INDIAN_PHARMA.reduce((s, c) => s + c.incorporatedYear, 0) / total);

  const byState: Record<string, number> = {};
  for (const c of INDIAN_PHARMA) byState[c.state] = (byState[c.state] ?? 0) + 1;
  const topStates = Object.entries(byState)
    .sort(([, a], [, b]) => b - a)
    .map(([state, count]) => ({ state, count }));

  return {
    total,
    listedCount,
    paidUpTotalCr: Math.round(paidUpTotal),
    marketCapListedCr: marketCapListed,
    uniqueStates,
    chargeTotal,
    avgDDScore: Math.round(avgDDScore),
    oldestYear,
    avgAge: Math.round(avgAge),
    topStates,
  };
}
