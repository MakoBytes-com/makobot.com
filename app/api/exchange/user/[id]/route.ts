import { NextResponse } from "next/server";
import { getExchangeUserProfile } from "@/lib/db";

// GET /api/exchange/user/[id] — Public user profile (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await getExchangeUserProfile(parseInt(id));

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Strip real name from public profile -- only show username, display_name, bio
    const { name, ...safeUser } = profile.user as Record<string, unknown>;
    return NextResponse.json({
      ...profile,
      user: safeUser,
    });
  } catch (error) {
    console.error("User profile error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
