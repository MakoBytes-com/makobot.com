import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — Local AI Workbench for Windows

> MakoBot is a free local Windows desktop app that gives every AI coding tool you use (Claude Code, Cursor, ChatGPT, Gemini, Antigravity, Windsurf) persistent searchable memory across every project, plus one-line plug-ins (@verify, @audit, @codereview, @designreview, @contractreview) that fan out to GPT, Claude, and Gemini for second opinions.

## Key URLs

- Home: https://makobot.com
- Comparison vs. other tools: https://makobot.com/compare
- Skills Exchange (community marketplace): https://makobot.com/exchange
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
