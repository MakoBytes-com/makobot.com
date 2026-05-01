import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureAppVersionsTable, upsertAppVersion } from "@/lib/db";

// One-shot backfill of Builds 88-103 into the kill-switch registry.
// Idempotent — re-run safely; uses INSERT ... ON CONFLICT DO UPDATE.
// Hit this once after deploying Build 103 to seed the table.

const BUILDS = [
  { build: 88,  status: "deprecated" as const },
  { build: 89,  status: "deprecated" as const },
  { build: 90,  status: "deprecated" as const },
  { build: 91,  status: "deprecated" as const },
  { build: 92,  status: "deprecated" as const },
  { build: 93,  status: "deprecated" as const },
  { build: 94,  status: "deprecated" as const },
  { build: 95,  status: "deprecated" as const },
  { build: 96,  status: "deprecated" as const },
  { build: 97,  status: "deprecated" as const },
  { build: 98,  status: "deprecated" as const },
  { build: 99,  status: "deprecated" as const },
  { build: 100, status: "deprecated" as const },
  { build: 101, status: "deprecated" as const },
  { build: 102, status: "deprecated" as const },
  { build: 103, status: "ok"         as const },
];

export async function POST() {
  const session = await auth();
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ensureAppVersionsTable();

  const results: Array<{ version: string; build: number; status: string }> = [];
  for (const b of BUILDS) {
    const version = `2.0.0.${b.build}`;
    const message = b.status === "deprecated" ? "Please update — Build 103 is current." : null;
    await upsertAppVersion({ version, buildNumber: b.build, status: b.status, message });
    results.push({ version, build: b.build, status: b.status });
  }

  return NextResponse.json({ ok: true, count: results.length, results });
}
