// One-shot diagnostic: counts rows + dumps 3 sample rows from each core
// table. Reads DATABASE_URL from .env.local.
//
// Usage: node scripts/diagnose-tables.mjs

import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve env files relative to THIS script's location (not cwd).
const scriptPath = fileURLToPath(import.meta.url);
const projectDir = path.resolve(path.dirname(scriptPath), "..");

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  for (const file of [path.join(projectDir, ".env.local"), path.join(projectDir, ".env.production")]) {
    try {
      const text = fs.readFileSync(file, "utf8");
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq < 0) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key === "DATABASE_URL") { dbUrl = val; break; }
      }
      if (dbUrl) break;
    } catch { /* skip */ }
  }
}
if (!dbUrl) {
  console.error("DATABASE_URL not set in env or .env.local / .env.production");
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: "require", max: 1, prepare: false });
const tables = ["users", "license_keys", "downloads", "exchange_listings", "exchange_comments"];

try {
  console.log(`\nDB: ${dbUrl.split("@")[1]?.split("/")[0] ?? "<unknown>"}\n`);
  for (const t of tables) {
    try {
      const c = await sql.unsafe(`SELECT COUNT(*) as c FROM "${t}"`);
      const count = parseInt(c[0]?.c ?? "0");
      console.log(`📊 ${t.padEnd(22)} ${String(count).padStart(6)} rows`);
      if (count > 0 && count <= 50) {
        const sample = await sql.unsafe(`SELECT * FROM "${t}" LIMIT 3`);
        for (const row of sample) {
          const compact = {};
          for (const [k, v] of Object.entries(row)) {
            if (k === "key" && typeof v === "string") compact[k] = v.slice(0, 4) + "…" + v.slice(-4);
            else if (k === "email" && typeof v === "string") {
              const [local, domain] = v.split("@");
              compact[k] = local && domain ? local.slice(0, 2) + "***@" + domain : "[redacted]";
            }
            else if (typeof v === "string" && v.length > 60) compact[k] = v.slice(0, 60) + "…";
            else compact[k] = v;
          }
          console.log("  ", JSON.stringify(compact));
        }
      }
    } catch (err) {
      console.log(`❌ ${t.padEnd(22)} ERROR: ${err.message}`);
    }
  }
  console.log("");
} finally {
  await sql.end();
}
