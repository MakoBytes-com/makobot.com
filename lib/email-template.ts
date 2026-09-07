/**
 * The look of every email makobot.com sends. Table-based, inline-styled
 * HTML so Outlook, Gmail and Apple Mail all draw the same thing, plus a
 * plain-text twin for clients that want it. Colors are the site's: navy
 * header, brand blue button, blue-biased neutrals.
 */

import { escapeHtml } from "./mail";

const LOGO_URL = "https://makobot.com/images/email-logo-v1.png";
const SITE = "https://makobot.com";

export interface EmailBlock {
  /** A paragraph of body text. */
  text?: string;
  /** A quoted message in a tinted box, shown exactly as written. */
  quote?: string;
  /** Label / value rows. */
  rows?: { label: string; value: string }[];
  /** A short chat transcript. */
  transcript?: { role: "user" | "assistant"; text: string }[];
  /** A button. */
  button?: { label: string; href: string };
}

export interface EmailSpec {
  /** Hidden first line most inboxes show after the subject. */
  preheader: string;
  /** The heading inside the card. */
  title: string;
  /** A small uppercase label above the heading, e.g. "New support ticket". */
  kicker?: string;
  blocks: EmailBlock[];
  /** A closing line under the blocks, before the footer. */
  outro?: string;
}

const FONT = "'Segoe UI Variable Text','Segoe UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif";

export function renderEmail(spec: EmailSpec): { html: string; text: string } {
  const parts: string[] = [];
  const plain: string[] = [];

  for (const b of spec.blocks) {
    if (b.text) {
      parts.push(`<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1d3554;">${escapeHtml(b.text)}</p>`);
      plain.push(b.text, "");
    }
    if (b.quote) {
      parts.push(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td style="background:#f1f5f9;border-left:4px solid #3a94d6;border-radius:0 8px 8px 0;padding:14px 16px;font-size:16px;line-height:1.6;color:#1d3554;white-space:pre-wrap;">${escapeHtml(b.quote)}</td></tr></table>`
      );
      plain.push(b.quote.split("\n").map((l) => `> ${l}`).join("\n"), "");
    }
    if (b.rows?.length) {
      const rows = b.rows
        .map(
          (r) =>
            `<tr><td style="padding:6px 12px 6px 0;font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#7a8aa0;white-space:nowrap;vertical-align:top;">${escapeHtml(r.label)}</td><td style="padding:6px 0;font-size:15px;line-height:1.5;color:#1d3554;vertical-align:top;">${escapeHtml(r.value)}</td></tr>`
        )
        .join("");
      parts.push(`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${rows}</table>`);
      plain.push(...b.rows.map((r) => `${r.label}: ${r.value}`), "");
    }
    if (b.transcript?.length) {
      const lines = b.transcript
        .map((t) => {
          const user = t.role === "user";
          return `<tr><td align="${user ? "right" : "left"}" style="padding:3px 0;"><table role="presentation" cellpadding="0" cellspacing="0" style="max-width:88%;"><tr><td style="background:${user ? "#0061aa" : "#e6f0f9"};color:${user ? "#ffffff" : "#1d3554"};border-radius:12px;padding:8px 12px;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(t.text)}</td></tr></table></td></tr>`;
        })
        .join("");
      parts.push(
        `<p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#7a8aa0;">The chat before they asked for a person</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${lines}</table>`
      );
      plain.push("The chat before they asked for a person:", ...b.transcript.map((t) => `${t.role === "user" ? "Visitor" : "Assistant"}: ${t.text}`), "");
    }
    if (b.button) {
      parts.push(
        `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;"><tr><td style="background:#0061aa;border-radius:8px;"><a href="${escapeHtml(b.button.href)}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${escapeHtml(b.button.label)}</a></td></tr></table>`
      );
      plain.push(`${b.button.label}: ${b.button.href}`, "");
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(spec.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f1f5f9;">${escapeHtml(spec.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;font-family:${FONT};">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#002643;border-radius:12px 12px 0 0;padding:18px 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle;padding-right:12px;"><img src="${LOGO_URL}" width="40" height="40" alt="" style="display:block;width:40px;height:40px;border-radius:50%;"></td>
      <td style="vertical-align:middle;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:.01em;">MakoBot <span style="font-weight:500;color:#99c3e7;">Support</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;border:1px solid #cfd9e5;border-top:0;border-bottom:0;padding:28px 28px 8px;">
    ${spec.kicker ? `<p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7a8aa0;">${escapeHtml(spec.kicker)}</p>` : ""}
    <h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;font-weight:800;color:#002643;">${escapeHtml(spec.title)}</h1>
    ${parts.join("\n")}
    ${spec.outro ? `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#3d5273;">${escapeHtml(spec.outro)}</p>` : ""}
  </td></tr>
  <tr><td style="background:#ffffff;border:1px solid #cfd9e5;border-top:1px solid #e4ebf3;border-radius:0 0 12px 12px;padding:16px 28px 20px;">
    <p style="margin:0;font-size:12.5px;line-height:1.6;color:#7a8aa0;">Mako Logics LLC &middot; Montgomery, Texas<br>
    <a href="mailto:support@makobot.com" style="color:#0061aa;text-decoration:none;">support@makobot.com</a> &middot; <a href="${SITE}" style="color:#0061aa;text-decoration:none;">makobot.com</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [spec.kicker ? spec.kicker.toUpperCase() : null, spec.title, "", ...plain, spec.outro ?? null, "", "--", "Mako Logics LLC, Montgomery, Texas", "support@makobot.com | makobot.com"]
    .filter((l): l is string => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return { html, text };
}
