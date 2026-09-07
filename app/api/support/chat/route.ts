import { NextResponse } from "next/server";
import { rateLimit, clientKey, rateLimitHeaders } from "@/lib/ratelimit";
import { answerSupport, type ChatTurn } from "@/lib/support";
import { llmConfigured } from "@/lib/llm";

/**
 * The support chat. Public, rate-limited, short messages only, nothing
 * stored: the transcript lives in the visitor's browser until they choose
 * to send it with a ticket.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const LIMIT = 40;
const WINDOW_MS = 60 * 60_000;

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "support-chat"), LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "That is a lot of messages in an hour. Email support@makobot.com and a person will answer." },
      { status: 429, headers: rateLimitHeaders(rl, LIMIT) }
    );
  }
  if (!llmConfigured()) {
    return NextResponse.json({ answer: "The assistant is not available right now. Use 'Talk to a person' and we will answer by email.", escalate: true });
  }

  let body: { turns?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
  const turns: ChatTurn[] = Array.isArray(body.turns)
    ? body.turns
        .filter((t): t is { role: string; text: string } => typeof t === "object" && t !== null && typeof (t as { text?: unknown }).text === "string")
        .map((t) => ({ role: t.role === "assistant" ? "assistant" : "user", text: String(t.text).slice(0, 1500) }) as ChatTurn)
        .slice(-10)
    : [];
  if (!turns.length || turns[turns.length - 1].role !== "user") return NextResponse.json({ error: "Say something first." }, { status: 400 });
  try {
    const a = await answerSupport(turns);
    return NextResponse.json(a);
  } catch (err) {
    console.error("[support-chat] failed:", err);
    return NextResponse.json({ answer: "I could not answer just now. Use 'Talk to a person' and we will reply by email.", escalate: true });
  }
}
