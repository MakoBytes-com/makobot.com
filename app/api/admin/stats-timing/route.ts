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

// Diagnostic — runs each /api/admin/stats query SERIALLY with per-query
// timing so we see exactly which one is slow. Same auth gate.
export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const queries: { name: string; fn: () => Promise<unknown> }[] = [
    { name: "getUserCount", fn: () => getUserCount() },
    { name: "getKeyCount", fn: () => getKeyCount() },
    { name: "getActiveKeyCount", fn: () => getActiveKeyCount() },
    { name: "getDownloadCount", fn: () => getDownloadCount() },
    { name: "getPageViewCount(30)", fn: () => getPageViewCount(30) },
    { name: "getUniqueVisitors(30)", fn: () => getUniqueVisitors(30) },
    { name: "getSignupsPerDay(30)", fn: () => getSignupsPerDay(30) },
    { name: "getDownloadsPerDay(30)", fn: () => getDownloadsPerDay(30) },
    { name: "getPageViewsPerDay(30)", fn: () => getPageViewsPerDay(30) },
    { name: "getTopPages(30, 10)", fn: () => getTopPages(30, 10) },
    { name: "getTopReferrers(30, 10)", fn: () => getTopReferrers(30, 10) },
    { name: "getRecentEvents(20)", fn: () => getRecentEvents(20) },
    { name: "getRecentDownloads(20)", fn: () => getRecentDownloads(20) },
  ];

  const timings: { name: string; ms: number; ok: boolean; err?: string; rowsOrCount?: unknown }[] = [];
  const overallStart = Date.now();
  for (const q of queries) {
    const t0 = Date.now();
    try {
      const result = await q.fn();
      const ms = Date.now() - t0;
      timings.push({
        name: q.name,
        ms,
        ok: true,
        rowsOrCount: Array.isArray(result) ? `[${result.length} rows]` : result,
      });
    } catch (err) {
      timings.push({
        name: q.name,
        ms: Date.now() - t0,
        ok: false,
        err: (err as Error).message,
      });
    }
  }

  return NextResponse.json({
    totalMs: Date.now() - overallStart,
    timings: timings.sort((a, b) => b.ms - a.ms), // slowest first
  });
}
