import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { trackDownload, trackEvent, downloadsEnabled, getSetting } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Master switch. Checked BEFORE the download is recorded, so a paused period
  // doesn't inflate the download numbers with attempts that never got a file.
  if (!(await downloadsEnabled())) {
    const message =
      (await getSetting("downloads_message")) ||
      "Downloads are paused for a short while. Please check back soon.";
    return NextResponse.json({ error: message, paused: true }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const userId = parseInt(session.user.id);

  const build = process.env.CURRENT_BUILD?.trim() || "unknown";
  const version = `v2.0.0 Build ${build}`;

  await trackDownload(userId, ip, userAgent, version);
  await trackEvent("download", { version, email: session.user.email }, userId, ip);

  // Return the download URL — configure via env var
  const downloadUrl = process.env.DOWNLOAD_URL || "#";
  return NextResponse.json({ url: downloadUrl });
}
