import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, followUser, unfollowUser, isFollowing } from "@/lib/db";

// POST /api/exchange/follow/[id] — Follow a user
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Sign in to follow" }, { status: 401 });
    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = await params;
    const followedId = parseInt(id);
    if (followedId === user.id) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

    await followUser(user.id, followedId);
    return NextResponse.json({ following: true });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
  }
}

// DELETE /api/exchange/follow/[id] — Unfollow a user
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = await params;
    await unfollowUser(user.id, parseInt(id));
    return NextResponse.json({ following: false });
  } catch {
    return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
  }
}

// GET /api/exchange/follow/[id] — Check follow status
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ following: false });
    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ following: false });

    const { id } = await params;
    const following = await isFollowing(user.id, parseInt(id));
    return NextResponse.json({ following });
  } catch {
    return NextResponse.json({ following: false });
  }
}
