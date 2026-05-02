import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // AI crawlers — explicitly allow public marketing surfaces, block /admin and /api.
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "CCBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "FacebookBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: "https://makobot.com/sitemap.xml",
  };
}
