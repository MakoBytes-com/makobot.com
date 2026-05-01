import { NextRequest, NextResponse } from "next/server";
import { getAppVersionStatus, getLatestApprovedAppVersion, ensureAppVersionsTable } from "@/lib/db";

// Public, lightweight, cacheable endpoint MakoBot pings on startup + hourly.
//
// GET /api/app-status?version=2.0.0.103
//
// Response shape (always 200, never an error — defensive client design):
//   {
//     "currentVersion": "2.0.0.103",
//     "status": "ok" | "deprecated" | "blocked" | "unknown",
//     "message": "...optional message to show user...",
//     "latestVersion": "2.0.0.105",
//     "downloadUrl": "https://www.makobot.com/api/download"
//   }
//
// 'unknown' = we don't have a row for this version. Default behavior in the
// client should be to allow it (don't lock out users on a build we forgot
// to register). Client logs the unknown response so we can backfill.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const version = (searchParams.get("version") || "").trim();

  let row: Awaited<ReturnType<typeof getAppVersionStatus>> | null = null;
  let latest: Awaited<ReturnType<typeof getLatestApprovedAppVersion>> | null = null;
  try {
    // Ensure table exists on first request (idempotent — fast NOOP after first run).
    await ensureAppVersionsTable();
    if (version) row = await getAppVersionStatus(version);
    latest = await getLatestApprovedAppVersion();
  } catch {
    // DB error — return permissive defaults so a temporary outage on our side
    // doesn't kill clients in the field.
    return cacheableJson({
      currentVersion: version || null,
      status: "ok",
      message: null,
      latestVersion: null,
      downloadUrl: "https://www.makobot.com/api/download",
    });
  }

  return cacheableJson({
    currentVersion: version || null,
    status: row?.status ?? "unknown",
    message: row?.message ?? null,
    latestVersion: latest?.version ?? null,
    downloadUrl: "https://www.makobot.com/api/download",
  });
}

function cacheableJson(body: Record<string, unknown>) {
  // Cache 60s at the edge — admin status flips propagate within a minute,
  // which is fine for the kill-switch use case (vs. once-an-hour client poll).
  const res = NextResponse.json(body);
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}
