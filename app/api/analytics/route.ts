import { NextRequest, NextResponse } from "next/server";
import { trackPageView, BOT_UA_RX } from "@/lib/db";

// Build 316 audit (MEDIUM): this is an unauthenticated public POST — cap every
// stored field so it can't be scripted with megabyte strings to bloat the DB.
const cap = (v: unknown, n: number): string | null =>
  typeof v === "string" && v.length > 0 ? v.slice(0, n) : null;

// Monitors and tools don't get page-view rows. MakoPulse's BrowserCheck alone
// was inserting ~480 rows/day (a homepage load every ~3 minutes) before this.
// Bots still get {ok:true} so they have nothing to adapt to.
const BOT_UA = new RegExp(BOT_UA_RX, "i");

// Per-IP rate limit, 30/min in-memory. On serverless the Map is per-instance,
// so the true ceiling is 30/min x warm instances — still blunts scripted
// sprays without an external store. Real users fire once per page nav.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, { n: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.n++;
  return h.n > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const safePath = cap(path, 500);
    if (!safePath) return NextResponse.json({ ok: false }, { status: 400 });
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").slice(0, 100);
    const userAgent = (req.headers.get("user-agent") || "unknown").slice(0, 500);

    if (BOT_UA.test(userAgent)) return NextResponse.json({ ok: true });
    if (rateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

    await trackPageView(safePath, cap(referrer, 500), userAgent, ip);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
