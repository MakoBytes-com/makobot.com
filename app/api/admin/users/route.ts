import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllUsers, setUserAdmin, deleteUser, getUserByEmail, getUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  const users = await getAllUsers(limit, offset);
  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, isAdmin } = await req.json();
  await setUserAdmin(userId, isAdmin);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json();
  const id = Number(userId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "A valid userId is required" }, { status: 400 });
  }

  // Guard 1: never delete the account you are signed in as. Deleting yourself
  // ends your own session mid-request and, if you were the only admin, locks
  // everyone out of /admin permanently — OWNER_EMAILS would re-promote on the
  // next sign-in, but only after re-creating the account from scratch.
  const me = session.user.email ? await getUserByEmail(session.user.email) : null;
  if (me && Number(me.id) === id) {
    return NextResponse.json(
      { error: "You can't delete the account you're signed in as." },
      { status: 400 },
    );
  }

  // Guard 2: admins are protected. Demote first, then delete — makes removing
  // another admin a deliberate two-step rather than one mis-click.
  const target = await getUserById(id);
  if (!target) {
    return NextResponse.json({ error: "That user no longer exists." }, { status: 404 });
  }
  if (target.is_admin) {
    return NextResponse.json(
      { error: "That user is an admin. Turn off their admin access first, then delete." },
      { status: 400 },
    );
  }

  try {
    const removed = await deleteUser(id);
    return NextResponse.json({ ok: true, email: target.email, removed });
  } catch (err) {
    // Most likely a foreign key this schema grew after deleteUser() was written.
    // Say so plainly instead of a bare 500 — the message reaches the admin UI.
    return NextResponse.json(
      { error: `Could not delete this user: ${(err as Error).message}` },
      { status: 500 },
    );
  }
}
