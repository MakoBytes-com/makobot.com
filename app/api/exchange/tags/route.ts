import { NextResponse } from "next/server";
import { getPopularTags, getListingsByTag } from "@/lib/db";

// GET /api/exchange/tags — Popular tags OR listings by tag
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    if (tag) {
      const listings = await getListingsByTag(tag.toLowerCase(), 30);
      const cleaned = listings.map((l: Record<string, unknown>) => {
        const { file_data, author_name, author_email, ...rest } = l;
        return rest;
      });
      return NextResponse.json({ listings: cleaned });
    }

    const tags = await getPopularTags(50);
    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json({ tags: [] });
  }
}
