// Master CP errors-pull endpoint (scope=errors.read, GET only).
//
// makobot.com has NO `error_events` table — it does not run the in-house
// error-instrumentation schema that Bulldog/Mako sites use. Rather than
// query a nonexistent table (which would throw and flag this client as
// unhealthy), we return a valid, stable EMPTY shape so master's per-client
// errors tab renders cleanly with zero open errors. Read-only; no DB hit.
import { NextResponse, type NextRequest } from "next/server";
import { verifyMasterToken } from "@/lib/master-jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "missing bearer token" }, { status: 401 });
  }

  try {
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "errors.read");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    return NextResponse.json({
      ok: true,
      summary: { open_24h: 0, open_7d: 0, total_open: 0, total_all: 0 },
      groups: [],
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "errors query failed" },
      { status: 500 },
    );
  }
}
