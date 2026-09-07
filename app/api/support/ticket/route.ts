import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit, clientKey, rateLimitHeaders, ipOf, ipPrefix } from "@/lib/ratelimit";
import { createTicket, type ChatTurn } from "@/lib/support";

/** A visitor or a signed-in user asks for a person. Makes a ticket and emails the owner. */

export const runtime = "nodejs";

const LIMIT = 5;
const WINDOW_MS = 60 * 60_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "support-ticket"), LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json({ error: "Five tickets an hour is the limit. Email support@makobot.com directly." }, { status: 429, headers: rateLimitHeaders(rl, LIMIT) });
  }
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Support is not available right now. Email support@makobot.com." }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const session = await auth().catch(() => null);
  const sessionEmail = session?.user?.email?.trim().toLowerCase() || null;
  const sessionUserId = session?.user?.id != null ? Number(session.user.id) : null;

  const email = (sessionEmail ?? (typeof body.email === "string" ? body.email : "")).trim().toLowerCase();
  const name = session?.user?.name ?? (typeof body.name === "string" ? body.name.trim().slice(0, 80) || null : null);
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 4000) : "";
  const subject = (typeof body.subject === "string" ? body.subject.trim().slice(0, 120) : "") || message.split(/\n/)[0].slice(0, 80) || "Support request";
  const page = typeof body.page === "string" ? body.page.slice(0, 300) : null;
  const transcript: ChatTurn[] = Array.isArray(body.transcript)
    ? body.transcript
        .filter((t): t is { role: string; text: string } => typeof t === "object" && t !== null && typeof (t as { text?: unknown }).text === "string")
        .map((t) => ({ role: t.role === "assistant" ? "assistant" : "user", text: String(t.text).slice(0, 1500) }) as ChatTurn)
        .slice(-20)
    : [];

  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter an email address we can reply to." }, { status: 400 });
  if (message.length < 5) return NextResponse.json({ error: "Tell us what is going on, in a sentence or two." }, { status: 400 });

  try {
    const t = await createTicket({
      userId: Number.isFinite(sessionUserId) ? sessionUserId : null,
      email,
      name,
      subject,
      message,
      transcript,
      page,
      ipPrefix: ipPrefix(ipOf(request)),
    });
    return NextResponse.json({ ok: true, id: t.id });
  } catch (err) {
    console.error("[support-ticket] failed:", err);
    return NextResponse.json({ error: "That did not send. Email support@makobot.com directly." }, { status: 500 });
  }
}
