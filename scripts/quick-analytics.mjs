// One-off: traffic vs conversion snapshot for the July 2026 repositioning.
// Aggregate counts only. DB URL comes from MB_DB_URL env var.
import postgres from "postgres";

const sql = postgres(process.env.MB_DB_URL, { ssl: "require", prepare: false, max: 1, connect_timeout: 20 });
const ago = (d) => new Date(Date.now() - d * 864e5).toISOString();
const q = async (label, fn) => {
  try { const r = await fn(); console.log(label, JSON.stringify(r)); }
  catch (e) { console.log(label, "ERR:", e.message); }
};

await q("pv7", () => sql`SELECT COUNT(*)::int AS n FROM page_views WHERE created_at > ${ago(7)}`);
await q("pv30", () => sql`SELECT COUNT(*)::int AS n FROM page_views WHERE created_at > ${ago(30)}`);
await q("uniq30", () => sql`SELECT COUNT(DISTINCT ip)::int AS n FROM page_views WHERE created_at > ${ago(30)}`);
await q("topPaths", () => sql`SELECT path, COUNT(*)::int AS n FROM page_views WHERE created_at > ${ago(30)} GROUP BY path ORDER BY n DESC LIMIT 8`);
await q("refs", () => sql`SELECT COALESCE(NULLIF(referrer,''),'(direct)') AS ref, COUNT(*)::int AS n FROM page_views WHERE created_at > ${ago(30)} GROUP BY 1 ORDER BY n DESC LIMIT 6`);
await q("dl", () => sql`SELECT COUNT(*)::int AS n30, (SELECT COUNT(*)::int FROM downloads) AS total FROM downloads WHERE created_at > ${ago(30)}`);
await q("keys", () => sql`SELECT COUNT(*)::int AS n30, (SELECT COUNT(*)::int FROM license_keys) AS total FROM license_keys WHERE created_at > ${ago(30)}`);
await q("upd", () => sql`SELECT COUNT(DISTINCT license_key)::int AS installs30 FROM update_events WHERE created_at > ${ago(30)}`);
await sql.end();
