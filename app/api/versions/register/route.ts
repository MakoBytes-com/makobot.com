import { NextRequest, NextResponse } from "next/server";
import { ensureAppVersionsTable, upsertAppVersion } from "@/lib/db";

// Secret-gated version registration for the publish pipeline.
//
// The App Versions / kill-switch registry (app/admin/versions) is otherwise
// a MANUAL list — new builds only appeared if someone clicked "+ Register
// Version". As of Build 316, publish.ps1 POSTs here after every successful
// publish so the registry (and the /api/app-status "latest version" the
// desktop client polls) stays current on its own.
//
// Auth: a dedicated VERSION_REGISTER_KEY secret via the x-register-key
// header — a script can't hold a NextAuth admin session, so the
// session-gated /api/admin/versions POST isn't reachable from the pipeline.
// Registering a build only ever marks it "ok"; deprecating or blocking a
// build stays a deliberate human action in the admin UI.
export async function POST(req: NextRequest) {
  const key = req.headers.get("x-register-key");
  if (!process.env.VERSION_REGISTER_KEY || key !== process.env.VERSION_REGISTER_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const version = String(body.version || "").trim();
    const buildNumber = parseInt(body.buildNumber);
    if (!version || !Number.isFinite(buildNumber)) {
      return NextResponse.json(
        { error: "version (string) and buildNumber (int) are required" },
        { status: 400 },
      );
    }

    await ensureAppVersionsTable();
    await upsertAppVersion({ version, buildNumber, status: "ok", message: null });
    return NextResponse.json({ ok: true, version, buildNumber });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
