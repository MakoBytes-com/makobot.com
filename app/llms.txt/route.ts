import { NextResponse } from "next/server";
import { llmsShortText } from "@/lib/knowledge";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new NextResponse(llmsShortText(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
