import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listWaitlist } from "@/lib/db";

/** Admin only: everyone who asked to hear when MakoBot is back. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const rows = await listWaitlist();
  return NextResponse.json({ signups: rows });
}
