import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listTickets, openTicketCount, replyTicket, setTicketStatus } from "@/lib/support";

/** The support inbox: list, reply, and change status. Admin only. Replies are emailed to the visitor. */

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [tickets, open] = await Promise.all([listTickets(), openTicketCount()]);
    return NextResponse.json({ tickets, open });
  } catch (err) {
    console.error("[admin-support] list failed:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Could not load tickets." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin || !session.user.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Which ticket?" }, { status: 400 });
  const action = typeof body.action === "string" ? body.action : "";
  try {
    if (action === "reply") {
      const text = typeof body.text === "string" ? body.text.trim().slice(0, 6000) : "";
      if (text.length < 2) return NextResponse.json({ error: "Write the reply first." }, { status: 400 });
      const t = await replyTicket(id, session.user.email, text);
      return NextResponse.json({ ok: true, ticket: t });
    }
    if (action === "status") {
      const status = body.status === "open" || body.status === "answered" || body.status === "closed" ? body.status : null;
      if (!status) return NextResponse.json({ error: "open, answered or closed." }, { status: 400 });
      await setTicketStatus(id, status);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "That did not work." }, { status: 500 });
  }
}
