import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, createStack, getPublicStacks, getUserStacks } from "@/lib/db";

// GET /api/exchange/stacks — Public stacks OR user's own
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("mine")) {
      const session = await auth();
      if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      const user = await getUserByEmail(session.user.email);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      const stacks = await getUserStacks(user.id);
      return NextResponse.json({ stacks });
    }
    const stacks = await getPublicStacks();
    return NextResponse.json({ stacks });
  } catch {
    return NextResponse.json({ stacks: [] });
  }
}

// POST /api/exchange/stacks — Create a new stack
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { title, description } = await request.json();
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });
    }

    const stack = await createStack(user.id, title.trim(), description.trim());
    return NextResponse.json({ stack });
  } catch (error) {
    console.error("Create stack error:", error);
    return NextResponse.json({ error: "Failed to create stack" }, { status: 500 });
  }
}
