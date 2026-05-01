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
    const [
      totalUsers,
      totalKeys,
      activeKeys,
      totalDownloads,
      pageViews30d,
      uniqueVisitors30d,
      signupsPerDay,
      downloadsPerDay,
      pageViewsPerDay,
      topPages,
      topReferrers,
      recentEvents,
      recentDownloads,
    ] = await Promise.all([
      getUserCount(),
      getKeyCount(),
      getActiveKeyCount(),
      getDownloadCount(),
      getPageViewCount(30),
      getUniqueVisitors(30),
      getSignupsPerDay(30),
      getDownloadsPerDay(30),
      getPageViewsPerDay(30),
      getTopPages(30, 10),
      getTopReferrers(30, 10),
      getRecentEvents(20),
      getRecentDownloads(20),
    ]);

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
