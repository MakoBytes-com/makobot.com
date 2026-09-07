"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The support inbox. Everything the help chat on the site could not answer
 * lands here with the chat that came before it. A reply goes to the visitor
 * by email from support@makobot.com and stays on the ticket.
 */

interface Turn {
  role: "user" | "assistant";
  text: string;
}

interface Reply {
  by: string;
  text: string;
  at: string;
}

interface Ticket {
  id: string;
  user_id: number | null;
  email: string;
  name: string | null;
  subject: string;
  message: string;
  transcript: Turn[];
  replies: Reply[];
  status: "open" | "answered" | "closed";
  page: string | null;
  created_at: string;
  updated_at: string;
}

function when(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

const PILL: Record<Ticket["status"], string> = {
  open: "bg-[#fffbeb] text-[#8a4b00] border-[#f5d9a8]",
  answered: "bg-[#ecfdf5] text-[#007956] border-[#a4f4cf]",
  closed: "bg-[#f1f5f9] text-[#555555] border-[#dbdbdb]",
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/support", { cache: "no-store" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Could not load tickets.");
      setTickets(j.tickets || []);
      setLoadError("");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const open = tickets.filter((t) => t.status === "open");
  const rest = tickets.filter((t) => t.status !== "open");

  return (
    <div>
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-2">
        <h1 className="text-2xl font-bold text-[#333333]">Support</h1>
        <p className="text-sm text-[#777777] tabular-nums">
          {open.length} open, {rest.length} answered or closed
        </p>
      </div>
      <p className="text-sm text-[#777777] mb-6 max-w-3xl leading-relaxed">
        Everything the help chat on the site could not answer lands here, with the chat that came before it. A reply goes to the visitor by email from
        support@makobot.com and stays on the ticket. New tickets also email you.
      </p>

      {loading && <p className="text-[#777777]">Loading…</p>}
      {loadError && (
        <p role="alert" className="text-sm text-[#a8232b] bg-[#fef2f2] border border-[#ffcaca] rounded-lg px-3 py-2 mb-4">
          {loadError}
        </p>
      )}

      {!loading && (
        <>
          <Section title="Open" empty="Nothing waiting.">
            {open.map((t) => (
              <TicketRow key={t.id} ticket={t} onChange={load} />
            ))}
          </Section>
          <Section title="Answered and closed" empty="None yet.">
            {rest.map((t) => (
              <TicketRow key={t.id} ticket={t} onChange={load} />
            ))}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section className="bg-[#f8f9fb] border border-[#dbdbdb] rounded-xl p-5 mb-6">
      <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#777777] mb-3">{title}</h2>
      {children.length === 0 ? <p className="text-sm text-[#777777]">{empty}</p> : children}
    </section>
  );
}

function TicketRow({ ticket, onChange }: { ticket: Ticket; onChange: () => Promise<void> }) {
  const [open, setOpen] = useState(ticket.status === "open");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});

  async function act(action: string, extra: Record<string, unknown>, okText: string) {
    setBusy(action);
    setMsg({});
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id: ticket.id, ...extra }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "That did not work.");
      setMsg({ ok: okText });
      if (action === "reply") setText("");
      await onChange();
    } catch (err) {
      setMsg({ error: err instanceof Error ? err.message : "That did not work." });
    } finally {
      setBusy("");
    }
  }

  return (
    <article className={`bg-white border rounded-xl mb-3 overflow-hidden ${ticket.status === "open" ? "border-[#f5d9a8]" : "border-[#dbdbdb]"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-[#f1f5f9] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3a94d6]"
      >
        <span className={`inline-block text-[11px] font-extrabold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full border ${PILL[ticket.status]}`}>{ticket.status}</span>
        <b className="text-[15px] text-[#333333]">{ticket.subject}</b>
        <span className="text-sm text-[#777777]">
          {ticket.email}
          {ticket.name ? ` · ${ticket.name}` : ""} · {when(ticket.created_at)}
          {ticket.user_id ? " · signed in" : " · visitor"}
        </span>
      </button>

      {open && (
        <div className="border-t border-[#e4ebf3] px-4 pb-4 pt-2 flex flex-col gap-3">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#333333] mt-2">{ticket.message}</p>
          {ticket.page && <p className="text-sm text-[#777777]">From {ticket.page}</p>}

          {ticket.transcript.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-[#004d88]">The chat before they asked for a person ({ticket.transcript.length} messages)</summary>
              <div className="flex flex-col gap-2 mt-2">
                {ticket.transcript.map((t, i) => (
                  <p
                    key={i}
                    className={`max-w-[88%] px-3 py-2 rounded-xl whitespace-pre-wrap leading-relaxed ${
                      t.role === "user" ? "self-end bg-[#0061aa] text-white rounded-br-sm" : "self-start bg-[#f1f5f9] text-[#333333] rounded-bl-sm"
                    }`}
                  >
                    {t.text}
                  </p>
                ))}
              </div>
            </details>
          )}

          {ticket.replies.map((r, i) => (
            <div key={i} className="border-l-[3px] border-[#99c3e7] pl-3 py-1">
              <span className="text-sm text-[#777777]">
                {r.by} · {when(r.at)}
              </span>
              <p className="whitespace-pre-wrap leading-relaxed text-[#333333] mt-1">{r.text}</p>
            </div>
          ))}

          {ticket.status !== "closed" ? (
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void act("reply", { text }, "Reply sent by email and kept here.");
              }}
            >
              <label htmlFor={`reply-${ticket.id}`} className="sr-only">
                Reply to {ticket.email}
              </label>
              <textarea
                id={`reply-${ticket.id}`}
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Reply to ${ticket.email}. It goes out by email.`}
                maxLength={6000}
                className="w-full text-[15px] px-3 py-2.5 border border-[#cfd9e5] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={!!busy || text.trim().length < 2}
                  className="px-4 py-2 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0061aa]"
                >
                  {busy === "reply" ? "Sending…" : "Send reply"}
                </button>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => act("status", { status: "closed" }, "Closed.")}
                  className="px-4 py-2 rounded-lg border border-[#cfd9e5] text-sm font-semibold text-[#3d5273] hover:bg-[#f1f5f9] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]"
                >
                  Close ticket
                </button>
              </div>
            </form>
          ) : (
            <div>
              <button
                type="button"
                disabled={!!busy}
                onClick={() => act("status", { status: "open" }, "Reopened.")}
                className="px-4 py-2 rounded-lg border border-[#cfd9e5] text-sm font-semibold text-[#3d5273] hover:bg-[#f1f5f9] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]"
              >
                Reopen
              </button>
            </div>
          )}

          {msg.error && (
            <p role="alert" className="text-sm text-[#a8232b] bg-[#fef2f2] border border-[#ffcaca] rounded-lg px-3 py-2">
              {msg.error}
            </p>
          )}
          {msg.ok && <p className="text-sm font-bold text-[#007956]">{msg.ok}</p>}
        </div>
      )}
    </article>
  );
}
