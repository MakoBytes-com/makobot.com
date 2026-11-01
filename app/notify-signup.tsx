"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Turnstile from "./turnstile";

/**
 * "Tell me when it's back." Stands in for every download button while MakoBot
 * is offline (lib/offline.ts). Saves to the release waitlist via /api/notify.
 */

type Source = "hero" | "download" | "get-key";

export default function NotifySignup({ source, size = "md" }: { source: Source; size?: "md" | "lg" }) {
  const { data: session } = useSession();
  const signedInEmail = session?.user?.email ?? "";
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { email: string; already: boolean }>(null);

  const effectiveEmail = signedInEmail || email;
  const inputId = `notify-email-${source}`;
  const big = size === "lg";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const turnstileToken = new FormData(e.currentTarget).get("cf-turnstile-response");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, turnstileToken }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "That did not save. Please try again.");
      setDone({ email: effectiveEmail, already: Boolean(j.alreadyOnList) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not save. Please try again.");
      // A used Turnstile token cannot be replayed; give the visitor a fresh one.
      try {
        window.turnstile?.reset?.();
      } catch {
        /* the widget re-renders on its own if needed */
      }
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="w-full max-w-md px-5 py-4 border border-[#a7d8b4] border-l-4 border-l-[#2f855a] rounded-lg bg-[#f0f9f3] text-[#1c4532] text-[15px] leading-relaxed text-left">
        <p className="font-semibold mb-1">{done.already ? "You're already on the list." : "You're on the list."}</p>
        <p>We&apos;ll email {done.email} once when MakoBot is back. Nothing else.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md flex flex-col gap-3 text-left">
      <label htmlFor={inputId} className="text-sm font-semibold text-[#3d5273]">
        Email me when it&apos;s back
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        {signedInEmail ? (
          <input id={inputId} value={signedInEmail} readOnly aria-readonly="true" className="flex-1 text-[15px] px-3 py-3 border border-[#cfd9e5] rounded-lg bg-[#f8f9fb] text-[#555555]" />
        ) : (
          <input
            id={inputId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            maxLength={255}
            placeholder="you@example.com"
            className="flex-1 text-[15px] px-3 py-3 border border-[#cfd9e5] rounded-lg bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a94d6]"
          />
        )}
        <button
          type="submit"
          disabled={busy || !effectiveEmail}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0061aa] ${big ? "px-8 py-4 text-lg" : "px-6 py-3 text-base"}`}
        >
          {busy ? "Saving…" : "Notify me"}
        </button>
      </div>

      {!signedInEmail && <Turnstile action={`notify-${source}`} />}

      {error && (
        <p role="alert" className="text-sm text-[#a8232b] bg-[#fef2f2] border border-[#ffcaca] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <p className="text-xs text-[#7a8aa0] leading-relaxed">
        One email when the next release is out, then nothing. See the <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}
