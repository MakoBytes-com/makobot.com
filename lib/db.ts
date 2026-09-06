import postgres from "postgres";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

let _sql: ReturnType<typeof postgres> | null = null;
export function getDb() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  // PERF: max=5 parallelizes the 13 queries that /api/admin/stats fires in
  // Promise.all. Pre-fix max=1 forced them to serialize through a single
  // connection — even fast queries summed to multi-second total latency,
  // and a single slow query stalled the whole dashboard. Supabase pooler
  // handles 5 simultaneous connections per Vercel function fine.
  _sql = postgres(url, { ssl: "require", prepare: false, max: 5 });
  return _sql;
}

// ─── SCHEMA SETUP ───
export async function setupDatabase() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      avatar_url TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      username VARCHAR(50) UNIQUE,
      display_name VARCHAR(100),
      bio TEXT,
      github_username VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS license_keys (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      key VARCHAR(255) UNIQUE NOT NULL,
      tier VARCHAR(50) DEFAULT 'free',
      status VARCHAR(50) DEFAULT 'active',
      activated_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS downloads (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      version VARCHAR(50),
      ip VARCHAR(45),
      user_agent TEXT,
      country VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY,
      path VARCHAR(500),
      referrer TEXT,
      user_agent TEXT,
      ip VARCHAR(45),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      type VARCHAR(100) NOT NULL,
      data JSONB,
      user_id INTEGER,
      ip VARCHAR(45),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  // Backfill columns added to existing tables over time (not in original schema).
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_type VARCHAR(50)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_data BYTEA`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE`;
}

// ─── USERS ───
export async function findOrCreateUser(profile: {
  google_id: string;
  email: string;
  name: string;
  avatar_url: string;
  github_username?: string;
}) {
  const sql = getDb();

  // Explicit column list throughout — never SELECT * on users. avatar_data
  // is BYTEA and can be tens of KB per row; pulling it into every session
  // check / sign-in / username lookup multiplies roundtrip cost across
  // the whole site.
  const userCols = sql`id, google_id, email, name, avatar_url, is_admin,
    created_at, username, display_name, bio, github_username, is_verified`;

  // Check by oauth ID first, then by email (handles users who sign in with both providers)
  const existing = await sql`
    SELECT ${userCols} FROM users WHERE google_id = ${profile.google_id}
  `;
  if (existing.length > 0) {
    // Update github_username if signing in with GitHub and we didn't have it
    if (profile.github_username && !existing[0].github_username) {
      await sql`UPDATE users SET github_username = ${profile.github_username} WHERE id = ${existing[0].id}`;
    }
    return refreshProfilePicture(sql, existing[0], profile);
  }

  // Check if user exists by email (signed in with different provider before)
  const byEmail = await sql`SELECT ${userCols} FROM users WHERE email = ${profile.email}`;
  if (byEmail.length > 0) {
    // Link this provider to existing account
    if (profile.github_username && !byEmail[0].github_username) {
      await sql`UPDATE users SET github_username = ${profile.github_username} WHERE id = ${byEmail[0].id}`;
    }
    return refreshProfilePicture(sql, byEmail[0], profile);
  }

  // Generate default username from GitHub username or email
  const defaultUsername = (profile.github_username || profile.email.split("@")[0])
    .toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
  const result = await sql`
    INSERT INTO users (google_id, email, name, avatar_url, username, display_name, github_username)
    VALUES (${profile.google_id}, ${profile.email}, ${profile.name}, ${profile.avatar_url}, ${defaultUsername}, ${profile.name}, ${profile.github_username || null})
    RETURNING id, google_id, email, name, avatar_url, is_admin, created_at,
              username, display_name, bio, github_username, is_verified
  `;
  return result[0];
}

// The picture link was stored once, at the very first sign-in, and never
// touched again. Google rotates profile-photo URLs, so the stored one went
// dead and the admin list showed a broken image for the owner (2026-09-06).
// Every sign-in now carries the provider's current link; take it whenever it
// differs. An empty link is ignored so a provider hiccup never wipes a photo.
async function refreshProfilePicture(
  sql: ReturnType<typeof getDb>,
  row: { id: number; avatar_url: string | null; name: string | null },
  profile: { avatar_url?: string | null; name?: string | null },
) {
  const fresh = (profile.avatar_url || "").trim();
  const name = (profile.name || "").trim();
  const wantAvatar = fresh && fresh !== (row.avatar_url || "");
  const wantName = name && !row.name;
  if (!wantAvatar && !wantName) return row;
  await sql`UPDATE users SET
    avatar_url = ${wantAvatar ? fresh : row.avatar_url},
    name = ${wantName ? name : row.name}
    WHERE id = ${row.id}`;
  return { ...row, avatar_url: wantAvatar ? fresh : row.avatar_url, name: wantName ? name : row.name };
}

export async function getUserByEmail(email: string) {
  // PERF: explicit columns only — this query runs on EVERY page load via
  // NextAuth's session callback. SELECT * was pulling avatar_data (~50KB
  // BYTEA) over the wire on every request to every page on the site.
  //
  // Build 102: LOWER() comparison on both sides. Google sometimes sends
  // mixed-case emails (e.g. "Russell.Sailors@gmail.com") in profile.email
  // even though the same account's stored row is lowercase. Without this
  // case-insensitive match, the session callback silently misses the user
  // and returns is_admin = undefined, locking the owner out of /admin.
  const sql = getDb();
  const rows = await sql`
    SELECT id, google_id, email, name, avatar_url, is_admin, created_at,
           username, display_name, bio, github_username, is_verified
    FROM users WHERE LOWER(email) = LOWER(${email})
  `;
  return rows[0] || null;
}

export async function getUserById(id: number) {
  const sql = getDb();
  const rows = await sql`
    SELECT id, google_id, email, name, avatar_url, is_admin, created_at,
           username, display_name, bio, github_username, is_verified
    FROM users WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function getAllUsers(limit = 100, offset = 0) {
  // Explicit column list — avoids dragging avatar_data (BYTEA, can be tens
  // of KB per row for users with uploaded avatars) into every admin-list
  // response. NextResponse JSON-serializes a Buffer as {type, data:[...]}
  // which is ~3× the byte size of the original buffer; on /admin/users
  // with multiple avatared users this dominated response time.
  // avatar_url + the /api/exchange/avatar/:id endpoint already render
  // images correctly — avatar_data is only needed by that endpoint.
  const sql = getDb();
  return sql`
    SELECT
      u.id, u.google_id, u.email, u.name, u.avatar_url, u.is_admin,
      u.created_at, u.username, u.display_name, u.github_username,
      u.is_verified,
      (SELECT COUNT(*) FROM license_keys WHERE user_id = u.id) as key_count,
      (SELECT COUNT(*) FROM downloads WHERE user_id = u.id) as download_count
    FROM users u
    ORDER BY u.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function getUserCount() {
  const sql = getDb();
  const rows = await sql`SELECT COUNT(*) as count FROM users`;
  return parseInt(rows[0].count as string);
}

export async function setUserAdmin(userId: number, isAdmin: boolean) {
  const sql = getDb();
  await sql`UPDATE users SET is_admin = ${isAdmin} WHERE id = ${userId}`;
}

/**
 * Delete a user and everything that hangs off them.
 *
 * NOTHING in this schema cascades from users(id) — every reference is a plain
 * `REFERENCES users(id)`, so a bare `DELETE FROM users` throws a foreign-key
 * violation the moment the person has a single license key, download, comment
 * or listing. Child rows have to go first, in dependency order, inside one
 * transaction so a failure half-way cannot leave a half-deleted account.
 *
 * Two deliberate choices:
 *  - license_keys are DELETED, not orphaned. /api/validate-key looks the key up
 *    in license_keys alone; leaving the row behind with a NULL user_id would
 *    leave a deleted person with a working licence.
 *  - downloads and events are DETACHED (user_id -> NULL), not deleted. Both are
 *    analytics history; nulling keeps the totals honest while removing the link
 *    to the person. Both columns are nullable, so this is safe.
 */
export async function deleteUser(userId: number) {
  const sql = getDb();

  return sql.begin(async (tx) => {
    const before = await tx`
      SELECT
        (SELECT COUNT(*)::int FROM license_keys WHERE user_id = ${userId}) AS keys,
        (SELECT COUNT(*)::int FROM downloads    WHERE user_id = ${userId}) AS downloads
    `;

    // The Skills Exchange was removed on 2026-08-24 and its tables are no
    // longer created by setupDatabase(). They may still EXIST on an older
    // database (production keeps them until they are explicitly dropped), and
    // while they do, their NOT NULL user_id foreign keys still block a delete.
    // So: clean them only if they are actually there. to_regclass returns NULL
    // for a missing relation instead of raising, which a bare DELETE would.
    const [{ present }] = await tx`
      SELECT to_regclass('public.exchange_listings') IS NOT NULL AS present
    `;

    if (present) {
      // Rows this user owns on OTHER people's listings. These carry NOT NULL
      // user_id, so they must go explicitly — the listing-level cascade below
      // only reaches rows attached to listings that HE owns.
      await tx`DELETE FROM exchange_comments        WHERE user_id = ${userId}`;
      await tx`DELETE FROM exchange_reviews         WHERE user_id = ${userId}`;
      await tx`DELETE FROM exchange_request_upvotes WHERE user_id = ${userId}`;
      await tx`DELETE FROM exchange_requests        WHERE user_id = ${userId}`;
      await tx`DELETE FROM exchange_follows         WHERE follower_id = ${userId} OR followed_id = ${userId}`;
      await tx`DELETE FROM exchange_collections     WHERE user_id = ${userId}`;
      await tx`DELETE FROM exchange_stacks          WHERE user_id = ${userId}`;
      // Listings last: ON DELETE CASCADE on listing_id sweeps up versions,
      // collection/stack items, downloads, and any reviews or comments other
      // people left on them.
      await tx`DELETE FROM exchange_listings        WHERE user_id = ${userId}`;
    }

    // Keep the analytics, drop the identity.
    await tx`UPDATE downloads SET user_id = NULL WHERE user_id = ${userId}`;
    await tx`UPDATE events    SET user_id = NULL WHERE user_id = ${userId}`;

    // Revoke the licence, then remove the person.
    await tx`DELETE FROM license_keys WHERE user_id = ${userId}`;
    await tx`DELETE FROM users        WHERE id = ${userId}`;

    return {
      keysRevoked: before[0].keys as number,
      downloadsDetached: before[0].downloads as number,
    };
  });
}

// ─── SITE SETTINGS ───
// Small key/value store for runtime switches that must change WITHOUT a
// redeploy. An env var cannot do this job: Vercel only picks up a changed env
// var on the next deployment, so flipping downloads off would take minutes and
// a build. This is read per-request straight from Postgres.

export async function ensureSettingsTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      updated_by INTEGER
    )
  `;
}

export async function getSetting(key: string): Promise<string | null> {
  const sql = getDb();
  await ensureSettingsTable();
  const rows = await sql`SELECT value FROM site_settings WHERE key = ${key} LIMIT 1`;
  return (rows[0]?.value as string) ?? null;
}

export async function setSetting(key: string, value: string, userId?: number | null) {
  const sql = getDb();
  await ensureSettingsTable();
  await sql`
    INSERT INTO site_settings (key, value, updated_at, updated_by)
    VALUES (${key}, ${value}, NOW(), ${userId ?? null})
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = NOW(), updated_by = EXCLUDED.updated_by
  `;
}

/** Downloads are ON unless the switch has been explicitly set to "off". */
export async function downloadsEnabled(): Promise<boolean> {
  try {
    return (await getSetting("downloads_enabled")) !== "off";
  } catch {
    // Never let a settings-table problem be the thing that blocks downloads.
    return true;
  }
}

export async function updateUserProfile(userId: number, data: {
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}) {
  const sql = getDb();
  if (data.username !== undefined) {
    // Check uniqueness
    const existing = await sql`SELECT id FROM users WHERE username = ${data.username} AND id != ${userId}`;
    if (existing.length > 0) return { error: "Username is already taken" };
    await sql`UPDATE users SET username = ${data.username} WHERE id = ${userId}`;
  }
  if (data.display_name !== undefined) await sql`UPDATE users SET display_name = ${data.display_name} WHERE id = ${userId}`;
  if (data.bio !== undefined) await sql`UPDATE users SET bio = ${data.bio} WHERE id = ${userId}`;
  if (data.avatar_url !== undefined) await sql`UPDATE users SET avatar_url = ${data.avatar_url} WHERE id = ${userId}`;
  const updated = await sql`
    SELECT id, google_id, email, name, avatar_url, is_admin, created_at,
           username, display_name, bio, github_username, is_verified
    FROM users WHERE id = ${userId}
  `;
  return { user: updated[0] };
}

export async function getUserByUsername(username: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT id, google_id, email, name, avatar_url, is_admin, created_at,
           username, display_name, bio, github_username, is_verified
    FROM users WHERE username = ${username}
  `;
  return rows[0] || null;
}

// ─── LICENSE KEYS ───
export async function createLicenseKey(userId: number, key: string, tier = "free") {
  const sql = getDb();
  const result = await sql`
    INSERT INTO license_keys (user_id, key, tier)
    VALUES (${userId}, ${key}, ${tier})
    RETURNING *
  `;
  return result[0];
}

export async function getKeyByUserId(userId: number) {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM license_keys WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1
  `;
  return rows[0] || null;
}

export async function getKeyByString(key: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT id, user_id, key, tier, status FROM license_keys WHERE key = ${key} LIMIT 1
  `;
  return rows[0] || null;
}

export async function getAllKeys(limit = 100, offset = 0) {
  const sql = getDb();
  // ue = the newest auto-update ping for this key (POST /api/update-installed,
  // sent by MakoBot Build 103+). Its to_version is what the user is actually
  // running now — downloads only record website installer pulls, which go
  // stale the moment the app self-updates from GitHub.
  return sql`
    SELECT
      lk.*,
      u.email,
      u.name,
      ld.version AS last_download_version,
      ld.created_at AS last_download_at,
      ue.to_version AS running_version,
      ue.created_at AS running_version_at,
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
    LEFT JOIN LATERAL (
      SELECT to_version, created_at
      FROM update_events
      WHERE license_key = lk.key AND to_version IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1
    ) ue ON TRUE
    ORDER BY lk.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function getDownloadsByKey(keyId: number) {
  const sql = getDb();
  return sql`
    SELECT d.id, d.version, d.ip, d.user_agent, d.created_at
    FROM downloads d
    JOIN license_keys lk ON lk.user_id = d.user_id
    WHERE lk.id = ${keyId}
    ORDER BY d.created_at DESC
  `;
}

export async function getKeyCount() {
  const sql = getDb();
  const rows = await sql`SELECT COUNT(*) as count FROM license_keys`;
  return parseInt(rows[0].count as string);
}

export async function getActiveKeyCount() {
  const sql = getDb();
  const rows = await sql`SELECT COUNT(*) as count FROM license_keys WHERE status = 'active'`;
  return parseInt(rows[0].count as string);
}

export async function updateKeyStatus(keyId: number, status: string) {
  const sql = getDb();
  await sql`UPDATE license_keys SET status = ${status} WHERE id = ${keyId}`;
}

export async function updateKeyTier(keyId: number, tier: string) {
  const sql = getDb();
  await sql`UPDATE license_keys SET tier = ${tier} WHERE id = ${keyId}`;
}

// ─── DOWNLOADS ───
export async function trackDownload(userId: number, ip: string, userAgent: string, version = "2.0.0") {
  const sql = getDb();
  await sql`
    INSERT INTO downloads (user_id, version, ip, user_agent)
    VALUES (${userId}, ${version}, ${ip}, ${userAgent})
  `;
}

export async function getDownloadCount() {
  const sql = getDb();
  const rows = await sql`SELECT COUNT(*) as count FROM downloads`;
  return parseInt(rows[0].count as string);
}

// Distinct people who have downloaded at least once — the correct numerator
// for a signup→download conversion rate. getDownloadCount() counts EVENTS
// (re-downloads included), which once produced a 766.7% "conversion rate".
export async function getUniqueDownloaders() {
  const sql = getDb();
  const rows = await sql`SELECT COUNT(DISTINCT user_id) as count FROM downloads`;
  return parseInt(rows[0].count as string);
}

export async function getRecentDownloads(limit = 50) {
  const sql = getDb();
  return sql`
    SELECT d.*, u.email, u.name
    FROM downloads d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
    LIMIT ${limit}
  `;
}

export async function getDownloadsPerDay(days = 30) {
  const sql = getDb();
  return sql`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM downloads
    WHERE created_at > ${daysAgo(days)}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
}

// ─── PAGE VIEWS ───

// Human-traffic filter. The page-view beacon (/api/analytics) is an
// unauthenticated public POST, so page_views collects non-human rows. Two
// proven polluters (July 2026 forensics): MakoPulse's BrowserCheck uptime
// monitor loading "/" every ~3 minutes (90% of all rows that month), and a
// referrer-spam spray — 1,229 IPs each hitting "/" once with the identical
// frozen Linux-Chrome UA and a fake google.com referrer. Tool/monitor UAs are
// also skipped at write time in app/api/analytics; the spray looks human
// per-row, so its rows stay in the table and are excluded at read time by
// signature (frozen Linux-Chrome UA AND google referrer). Known collateral:
// a real Linux desktop Chrome visitor arriving from Google search is not
// counted; direct/bookmark Linux visits still are.
export const BOT_UA_RX =
  "(bot|crawl|spider|slurp|makopulse|monitor|uptime|probe|scan|headless|python|curl|wget|httpx|go-http|node-fetch|axios|scrapy|phantomjs|selenium|playwright|puppeteer|dataprovider|facebookexternalhit|zgrab|censys|nuclei|okhttp|libwww|mozilla/5\\.0\\()";
const SPRAY_UA_RX =
  "^Mozilla/5\\.0 \\(X11; Linux x86_64\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/[0-9.]+ Safari/537\\.36$";
const SPRAY_REF_RX = "^https?://(www\\.)?google\\.";

export async function trackPageView(path: string, referrer: string | null, userAgent: string, ip: string) {
  const sql = getDb();
  await sql`
    INSERT INTO page_views (path, referrer, user_agent, ip)
    VALUES (${path}, ${referrer}, ${userAgent}, ${ip})
  `;
}

export async function getPageViewCount(days = 30) {
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(*) as count FROM page_views
    WHERE created_at > ${daysAgo(days)}
    AND user_agent !~* ${BOT_UA_RX}
    AND NOT (user_agent ~ ${SPRAY_UA_RX} AND COALESCE(referrer, '') ~* ${SPRAY_REF_RX})
  `;
  return parseInt(rows[0].count as string);
}

export async function getPageViewsPerDay(days = 30) {
  const sql = getDb();
  return sql`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM page_views
    WHERE created_at > ${daysAgo(days)}
    AND user_agent !~* ${BOT_UA_RX}
    AND NOT (user_agent ~ ${SPRAY_UA_RX} AND COALESCE(referrer, '') ~* ${SPRAY_REF_RX})
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
}

export async function getTopPages(days = 30, limit = 20) {
  const sql = getDb();
  return sql`
    SELECT path, COUNT(*) as count
    FROM page_views
    WHERE created_at > ${daysAgo(days)}
    AND user_agent !~* ${BOT_UA_RX}
    AND NOT (user_agent ~ ${SPRAY_UA_RX} AND COALESCE(referrer, '') ~* ${SPRAY_REF_RX})
    GROUP BY path
    ORDER BY count DESC
    LIMIT ${limit}
  `;
}

export async function getTopReferrers(days = 30, limit = 20) {
  const sql = getDb();
  return sql`
    SELECT referrer, COUNT(*) as count
    FROM page_views
    WHERE created_at > ${daysAgo(days)}
    AND referrer IS NOT NULL AND referrer != ''
    AND user_agent !~* ${BOT_UA_RX}
    AND NOT (user_agent ~ ${SPRAY_UA_RX} AND COALESCE(referrer, '') ~* ${SPRAY_REF_RX})
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT ${limit}
  `;
}

// Outside referrals — same data as getTopReferrers but with the URL parsed
// down to a hostname, internal makobot.com / localhost referrals stripped,
// and a "Direct (no referrer)" bucket for visits with no Referer header
// (typed URL, bookmark, or AI/messaging app that doesn't pass referrer).
export async function getOutsideReferrals(days = 30, limit = 25) {
  const sql = getDb();

  // External hostnames only — Postgres extracts the host from the URL via
  // substring()-with-regex, then we group by hostname.
  const hosts = await sql`
    SELECT
      LOWER(substring(referrer from '^[a-zA-Z]+://([^/?#]+)')) AS hostname,
      COUNT(*) AS count
    FROM page_views
    WHERE created_at > ${daysAgo(days)}
      AND referrer IS NOT NULL
      AND referrer != ''
      AND referrer NOT ILIKE '%makobot.com%'
      AND referrer NOT ILIKE '%localhost%'
      AND referrer NOT ILIKE '%127.0.0.1%'
      AND user_agent !~* ${BOT_UA_RX}
      AND NOT (user_agent ~ ${SPRAY_UA_RX} AND COALESCE(referrer, '') ~* ${SPRAY_REF_RX})
    GROUP BY hostname
    HAVING LOWER(substring(referrer from '^[a-zA-Z]+://([^/?#]+)')) IS NOT NULL
    ORDER BY count DESC
    LIMIT ${limit}
  `;

  // Direct visits (no referrer) — bookmark, typed URL, or privacy-stripped.
  const direct = await sql`
    SELECT COUNT(*) AS count
    FROM page_views
    WHERE created_at > ${daysAgo(days)}
      AND (referrer IS NULL OR referrer = '')
      AND user_agent !~* ${BOT_UA_RX}
  `;

  return {
    external: hosts as unknown as Array<{ hostname: string; count: number | string }>,
    directCount: parseInt(direct[0].count as string) || 0,
  };
}

export async function getUniqueVisitors(days = 30) {
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(DISTINCT ip) as count FROM page_views
    WHERE created_at > ${daysAgo(days)}
    AND user_agent !~* ${BOT_UA_RX}
    AND NOT (user_agent ~ ${SPRAY_UA_RX} AND COALESCE(referrer, '') ~* ${SPRAY_REF_RX})
  `;
  return parseInt(rows[0].count as string);
}

// ─── APP VERSIONS / KILL-SWITCH ───
//
// Per-build status flag controlling what the desktop app does on startup.
// MakoBot Build 103+ polls /api/app-status?version=X every hour. The server
// looks up that version's status here and tells the client to keep going,
// show a soft "please update" banner, or hard-block until the user updates.
// Used to disable a bad build remotely without revoking signatures.

export async function ensureAppVersionsTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS app_versions (
      version VARCHAR(50) PRIMARY KEY,
      build_number INTEGER NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'ok',
      message TEXT,
      released_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  // Constraint on status — Postgres won't enforce enum-like values otherwise.
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_versions_status_chk') THEN
        ALTER TABLE app_versions ADD CONSTRAINT app_versions_status_chk
          CHECK (status IN ('ok', 'deprecated', 'blocked'));
      END IF;
    END $$
  `;
}

export async function getAppVersionStatus(version: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT version, build_number, status, message, released_at, updated_at
    FROM app_versions WHERE version = ${version}
  `;
  return rows[0] || null;
}

export async function getLatestApprovedAppVersion() {
  const sql = getDb();
  const rows = await sql`
    SELECT version, build_number, status, released_at
    FROM app_versions
    WHERE status = 'ok'
    ORDER BY build_number DESC
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function listAppVersions() {
  const sql = getDb();
  return sql`
    SELECT version, build_number, status, message, released_at, updated_at
    FROM app_versions
    ORDER BY build_number DESC
  `;
}

export async function upsertAppVersion(opts: {
  version: string;
  buildNumber: number;
  status?: "ok" | "deprecated" | "blocked";
  message?: string | null;
}) {
  const sql = getDb();
  const status = opts.status || "ok";
  await sql`
    INSERT INTO app_versions (version, build_number, status, message, updated_at)
    VALUES (${opts.version}, ${opts.buildNumber}, ${status}, ${opts.message ?? null}, NOW())
    ON CONFLICT (version) DO UPDATE SET
      build_number = EXCLUDED.build_number,
      status = EXCLUDED.status,
      message = EXCLUDED.message,
      updated_at = NOW()
  `;
}

export async function setAppVersionStatus(
  version: string,
  status: "ok" | "deprecated" | "blocked",
  message?: string | null,
) {
  const sql = getDb();
  await sql`
    UPDATE app_versions
    SET status = ${status},
        message = ${message ?? null},
        updated_at = NOW()
    WHERE version = ${version}
  `;
}

// ─── UPDATE EVENTS / TELEMETRY ───
//
// MakoBot Build 103+ pings POST /api/update-installed right before launching
// the auto-update installer. Lets the admin see who upgraded from what to what.

export async function ensureUpdateEventsTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS update_events (
      id SERIAL PRIMARY KEY,
      from_version VARCHAR(50),
      to_version VARCHAR(50),
      license_key VARCHAR(50),
      ip VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_update_events_created_at ON update_events (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_update_events_license_key ON update_events (license_key)`;
}

export async function recordUpdateEvent(opts: {
  fromVersion?: string | null;
  toVersion?: string | null;
  licenseKey?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO update_events (from_version, to_version, license_key, ip, user_agent)
    VALUES (${opts.fromVersion ?? null}, ${opts.toVersion ?? null}, ${opts.licenseKey ?? null}, ${opts.ip ?? null}, ${opts.userAgent ?? null})
  `;
}

export async function getRecentUpdateEvents(limit = 50) {
  const sql = getDb();
  return sql`
    SELECT id, from_version, to_version, license_key, ip, user_agent, created_at
    FROM update_events
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

// ─── EVENTS ───
export async function trackEvent(type: string, data: Record<string, unknown> | null, userId: number | null, ip: string) {
  const sql = getDb();
  await sql`
    INSERT INTO events (type, data, user_id, ip)
    VALUES (${type}, ${JSON.stringify(data)}, ${userId}, ${ip})
  `;
}

export async function getRecentEvents(limit = 50) {
  const sql = getDb();
  return sql`
    SELECT e.*, u.email, u.name
    FROM events e
    LEFT JOIN users u ON e.user_id = u.id
    ORDER BY e.created_at DESC
    LIMIT ${limit}
  `;
}

// ─── AGGREGATE STATS ───
export async function getSignupsPerDay(days = 30) {
  const sql = getDb();
  return sql`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM users
    WHERE created_at > ${daysAgo(days)}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
}
