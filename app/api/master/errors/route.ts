// Master CP errors-pull endpoint (scope=errors.read, GET only).
//
// makobot.com has NO `error_events` table — it does not run the in-house
// error-instrumentation schema that Bulldog/Mako sites use. What it does
// report is the one failure that once went unseen for weeks: the support chat
// unable to answer (lib/support-health.ts). While that lasts it is one open
// group in the same shape the Bulldog sites return; otherwise the result is
// empty. Read-only.
import { NextResponse, type NextRequest } from "next/server";
import { verifyMasterToken } from "@/lib/master-jwt";
import { readChatHealth } from "@/lib/support-health";

const DAY_MS = 24 * 60 * 60_000;

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
    const h = await readChatHealth();
    const age = h.lastFailureAt ? Date.now() - new Date(h.lastFailureAt).getTime() : Infinity;
    const open = h.failing ? h.failures : 0;
    return NextResponse.json({
      ok: true,
      summary: {
        open_24h: age <= DAY_MS ? open : 0,
        open_7d: age <= 7 * DAY_MS ? open : 0,
        total_open: open,
        total_all: open,
      },
      groups: h.failing
        ? [
            {
              fingerprint: "support-chat-down",
              count: h.failures,
              level: "error",
              module: "support-chat",
              message: `The Help chat cannot answer: ${h.lastReason ?? "unknown reason"}`,
              last_seen: h.lastFailureAt,
              first_seen: h.firstFailureAt,
              resolved: false,
            },
          ]
        : [],
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "errors query failed" },
      { status: 500 },
    );
  }
}
