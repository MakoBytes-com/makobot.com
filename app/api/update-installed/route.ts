import { NextRequest, NextResponse } from "next/server";
import { ensureUpdateEventsTable, recordUpdateEvent } from "@/lib/db";

// MakoBot Build 103+ POSTs here from UpdateChecker.LaunchInstaller right
// before launching the auto-update installer. Best-effort telemetry — the
// client's failure handling treats any non-2xx as silent (the update still
// proceeds). We never block, never retry, never expose user-facing errors.
//
// Body: { fromVersion: "2.0.0.102", toVersion: "2.0.0.103", licenseKey?: "MAKO-..." }
// All fields optional; we record what we can and move on.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const fromVersion = typeof body.fromVersion === "string" ? body.fromVersion.slice(0, 50) : null;
    const toVersion = typeof body.toVersion === "string" ? body.toVersion.slice(0, 50) : null;
    const licenseKey = typeof body.licenseKey === "string" ? body.licenseKey.slice(0, 50) : null;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;

    await ensureUpdateEventsTable();
    await recordUpdateEvent({ fromVersion, toVersion, licenseKey, ip, userAgent });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Best-effort. If our DB is down, the desktop client just doesn't know
    // we missed this event — far better than blocking the user's update.
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 200 });
  }
}
