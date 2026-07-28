import postgres from "postgres";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.production", "utf8")
    .split("\n").filter(Boolean).map(l => l.match(/^([^=]+)="?(.*?)"?$/)?.slice(1) ?? [])
    .filter(p => p.length === 2)
);
const NEON_URL = env.DATABASE_URL;
const SUPA_URL = process.env.SUPA_URL;
if (!NEON_URL) throw new Error("DATABASE_URL not in .env.production");
if (!SUPA_URL) throw new Error("SUPA_URL env var not set");

const src = postgres(NEON_URL, { ssl: "require", max: 1, prepare: false });
const dst = postgres(SUPA_URL, { ssl: "require", max: 1, prepare: false });

const log = (...a) => console.log("[migrate]", ...a);

try {
  await src`SELECT 1`;
  log("Neon connected");
  await dst`SELECT 1`;
  log("Supabase connected");

  log("--- clearing destination public schema (idempotent re-run safety) ---");
  const existingDst = await dst`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  for (const { tablename } of existingDst) {
    await dst.unsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
  }
  log(`Dropped ${existingDst.length} existing tables on Supabase`);

  const tables = await src`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' ORDER BY tablename
  `;
  log(`Found ${tables.length} tables to migrate:`, tables.map(t => t.tablename).join(", "));

  for (const { tablename } of tables) {
    const columns = await src`
      SELECT column_name, data_type, udt_name, is_nullable, column_default,
             character_maximum_length, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${tablename}
      ORDER BY ordinal_position
    `;
    const colDefs = columns.map(c => {
      const isSerial = c.column_default && /^nextval\(/i.test(c.column_default);
      let type;
      if (isSerial) {
        type = c.data_type === "bigint" ? "BIGSERIAL" : "SERIAL";
      } else if (c.data_type === "USER-DEFINED") type = c.udt_name;
      else if (c.data_type === "ARRAY") type = `${c.udt_name.replace(/^_/, "")}[]`;
      else if (c.data_type === "character varying") type = c.character_maximum_length ? `VARCHAR(${c.character_maximum_length})` : "TEXT";
      else if (c.data_type === "numeric") type = c.numeric_precision ? `NUMERIC(${c.numeric_precision},${c.numeric_scale})` : "NUMERIC";
      else if (c.data_type === "timestamp without time zone") type = "TIMESTAMP";
      else if (c.data_type === "timestamp with time zone") type = "TIMESTAMPTZ";
      else type = c.data_type.toUpperCase();
      const parts = [`"${c.column_name}"`, type];
      if (!isSerial && c.column_default) parts.push(`DEFAULT ${c.column_default}`);
      if (c.is_nullable === "NO") parts.push("NOT NULL");
      return parts.join(" ");
    });
    const ddl = `CREATE TABLE IF NOT EXISTS "${tablename}" (\n  ${colDefs.join(",\n  ")}\n);`;
    log(`Creating table ${tablename}`);
    await dst.unsafe(ddl);
  }

  log("--- adding non-FK constraints (PK, UNIQUE, CHECK) ---");
  const allConstraints = await src`
    SELECT cls.relname AS table_name, con.conname, con.contype,
           pg_get_constraintdef(con.oid) AS def
    FROM pg_constraint con
    JOIN pg_class cls ON cls.oid = con.conrelid
    JOIN pg_namespace ns ON ns.oid = cls.relnamespace
    WHERE ns.nspname = 'public'
    ORDER BY CASE con.contype WHEN 'p' THEN 1 WHEN 'u' THEN 2 WHEN 'c' THEN 3 WHEN 'f' THEN 4 ELSE 5 END
  `;
  const nonFkConstraints = allConstraints.filter(c => c.contype !== 'f');
  const fkConstraints = allConstraints.filter(c => c.contype === 'f');
  for (const c of nonFkConstraints) {
    try {
      await dst.unsafe(`ALTER TABLE "${c.table_name}" ADD CONSTRAINT "${c.conname}" ${c.def}`);
    } catch (e) {
      if (!String(e.message).includes("already exists")) {
        log(`WARN: constraint ${c.conname} on ${c.table_name}: ${e.message}`);
      }
    }
  }

  log("--- adding indexes (non-constraint) ---");
  const indexes = await src`
    SELECT indexname, indexdef FROM pg_indexes
    WHERE schemaname = 'public' AND indexname NOT LIKE '%_pkey'
      AND indexname NOT IN (SELECT conname FROM pg_constraint)
  `;
  for (const i of indexes) {
    try {
      await dst.unsafe(i.indexdef);
    } catch (e) {
      if (!String(e.message).includes("already exists")) {
        log(`WARN: index ${i.indexname}: ${e.message}`);
      }
    }
  }

  log("--- copying data ---");
  for (const { tablename } of tables) {
    const rows = await src.unsafe(`SELECT * FROM "${tablename}"`);
    if (rows.length === 0) {
      log(`  ${tablename}: empty, skipping`);
      continue;
    }
    const cols = Object.keys(rows[0]);
    await dst.unsafe(`TRUNCATE "${tablename}" RESTART IDENTITY CASCADE`);
    for (const row of rows) {
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
      const values = cols.map(k => row[k]);
      await dst.unsafe(
        `INSERT INTO "${tablename}" (${cols.map(c => `"${c}"`).join(", ")}) VALUES (${placeholders})`,
        values
      );
    }
    log(`  ${tablename}: ${rows.length} rows copied`);
  }

  log("--- adding FK constraints (after data copy) ---");
  for (const c of fkConstraints) {
    try {
      await dst.unsafe(`ALTER TABLE "${c.table_name}" ADD CONSTRAINT "${c.conname}" ${c.def}`);
    } catch (e) {
      if (!String(e.message).includes("already exists")) {
        log(`WARN: FK ${c.conname} on ${c.table_name}: ${e.message}`);
      }
    }
  }

  log("--- resetting sequences ---");
  const sequences = await dst`
    SELECT c.relname AS seq, t.relname AS table_name, a.attname AS column
    FROM pg_class c
    JOIN pg_depend d ON d.objid = c.oid
    JOIN pg_class t ON d.refobjid = t.oid
    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'S' AND n.nspname = 'public'
  `;
  for (const s of sequences) {
    const result = await dst.unsafe(`SELECT COALESCE(MAX("${s.column}"), 0) AS m FROM "${s.table_name}"`);
    const max = Number(result[0].m);
    if (max > 0) {
      await dst.unsafe(`SELECT setval('"${s.seq}"', ${max}, true)`);
      log(`  ${s.seq} → ${max}`);
    }
  }

  log("DONE — migration complete");
} catch (e) {
  console.error("[migrate] FAILED:", e);
  process.exitCode = 1;
} finally {
  await src.end();
  await dst.end();
}
