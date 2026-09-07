"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Turnstile from "./turnstile";

/**
 * The help bubble in the corner of every public page. Chat first; a
 * "Talk to a person" form when the assistant cannot help or the visitor
 * asks. The transcript stays in this browser until it goes with a ticket.
 * Ported from handpenned.com on 2026-09-06.
 */

interface Turn {
  role: "user" | "assistant";
  text: string;
}

const OPENER: Turn = {
  role: "assistant",
  text: "Hi. Ask me anything about MakoBot: getting the free key, installing it, connecting your email, how memory works. If I can't answer, I'll pass you to a person.",
};

export default function SupportChat() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([OPENER]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns, open, handoff, busy]);

  // Focus goes into the panel when it opens.
  useEffect(() => {
    if (open) {
      const first = panelRef.current?.querySelector<HTMLElement>("input, textarea, button");
      first?.focus();
    }
  }, [open, handoff]);

  // Not inside the admin: it has its own Support tab, and the rail is busy enough.
  if (path?.startsWith("/admin")) return null;

  const close = () => {
    setOpen(false);
    setTimeout(() => bubbleRef.current?.focus(), 0);
  };

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])")];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || busy) return;
    const next = [...turns, { role: "user" as const, text: t }];
    setTurns(next);
    setText("");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turns: next.filter((x) => x !== OPENER) }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "That did not work.");
      setTurns((cur) => [...cur, { role: "assistant", text: j.answer }]);
      if (j.escalate) {
        setHandoff(true);
        setMessage(t);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not work.");
    } finally {
      setBusy(false);
    }
  }

  async function sendTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const turnstileToken = new FormData(e.currentTarget).get("cf-turnstile-response");
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, page: path, transcript: turns.filter((x) => x !== OPENER), turnstileToken }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "That did not send.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not send.");
    } finally {
      setBusy(false);
    }
  }

  const errorBox = error ? (
    <p role="alert" className="mx-3.5 my-0 text-sm text-[#a8232b] bg-[#fef2f2] border border-[#ffcaca] rounded-lg px-3 py-2">
      {error}
    </p>
  ) : null;

  return (
    <div className="support-chat fixed right-[18px] bottom-[18px] z-[60] flex flex-col items-end gap-2.5 max-sm:right-2.5 max-sm:bottom-2.5">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Help"
          onKeyDown={onPanelKeyDown}
          className="support-panel flex flex-col w-[min(380px,calc(100vw-36px))] max-h-[min(600px,calc(100vh-100px))] bg-white border border-[#cfd9e5] rounded-2xl shadow-[0_16px_44px_rgba(29,53,84,0.22)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-[#002643] text-white text-base">
            <b>Help</b>
            <button type="button" onClick={close} aria-label="Close help" className="text-sm font-semibold text-[#cce1f3] underline underline-offset-2 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
              Close
            </button>
          </div>

          {!handoff ? (
            <>
              <div ref={listRef} className="flex-1 min-h-[160px] overflow-y-auto p-3.5 flex flex-col gap-2 styled-scrollbar">
                {turns.map((t, i) => (
                  <p
                    key={i}
                    className={`m-0 max-w-[88%] px-3 py-2 rounded-xl text-[15px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] ${
                      t.role === "user" ? "self-end bg-[#0061aa] text-white rounded-br-[4px]" : "self-start bg-[#f1f5f9] text-[#1d3554] rounded-bl-[4px]"
                    }`}
                  >
                    {t.text}
                  </p>
                ))}
                {busy && (
                  <p className="m-0 self-start px-3 py-2 rounded-xl rounded-bl-[4px] bg-[#f1f5f9] text-sm text-[#7a8aa0]" aria-live="polite">
                    Thinking…
                  </p>
                )}
              </div>
              {errorBox}
              <form onSubmit={send} className="flex gap-2 px-3.5 pt-2.5 pb-1.5 border-t border-[#e4ebf3]">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a question"
                  aria-label="Your question"
                  maxLength={1500}
                  className="flex-1 min-w-0 text-[15px] px-3 py-2.5 border border-[#cfd9e5] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]"
                />
                <button
                  type="submit"
                  disabled={busy || !text.trim()}
                  className="px-4 py-2.5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#0061aa]"
                >
                  Send
                </button>
              </form>
              <button
                type="button"
                onClick={() => setHandoff(true)}
                className="self-center mt-0.5 mb-2.5 text-sm font-semibold text-[#0061aa] underline underline-offset-2 hover:text-[#004d88] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6] rounded"
              >
                Talk to a person instead
              </button>
            </>
          ) : sent ? (
            <div className="p-3.5">
              <p className="m-0 px-4 py-3 border border-[#a7d8b4] border-l-4 border-l-[#2f855a] rounded-lg bg-[#f0f9f3] text-[#1c4532] text-[14.5px] leading-relaxed">
                Sent. A person will reply to {email} soon, usually the same day. Your chat so far went with it, so you will not have to repeat yourself.
              </p>
            </div>
          ) : (
            <form onSubmit={sendTicket} className="p-3.5 flex flex-col gap-2.5 overflow-y-auto">
              <p className="m-0 text-sm text-[#7a8aa0] leading-relaxed">A person will answer by email. Your chat so far goes with the message.</p>
              <div className="flex flex-col gap-1">
                <label htmlFor="support-email" className="text-sm font-semibold text-[#3d5273]">
                  Your email
                </label>
                <input
                  id="support-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="text-[15px] px-3 py-2.5 border border-[#cfd9e5] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="support-msg" className="text-sm font-semibold text-[#3d5273]">
                  What is going on
                </label>
                <textarea
                  id="support-msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={4000}
                  required
                  className="text-[15px] px-3 py-2.5 border border-[#cfd9e5] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]"
                />
              </div>
              <Turnstile action="support-chat" />
              {error && (
                <p role="alert" className="m-0 text-sm text-[#a8232b] bg-[#fef2f2] border border-[#ffcaca] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <button
                  type="submit"
                  disabled={busy || !email || message.trim().length < 5}
                  className="px-4 py-2.5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#0061aa]"
                >
                  {busy ? "Sending…" : "Send to a person"}
                </button>
                <button
                  type="button"
                  onClick={() => setHandoff(false)}
                  className="text-sm font-semibold text-[#0061aa] underline underline-offset-2 hover:text-[#004d88] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6] rounded"
                >
                  Back to the chat
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <button
        ref={bubbleRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-label={open ? "Close help" : "Open help"}
        className="support-bubble min-w-[64px] h-[52px] px-5 rounded-full bg-[#0061aa] hover:bg-[#004d88] text-white text-base font-extrabold shadow-[0_6px_18px_rgba(0,38,67,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0061aa]"
      >
        {open ? "×" : "Help"}
      </button>
    </div>
  );
}
