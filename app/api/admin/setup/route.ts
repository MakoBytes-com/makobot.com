import { NextRequest, NextResponse } from "next/server";
import { setupDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  const setupKey = req.headers.get("x-setup-key");
  if (setupKey !== process.env.SETUP_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await setupDatabase();
    return NextResponse.json({ ok: true, message: "Database tables created" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
