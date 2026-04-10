import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllUsers, setUserAdmin } from "@/lib/db";

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
