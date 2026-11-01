import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit, clientKey, rateLimitHeaders, ipOf, ipPrefix } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { joinWaitlist } from "@/lib/db";

/** "Tell me when MakoBot is back." Stores the email on the release waitlist. */

export const runtime = "nodejs";

const LIMIT = 5;
const WINDOW_MS = 60 * 60_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const SOURCES = new Set(["hero", "download", "get-key"]);

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "notify"), LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many tries from this connection. Please wait a while, or email support@makobot.com." }, { status: 429, headers: rateLimitHeaders(rl, LIMIT) });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Signups are not working right now. Email support@makobot.com and we will add you." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const session = await auth().catch(() => null);
  const sessionEmail = session?.user?.email?.trim().toLowerCase() || null;
  const email = (sessionEmail ?? (typeof body.email === "string" ? body.email : "")).trim().toLowerCase().slice(0, 255);
  const source = typeof body.source === "string" && SOURCES.has(body.source) ? body.source : null;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter an email address we can write to." }, { status: 400 });
  }

  // Every public form gets a captcha. A signed-in user is already a known person.
  if (!sessionEmail) {
    const turnstile = await verifyTurnstile(typeof body.turnstileToken === "string" ? body.turnstileToken : null, ipOf(request));
    if (!turnstile.ok) {
      return NextResponse.json({ error: "The human check did not pass. Reload the page and try again." }, { status: 400 });
    }
  }

  try {
    const added = await joinWaitlist(email, source, ipPrefix(ipOf(request)));
    return NextResponse.json({ ok: true, alreadyOnList: !added });
  } catch (err) {
    console.error("[notify] failed:", err);
    return NextResponse.json({ error: "That did not save. Email support@makobot.com and we will add you." }, { status: 500 });
  }
}
