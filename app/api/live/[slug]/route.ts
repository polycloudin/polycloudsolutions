import { NextResponse } from "next/server";
import { getClient } from "../../../client/data/registry";
import { fetchGa4 } from "../../../client/data/fetchers/ga4";
import type { ClientData } from "../../../client/data/types";

/**
 * Live-data overlay for a client dashboard.
 *
 * Reads the baseline ClientData from the registry, then asks each live
 * fetcher to produce a Partial<ClientData> and merges them on top.
 * If no fetchers are configured (missing env vars), the response is the
 * untouched baseline — the UI still works, just shows hardcoded numbers.
 *
 * GET /api/live/polycloud  → merged ClientData
 */
export const runtime = "nodejs"; // jose needs Node crypto APIs

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const base = getClient(slug);
  if (!base) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Only the polycloud dogfood dashboard gets live overlays for now.
  // Other (demo) clients keep their hardcoded numbers.
  if (slug !== "polycloud") {
    return NextResponse.json(base);
  }

  try {
    const ga4 = await fetchGa4();
    if (ga4) {
      const merged: ClientData = {
        ...base,
        overview: {
          ...base.overview,
          // Prepend GA4 KPIs so they lead the overview grid
          kpis: [...(ga4.overviewKpis ?? []), ...base.overview.kpis].slice(0, 5),
        },
        organic: {
          ...base.organic,
          siteTraffic: ga4.siteTraffic ?? base.organic?.siteTraffic,
        },
      };
      return NextResponse.json(merged);
    }
  } catch (err) {
    console.error("live route ga4 error:", err);
    // Fall through to baseline
  }

  return NextResponse.json(base);
}
