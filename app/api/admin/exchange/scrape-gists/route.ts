import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

const GIST_SEARCH_KEYWORDS = [
  { q: "CLAUDE.md", cat: "configs", plat: ["claude"] },
  { q: "cursorrules", cat: "configs", plat: ["cursor"] },
  { q: "windsurfrules", cat: "configs", plat: ["windsurf"] },
  { q: "system prompt AI", cat: "prompts", plat: ["claude", "chatgpt", "universal"] },
  { q: "custom instructions ChatGPT", cat: "configs", plat: ["chatgpt"] },
  { q: "MCP server config", cat: "mcp", plat: ["claude", "universal"] },
  { q: "Claude Code skill", cat: "skills", plat: ["claude"] },
  { q: "AI agent prompt", cat: "prompts", plat: ["universal"] },
  { q: "cursor rules react", cat: "configs", plat: ["cursor"] },
  { q: "Claude instructions markdown", cat: "configs", plat: ["claude"] },
];

// POST /api/admin/exchange/scrape-gists — Scrape GitHub Gists (admin only, streaming)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const body = await request.json();
  const maxResults = Math.min(body.maxResults || 50, 300);

  const sql = getDb();

  const communityUser = await sql`SELECT id FROM users WHERE email = 'community@makobot.com'`;
  if (communityUser.length === 0) {
    return new Response(JSON.stringify({ error: "Community user not found" }), { status: 500 });
  }
  const communityUserId = communityUser[0].id;

  const ghHeaders: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MakoBot-Exchange-Scraper",
  };
  if (process.env.GITHUB_TOKEN) {
    ghHeaders.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      let imported = 0;
      let skipped = 0;
      let errors = 0;

      send({ type: "start", total: maxResults, message: "Starting GitHub Gists scrape..." });

      for (const search of GIST_SEARCH_KEYWORDS) {
        if (imported >= maxResults) break;

        try {
          send({ type: "progress", imported, skipped, errors, message: `Searching Gists: "${search.q}"...` });

          // GitHub Gist search uses the same code search API
          const res = await fetch(
            `https://api.github.com/search/code?q=${encodeURIComponent(search.q + " in:file")}&per_page=30&sort=indexed&order=desc`,
            { headers: ghHeaders }
          );

          if (!res.ok) {
            if (res.status === 403) {
              send({ type: "warning", message: "Rate limited. Waiting 60 seconds..." });
              await new Promise((r) => setTimeout(r, 60000));
            } else {
              send({ type: "warning", message: `GitHub API error (${res.status})` });
            }
            errors++;
            continue;
          }

          const data = await res.json();
          const items = data.items || [];

          for (const item of items) {
            if (imported >= maxResults) break;

            try {
              const repoName = item.repository?.full_name;
              const owner = item.repository?.owner?.login;
              const filePath = item.path;
              const htmlUrl = item.html_url;

              if (!repoName || !owner || !filePath) { skipped++; continue; }

              // Check for duplicates
              const existing = await sql`SELECT id FROM exchange_listings WHERE source_url = ${htmlUrl}`;
              if (existing.length > 0) { skipped++; continue; }

              // Fetch raw content
              const rawUrl = `https://raw.githubusercontent.com/${repoName}/${item.repository?.default_branch || "main"}/${filePath}`;
              const contentRes = await fetch(rawUrl);
              if (!contentRes.ok) { skipped++; continue; }

              const content = await contentRes.text();
              if (content.length < 50 || content.length > 500000) { skipped++; continue; }

              // Generate title
              let title = filePath.replace(/^.*\//, "").replace(/\.[^.]+$/, "");
              if (["CLAUDE", ".cursorrules", ".windsurfrules", "SKILL", "README"].includes(title)) {
                title = `${title} from ${repoName.split("/")[1]}`;
              }
              title = title.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
              if (title.length > 190) title = title.slice(0, 190);

              // Generate description
              let description = `AI configuration imported from ${repoName}. Original author: ${owner}.`;
              const descMatch = content.match(/^---[\s\S]*?description:\s*(.+?)[\n\r]/m);
              if (descMatch) description = descMatch[1].trim().slice(0, 500);

              // Detect category and platforms from content
              let cat = search.cat;
              let plat = [...search.plat];
              const lc = content.toLowerCase();
              if (lc.includes("mcpservers") || lc.includes("modelcontextprotocol")) cat = "mcp";
              if (lc.includes("pretooluse") || lc.includes("posttooluse")) cat = "hooks";
              if (lc.includes("claude") && !plat.includes("claude")) plat.push("claude");
              if (lc.includes("chatgpt") && !plat.includes("chatgpt")) plat.push("chatgpt");
              if (lc.includes("cursor") && !plat.includes("cursor")) plat.push("cursor");
              if (lc.includes("gemini") && !plat.includes("gemini")) plat.push("gemini");

              const slugBase = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);

              const result = await sql`
                INSERT INTO exchange_listings (user_id, title, slug, description, category, platforms, content, source_url, source_author, status)
                VALUES (${communityUserId}, ${title}, ${"temp-" + Date.now() + "-" + imported}, ${description}, ${cat}, ${plat}, ${content}, ${htmlUrl}, ${owner}, 'approved')
                RETURNING id
              `;
              const id = result[0].id;
              await sql`UPDATE exchange_listings SET slug = ${slugBase + "-" + id} WHERE id = ${id}`;

              imported++;
              send({ type: "imported", imported, skipped, errors, title, author: owner });
            } catch {
              errors++;
            }
          }

          // Wait between queries to avoid rate limiting
          send({ type: "progress", imported, skipped, errors, message: "Waiting for rate limit cooldown..." });
          await new Promise((r) => setTimeout(r, 8000));
        } catch {
          errors++;
        }
      }

      send({ type: "done", imported, skipped, errors, message: `Gist scrape complete. ${imported} imported, ${skipped} skipped, ${errors} errors.` });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
