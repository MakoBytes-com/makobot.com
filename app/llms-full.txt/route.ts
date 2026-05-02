import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — Local AI Workbench for Windows

## What it is

MakoBot is a free Windows desktop application that runs entirely on the user's computer. It is the local layer that makes every AI coding tool the user already uses smarter, by giving them persistent searchable memory across every project, plus one-line plug-ins for cross-checked second opinions from multiple AI providers.

## Three pillars

1. **Memory** — Cross-project timeline auto-injected into CLAUDE.md, AGENTS.md, and .cursorrules. Every AI tool the user uses sees the same source of truth.
2. **Search** — One bar that reaches every conversation, every commit, every note, every transcript, every skill, and every clipboard import — across every project and every AI tool.
3. **AI Tools (plug-ins)** — One-line trigger words inside any AI chat. Each fans the question out to GPT, Claude, and Gemini in parallel for second opinions:
   - @verify — fact-check a draft answer
   - @audit — deep critique returning a CRITICAL/HIGH/MEDIUM/LOW punch list
   - @codereview — fast PR-style review on a diff
   - @designreview — multi-perspective UI/UX critique (returns all three opinions verbatim)
   - @contractreview — plain-English contract review with risk flags + negotiable-clause suggestions

## Compatibility

Fully automatic injection: Claude Code, Antigravity, Cursor, Windsurf.
One-click clipboard: ChatGPT, Claude Web, Google Gemini.
Any tool: Copy Context to clipboard, paste anywhere.
MCP server: Built-in MCP server on localhost:7777 — any MCP-compatible tool can search memory, read the brain, add notes programmatically.

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
