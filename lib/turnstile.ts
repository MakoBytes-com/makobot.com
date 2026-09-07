/**
 * Cloudflare Turnstile verification. Every public form gets a captcha.
 *
 * FAIL-CLOSED when configured, PASS-THROUGH when not. With
 * TURNSTILE_SECRET_KEY set, a missing or invalid token rejects the submission.
 * Unset, submissions pass and the gap is logged, so an unprovisioned captcha
 * never silently blocks a form and never silently pretends to protect it.
 *
 * SERVER ONLY.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  ok: boolean;
  unconfigured: boolean;
  errors?: string[];
}

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string | null | undefined, remoteIp?: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY is not set. Form submitted without captcha verification.");
    return { ok: true, unconfigured: true };
  }

  if (!token) return { ok: false, unconfigured: false, errors: ["missing-input-response"] };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const json = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return { ok: json.success === true, unconfigured: false, errors: json["error-codes"] };
  } catch {
    // A Cloudflare outage must not take the form down with it, but it also
    // must not silently disable the check. Log loudly and let it through.
    console.error("[turnstile] verification endpoint unreachable. Allowing submission.");
    return { ok: true, unconfigured: false, errors: ["verify-unreachable"] };
  }
}
