"use client";

import { useEffect, useRef } from "react";

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

export default function Turnstile({ action }: { action: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !holder.current) return;
    let cancelled = false;

    const mount = () => {
      if (cancelled || !holder.current || !window.turnstile) return;
      if (widgetId.current) return;
      widgetId.current = window.turnstile.render(holder.current, { sitekey: siteKey, action, theme: "light" });
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
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [siteKey, action]);

  if (!siteKey) return null;
  return <div ref={holder} role="group" aria-label="Human verification" className="min-h-[65px]" />;
}
