import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — One AI Memory for Every Tool You Use (Windows)

## What it is

MakoBot is a free Windows desktop application that runs entirely on the user's computer. It is the shared memory for every AI the user uses — one brain that briefs Claude, Cursor, ChatGPT, Gemini, and every other tool automatically, routes work across Claude, GPT, and Gemini for cross-checked second opinions, and runs background agents that draft improvements while the user is idle. Keys and data stay on the machine.

## Why it exists (2026 context)

Every major assistant now ships built-in memory — Claude (including Claude Code per-project auto-memory), ChatGPT, Gemini, Copilot, Cursor, Windsurf. All of them are per-tool silos: what one tool remembers never reaches the others, the record is distilled to bullet points rather than kept complete, most of it lives in the vendor's cloud, and none of it is portable when the user switches products. MakoBot is the one memory ABOVE all of them — it watches the user's actual work (commits, conversations, decisions, notes), keeps the complete history as plain markdown/JSON on the user's own disk, and briefs every tool from the same brain. Vendor memories are a retention feature for the vendor; MakoBot is a memory feature for the user.

## Five pillars

1. **Memory** — Cross-project timeline + per-project context auto-injected into CLAUDE.md, AGENTS.md, and .cursorrules. Every AI tool the user uses sees the same source of truth. Brain.md compaction is non-destructive with quarterly archives. A Memory Graph layer indexes the auto-memory tree. One search bar reaches every conversation, commit, note, transcript, skill, and clipboard import — across every project and every AI tool. Smart Search adds on-device semantic search on top: find memories by meaning, not keywords. The Memory Suggestions queue lets the user Save, Discard, Delete, or Keep what background agents draft.

2. **AI Tools (plug-ins)** — One-line trigger words inside any AI chat. Each fans the question out to GPT, Claude, and Gemini in parallel for second opinions:
   - @verify — fact-check a draft answer
   - @audit — deep critique returning a CRITICAL/HIGH/MEDIUM/LOW punch list
   - @codereview — fast PR-style review on a diff
   - @designreview — multi-perspective UI/UX critique (returns all three opinions verbatim)
   - @contractreview — plain-English contract review with risk flags + negotiable-clause suggestions

   BYOK across OpenAI, Google, Anthropic. On a Claude Max plan, every Anthropic call routes through the user's CLI subprocess for free.

3. **Skills** — Reusable skill library + God-Mode commands. Skill references injected into every project so any AI client picks them up automatically. Per-client filtering means each AI tool only sees the skills meant for it. Slim skill index with on-demand skill_view loader (agentskills.io spec). Built-in **Skills Marketplace** browses and installs verified Anthropic skills with one click — handles nested SKILL.md formats and OneDrive paths cleanly.

4. **Agents** — Five named built-in agents (Researcher · Builder · Reviewer · Triage · Archivist) with assignable tasks, inter-agent handoffs, recurring schedules, attachments, project-scoped context, web fetch, and live cost tracking. Plus **Dreams** — the idle-time agent that examines memory while the user is away and drafts skills, feedback rules, and cleanups for review. Each shows up in the Tick Log with an AI take attached, and Autopilot can act on the confident ones automatically.

5. **Autopilot** — MakoBot decides for itself which memories and skills are worth keeping: strong ones saved, junk discarded, and stale entries archived (filed into brain-archives, never destroyed, always undoable). Two toggles (memory suggestions + skill suggestions, both on by default) and a plain-English activity feed showing exactly what it did — no approval queue to babysit. Turn either toggle off to review every item yourself instead.

## Smart Search — semantic memory search, 100% on-device

- Finds memories by MEANING, not keywords. Searching "that email env var problem" finds the CONTACT_EMAIL_TO note even though no keyword matches.
- One-click enable downloads a small (140 MB) embedding model (nomic-embed v1.5, SHA-pinned to an immutable revision) and indexes the whole memory tree locally.
- Upgrades both in-app search AND the MCP search_memory tool that every connected AI session uses.
- Runs entirely on the user's machine. Nothing leaves the computer — no cloud embedding service, no API key.

## MakoSync — the same brain on every computer (no server, no account)

- Each machine writes small AES-256-GCM-encrypted change packets into a folder the user already syncs. OneDrive works out of the box; Dropbox, Google Drive, and NAS folders all work too.
- Only the user holds the passphrase — even their cloud provider sees scrambled blobs. There is no MakoBot server and no account.
- Merging can only ever ADD to memory: a fresh laptop can never flatten a year-old desktop brain. Conflicts keep both versions visibly instead of silently discarding one.
- Setup is three steps: install MakoBot on the second machine, point it at the same synced folder, enter the same passphrase.

## Memory Health — the dashboard tile that watches the watchers

- Continuously monitors the memory tree for files shrinking (data loss), writers going silent, corruption, and runaway growth.
- Problems surface within 10 minutes, explained in plain English — "your memory is safe" made visible.
- No comparable tool ships memory health monitoring.

## One brain, every AI tool

- MakoBot auto-detects Cursor, Gemini CLI, and Windsurf on the machine and registers its local MCP memory server with each. Claude Code was always connected.
- Every AI tool the user works with shares the same memory, semantic search, brain, and project context — shipped inside a signed Windows app, no manual MCP configuration.

## Background Reflector + Smart Triage

- **Background reflector** — after every turn, MakoBot quietly reviews what happened and drafts new skills + feedback rules for approval.
- **Autopilot** — AI scores every background-authored suggestion (skills, feedback rules, memory cleanups) and acts on the confident ones itself: good ones saved, junk discarded, stale entries archived (filed, never destroyed, always undoable). Only genuinely unsure items wait for the user; everything shows in a plain-English activity feed. Two toggles (memory + skills) turn it off for manual review.
- **Live web-AI capture** — a sideloaded browser extension saves the user's ChatGPT, Claude.ai, and Gemini conversations into memory as they chat, verbatim and 100% local; it is the only way to keep Gemini's replies since Google's own export omits them.
- **Security gates stay manual** — AI code edits, shell commands, and AI-created write tasks always ask for explicit approval; Autopilot governs memory decisions only, never those.
- **Schedules + handoffs** — recurring tasks and inter-agent handoffs (handoff_task, enqueue_task) available as MCP tools.

## Built-in Chat and Code tabs

MakoBot ships with a full in-app **Chat tab** and **Code tab** so the user can work inside MakoBot directly, not just inject context into other tools.

- **AI provider picker** — choose any of 10+ cloud providers per turn (Anthropic, OpenAI, Google, Groq, DeepSeek, xAI Grok, plus more) — or the bundled local model.
- **Image vision passthrough** — paste/attach images in chat; works across Claude (Pro/Max), Gemini, Groq, DeepSeek, and xAI.
- **Chat request queueing** — type the next message while the current one is still streaming; it queues and sends automatically.
- **Cross-restart conversation continuity** — sessions resume across MakoBot restarts via --session-id / --resume.
- **Local model (LlamaSharp)** — runs entirely on-device with zero cloud calls, zero API keys, and works offline. Built into the installer. A one-click CUDA add-on installer unlocks full NVIDIA GPU speed, and an auto-detect button sets GPU layers + context size from the loaded model — context also auto-bumps on overflow, so users never guess settings. Local reasoning models get a collapsible "Thought for X.Ys" panel. Model downloads survive network resets (resume) and all curated models are SHA-256-pinned to immutable revisions.
- **Claude Code Max plan sign-in** — sign in with the user's Claude Max subscription and chat without a separate API key. Every Anthropic call in MakoBot — chat, agents, Dreams, plug-ins — honors AnthropicAuth and routes through the CLI for free. The cost dashboard merges Max-plan + BYOK usage in one view.
- **Code tab** — AvalonEdit source editor, embedded terminal, Git pane, file tree, and multi-file tabs. A VS-Code-style workspace inside MakoBot.
- **Signal bridge** — talk to MakoBot from a phone via the Signal messenger. Ask questions, dispatch agents, search memory remotely.

## Data safety

- **Scheduled auto-backup** — set-and-forget backup of the memory tree to OneDrive or any folder on a user-picked cadence. Runs on a background thread; sweeps stale .tmp files; never blocks the UI. Backups stay small (~150 MB) by excluding re-downloadable models, and restore validates the archive and snapshots current memory before touching anything.
- **Memory Health monitoring** — a dashboard tile detects shrinking files, silent writers, corruption, and runaway growth within 10 minutes, in plain English.
- **MakoSync** — the same memory on every computer the user owns via end-to-end-encrypted change packets through the user's own storage. Add-only merging means a new machine can never wipe an established brain.
- **Crash-safety net** — MakoBot never takes itself down: three global exception handlers catch errors, show a visible recovery message, and keep the app running.
- **Memory tree lives outside OneDrive by default** — avoids OneDrive sync conflicts on live working files; backups (and MakoSync packets) go to OneDrive instead.
- **Non-destructive compaction** — quarterly archives of brain.md preserve full history.
- **Audited** — a ~70-finding deep audit covering security, data integrity, performance, and accessibility (app-wide keyboard access, 12px+ text, per-monitor DPI) was fixed in a single release.

## Compatibility

Fully automatic injection: Claude Code, Antigravity, Cursor, Windsurf.
One-click clipboard: ChatGPT, Claude Web, Google Gemini.
Any tool: Copy Context to clipboard, paste anywhere.
MCP server: Built-in MCP server on localhost:7777 — auto-registered with Cursor, Gemini CLI, and Windsurf; any MCP-compatible tool can search memory, read the brain, add notes programmatically.
Multi-machine: MakoSync carries the same memory to every Windows machine the user owns — end-to-end encrypted through the user's own synced storage (OneDrive, Dropbox, Google Drive, NAS), no server, no account.

## Privacy

100% local. No cloud, no accounts, no telemetry. All data stays on the user's machine. Smart Search embeddings are computed on-device. MakoSync, when enabled, only ever writes AES-256-GCM-encrypted blobs into storage the user controls — the passphrase never leaves the machine. BYOK (bring-your-own-keys) for AI providers — DPAPI-encrypted. Digitally signed installer (Mako Logics LLC) verified by Microsoft Azure Trusted Signing.

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

- vs. native vendor memories (Claude memory, Claude Code auto-memory, ChatGPT memory, Cursor/Windsurf memories): those are single-tool silos that summarize and live in the vendor's cloud; MakoBot is cross-tool + cross-project, keeps the full record, and stores it on the user's machine.
- vs. OpenMemory MCP (Mem0): same "one memory across MCP tools" idea, but OpenMemory is a Docker-based developer tool with manual saves; MakoBot is a signed Windows app that captures the user's work automatically and adds sync, health monitoring, agents, and semantic search.
- vs. Pieces: Pieces routes search/sync assistance through its own cloud; MakoBot's semantic search is fully on-device and MakoSync moves only user-key-encrypted packets through storage the user controls.
- Not a model. Not a CLI. Not a browser extension. A Windows-native desktop application with a real UI, a signed installer, an in-app updater, and a license key.
- Sits ABOVE existing AI agent loops (Claude Code, Cursor, Windsurf, Aider) — does not replace them.
- Bundles cross-IDE memory + multi-LLM verification + plug-in architecture + skills + commands + dashboard in a single app.
- Unique in the category: on-device semantic memory search, end-to-end-encrypted multi-machine sync with no vendor cloud and no account (MakoSync), and memory health monitoring.
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
