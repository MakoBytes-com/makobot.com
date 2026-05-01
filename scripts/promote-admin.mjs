// Promote a user to admin in the makobot.com Supabase database.
//
// Usage:
//   node scripts/promote-admin.mjs <email>          # promote
//   node scripts/promote-admin.mjs <email> --revoke # demote
//
// Reads DATABASE_URL from .env.production by default, or from the env if set.
// Safe to re-run; idempotent.

import postgres from "postgres";
import fs from "node:fs";

const args = process.argv.slice(2);
const email = args.find(a => a.includes("@"));
const revoke = args.includes("--revoke");

if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email> [--revoke]");
  process.exit(1);
}

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  try {
    const env = Object.fromEntries(
      fs.readFileSync(".env.production", "utf8")
        .split("\n").filter(Boolean).map(l => l.match(/^([^=]+)="?(.*?)"?$/)?.slice(1) ?? [])
        .filter(p => p.length === 2)
    );
    dbUrl = env.DATABASE_URL;
  } catch {
    /* fall through */
  }
}
if (!dbUrl) {
  console.error("DATABASE_URL not set in env or .env.production");
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: "require", max: 1, prepare: false });

try {
  const before = await sql`SELECT id, email, is_admin FROM users WHERE email = ${email} LIMIT 1`;
  if (before.length === 0) {
    console.error(`No user found with email: ${email}`);
    console.error("Sign in with that email at least once before running this script.");
    process.exit(1);
  }

  const target = !revoke;
  await sql`UPDATE users SET is_admin = ${target} WHERE email = ${email}`;
  const after = await sql`SELECT id, email, is_admin FROM users WHERE email = ${email} LIMIT 1`;

  console.log(`✓ ${revoke ? "Revoked" : "Promoted"}:`, after[0]);
  console.log("\nNext step: sign out of makobot.com and sign back in — the session callback re-reads is_admin on login.");
} finally {
  await sql.end();
}
