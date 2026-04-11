import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

const GITLAB_SEARCHES = [
  { q: "CLAUDE.md", cat: "configs", plat: ["claude"] },
  { q: ".cursorrules", cat: "configs", plat: ["cursor"] },
  { q: ".windsurfrules", cat: "configs", plat: ["windsurf"] },
  { q: "system prompt AI assistant", cat: "prompts", plat: ["universal"] },
  { q: "MCP server configuration", cat: "mcp", plat: ["claude", "universal"] },
  { q: "Claude Code skill", cat: "skills", plat: ["claude"] },
  { q: "AI agent config", cat: "agents", plat: ["universal"] },
  { q: "custom instructions ChatGPT", cat: "configs", plat: ["chatgpt"] },
];

// POST /api/admin/exchange/scrape-gitlab — Scrape GitLab (admin only, streaming)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const body = await request.json();
  const maxResults = Math.min(body.maxResults || 50, 300);

  const sql = neon(process.env.DATABASE_URL!);

  const communityUser = await sql`SELECT id FROM users WHERE email = 'community@makobot.com'`;
  if (communityUser.length === 0) {
    return new Response(JSON.stringify({ error: "Community user not found" }), { status: 500 });
  }
  const communityUserId = communityUser[0].id;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      let imported = 0;
      let skipped = 0;
      let errors = 0;

      send({ type: "start", total: maxResults, message: "Starting GitLab scrape..." });

      for (const search of GITLAB_SEARCHES) {
        if (imported >= maxResults) break;

        try {
          send({ type: "progress", imported, skipped, errors, message: `Searching GitLab: "${search.q}"...` });

          // GitLab public search API (no auth required for public projects)
          const res = await fetch(
            `https://gitlab.com/api/v4/search?scope=blobs&search=${encodeURIComponent(search.q)}&per_page=20`,
            {
              headers: { "User-Agent": "MakoBot-Exchange-Scraper" },
            }
          );

          if (!res.ok) {
            if (res.status === 429) {
              send({ type: "warning", message: "Rate limited. Waiting 60 seconds..." });
              await new Promise((r) => setTimeout(r, 60000));
            } else {
              send({ type: "warning", message: `GitLab API error (${res.status})` });
            }
            errors++;
            continue;
          }

          const items = await res.json();

          for (const item of items) {
            if (imported >= maxResults) break;

            try {
              const projectId = item.project_id;
              const filePath = item.path;
              const ref = item.ref || "main";

              if (!projectId || !filePath) { skipped++; continue; }

              // Get project details for author info
              const projRes = await fetch(`https://gitlab.com/api/v4/projects/${projectId}`);
              if (!projRes.ok) { skipped++; continue; }
              const project = await projRes.json();

              const owner = project.namespace?.path || project.path_with_namespace?.split("/")[0] || "unknown";
              const repoName = project.path_with_namespace || `project-${projectId}`;
              const htmlUrl = `https://gitlab.com/${repoName}/-/blob/${ref}/${filePath}`;

              // Check for duplicates
              const existing = await sql`SELECT id FROM exchange_listings WHERE source_url = ${htmlUrl}`;
              if (existing.length > 0) { skipped++; continue; }

              // Fetch raw content
              const rawUrl = `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${ref}`;
              const contentRes = await fetch(rawUrl);
              if (!contentRes.ok) { skipped++; continue; }

              const content = await contentRes.text();
              if (content.length < 50 || content.length > 500000) { skipped++; continue; }

              // Generate title
              let title = filePath.replace(/^.*\//, "").replace(/\.[^.]+$/, "");
              if (["CLAUDE", ".cursorrules", ".windsurfrules", "SKILL"].includes(title)) {
                title = `${title} from ${repoName.split("/").pop()}`;
              }
              title = title.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
              if (title.length > 190) title = title.slice(0, 190);

              // Description
              let description = `AI configuration imported from GitLab (${repoName}). Original author: ${owner}.`;
              const descMatch = content.match(/^---[\s\S]*?description:\s*(.+?)[\n\r]/m);
              if (descMatch) description = descMatch[1].trim().slice(0, 500);

              // Detect platforms from content
              const lc = content.toLowerCase();
              const plat = [...search.plat];
              if (lc.includes("claude") && !plat.includes("claude")) plat.push("claude");
              if (lc.includes("chatgpt") && !plat.includes("chatgpt")) plat.push("chatgpt");
              if (lc.includes("cursor") && !plat.includes("cursor")) plat.push("cursor");
              if (lc.includes("gemini") && !plat.includes("gemini")) plat.push("gemini");

              const slugBase = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);

              const result = await sql`
                INSERT INTO exchange_listings (user_id, title, slug, description, category, platforms, content, source_url, source_author, status)
                VALUES (${communityUserId}, ${title}, ${"temp-" + Date.now() + "-" + imported}, ${description}, ${search.cat}, ${plat}, ${content}, ${htmlUrl}, ${owner}, 'approved')
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

          send({ type: "progress", imported, skipped, errors, message: "Waiting for rate limit cooldown..." });
          await new Promise((r) => setTimeout(r, 5000));
        } catch {
          errors++;
        }
      }

      send({ type: "done", imported, skipped, errors, message: `GitLab scrape complete. ${imported} imported, ${skipped} skipped, ${errors} errors.` });
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
