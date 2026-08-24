import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSetting, setSetting, getUserByEmail } from "@/lib/db";

// Runtime switches an admin can flip without a redeploy. Deliberately a short
// allowlist — this endpoint must never become a way to write arbitrary keys.
const ALLOWED = new Set(["downloads_enabled", "downloads_message"]);

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const downloadsEnabled = (await getSetting("downloads_enabled")) !== "off";
  const downloadsMessage = (await getSetting("downloads_message")) || "";

  return NextResponse.json({ downloadsEnabled, downloadsMessage });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const me = session.user.email ? await getUserByEmail(session.user.email) : null;
  const meId = me ? Number(me.id) : null;

  if (typeof body.downloadsEnabled === "boolean") {
    if (!ALLOWED.has("downloads_enabled")) {
      return NextResponse.json({ error: "Unknown setting" }, { status: 400 });
    }
    await setSetting("downloads_enabled", body.downloadsEnabled ? "on" : "off", meId);
  }

  if (typeof body.downloadsMessage === "string") {
    // Shown to visitors on /get-key, so keep it short and plain.
    await setSetting("downloads_message", body.downloadsMessage.slice(0, 300), meId);
  }

  const downloadsEnabled = (await getSetting("downloads_enabled")) !== "off";
  const downloadsMessage = (await getSetting("downloads_message")) || "";
  return NextResponse.json({ ok: true, downloadsEnabled, downloadsMessage });
}
