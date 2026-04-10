import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { trackDownload, trackEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const userId = parseInt(session.user.id);

  await trackDownload(userId, ip, userAgent);
  await trackEvent("download", { version: "2.0.0", email: session.user.email }, userId, ip);

  // Return the download URL — configure via env var
  const downloadUrl = process.env.DOWNLOAD_URL || "#";
  return NextResponse.json({ url: downloadUrl });
}
