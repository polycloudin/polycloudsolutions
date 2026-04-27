import { NextResponse } from "next/server";
import { getClient } from "../../../lib/clients";
import { fetchGa4 } from "../../../client/data/fetchers/ga4";
import { fetchVercelAnalytics } from "../../../client/data/fetchers/vercel-analytics";
import type { ClientData, KPI, SiteTraffic } from "../../../client/data/types";

/**
 * Canonical client-data endpoint. Reads the baseline ClientData (DB-first
 * via app/lib/clients, static-registry fallback for the three legacy
 * dashboards), runs any configured liveFeeds fetchers, and returns the
 * merged result.
 *
 * Fetchers that return null (missing creds, errors) don't affect output —
 * the dashboard gracefully shows hardcoded values.
 *
 * GET /api/live/<slug>  → ClientData (or merged ClientData if liveFeeds set)
 *
 * Auth posture: this endpoint is currently unguarded — proxy.ts gates the
 * page surface (/client/<slug>) by claims, and the route mirrors that on
 * the data path. If a slug is `auth: "private"`, the page bounces unauth
 * users to /login before they can fetch this endpoint. Public slugs
 * (kumar-textiles, demo) are intentionally readable without a session.
 */
export const runtime = "nodejs"; // jose (GA4 JWT signing) needs Node crypto

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const base = await getClient(slug);
  if (!base) return NextResponse.json({ error: "not found" }, { status: 404 });

  const feeds = base.liveFeeds;
  if (!feeds) return NextResponse.json(base);

  // Run every configured fetcher in parallel. Failures → null → skip.
  const [ga4Result, vercelResult] = await Promise.all([
    feeds.ga4 ? fetchGa4(feeds.ga4.propertyId).catch((e) => { console.error("ga4", e); return null; }) : Promise.resolve(null),
    feeds.vercelAnalytics
      ? fetchVercelAnalytics({
          projectId: feeds.vercelAnalytics.projectId,
          teamId: feeds.vercelAnalytics.teamId,
          siteUrl: feeds.vercelAnalytics.siteUrl,
        }).catch((e) => { console.error("vercel", e); return null; })
      : Promise.resolve(null),
  ]);

  // Merge in priority order: GA4 wins over Vercel for overlapping KPIs.
  // Both contribute site-traffic (pages/referrers) — prefer GA4 there too.
  const liveKpis: KPI[] = [
    ...(ga4Result?.overviewKpis ?? []),
    ...(vercelResult?.overviewKpis ?? []),
  ];
  const liveSiteTraffic: SiteTraffic | undefined =
    ga4Result?.siteTraffic ?? vercelResult?.siteTraffic ?? undefined;

  if (liveKpis.length === 0 && !liveSiteTraffic) {
    // Nothing live came back — return baseline unchanged
    return NextResponse.json(base);
  }

  const merged: ClientData = {
    ...base,
    overview: {
      ...base.overview,
      // Live KPIs lead; keep any baseline KPIs up to a total of 5
      kpis: [...liveKpis, ...base.overview.kpis].slice(0, 5),
    },
    organic: {
      ...base.organic,
      siteTraffic: liveSiteTraffic ?? base.organic?.siteTraffic,
    },
  };
  return NextResponse.json(merged);
}
