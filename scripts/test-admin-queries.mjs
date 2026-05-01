// Run the EXACT queries the admin pages use, locally against the same
// Supabase DB. Tells us if the issue is in the queries (returns nothing)
// vs. the API/render layer.
//
// Usage: requires .env.production pulled via `vercel env pull .env.production`

import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const projectDir = path.resolve(path.dirname(scriptPath), "..");

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.length < 20) {
  for (const f of [path.join(projectDir, ".env.production"), path.join(projectDir, ".env.local")]) {
    try {
      for (const raw of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq < 0) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key === "DATABASE_URL" && val.length > 20) { dbUrl = val; break; }
      }
      if (dbUrl && dbUrl.length > 20) break;
    } catch { /* skip */ }
  }
}
if (!dbUrl || dbUrl.length < 20) {
  console.error("DATABASE_URL not set or empty.");
  console.error("Run: vercel env pull .env.production");
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: "require", max: 1, prepare: false });

console.log(`\nDB: ${dbUrl.split("@")[1]?.split("/")[0]}\n`);

try {
  console.log("=== getAllUsers (admin /users page) ===");
  const users = await sql`
    SELECT u.*,
      (SELECT COUNT(*) FROM license_keys WHERE user_id = u.id) as key_count,
      (SELECT COUNT(*) FROM downloads WHERE user_id = u.id) as download_count
    FROM users u
    ORDER BY u.created_at DESC
    LIMIT 100 OFFSET 0
  `;
  console.log(`Returned ${users.length} rows.`);
  for (const u of users) {
    const compact = { ...u };
    if (compact.avatar_data) compact.avatar_data = `[buffer ${compact.avatar_data.length} bytes]`;
    console.log(JSON.stringify(compact));
  }

  console.log("\n=== getAllKeys (admin /keys page) ===");
  const keys = await sql`
    SELECT
      lk.*,
      u.email,
      u.name,
      ld.version AS last_download_version,
      ld.created_at AS last_download_at,
      (SELECT COUNT(*) FROM downloads WHERE user_id = lk.user_id) AS download_count
    FROM license_keys lk
    JOIN users u ON lk.user_id = u.id
    LEFT JOIN LATERAL (
      SELECT version, created_at
      FROM downloads
      WHERE user_id = lk.user_id
      ORDER BY created_at DESC
      LIMIT 1
    ) ld ON TRUE
    ORDER BY lk.created_at DESC
    LIMIT 100 OFFSET 0
  `;
  console.log(`Returned ${keys.length} rows.`);
  for (const k of keys) {
    const compact = { ...k };
    if (compact.key && typeof compact.key === "string") compact.key = compact.key.slice(0, 4) + "…" + compact.key.slice(-4);
    console.log(JSON.stringify(compact));
  }
} catch (err) {
  console.error("\nQUERY ERROR:", err.message);
  console.error(err.stack);
} finally {
  await sql.end();
}
