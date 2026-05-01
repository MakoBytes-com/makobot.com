import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  ensureAppVersionsTable,
  listAppVersions,
  setAppVersionStatus,
  upsertAppVersion,
} from "@/lib/db";

// Admin CRUD for the app_versions kill-switch table.

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await ensureAppVersionsTable();
  const versions = await listAppVersions();
  return NextResponse.json({ versions });
}

// POST — create or upsert a version row.
// Body: { version, buildNumber, status?, message? }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const version = String(body.version || "").trim();
    const buildNumber = parseInt(body.buildNumber);
    if (!version || !Number.isFinite(buildNumber)) {
      return NextResponse.json({ error: "version (string) and buildNumber (int) are required" }, { status: 400 });
    }
    const status = body.status === "ok" || body.status === "deprecated" || body.status === "blocked"
      ? body.status : "ok";
    const message = typeof body.message === "string" ? body.message : null;

    await ensureAppVersionsTable();
    await upsertAppVersion({ version, buildNumber, status, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PATCH — flip status / edit message on an existing row.
// Body: { version, status, message? }
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const version = String(body.version || "").trim();
    const status = body.status;
    if (!version || (status !== "ok" && status !== "deprecated" && status !== "blocked")) {
      return NextResponse.json({ error: "version + status (ok/deprecated/blocked) required" }, { status: 400 });
    }
    const message = typeof body.message === "string" ? body.message : null;
    await setAppVersionStatus(version, status, message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
