import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { SITE_LAST_UPDATED } from "@/lib/version";

const STATIC_LAST_MOD = new Date(SITE_LAST_UPDATED);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: "https://makobot.com",                       lastModified: STATIC_LAST_MOD, changeFrequency: "weekly",  priority: 1 },
    { url: "https://makobot.com/exchange",              lastModified: STATIC_LAST_MOD, changeFrequency: "daily",   priority: 0.9 },
    { url: "https://makobot.com/exchange/collections",  lastModified: STATIC_LAST_MOD, changeFrequency: "daily",   priority: 0.7 },
    { url: "https://makobot.com/exchange/requests",     lastModified: STATIC_LAST_MOD, changeFrequency: "daily",   priority: 0.7 },
    { url: "https://makobot.com/exchange/stacks",       lastModified: STATIC_LAST_MOD, changeFrequency: "weekly",  priority: 0.7 },
    { url: "https://makobot.com/get-key",               lastModified: STATIC_LAST_MOD, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://makobot.com/compare",               lastModified: STATIC_LAST_MOD, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://makobot.com/privacy",               lastModified: STATIC_LAST_MOD, changeFrequency: "yearly",  priority: 0.3 },
    { url: "https://makobot.com/terms",                 lastModified: STATIC_LAST_MOD, changeFrequency: "yearly",  priority: 0.3 },
  ];

  try {
    const sql = getDb();

    const listings = await sql`
      SELECT slug, updated_at FROM exchange_listings
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 5000
    `;
    for (const row of listings) {
      entries.push({
        url: `https://makobot.com/exchange/${row.slug}`,
        lastModified: new Date(row.updated_at as string),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    const stacks = await sql`
      SELECT slug, updated_at FROM exchange_stacks
      WHERE is_public = true
      ORDER BY created_at DESC
      LIMIT 1000
    `;
    for (const row of stacks) {
      entries.push({
        url: `https://makobot.com/exchange/stacks/${row.slug}`,
        lastModified: new Date(row.updated_at as string),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    const collections = await sql`
      SELECT slug, updated_at FROM exchange_collections
      WHERE is_public = true
      ORDER BY created_at DESC
      LIMIT 1000
    `;
    for (const row of collections) {
      entries.push({
        url: `https://makobot.com/exchange/collections/${row.slug}`,
        lastModified: new Date(row.updated_at as string),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    const tagRows = await sql`
      SELECT DISTINCT unnest(tags) AS tag
      FROM exchange_listings
      WHERE status = 'approved' AND tags IS NOT NULL
      LIMIT 500
    `;
    for (const row of tagRows) {
      const tag = String(row.tag ?? "").trim();
      if (!tag) continue;
      entries.push({
        url: `https://makobot.com/exchange/tags/${encodeURIComponent(tag)}`,
        lastModified: STATIC_LAST_MOD,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }

    const users = await sql`
      SELECT id FROM users
      WHERE username IS NOT NULL
        AND id IN (SELECT DISTINCT user_id FROM exchange_listings WHERE status = 'approved')
      LIMIT 2000
    `;
    for (const row of users) {
      entries.push({
        url: `https://makobot.com/exchange/user/${row.id}`,
        lastModified: STATIC_LAST_MOD,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  } catch {
    // DB unavailable — return static entries only
  }

  return entries;
}
