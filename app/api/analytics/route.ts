import { NextRequest, NextResponse } from "next/server";
import { trackPageView } from "@/lib/db";

// Build 316 audit (MEDIUM): this is an unauthenticated public POST — cap every
// stored field so it can't be scripted with megabyte strings to bloat the DB.
// (A proper per-IP rate limit is the follow-up; length caps are the cheap
// first line and stop the worst abuse.)
const cap = (v: unknown, n: number): string | null =>
  typeof v === "string" && v.length > 0 ? v.slice(0, n) : null;

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const safePath = cap(path, 500);
    if (!safePath) return NextResponse.json({ ok: false }, { status: 400 });
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").slice(0, 100);
    const userAgent = (req.headers.get("user-agent") || "unknown").slice(0, 500);

    await trackPageView(safePath, cap(referrer, 500), userAgent, ip);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
