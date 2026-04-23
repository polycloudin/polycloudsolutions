/**
 * CA Firm Portal — synthetic 12-month MIS data for /ca-firm demo page.
 *
 * All values explicitly synthetic (no real client information). Mirrors the
 * Python reference implementation at:
 *   tools/client_mis/ingester.py → build_demo_history()
 *   tools/client_mis/projections.py → compute_projection()
 *
 * The CA Firm AI Employee (Tier B2) generates this exact payload monthly
 * from each client's Tally + GSTR-2B + bank statements and white-labels the
 * dashboard with the CA firm's brand.
 */

export type MonthlySnapshot = {
  monthYear: string; // "2024-04"
  revenue: number;
  expenses: number;
  netProfit: number;
  gstLiability: number;
  gstPaid: number;
  itcAvailable: number;
  itcUtilised: number;
  tdsDeducted: number;
  tdsDeposited: number;
  cashInflows: number;
  cashOutflows: number;
  closingCash: number;
};

export type CashFlowTier = "healthy" | "adequate" | "tight" | "critical";

export type ClientProfile = {
  name: string;
  gstin: string;
  pan: string;
  fy: string;
  industry: string;
  cfo: string;
  asOfDate: string;
};

export const DEMO_CLIENT: ClientProfile = {
  name: "Gupta Textiles Pvt Ltd (Demo)",
  gstin: "36AACPG9012O3Z2",
  pan: "AACPG9012O",
  fy: "2024-25",
  industry: "Manufacturing — Textiles",
  cfo: "Ms. Priya Gupta",
  asOfDate: "2026-04-23",
};

function buildHistory(): MonthlySnapshot[] {
  const baseRevenue = 25_00_000;
  const baseExpenses = 22_00_000;
  const seasonality = [
    1.0, 1.05, 0.85, 0.9, 1.0, 1.05, 1.0, 1.0, 0.95, 0.95, 1.15, 1.05,
  ];
  const snapshots: MonthlySnapshot[] = [];
  let closingCash = 45_00_000;
  const startYear = 2023;

  for (let i = 0; i < 12; i++) {
    const month = ((startYear * 12 + 3 + i) % 12) + 1;
    const year = startYear + Math.floor((3 + i) / 12);
    const factor = seasonality[i];
    const revenue = Math.round(baseRevenue * factor);
    const expenses = Math.round(baseExpenses * (1 + (factor - 1) * 0.6));
    const netProfit = revenue - expenses;

    const gstLiability = Math.round(revenue * 0.18);
    const itcAvailable = Math.round(revenue * 0.11);
    const itcUtilised = Math.round(itcAvailable * 0.85);
    const gstPaid = Math.round(gstLiability - itcUtilised);

    const tdsDeducted = Math.round(expenses * 0.1);
    const tdsDeposited = Math.round(tdsDeducted * (i !== 5 ? 0.95 : 0.6));

    const cashInflows = Math.round(revenue * 0.92 + (i > 0 ? 80_000 : 0));
    const cashOutflows = Math.round(expenses + gstPaid * 0.8 + tdsDeposited);
    closingCash = closingCash + cashInflows - cashOutflows;

    snapshots.push({
      monthYear: `${year}-${String(month).padStart(2, "0")}`,
      revenue,
      expenses,
      netProfit,
      gstLiability,
      gstPaid,
      itcAvailable,
      itcUtilised,
      tdsDeducted,
      tdsDeposited,
      cashInflows,
      cashOutflows,
      closingCash,
    });
  }
  return snapshots;
}

export const SNAPSHOTS: MonthlySnapshot[] = buildHistory();

// ── Cash flow projection (6-month rolling + Indian business seasonality) ──

const PROJ_SEASONALITY: Record<number, number> = {
  1: 1.05, 2: 1.0, 3: 0.85, 4: 0.9, 5: 1.0, 6: 1.05,
  7: 1.0, 8: 1.0, 9: 0.95, 10: 0.95, 11: 1.1, 12: 1.05,
};

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function pstdev(xs: number[]): number {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

export type CashFlow = {
  asOfDate: string;
  currentCash: number;
  proj30Net: number;
  proj60Net: number;
  proj90Net: number;
  projCash30: number;
  projCash60: number;
  projCash90: number;
  burnRateMonthly: number;
  runwayDays: number | null;
  tier: CashFlowTier;
  confidence: number;
};

export function projectCashFlow(
  snapshots: MonthlySnapshot[],
  asOf: string
): CashFlow {
  const netFlows = snapshots.map((s) => s.cashInflows - s.cashOutflows);
  const window = netFlows.slice(-6);
  const baseNet = mean(window);

  const std = pstdev(window);
  const relStd = Math.abs(baseNet) > 1 ? std / Math.abs(baseNet) : 2;
  const volatilityConf = Math.max(0.3, Math.min(0.95, 1 - relStd * 0.3));
  const confidence = Math.round(volatilityConf * 100) / 100;

  const asOfDate = new Date(asOf + "T00:00:00");
  const upcoming = [1, 2, 3].map((offset) => {
    const d = new Date(asOfDate);
    d.setMonth(d.getMonth() + offset);
    return d.getMonth() + 1;
  });
  const projected = upcoming.map((m) =>
    Math.round(baseNet * (PROJ_SEASONALITY[m] ?? 1))
  );
  const [n30, n60extra, n90extra] = projected;
  const n60 = n30 + n60extra;
  const n90 = n60 + n90extra;

  const currentCash = snapshots[snapshots.length - 1].closingCash;
  const cash30 = currentCash + n30;
  const cash60 = currentCash + n60;
  const cash90 = currentCash + n90;

  const burn = Math.max(0, -baseNet);
  const runwayDays =
    burn > 0 && currentCash > 0 ? Math.floor((currentCash / burn) * 30) : null;

  let tier: CashFlowTier;
  if (burn <= 0 && currentCash > 0) {
    tier = cash90 > currentCash * 0.9 ? "healthy" : "adequate";
  } else if (runwayDays === null) {
    tier = "healthy";
  } else if (runwayDays > 90) tier = "adequate";
  else if (runwayDays > 60) tier = "tight";
  else tier = "critical";

  return {
    asOfDate: asOf,
    currentCash,
    proj30Net: n30,
    proj60Net: n60,
    proj90Net: n90,
    projCash30: cash30,
    projCash60: cash60,
    projCash90: cash90,
    burnRateMonthly: burn,
    runwayDays,
    tier,
    confidence,
  };
}

export const CASH_FLOW: CashFlow = projectCashFlow(SNAPSHOTS, DEMO_CLIENT.asOfDate);

// ── Utilities ──

export function shortMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[Number(m)]} '${y.slice(2)}`;
}

export const TIER_META: Record<
  CashFlowTier,
  { label: string; color: string; bg: string }
> = {
  healthy: { label: "Healthy", color: "#15803D", bg: "#ECFDF5" },
  adequate: { label: "Adequate", color: "#1A5FD4", bg: "#EFF6FF" },
  tight: { label: "Tight", color: "#F46B2C", bg: "#FFF7ED" },
  critical: { label: "Critical", color: "#DC2626", bg: "#FEF2F2" },
};
