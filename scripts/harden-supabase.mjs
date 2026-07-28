// One-shot: enable RLS on all public tables (no policies, since app connects
// as postgres superuser which bypasses RLS — denies anon/authenticated REST
// access via PostgREST). Also dumps the live schema diff vs setupDatabase()
// so we know what to backfill into lib/db.ts.

import postgres from "postgres";
import fs from "node:fs";

const SUPA_URL = process.env.SUPA_URL;
if (!SUPA_URL) throw new Error("SUPA_URL env var not set");

const sql = postgres(SUPA_URL, { ssl: "require", max: 1, prepare: false });
const log = (...a) => console.log("[harden]", ...a);

try {
  log("--- listing all public tables ---");
  const tables = await sql`
    SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename
  `;
  log(`Found ${tables.length} tables`);

  log("--- checking current RLS state ---");
  const rls = await sql`
    SELECT n.nspname AS schema, c.relname AS table_name, c.relrowsecurity AS rls_enabled
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY c.relname
  `;
  for (const r of rls) {
    log(`  ${r.table_name}: rls=${r.rls_enabled}`);
  }

  log("--- enabling RLS on all public tables ---");
  for (const { tablename } of tables) {
    await sql.unsafe(`ALTER TABLE "${tablename}" ENABLE ROW LEVEL SECURITY`);
    log(`  enabled RLS on ${tablename}`);
  }

  log("--- verifying ---");
  const after = await sql`
    SELECT c.relname, c.relrowsecurity
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname='public' AND c.relkind='r' ORDER BY c.relname
  `;
  const stillOff = after.filter(r => !r.relrowsecurity);
  if (stillOff.length === 0) {
    log("✓ all public tables have RLS enabled");
  } else {
    log("✗ still off:", stillOff.map(r => r.relname).join(", "));
  }

  log("--- dumping schema for setupDatabase() backfill ---");
  const schemaDump = [];
  for (const { tablename } of tables) {
    const cols = await sql`
      SELECT column_name, data_type, udt_name, is_nullable, column_default,
             character_maximum_length, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name=${tablename}
      ORDER BY ordinal_position
    `;
    schemaDump.push({ table: tablename, columns: cols });
  }
  fs.writeFileSync("scripts/.live-schema.json", JSON.stringify(schemaDump, null, 2));
  log(`wrote scripts/.live-schema.json (${schemaDump.length} tables)`);
} catch (e) {
  console.error("[harden] FAILED:", e);
  process.exitCode = 1;
} finally {
  await sql.end();
}
