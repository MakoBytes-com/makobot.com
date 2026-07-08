// Master CP health-pull endpoint. Master signs a JWT with scope=health.read
// and fetches this to populate the fleet dashboard's "schema drift" / "last
// seen" tile. Read-only: a single COUNT(*) on users.
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
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "health.read");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    const sql = getDb();
    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM users`;

    return NextResponse.json({
      ok: true,
      schema_rev: 1,
      plugin_versions: { admin: "1.0.0" },
      user_count: count,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "health query failed" },
      { status: 500 },
    );
  }
}
