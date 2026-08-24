import type { MetadataRoute } from "next";
import { SITE_LAST_UPDATED } from "@/lib/version";

const STATIC_LAST_MOD = new Date(SITE_LAST_UPDATED);

// The Skills Exchange was removed on 2026-08-24. This used to query
// exchange_listings / _stacks / _collections to emit thousands of per-listing
// URLs; all of those routes are gone, so the sitemap is now the static set of
// real pages. No DB call is needed any more.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: "https://makobot.com",          lastModified: STATIC_LAST_MOD, changeFrequency: "weekly",  priority: 1 },
    { url: "https://makobot.com/get-key",  lastModified: STATIC_LAST_MOD, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://makobot.com/compare",  lastModified: STATIC_LAST_MOD, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://makobot.com/privacy",  lastModified: STATIC_LAST_MOD, changeFrequency: "yearly",  priority: 0.3 },
    { url: "https://makobot.com/terms",    lastModified: STATIC_LAST_MOD, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
