import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = `# MakoBot — Local AI Workbench for Windows

> MakoBot is the local control plane for every AI you use. It gives Claude Code, Cursor, ChatGPT, Gemini, Antigravity, and Windsurf persistent searchable memory across every project, routes work across Claude, GPT, and Gemini via one-line plug-ins (@verify, @audit, @codereview, @designreview, @contractreview), and runs idle-time agents that draft improvements while you're away. Five pillars — Memory, AI Tools, Skills, Agents, and the Brain Core. Built-in Chat and Code tabs with 10+ cloud providers plus image vision, a bundled LlamaSharp local model, Claude Code Max plan sign-in, five named built-in agents with handoffs and schedules, a Skills Marketplace for verified Anthropic skills, a 3D Brain Core visualization of your memory tree, scheduled auto-backup to OneDrive, and a Signal bridge so you can talk to MakoBot from your phone.

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
