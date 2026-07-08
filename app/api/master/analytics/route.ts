// Master CP analytics-pull endpoint (scope=analytics.read). Returns the
// CANONICAL fleet analytics shape (matching Bulldog / makologics.com) so
// master's per-client analytics tab renders from one data model across the
// fleet. Read-only. All queries are 30-day-windowed and exclude /admin/*
// paths so admin navigation doesn't inflate public traffic.
//
// makobot's page_views table (lib/db.ts) columns: path, referrer,
// user_agent, ip, created_at. Notable gaps vs the Bulldog schema:
//   - NO session_id column  → "sessions" is approximated by COUNT(DISTINCT ip),
//     which matches makobot's own getUniqueVisitors() convention. Documented,
//     not silently faked.
//   - NO country column on page_views → topCountries is empty.
//   - events table uses a `type` column (not `name`); conversions = COUNT of
//     events; the events breakdown maps type -> name.
//   - no dwell-time (needs session_id), no web-vitals events, no CTA-by-
//     location naming convention → those cards return empty. All keys are
//     still present so the response shape is identical to Bulldog's.
import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { verifyMasterToken } from "@/lib/master-jwt";

export const dynamic = "force-dynamic";

const DAYS = 30;

function isoDaysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function formatShortDate(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });
}

// Strip protocol + leading "www.", drop self-referrals and localhost so
// "https://www.google.com/" and "http://google.com" collapse to one host.
function normalizeReferrer(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (!host) return null;
    if (host === "localhost") return null;
    if (host.endsWith("makobot.com")) return null; // self-referral
    return host;
  } catch {
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed.slice(0, 120) : null;
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "missing bearer token" }, { status: 401 });
  }

  try {
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "analytics.read");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    const sql = getDb();
    const since = isoDaysAgo(DAYS - 1).toISOString();

    // Priority queries: totals, 30-day daily traffic, top pages, top
    // referrers, event breakdown. Fired in parallel (getDb uses max=5).
    const [
      totalsRows,
      convRows,
      trafficRows,
      topPageRows,
      namedRefRows,
      directRefRows,
      eventRows,
    ] = await Promise.all([
      sql`
        SELECT COUNT(*)::int AS views, COUNT(DISTINCT ip)::int AS sessions
        FROM page_views
        WHERE created_at >= ${since} AND path NOT LIKE '/admin%'
      `,
      sql`SELECT COUNT(*)::int AS total FROM events WHERE created_at >= ${since}`,
      sql`
        SELECT
          to_char(date_trunc('day', created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day,
          COUNT(*)::int AS views,
          COUNT(DISTINCT ip)::int AS sessions
        FROM page_views
        WHERE created_at >= ${since} AND path NOT LIKE '/admin%'
        GROUP BY 1
        ORDER BY 1
      `,
      sql`
        SELECT path, COUNT(*)::int AS count
        FROM page_views
        WHERE created_at >= ${since} AND path NOT LIKE '/admin%'
        GROUP BY path
        ORDER BY COUNT(*) DESC
        LIMIT 10
      `,
      sql`
        SELECT referrer, COUNT(*)::int AS count
        FROM page_views
        WHERE created_at >= ${since} AND referrer IS NOT NULL AND path NOT LIKE '/admin%'
        GROUP BY referrer
      `,
      sql`
        SELECT COUNT(*)::int AS count
        FROM page_views
        WHERE created_at >= ${since} AND (referrer IS NULL OR referrer = '') AND path NOT LIKE '/admin%'
      `,
      sql`
        SELECT type AS name, COUNT(*)::int AS count
        FROM events
        WHERE created_at >= ${since}
        GROUP BY type
        ORDER BY COUNT(*) DESC
        LIMIT 12
      `,
    ]);

    // totals
    const pv = totalsRows[0] ?? { views: 0, sessions: 0 };
    const totals = {
      views: Number(pv.views) || 0,
      sessions: Number(pv.sessions) || 0,
      conversions: Number(convRows[0]?.total) || 0,
    };

    // traffic: gap-fill every day in the 30-day window
    const byDay = new Map<string, { views: number; sessions: number }>();
    for (const r of trafficRows) {
      byDay.set(String(r.day), { views: Number(r.views) || 0, sessions: Number(r.sessions) || 0 });
    }
    const traffic: Array<{ date: string; views: number; sessions: number }> = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = isoDaysAgo(i);
      const key = d.toISOString().slice(0, 10);
      const match = byDay.get(key);
      traffic.push({
        date: formatShortDate(d),
        views: match?.views ?? 0,
        sessions: match?.sessions ?? 0,
      });
    }

    // topPages
    const topPages = topPageRows.map((r) => ({ path: String(r.path), count: Number(r.count) || 0 }));

    // topReferrers: normalize named hosts; roll self-referrals/localhost into direct
    const refMap = new Map<string, number>();
    let selfReferralCount = 0;
    for (const r of namedRefRows) {
      const source = normalizeReferrer(r.referrer as string | null);
      const c = Number(r.count) || 0;
      if (!source) {
        selfReferralCount += c;
        continue;
      }
      refMap.set(source, (refMap.get(source) || 0) + c);
    }
    const named = [...refMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));
    const direct = (Number(directRefRows[0]?.count) || 0) + selfReferralCount;
    const topReferrers = { named, direct };

    // events breakdown (events.type -> name)
    const events = eventRows.map((r) => ({ name: String(r.name), count: Number(r.count) || 0 }));

    return NextResponse.json({
      ok: true,
      totals,
      traffic,
      topPages,
      topReferrers,
      // Best-effort / empty: columns or event conventions makobot doesn't have.
      topCountries: [], // no country column on page_views
      timeOnPage: [], // needs session_id to compute dwell time
      events,
      ctaByLocation: [], // makobot events aren't named "Phone Call — <loc>"
      webVitals: [], // no web-vital events captured
      webVitalsByPath: [],
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "analytics query failed" },
      { status: 500 },
    );
  }
}
