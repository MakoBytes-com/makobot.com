import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — a personal AI assistant that lives on your Windows PC and never forgets

## What it is

MakoBot is a free Windows desktop application from Mako Logics LLC. It runs a Claude-powered assistant on the user's own computer. It lives in a chat window with tabs, has a face, talks and listens, and remembers. Its brain is Claude through the user's own Claude plan. Everything it stores stays on the user's disk. There is no Mako Logics server in the middle of any conversation, no subscription, and the app never shuts itself down.

Current release: version 3.0, build 393 (September 2026). Windows 10 and 11. The installer is about 240 MB and is digitally signed by Mako Logics LLC through Microsoft Azure Trusted Signing.

## What it does

- **Email.** Reads mail across Outlook (Microsoft 365), Gmail, iCloud and Yahoo. Watches every added mailbox in the background and raises alerts. Tells genuine mail from forged mail by checking the sender's DMARC, DKIM and SPF records rather than guessing from the wording. Can draft, send, reply and forward, but every send waits for the user's typed approval, and no setting can turn that gate off. Reads only the inbox on its own; it will not open Junk or Deleted Items unless asked.
- **Calendar and to-do.** Shows the user's Microsoft calendar by month or week, creates and edits events, and keeps the Microsoft To Do list with a separate pane for team tasks.
- **Voice.** Listens with a local Whisper model, so the user's voice never leaves the machine. Speaks with a natural neural voice and starts speaking after the first sentence rather than waiting for the full reply. An optional "Hey MakoBot" wake phrase.
- **Phone.** A private chat page served only on the user's own Tailscale network, with push notifications to an iPhone. If Tailscale is not running, there is no page. The app never listens on a public interface.
- **Routines.** A spoken morning briefing on weekdays at 7:45, an end-of-day check at 5:30, and a Friday wrap-up. MakoBot suggests each once; nothing runs until accepted, a dismissed suggestion never returns, and a routine can only look, never act.
- **A second opinion.** One button brings another AI (GPT, Gemini, Grok, DeepSeek or Groq-hosted models, with the user's own key) into the chat as a critic. The critic sees the recent conversation and MakoBot's answer, is told to lead with the most serious problem, has no tools, and cannot send or change anything. Only MakoBot acts, and only with approval. The user ticks a one-time consent before conversation context is shared.
- **Screens and pages.** Can look at a live web page or take a screenshot of the user's monitors on request, and can generate images and video through a gateway with the user's own key.
- **Shipping a site.** Can run build, commit, push, wait for the deploy, and verify the live page as one job that stops at the first failure.

## How it remembers

- One cross-project brain file plus a context file for every project the user adds, in the same plain-text format the earlier engine used.
- Every conversation is saved in full as an append-only transcript. Nothing is trimmed or summarized away.
- Claude Code sessions are saved as readable transcripts. Project folders are watched and each commit is recorded as it happens.
- A small browser extension captures the user's ChatGPT, Claude.ai and Gemini web conversations into memory as they chat.
- A few minutes after a chat goes quiet, a locked-down copy of MakoBot rereads it with memory tools only and saves at most two short notes.
- Roughly once a day it rereads its own notes for contradictions, repeated patterns and unanswered questions, and appends what it noticed.
- Search by words, or by meaning using a small embedding model that runs on the machine.
- A backup every night, dated archives when a file gets large, and an optional encrypted sync of the memory tree across the user's own computers through a folder they already sync. Sync can only add, so a new machine can never wipe an established memory.

## The front door for Claude Code

- Every project folder the user adds gets MakoBot's memory tools in Claude Code automatically. It keeps the access keys in each project healthy so a session never silently loses its memory.
- Live Claude Code sessions are shown in the app as they start, both the user's own in VS Code and MakoBot's own in the background.
- The memory server runs on the local machine only, gated by a bearer token. Cursor and any other MCP client can search the memory, read the brain, and add a note.
- Every AI vendor's built-in memory is a per-tool silo. MakoBot keeps the full record on the user's disk and briefs every tool from the same place.

## How it protects the user

- Mailbox passwords are encrypted with Windows Data Protection. They are never written in the clear, never logged, and never sent to the screen.
- API keys, tokens, connection strings and similar secrets are scrubbed before anything is written to memory, saved to a transcript, or shown to a second AI.
- Updates are downloaded, then checked for a valid Authenticode signature issued to Mako Logics LLC, then run. An unsigned file or one signed by anyone else is refused.
- It will not fetch addresses inside the user's own network (routers, NAS, private ranges) even if a page or an email tries to steer it there.
- Every send, reply, forward and delete is protected at the code level. Trust modes can auto-approve reads, never those.
- A remote off switch lets Mako Logics pause unattended work on a specific build if it ever misbehaves. It fails open, so a network outage never stops the app.

## Built to keep running

- A daily self-check across about eighteen conditions (mailbox unreachable, memory unreachable, update check broken, cannot speak, cannot reach the phone, stale backup, and more). It reports facts, never a vague green badge.
- Vitals with numbers: low disk, an oversized memory file, a backup older than three days.
- A stall watchdog that names the exact tool call that froze the app.
- Every file it maintains (settings, routines, logs, memory indexes) detects corruption, sets the damaged copy aside, and rewrites itself fresh.
- A cost meter on every chat measured against the user's Claude plan limits.
- Rotating logs that detect their own churn.

## Who it is for

- People who direct AI rather than program it, and want one assistant that knows their whole working life.
- Anyone running Claude Code who is tired of re-explaining a project every session.
- Small business owners and consultants who want their mail watched and their calendar kept without handing either to a cloud service.

## Privacy in one paragraph

Mail, memory, transcripts and voice stay on the user's computer. The app contacts makobot.com to activate a license key and to check service status, GitHub to look for signed updates, Microsoft's speech service to produce its voice, and Hugging Face once to download the local speech and search models. Anything beyond that (a second-opinion AI, image generation) happens only when the user starts it, with the user's own keys, after secrets are scrubbed. The website collects an email address to issue a free license key and keeps basic page-view counts in its own database. See https://makobot.com/privacy.

## Distribution

- Website hosting: Vercel. DNS: Cloudflare.
- Free license key: sign in with Google or GitHub at https://makobot.com/get-key.
- Installer: a signed GitHub release asset behind an authenticated download.
- Product line: MakoBot and PixelCopy ship under the MakoBytes brand of Mako Logics LLC.

## What it is not

- Not a cloud service. Not a browser extension on its own. Not a command-line tool.
- Not a replacement for Claude Code, Cursor or the user's other AI tools. It sits above them.
- Not for macOS or Linux. Windows only.

## Source of truth

If anything in this document conflicts with the live site, the live site is authoritative. Sitemap: https://makobot.com/sitemap.xml. Robots: https://makobot.com/robots.txt.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
