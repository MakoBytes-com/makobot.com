import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, updateExchangeListing, deleteExchangeListing } from "@/lib/db";

// PATCH /api/exchange/listings/[id] — Edit own listing
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = await params;
    const body = await request.json();

    const updated = await updateExchangeListing(parseInt(id), user.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Listing not found or not yours" }, { status: 404 });
    }

    const { file_data, ...cleaned } = updated;
    return NextResponse.json({ listing: cleaned });
  } catch (error) {
    console.error("Exchange update error:", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

// DELETE /api/exchange/listings/[id] — Delete listing (owner or admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = await params;
    await deleteExchangeListing(parseInt(id), user.id, session.user.isAdmin || false);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Exchange delete error:", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
