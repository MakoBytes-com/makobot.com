import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getKeyByUserId, createLicenseKey } from "@/lib/db";
import { generateLicenseKey } from "@/lib/keys";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  // Check if user already has a key
  const existingKey = await getKeyByUserId(userId);
  if (existingKey) {
    return NextResponse.json({ key: existingKey.key, tier: existingKey.tier, status: existingKey.status });
  }

  // Generate and store new key
  const key = generateLicenseKey(session.user.email);
  const record = await createLicenseKey(userId, key, "free");

  return NextResponse.json({ key: record.key, tier: record.tier, status: record.status });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const existingKey = await getKeyByUserId(userId);

  if (!existingKey) {
    return NextResponse.json({ key: null });
  }

  return NextResponse.json({ key: existingKey.key, tier: existingKey.tier, status: existingKey.status });
}
