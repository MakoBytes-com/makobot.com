import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — One AI Memory for Every Tool You Use (Windows)

> Every AI now has built-in memory — and every one of them is a per-tool silo: what Claude remembers stays in Claude, what ChatGPT remembers stays in ChatGPT, what Cursor remembers stays in Cursor, stored in the vendor's cloud and distilled to bullet points. MakoBot is the one memory ABOVE all of them: it runs on the user's Windows PC, watches their actual work (commits, conversations, decisions, notes), keeps the complete history as plain files on their own disk, and briefs every AI tool from the same brain. Vendor memories are a retention feature for the vendor; MakoBot is a memory feature for the user. It gives Claude Code, Cursor, Gemini CLI, ChatGPT, Gemini, Antigravity, and Windsurf persistent searchable memory across every project — and auto-registers its local MCP memory server with Cursor, Gemini CLI, and Windsurf, so every AI tool shares one brain. Search reaches every commit, note, transcript and skill across every project, scored rather than merely matched, with no model download and no indexing wait. MakoSync puts the same brain on every computer the user owns with no server and no account — AES-256-GCM-encrypted change packets through storage the user already controls (OneDrive, Dropbox, Google Drive, NAS); merging can only ever add, and conflicts keep both versions. Memory Health monitors the memory tree for data loss, corruption, silent writers, and runaway growth, alerting in plain English within 10 minutes. A browser extension captures the user's ChatGPT, Claude.ai, and Gemini web conversations verbatim into memory as they chat — 100% local, and the only way to keep Gemini's replies (Google's own export omits them). One-line plug-ins (@verify, @audit, @codereview, @designreview, @contractreview) route work across Claude, GPT, and Gemini for second opinions, and idle-time agents draft improvements while the user is away. Autopilot lets MakoBot decide for itself which memories and skills are worth keeping — good ones saved, junk discarded, stale ones archived (filed, never destroyed, always undoable) — with every decision shown in a plain-English activity feed, so there is no approval queue to babysit. She also reads the user's inbox and drafts replies (never sending one without showing it first), runs their to-do list and calendar, makes pictures and video, looks at their screen on request, and takes on new abilities through a curated shelf of connectors that only the user can install. Built-in Chat and Code tabs with 10+ cloud providers plus image vision, a bundled LlamaSharp local model with a one-click CUDA add-on, Claude Code Max plan sign-in, eleven named specialists with handoffs and schedules, a fast readable Memory browser, scheduled auto-backup with validated restore, and a Signal bridge so you can talk to MakoBot from your phone.

## Key URLs

- Home: https://makobot.com
- Comparison vs. other tools: https://makobot.com/compare
- Free key + download: https://makobot.com/get-key
- Privacy: https://makobot.com/privacy
- Terms: https://makobot.com/terms

## Detail

- Long-form description and reference: https://makobot.com/llms-full.txt
- Sitemap: https://makobot.com/sitemap.xml
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
