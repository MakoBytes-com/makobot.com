import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, getStack, addToStack, removeFromStack, deleteStack, incrementStackDownload } from "@/lib/db";

// GET /api/exchange/stacks/[slug] — Stack detail
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const stack = await getStack(slug);
    if (!stack) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ stack });
  } catch {
    return NextResponse.json({ error: "Failed to load stack" }, { status: 500 });
  }
}

// PATCH /api/exchange/stacks/[slug] — Add/remove items or record download
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const stack = await getStack(slug) as Record<string, unknown> | null;
    if (!stack) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const stackId = stack.id as number;

    const body = await request.json();

    if (body.action === "download") {
      await incrementStackDownload(stackId);
      return NextResponse.json({ ok: true });
    }

    // Owner-only actions
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (body.action === "add") {
      const result = await addToStack(stackId, body.listingId, user.id);
      return NextResponse.json(result);
    }
    if (body.action === "remove") {
      const result = await removeFromStack(stackId, body.listingId, user.id);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/exchange/stacks/[slug] — Delete stack
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { slug } = await params;
    const stack = await getStack(slug) as Record<string, unknown> | null;
    if (!stack || stack.user_id !== user.id) return NextResponse.json({ error: "Not yours" }, { status: 403 });

    await deleteStack(stack.id as number, user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
