/**
 * Whether the support chat can actually answer, kept where the owner and the
 * fleet dashboard can see it.
 *
 * Added 2026-10-13. The chat's AI provider account had been closed and the
 * chat failed every question for weeks, while /api/master/errors reported a
 * clean zero, because a failed answer was only ever a console line. Now a
 * failure is recorded in site_settings, emails ALERT_EMAIL (at most once every
 * six hours while it lasts), and shows as an open error on the dashboard until
 * an answer goes through again.
 *
 * Nothing here may break the chat: every function swallows its own errors.
 *
 * SERVER ONLY.
 */

import { getSetting, setSetting } from "./db";
import { sendMail, mailConfigured } from "./mail";
import { renderEmail } from "./email-template";

const KEY = "support_chat_health";
const ALERT_EVERY_MS = 6 * 60 * 60_000;
const BILLING_URL = "https://console.anthropic.com/settings/billing";

export interface ChatHealth {
  failing: boolean;
  /** When the current run of failures started. */
  firstFailureAt: string | null;
  lastFailureAt: string | null;
  /** Failed answers since firstFailureAt. */
  failures: number;
  lastReason: string | null;
  lastAlertAt: string | null;
  lastOkAt: string | null;
}

const HEALTHY: ChatHealth = {
  failing: false,
  firstFailureAt: null,
  lastFailureAt: null,
  failures: 0,
  lastReason: null,
  lastAlertAt: null,
  lastOkAt: null,
};

export async function readChatHealth(): Promise<ChatHealth> {
  try {
    const raw = await getSetting(KEY);
    return raw ? { ...HEALTHY, ...(JSON.parse(raw) as Partial<ChatHealth>) } : HEALTHY;
  } catch {
    return HEALTHY;
  }
}

/** A question could not be answered. Records it and tells the owner. */
export async function recordChatFailure(reason: string, billing: boolean): Promise<void> {
  try {
    const now = new Date();
    const h = await readChatHealth();
    const next: ChatHealth = {
      ...h,
      failing: true,
      firstFailureAt: h.failing ? h.firstFailureAt : now.toISOString(),
      lastFailureAt: now.toISOString(),
      failures: h.failing ? h.failures + 1 : 1,
      lastReason: reason,
    };
    const due = !h.lastAlertAt || now.getTime() - new Date(h.lastAlertAt).getTime() >= ALERT_EVERY_MS;
    if (due && (await alertOwner(next, billing))) next.lastAlertAt = now.toISOString();
    await setSetting(KEY, JSON.stringify(next));
  } catch (err) {
    console.error("[support-chat] could not record the failure:", err);
  }
}

/**
 * A question was answered. Writes only when this ends a run of failures, so a
 * healthy chat costs no database write per question.
 */
export async function recordChatSuccess(): Promise<void> {
  try {
    const h = await readChatHealth();
    if (!h.failing) return;
    await setSetting(KEY, JSON.stringify({ ...h, failing: false, lastOkAt: new Date().toISOString() }));
  } catch (err) {
    console.error("[support-chat] could not record the recovery:", err);
  }
}

async function alertOwner(h: ChatHealth, billing: boolean): Promise<boolean> {
  const to = process.env.ALERT_EMAIL;
  if (!to || !mailConfigured()) {
    console.error("[support-chat] the chat is failing and ALERT_EMAIL or mail is not set up, so nobody was told.");
    return false;
  }
  const mail = renderEmail({
    preheader: `Visitors are getting no answers: ${h.lastReason ?? "unknown reason"}`,
    kicker: "Help chat is down",
    title: "The Help chat on makobot.com cannot answer",
    blocks: [
      {
        rows: [
          { label: "Why", value: h.lastReason ?? "Unknown" },
          { label: "Failing since", value: h.firstFailureAt ? new Date(h.firstFailureAt).toUTCString() : "Unknown" },
          { label: "Questions missed", value: String(h.failures) },
        ],
      },
      billing
        ? { text: "Adding credit to the Anthropic account fixes it. The chat starts answering again on its own; nothing needs redeploying." }
        : { text: "Visitors are being offered \"Talk to a person\" instead, so tickets still arrive." },
      ...(billing ? [{ button: { label: "Add Anthropic credit", href: BILLING_URL } }] : []),
    ],
    outro: "This email repeats at most every six hours while the chat keeps failing.",
  });
  const sent = await sendMail({ to, subject: "[makobot.com] The Help chat cannot answer", text: mail.text, html: mail.html });
  if (!sent.ok) console.error("[support-chat] failure alert did not send:", sent.error);
  return sent.ok;
}
