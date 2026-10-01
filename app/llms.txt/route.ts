import { NextResponse } from "next/server";
import { llmsShortText } from "@/lib/knowledge";
import { latestBuild } from "@/lib/build";

// Static, but regenerated hourly and the moment a new build is registered
// (/api/versions/register), so the build number in it follows the release.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return new NextResponse(llmsShortText(await latestBuild()), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
