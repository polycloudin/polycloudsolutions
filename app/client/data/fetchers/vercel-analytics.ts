import type { KPI, SiteTraffic } from "../types";

/**
 * Vercel Web Analytics fetcher — reusable across clients.
 *
 * Called per-client with projectId (+ optional teamId) from
 * data/<slug>.ts.liveFeeds.vercelAnalytics.
 *
 * Shared env var (one token for PolyCloud's Vercel team):
 *   VERCEL_ACCESS_TOKEN — personal or team token (Reader scope is enough)
 *                         generate at vercel.com/account/tokens
 *
 * Vercel's public Analytics API isn't fully stable yet; this hits the
 * same insights endpoints the dashboard uses. Fails quietly on any error
 * so the dashboard falls back to its baseline data.
 */

interface VercelAnalyticsSection {
  overviewKpis?: KPI[];
  siteTraffic?: SiteTraffic;
}

export async function fetchVercelAnalytics(params: {
  projectId: string;
  teamId?: string;
  siteUrl?: string;
}): Promise<VercelAnalyticsSection | null> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  if (!token || !params.projectId) return null;

  const base = "https://vercel.com/api/web-analytics/stats";
  const since = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // 7d
  const until = Math.floor(Date.now() / 1000);

  const query = new URLSearchParams({
    projectId: params.projectId,
    since: String(since),
    until: String(until),
    granularity: "day",
  });
  if (params.teamId) query.set("teamId", params.teamId);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch summary metrics, top pages, and top referrers in parallel
  try {
    const [summary, pages, referrers] = await Promise.all([
      fetch(`${base}/summary?${query}`, { headers, cache: "no-store" }),
      fetch(`${base}/paths?${query}&limit=5`, { headers, cache: "no-store" }),
      fetch(`${base}/referrers?${query}&limit=5`, { headers, cache: "no-store" }),
    ]);

    // If any response is not OK, bail gracefully — Vercel's API is still moving
    if (!summary.ok || !pages.ok || !referrers.ok) {
      console.error("Vercel Analytics responses:", summary.status, pages.status, referrers.status);
      return null;
    }

    const summaryJson = await summary.json();
    const pagesJson = await pages.json();
    const referrersJson = await referrers.json();

    // Summary shape varies by endpoint version — be defensive.
    const visits =
      summaryJson?.totals?.visits ??
      summaryJson?.visits ??
      summaryJson?.total ??
      null;
    const visitors =
      summaryJson?.totals?.visitors ??
      summaryJson?.visitors ??
      null;
    const bounceRate =
      summaryJson?.totals?.bounceRate ??
      summaryJson?.bounceRate ??
      null;

    const overviewKpis: KPI[] = [
      { label: "Site visits (7d)", value: visits != null ? String(visits) : "—", tone: "ink" },
      { label: "Unique visitors (7d)", value: visitors != null ? String(visitors) : "—", tone: "ink" },
      {
        label: "Bounce rate",
        value: bounceRate != null ? `${Math.round(Number(bounceRate) * 100)}%` : "—",
        tone: "ink",
      },
    ];

    const rows = (pagesJson?.data ?? pagesJson?.paths ?? []) as Array<{
      path?: string;
      key?: string;
      value?: number;
      count?: number;
      visits?: number;
    }>;
    const topPages = rows.slice(0, 5).map((r) => ({
      path: r.path ?? r.key ?? "/",
      pageviews: Number(r.value ?? r.count ?? r.visits ?? 0),
    }));

    const refRows = (referrersJson?.data ?? referrersJson?.referrers ?? []) as Array<{
      referrer?: string;
      key?: string;
      value?: number;
      count?: number;
      visits?: number;
    }>;
    const topReferrers = refRows.slice(0, 5).map((r) => ({
      source: r.referrer ?? r.key ?? "direct",
      visits: Number(r.value ?? r.count ?? r.visits ?? 0),
    }));

    return {
      overviewKpis,
      siteTraffic: {
        visits7d: visits != null ? Number(visits) : null,
        topPages,
        topReferrers,
      },
    };
  } catch (err) {
    console.error("Vercel Analytics fetch error:", err);
    return null;
  }
}
