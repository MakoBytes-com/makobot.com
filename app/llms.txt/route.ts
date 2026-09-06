import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — a personal AI assistant that lives on your Windows PC and never forgets

> MakoBot is a free Windows desktop application from Mako Logics LLC. It runs a Claude-powered assistant on the user's own machine. It watches the user's email across Outlook, Gmail, iCloud and Yahoo, tells genuine mail from forged mail using the sender's authentication records, keeps the user's Microsoft calendar and to-do list, listens through a local speech model so audio never leaves the machine, speaks with a natural voice, and can be reached from a phone over the user's own private Tailscale network. It remembers everything: one brain file across all of the user's work, a context file per project, every conversation saved in full, Claude Code sessions saved as transcripts, commits recorded as they happen, and ChatGPT, Claude.ai and Gemini chats captured by a browser extension. Memory is searchable by words or by meaning, entirely on the machine, backed up nightly, and can be synced encrypted across the user's own computers. It is the front door for Claude Code: every project the user adds gets its memory tools automatically, and any MCP client can use them. Every send, reply, forward and delete waits for the user's approval, and no setting can turn that off. Mailbox passwords are sealed with Windows data protection, secrets are scrubbed before anything is written, and updates run only when signed by Mako Logics LLC. The app never shuts itself down and runs a daily self-check that reports facts. Its brain runs on the user's own Claude plan. There is no subscription. Current release: version 3.0, build 393.

## Key URLs

- Home: https://makobot.com
- How it compares: https://makobot.com/compare
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
