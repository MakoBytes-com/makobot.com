// One-shot backfill of the app_versions kill-switch table for Builds 88-103.
// Idempotent — safe to re-run; uses INSERT ... ON CONFLICT DO UPDATE.
//
// Build 103 is the current LIVE build. Builds 88-102 are marked "deprecated"
// (still installable, but the app shows a soft "please update" banner).
// If a user is on a deprecated build the kill-switch never blocks them.
//
// Usage:
//   node scripts/backfill-versions.mjs
//
// Reads DATABASE_URL from .env.production by default, or from env.

import postgres from "postgres";
import fs from "node:fs";

let dbUrl = process.env.DATABASE_URL;
for (const envFile of [".env.production", ".env.local"]) {
  if (dbUrl) break;
  try {
    const env = Object.fromEntries(
      fs.readFileSync(envFile, "utf8")
        .split("\n").filter(Boolean).map(l => l.match(/^([^=]+)="?(.*?)"?$/)?.slice(1) ?? [])
        .filter(p => p.length === 2)
    );
    dbUrl = env.DATABASE_URL;
  } catch { /* fall through */ }
}
if (!dbUrl) {
  console.error("DATABASE_URL not set in env or .env.production");
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: "require", max: 1, prepare: false });

const builds = [
  { build: 88,  version: "2.0.0.88",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 89,  version: "2.0.0.89",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 90,  version: "2.0.0.90",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 91,  version: "2.0.0.91",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 92,  version: "2.0.0.92",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 93,  version: "2.0.0.93",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 94,  version: "2.0.0.94",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 95,  version: "2.0.0.95",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 96,  version: "2.0.0.96",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 97,  version: "2.0.0.97",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 98,  version: "2.0.0.98",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 99,  version: "2.0.0.99",  status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 100, version: "2.0.0.100", status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 101, version: "2.0.0.101", status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 102, version: "2.0.0.102", status: "deprecated", message: "Please update — Build 103 is current." },
  { build: 103, version: "2.0.0.103", status: "ok",         message: null },
];

try {
  await sql`
    CREATE TABLE IF NOT EXISTS app_versions (
      version VARCHAR(50) PRIMARY KEY,
      build_number INTEGER NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'ok',
      message TEXT,
      released_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_versions_status_chk') THEN
        ALTER TABLE app_versions ADD CONSTRAINT app_versions_status_chk
          CHECK (status IN ('ok', 'deprecated', 'blocked'));
      END IF;
    END $$
  `;

  for (const b of builds) {
    await sql`
      INSERT INTO app_versions (version, build_number, status, message, updated_at)
      VALUES (${b.version}, ${b.build}, ${b.status}, ${b.message}, NOW())
      ON CONFLICT (version) DO UPDATE SET
        build_number = EXCLUDED.build_number,
        status       = EXCLUDED.status,
        message      = EXCLUDED.message,
        updated_at   = NOW()
    `;
    console.log(`✓ ${b.version}  build=${b.build}  status=${b.status}`);
  }

  console.log("\nFinal table:");
  const rows = await sql`SELECT version, build_number, status, message FROM app_versions ORDER BY build_number DESC`;
  for (const r of rows) {
    console.log(`  ${r.version}  build=${r.build_number}  status=${r.status}` + (r.message ? `  "${r.message}"` : ""));
  }
} finally {
  await sql.end();
}
