"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget. Renders nothing when the site key is absent,
 * so the form stays usable before the widget is provisioned. The script loads
 * once, lazily. Put it INSIDE the form: Turnstile writes a hidden input named
 * cf-turnstile-response into this element, which the form then submits.
 */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const CONTACT_EMAIL = "support@makobot.com";

export default function Turnstile({ action }: { action: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!siteKey || !holder.current) return;
    let cancelled = false;

    // An error-callback that returns true marks the failure as handled, so
    // Turnstile does not throw it as an uncaught TurnstileError (e.g. 600010
    // from a bot, a privacy extension or a locked-down browser). The visitor
    // gets a plain message and a retry instead of a dead widget.
    const mount = () => {
      if (cancelled || !holder.current || !window.turnstile) return;
      if (widgetId.current) return;
      try {
        widgetId.current = window.turnstile.render(holder.current, {
          sitekey: siteKey,
          action,
          theme: "light",
          callback: () => {
            if (!cancelled) setFailed(false);
          },
          "error-callback": () => {
            if (!cancelled) setFailed(true);
            return true;
          },
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const onScriptError = () => {
      // Drop the dead tag so "Try again" fetches the script afresh.
      document.querySelector(`script[src="${SCRIPT_SRC}"]`)?.remove();
      if (!cancelled) setFailed(true);
    };

    if (window.turnstile) {
      mount();
    } else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", mount);
      s.addEventListener("error", onScriptError);
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* already gone */
        }
      }
      widgetId.current = null;
    };
  }, [siteKey, action, attempt]);

  if (!siteKey) return null;
  return (
    <div>
      <div ref={holder} role="group" aria-label="Human verification" className="min-h-[65px]" />
      {failed && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          The security check didn&apos;t load. A privacy extension or strict browser setting can block it.{" "}
          <button type="button" onClick={retry} className="font-semibold underline hover:no-underline">
            Try again
          </button>{" "}
          or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline hover:no-underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}
    </div>
  );
}
