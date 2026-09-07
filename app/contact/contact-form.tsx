"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Turnstile from "../turnstile";

/**
 * The contact form. It files a support ticket through the same route the
 * Help chat uses, so every message lands in Admin > Support and emails the
 * owner. A signed-in user's email is taken from the session on the server.
 */

const INPUT = "w-full text-[15px] px-3 py-2.5 border border-[#cfd9e5] rounded-lg bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]";
const LABEL = "text-sm font-semibold text-[#3d5273]";

export default function ContactForm() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  const signedInEmail = session?.user?.email ?? "";
  const effectiveEmail = signedInEmail || email;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const turnstileToken = new FormData(e.currentTarget).get("cf-turnstile-response");
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, page: "/contact", turnstileToken }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "That did not send.");
      setSentTo(effectiveEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not send.");
      // A used Turnstile token cannot be replayed; give the visitor a fresh one for the retry.
      try {
        window.turnstile?.reset?.();
      } catch {
        /* the widget re-renders on its own if needed */
      }
    } finally {
      setBusy(false);
    }
  }

  if (sentTo) {
    return (
      <div role="status" className="px-5 py-4 border border-[#a7d8b4] border-l-4 border-l-[#2f855a] rounded-lg bg-[#f0f9f3] text-[#1c4532] text-[15px] leading-relaxed">
        <p className="font-semibold mb-1">Sent.</p>
        <p>A person will reply to {sentTo} soon, usually the same day. The reply comes from support@makobot.com, so it may help to check your junk folder once.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="contact-name" className={LABEL}>
            Your name <span className="font-normal text-[#7a8aa0]">(optional)</span>
          </label>
          <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} className={INPUT} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact-email" className={LABEL}>
            Your email
          </label>
          {signedInEmail ? (
            <input id="contact-email" value={signedInEmail} readOnly aria-readonly="true" className={`${INPUT} bg-[#f8f9fb] text-[#555555]`} />
          ) : (
            <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={INPUT} />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-subject" className={LABEL}>
          Subject <span className="font-normal text-[#7a8aa0]">(optional)</span>
        </label>
        <input id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} className={INPUT} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className={LABEL}>
          Message
        </label>
        <textarea id="contact-message" rows={7} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={4000} required className={INPUT} />
        <p className="text-xs text-[#7a8aa0] tabular-nums">{message.length} / 4000</p>
      </div>

      <Turnstile action="contact" />

      {error && (
        <p role="alert" className="text-sm text-[#a8232b] bg-[#fef2f2] border border-[#ffcaca] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy || !effectiveEmail || message.trim().length < 5}
          className="px-6 py-3 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0061aa]"
        >
          {busy ? "Sending…" : "Send message"}
        </button>
        <p className="text-xs text-[#7a8aa0] max-w-xs leading-relaxed">
          Your message and email are kept as a support ticket so we can follow up. See the <a href="/privacy" className="underline">privacy policy</a>.
        </p>
      </div>
    </form>
  );
}
