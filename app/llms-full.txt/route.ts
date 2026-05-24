import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — Local AI Workbench for Windows

## What it is

MakoBot is a free Windows desktop application that runs entirely on the user's computer. It is the local control plane for every AI the user uses — it gives assistants a permanent shared memory, routes work across Claude, GPT, and Gemini for cross-checked second opinions, and runs background agents that draft improvements while the user is idle. Keys and data stay on the machine.

## Five pillars

1. **Memory** — Cross-project timeline + per-project context auto-injected into CLAUDE.md, AGENTS.md, and .cursorrules. Every AI tool the user uses sees the same source of truth. Brain.md compaction is non-destructive with quarterly archives. A Memory Graph layer indexes the auto-memory tree. One search bar reaches every conversation, commit, note, transcript, skill, and clipboard import — across every project and every AI tool. The Memory Suggestions queue lets the user Save, Discard, Delete, or Keep what background agents draft.

2. **AI Tools (plug-ins)** — One-line trigger words inside any AI chat. Each fans the question out to GPT, Claude, and Gemini in parallel for second opinions:
   - @verify — fact-check a draft answer
   - @audit — deep critique returning a CRITICAL/HIGH/MEDIUM/LOW punch list
   - @codereview — fast PR-style review on a diff
   - @designreview — multi-perspective UI/UX critique (returns all three opinions verbatim)
   - @contractreview — plain-English contract review with risk flags + negotiable-clause suggestions

   BYOK across OpenAI, Google, Anthropic. On a Claude Max plan, every Anthropic call routes through the user's CLI subprocess for free.

3. **Skills** — Reusable skill library + God-Mode commands. Skill references injected into every project so any AI client picks them up automatically. Per-client filtering means each AI tool only sees the skills meant for it. Slim skill index with on-demand skill_view loader (agentskills.io spec). Built-in **Skills Marketplace** browses and installs verified Anthropic skills with one click — handles nested SKILL.md formats and OneDrive paths cleanly.

4. **Agents** — Five named built-in agents (Researcher · Builder · Reviewer · Triage · Archivist) with assignable tasks, inter-agent handoffs, recurring schedules, attachments, project-scoped context, web fetch, and live cost tracking. Plus **Dreams** — the idle-time agent that examines memory while the user is away and drafts skills, feedback rules, and cleanups for review. Inline Save / Snooze / Discard in the Tick Log. Every Dream becomes a Brain Core node with an AI take attached.

5. **Brain Core** — Rotating 3D visualization of every entry in the memory tree: commits, feedback, skills, notes, sessions, and Dreams reasoning. Click any dot to see its full body. Filter by source via the chip row above the viewport (toggles stick across restarts).

## Background Reflector + Smart Triage

- **Background reflector** — after every turn, MakoBot quietly reviews what happened and drafts new skills + feedback rules for approval.
- **AI-triaged proposals** — Haiku scores every pending proposal 1–10 with a one-sentence rationale. Default sort by Smart rank. Threshold quick-actions for the top + bottom buckets.
- **Smart Memory Suggestions UX** — inline plain-English "AI says" sentence per row plus a one-click "Take all AI recommendations" bulk sweep. Tabbed Save / Delete split kills the Approve/Reject ambiguity.
- **Approval-gated writes** — every AI-suggested skill or rule shows up in a Pending Proposals queue. Nothing touches the user's config until approved.
- **Schedules + handoffs** — recurring tasks and inter-agent handoffs (handoff_task, enqueue_task) available as MCP tools.

## Built-in Chat and Code tabs

MakoBot ships with a full in-app **Chat tab** and **Code tab** so the user can work inside MakoBot directly, not just inject context into other tools.

- **AI provider picker** — choose any of 10+ cloud providers per turn (Anthropic, OpenAI, Google, Groq, DeepSeek, xAI Grok, plus more) — or the bundled local model.
- **Image vision passthrough** — paste/attach images in Claude Code chat mode; vision-capable providers receive them directly.
- **Cross-restart conversation continuity** — sessions resume across MakoBot restarts via --session-id / --resume.
- **Local model (LlamaSharp)** — runs entirely on-device with zero cloud calls, zero API keys, and works offline. Built into the installer.
- **Claude Code Max plan sign-in** — sign in with the user's Claude Max subscription and chat without a separate API key. Every Anthropic call in MakoBot — chat, agents, Dreams, plug-ins — honors AnthropicAuth and routes through the CLI for free. The cost dashboard merges Max-plan + BYOK usage in one view.
- **Code tab** — AvalonEdit source editor, embedded terminal, Git pane, file tree, and multi-file tabs. A VS-Code-style workspace inside MakoBot.
- **Signal bridge** — talk to MakoBot from a phone via the Signal messenger. Ask questions, dispatch agents, search memory remotely.

## Data safety

- **Scheduled auto-backup** — set-and-forget backup of the memory tree to OneDrive or any folder on a user-picked cadence. Runs on a background thread; sweeps stale .tmp files; never blocks the UI.
- **Memory tree lives outside OneDrive by default** — avoids OneDrive sync conflicts on live working files; backups go to OneDrive instead.
- **Non-destructive compaction** — quarterly archives of brain.md preserve full history.

## Compatibility

Fully automatic injection: Claude Code, Antigravity, Cursor, Windsurf.
One-click clipboard: ChatGPT, Claude Web, Google Gemini.
Any tool: Copy Context to clipboard, paste anywhere.
MCP server: Built-in MCP server on localhost:7777 — any MCP-compatible tool can search memory, read the brain, add notes programmatically.
OneDrive sync: project memory and brain.md sync across Windows machines.

## Privacy

100% local. No cloud, no accounts, no telemetry. All data stays on the user's machine. BYOK (bring-your-own-keys) for AI providers — DPAPI-encrypted. Digitally signed installer (Mako Logics LLC) verified by Microsoft Azure Trusted Signing.

## Distribution

- Hosting for the website: Vercel
- DNS: Cloudflare
- Source repo: github.com/MakoBytes-com/makobot.com
- Database (website only): Supabase Postgres 17.6 with RLS enabled deny-all
- License key auth: Google OAuth + GitHub OAuth (free; one key per Google account)
- Download endpoint: GitHub release asset, behind authenticated POST

## Who it is for

- Solo founders and non-developer builders who direct AI but cannot hire engineers.
- Freelancers and small agencies juggling 5–10 client projects.
- MSPs and IT consultants who want AI that remembers every client's stack.
- Compliance-conscious builders (legal, healthcare, finance) who cannot paste sensitive data into web AI.

## How it differs from similar tools

- Not a model. Not a CLI. Not a browser extension. A Windows-native desktop application with a real UI, a signed installer, an in-app updater, and a license key.
- Sits ABOVE existing AI agent loops (Claude Code, Cursor, Windsurf, Aider) — does not replace them.
- Bundles cross-IDE memory + multi-LLM verification + plug-in architecture + skills + commands + dashboard in a single app.
- Comparison page with detailed side-by-side: https://makobot.com/compare

## Author

Built by Russell Sailors / Mako Logics. Russell is a developer who career-pivoted into AI. The product line (PromptPixel, AI Prompt Hive, MakoBot) ships under the MakoBytes brand.

## Operating system

Windows 10, Windows 11. macOS and Linux are not supported.

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
