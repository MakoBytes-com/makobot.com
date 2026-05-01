import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserCount,
  getKeyCount,
  getActiveKeyCount,
  getDownloadCount,
  getPageViewCount,
  getUniqueVisitors,
  getSignupsPerDay,
  getDownloadsPerDay,
  getPageViewsPerDay,
  getTopPages,
  getTopReferrers,
  getRecentEvents,
  getRecentDownloads,
} from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Serial execution — Promise.all was hanging in production for unknown
    // reasons (timing endpoint shows queries finish in 46ms total when serial,
    // so total wall time is fine). Stop fighting it; ship working dashboard.
    const totalUsers = await getUserCount();
    const totalKeys = await getKeyCount();
    const activeKeys = await getActiveKeyCount();
    const totalDownloads = await getDownloadCount();
    const pageViews30d = await getPageViewCount(30);
    const uniqueVisitors30d = await getUniqueVisitors(30);
    const signupsPerDay = await getSignupsPerDay(30);
    const downloadsPerDay = await getDownloadsPerDay(30);
    const pageViewsPerDay = await getPageViewsPerDay(30);
    const topPages = await getTopPages(30, 10);
    const topReferrers = await getTopReferrers(30, 10);
    const recentEvents = await getRecentEvents(20);
    const recentDownloads = await getRecentDownloads(20);

    return NextResponse.json({
      totals: { totalUsers, totalKeys, activeKeys, totalDownloads, pageViews30d, uniqueVisitors30d },
      charts: { signupsPerDay, downloadsPerDay, pageViewsPerDay },
      topPages,
      topReferrers,
      recentEvents,
      recentDownloads,
    });
  } catch (err) {
    // Surface the actual failure to the client instead of returning a
    // generic 500 with no body. The dashboard's catch block surfaces
    // `error.message` to the user.
    const e = err as Error;
    console.error("[/api/admin/stats] failed:", e);
    return NextResponse.json(
      { error: e.message || "Stats query failed", stack: e.stack?.split("\n").slice(0, 5).join(" | ") },
      { status: 500 }
    );
  }
}
