import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

// Admin-gated diagnostic — returns row counts + a few sample rows from each
// core table so we can see at a glance whether the post-migration Supabase
// has the data the admin pages expect.
export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const tables = [
    "users",
    "license_keys",
    "downloads",
    "exchange_listings",
    "exchange_comments",
  ];

  const result: Record<string, unknown> = {
    runAt: new Date().toISOString(),
    sessionEmail: session.user.email,
    sessionIsAdmin: session.user.isAdmin,
    tables: {},
  };

  const tableInfo: Record<string, unknown> = {};
  for (const t of tables) {
    try {
      const countRows = await sql.unsafe(`SELECT COUNT(*) as c FROM "${t}"`);
      const sampleRows = await sql.unsafe(`SELECT * FROM "${t}" LIMIT 3`);
      tableInfo[t] = {
        count: parseInt((countRows[0]?.c as string) ?? "0"),
        columns: sampleRows[0] ? Object.keys(sampleRows[0]) : [],
        sample: sampleRows.map((r: Record<string, unknown>) => {
          // Redact obvious secrets
          const redacted: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(r)) {
            if (k === "key" && typeof v === "string") {
              redacted[k] = v.length > 8 ? v.slice(0, 4) + "…" + v.slice(-4) : "[redacted]";
            } else if (k === "email" && typeof v === "string") {
              const [local, domain] = v.split("@");
              redacted[k] = local && domain ? local.slice(0, 2) + "***@" + domain : "[redacted]";
            } else {
              redacted[k] = v;
            }
          }
          return redacted;
        }),
      };
    } catch (err) {
      tableInfo[t] = { error: (err as Error).message };
    }
  }
  result.tables = tableInfo;

  return NextResponse.json(result);
}
