import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: "https://makobot.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://makobot.com/exchange",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://makobot.com/exchange/collections",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://makobot.com/exchange/requests",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://makobot.com/get-key",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://makobot.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://makobot.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Add all approved exchange listings
  try {
    const sql = getDb();
    const listings = await sql`
      SELECT slug, updated_at FROM exchange_listings WHERE status = 'approved' ORDER BY created_at DESC
    `;
    for (const listing of listings) {
      entries.push({
        url: `https://makobot.com/exchange/${listing.slug}`,
        lastModified: new Date(listing.updated_at as string),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    // If DB is unavailable, return static entries only
  }

  return entries;
}
