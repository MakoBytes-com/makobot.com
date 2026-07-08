// Master CP user-summary pull endpoint. Verifies an inbound master JWT
// (scope=users.read) and returns per-role user counts the fleet dashboard
// rolls up. Read-only.
//
// Column mapping to makobot's schema (lib/db.ts `users` table):
//   - total   = COUNT(*)
//   - active  = COUNT(*)  — makobot has no disabled/soft-delete flag, so
//               every row is an active user. (No `disabled_at` column.)
//   - admins  = COUNT(*) WHERE is_admin = true  (real boolean column)
//   - editors = 0  — makobot has no editor role (no `role` column at all)
import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { verifyMasterToken } from "@/lib/master-jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "missing bearer token" }, { status: 401 });
  }

  try {
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "users.read");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    const sql = getDb();
    const [row] = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*)::int AS active,
        COUNT(*) FILTER (WHERE is_admin = true)::int AS admins
      FROM users
    `;

    return NextResponse.json({
      ok: true,
      counts: {
        total: row?.total ?? 0,
        active: row?.active ?? 0,
        admins: row?.admins ?? 0,
        editors: 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "users query failed" },
      { status: 500 },
    );
  }
}
