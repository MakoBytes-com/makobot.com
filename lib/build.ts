import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { getLatestApprovedAppVersion } from "./db";
import { MAKOBOT_BUILD } from "./version";

// The build number the site shows, read from the same app_versions registry
// the desktop app's update check uses. publish.ps1 registers every new build
// there (POST /api/versions/register), and that route expires this cache, so
// the site follows a release on its own.
//
// Why: the number used to come from the NEXT_PUBLIC_MAKOBOT_BUILD setting on
// Vercel, which nothing bumped — the home page said "Build 394" through
// Builds 395-418 (found 2026-09-30). MAKOBOT_BUILD in version.ts is now only
// the fallback for a build or preview with no database.
export const BUILD_TAG = "makobot-build";

export const latestBuild = unstable_cache(
  async (): Promise<string> => {
    try {
      const row = await getLatestApprovedAppVersion();
      const n = Number(row?.build_number);
      return Number.isInteger(n) && n > 0 ? String(n) : MAKOBOT_BUILD;
    } catch {
      return MAKOBOT_BUILD;
    }
  },
  ["makobot-latest-build"],
  { tags: [BUILD_TAG], revalidate: 3600 },
);

/**
 * Call after anything changes app_versions (a new build registered, a build
 * blocked or deprecated by hand): expires the cached number and the static
 * pages that print it, so they follow at once rather than within the hour.
 */
export function refreshShownBuild() {
  revalidateTag(BUILD_TAG, { expire: 0 });
  for (const p of ["/", "/llms.txt", "/llms-full.txt"]) revalidatePath(p);
}
