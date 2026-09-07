/**
 * Outbound email through Cloudflare Email Service. Ported from handpenned's
 * lib/mail.ts (the fleet reference) on 2026-09-06. makobot.com was onboarded
 * as a sending domain the same day; support@makobot.com forwards to the
 * owner through Email Routing, so replies to anything we send come back.
 *
 * Fails loud rather than silent: a caller that expects a mail to go out and
 * gets `ok: false` can tell the user, instead of leaving them waiting on a
 * message that was never sent.
 *
 * SERVER ONLY.
 */

export interface MailResult {
  ok: boolean;
  error?: string;
  messageId?: string;
}

export const SUPPORT_ADDRESS = "support@makobot.com";

export function mailConfigured(): boolean {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_EMAIL_TOKEN && process.env.MAIL_FROM);
}

interface SendResponse {
  success: boolean;
  errors?: { code?: number; message?: string }[];
  result?: {
    message_id?: string;
    delivered?: string[];
    queued?: string[];
    permanent_bounces?: string[];
    suppressed_recipients?: string[];
  };
}

export async function sendMail(input: { to: string; subject: string; text: string; html: string; replyTo?: string }): Promise<MailResult> {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_EMAIL_TOKEN;
  const from = process.env.MAIL_FROM;
  if (!account || !token || !from) {
    console.error("[mail] CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_EMAIL_TOKEN / MAIL_FROM missing. Mail NOT sent:", input.subject);
    return { ok: false, error: "Email is not configured on this deployment." };
  }

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/email/sending/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: input.to,
        reply_to: input.replyTo ?? SUPPORT_ADDRESS,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    const json = (await res.json().catch(() => ({}))) as SendResponse;
    if (!res.ok || !json.success) {
      const why = json.errors?.map((e) => e.message).filter(Boolean).join("; ") || `HTTP ${res.status}`;
      console.error("[mail] Cloudflare rejected the message:", why);
      return { ok: false, error: why };
    }

    const bounced = json.result?.permanent_bounces ?? [];
    const suppressed = json.result?.suppressed_recipients ?? [];
    if (bounced.includes(input.to) || suppressed.includes(input.to)) {
      const why = bounced.includes(input.to) ? "That address bounced permanently." : "That address is on the suppression list.";
      console.error("[mail] not deliverable:", input.to, why);
      return { ok: false, error: why };
    }

    return { ok: true, messageId: json.result?.message_id };
  } catch (err) {
    console.error("[mail] send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
