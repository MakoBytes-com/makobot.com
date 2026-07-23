import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/exchange/import-github — Fetch file content from GitHub (auth required)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in to import from GitHub" }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Convert GitHub URL to raw content URL
    // Supports: github.com/user/repo/blob/branch/path and raw.githubusercontent.com
    let rawUrl = url.trim();

    if (rawUrl.includes("github.com") && rawUrl.includes("/blob/")) {
      // Convert github.com blob URL to raw URL
      rawUrl = rawUrl
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
    } else if (rawUrl.includes("github.com") && !rawUrl.includes("raw.githubusercontent.com")) {
      return NextResponse.json({
        error: "Please use a direct link to a file (click on a file in the repo, then copy the URL)",
      }, { status: 400 });
    }

    // SSRF guard (Build 316 audit): the substring checks above only fire when
    // the URL contains "github.com" — a URL that doesn't (an internal IP, the
    // cloud metadata endpoint, any third-party host) would otherwise be fetched
    // verbatim and its body reflected back. Parse and hard-require the final
    // target to be https://raw.githubusercontent.com/… before any fetch.
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
    }
    if (parsed.protocol !== "https:" || parsed.hostname !== "raw.githubusercontent.com") {
      return NextResponse.json({
        error: "Only public GitHub file links are allowed (github.com/…/blob/… or raw.githubusercontent.com).",
      }, { status: 400 });
    }

    // Fetch the file content — redirects disabled so a 3xx from GitHub can't
    // bounce the request to an off-allowlist host.
    const res = await fetch(parsed.toString(), {
      headers: { "Accept": "text/plain" },
      redirect: "error",
    });

    if (!res.ok) {
      return NextResponse.json({
        error: `Could not fetch file from GitHub (${res.status}). Make sure the repo is public and the URL is correct.`,
      }, { status: 400 });
    }

    const content = await res.text();
    if (content.length > 500000) {
      return NextResponse.json({ error: "File is too large (max 500KB)" }, { status: 400 });
    }

    // Try to extract metadata from the content
    const fileName = rawUrl.split("/").pop() || "imported-file";
    let suggestedTitle = fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    let suggestedCategory = "prompts";
    let suggestedPlatforms: string[] = ["universal"];

    // Auto-detect category and platforms from filename and content
    const lowerName = fileName.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (lowerName.includes("skill") || lowerName.endsWith(".skill")) {
      suggestedCategory = "skills";
    } else if (lowerName === "claude.md" || lowerName.includes("claude")) {
      suggestedCategory = "configs";
      suggestedPlatforms = ["claude"];
      suggestedTitle = "CLAUDE.md Configuration";
    } else if (lowerName === ".cursorrules" || lowerName.includes("cursor")) {
      suggestedCategory = "configs";
      suggestedPlatforms = ["cursor"];
      suggestedTitle = "Cursor Rules";
    } else if (lowerName === ".windsurfrules" || lowerName.includes("windsurf")) {
      suggestedCategory = "configs";
      suggestedPlatforms = ["windsurf"];
      suggestedTitle = "Windsurf Rules";
    } else if (lowerContent.includes("mcpservers") || lowerContent.includes("mcp_servers") || lowerContent.includes("modelcontextprotocol")) {
      suggestedCategory = "mcp";
    } else if (lowerContent.includes("hooks") && (lowerContent.includes("pretooluse") || lowerContent.includes("posttooluse"))) {
      suggestedCategory = "hooks";
      suggestedPlatforms = ["claude"];
    }

    // Detect platforms from content
    if (lowerContent.includes("claude") || lowerContent.includes("anthropic")) suggestedPlatforms = [...new Set([...suggestedPlatforms, "claude"])];
    if (lowerContent.includes("chatgpt") || lowerContent.includes("openai")) suggestedPlatforms = [...new Set([...suggestedPlatforms, "chatgpt"])];
    if (lowerContent.includes("gemini") || lowerContent.includes("google ai")) suggestedPlatforms = [...new Set([...suggestedPlatforms, "gemini"])];
    if (lowerContent.includes("cursor")) suggestedPlatforms = [...new Set([...suggestedPlatforms, "cursor"])];

    // Try to extract title from YAML frontmatter
    const frontmatterMatch = content.match(/^---\s*\n[\s\S]*?name:\s*(.+)\n[\s\S]*?---/m);
    if (frontmatterMatch) {
      suggestedTitle = frontmatterMatch[1].trim();
    }

    // Try to extract description from frontmatter
    let suggestedDescription = "";
    const descMatch = content.match(/^---\s*\n[\s\S]*?description:\s*(.+)\n[\s\S]*?---/m);
    if (descMatch) {
      suggestedDescription = descMatch[1].trim();
    }

    // Remove "universal" if we detected specific platforms
    if (suggestedPlatforms.length > 1) {
      suggestedPlatforms = suggestedPlatforms.filter(p => p !== "universal");
    }

    return NextResponse.json({
      content,
      fileName,
      suggestedTitle,
      suggestedDescription,
      suggestedCategory,
      suggestedPlatforms,
      sourceUrl: url.trim(),
    });
  } catch (error) {
    console.error("GitHub import error:", error);
    return NextResponse.json({ error: "Failed to import from GitHub" }, { status: 500 });
  }
}
