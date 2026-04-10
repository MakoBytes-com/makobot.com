import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllKeys, updateKeyStatus, updateKeyTier } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  const keys = await getAllKeys(limit, offset);
  return NextResponse.json({ keys });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { keyId, status, tier } = await req.json();

  if (status) await updateKeyStatus(keyId, status);
  if (tier) await updateKeyTier(keyId, tier);

  return NextResponse.json({ ok: true });
}
