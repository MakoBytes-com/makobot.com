import { NextRequest, NextResponse } from "next/server";
import { trackPageView } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await trackPageView(path, referrer || null, userAgent, ip);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
