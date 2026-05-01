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
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_listings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      platforms TEXT[] NOT NULL DEFAULT '{}',
      content TEXT,
      file_name VARCHAR(255),
      file_data BYTEA,
      file_size INTEGER DEFAULT 0,
      screenshot_url TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      rejection_reason TEXT,
      download_count INTEGER DEFAULT 0,
      rating_avg NUMERIC(3,2) DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_reviews (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(listing_id, user_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_collections (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      is_public BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_collection_items (
      id SERIAL PRIMARY KEY,
      collection_id INTEGER REFERENCES exchange_collections(id) ON DELETE CASCADE NOT NULL,
      listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
      sort_order INTEGER DEFAULT 0,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(collection_id, listing_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50),
      platforms TEXT[] DEFAULT '{}',
      upvote_count INTEGER DEFAULT 0,
      status VARCHAR(20) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_request_upvotes (
      id SERIAL PRIMARY KEY,
      request_id INTEGER REFERENCES exchange_requests(id) ON DELETE CASCADE NOT NULL,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(request_id, user_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_downloads (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
      user_id INTEGER,
      ip VARCHAR(45),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_follows (
      id SERIAL PRIMARY KEY,
      follower_id INTEGER REFERENCES users(id) NOT NULL,
      followed_id INTEGER REFERENCES users(id) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(follower_id, followed_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_stacks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      is_public BOOLEAN DEFAULT TRUE,
      download_count INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_stack_items (
      id SERIAL PRIMARY KEY,
      stack_id INTEGER REFERENCES exchange_stacks(id) ON DELETE CASCADE NOT NULL,
      listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
      sort_order INTEGER DEFAULT 0,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(stack_id, listing_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_versions (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
      version VARCHAR(20) NOT NULL,
      changelog TEXT,
      content TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS exchange_comments (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      parent_id INTEGER REFERENCES exchange_comments(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  // Backfill columns added to existing tables over time (not in original schema).
  await sql`ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS source_url TEXT`;
  await sql`ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS source_author VARCHAR(200)`;
  await sql`ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS forked_from INTEGER`;
  await sql`ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0`;
  await sql`ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS current_version VARCHAR(20) DEFAULT '1.0.0'`;
  await sql`ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`;
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
    return existing[0];
  }

  // Check if user exists by email (signed in with different provider before)
  const byEmail = await sql`SELECT ${userCols} FROM users WHERE email = ${profile.email}`;
  if (byEmail.length > 0) {
    // Link this provider to existing account
    if (profile.github_username && !byEmail[0].github_username) {
      await sql`UPDATE users SET github_username = ${profile.github_username} WHERE id = ${byEmail[0].id}`;
    }
    return byEmail[0];
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

export async function getAllKeys(limit = 100, offset = 0) {
  const sql = getDb();
  return sql`
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
  `;
  return parseInt(rows[0].count as string);
}

export async function getPageViewsPerDay(days = 30) {
  const sql = getDb();
  return sql`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM page_views
    WHERE created_at > ${daysAgo(days)}
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
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT ${limit}
  `;
}

export async function getUniqueVisitors(days = 30) {
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(DISTINCT ip) as count FROM page_views
    WHERE created_at > ${daysAgo(days)}
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

// ─── EXCHANGE LISTINGS ───
export async function createExchangeListing(data: {
  user_id: number;
  title: string;
  description: string;
  category: string;
  platforms: string[];
  content?: string | null;
  file_name?: string | null;
  file_data?: Buffer | null;
  file_size?: number;
  screenshot_url?: string | null;
}) {
  const sql = getDb();
  const result = await sql`
    INSERT INTO exchange_listings (user_id, title, slug, description, category, platforms, content, file_name, file_data, file_size, screenshot_url)
    VALUES (
      ${data.user_id},
      ${data.title},
      ${"temp-slug"},
      ${data.description},
      ${data.category},
      ${data.platforms},
      ${data.content || null},
      ${data.file_name || null},
      ${data.file_data || null},
      ${data.file_size || 0},
      ${data.screenshot_url || null}
    )
    RETURNING *
  `;
  const listing = result[0];
  // Update slug with the ID for uniqueness
  const slug = generateExchangeSlug(data.title, listing.id);
  await sql`UPDATE exchange_listings SET slug = ${slug} WHERE id = ${listing.id}`;
  listing.slug = slug;
  return listing;
}

function generateExchangeSlug(title: string, id: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base || "listing"}-${id}`;
}

export async function getExchangeListings(opts: {
  category?: string;
  platform?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
  status?: string;
} = {}) {
  const sql = getDb();
  const limit = opts.limit || 24;
  const offset = opts.offset || 0;
  const status = opts.status || "approved";

  // Build dynamic query using conditional fragments
  // Neon tagged templates don't support dynamic WHERE easily,
  // so we use a flexible approach
  if (opts.search && opts.category && opts.platform) {
    const search = `%${opts.search}%`;
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
        AND el.category = ${opts.category}
        AND ${opts.platform} = ANY(el.platforms)
        AND (el.title ILIKE ${search} OR el.description ILIKE ${search})
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.search && opts.category) {
    const search = `%${opts.search}%`;
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
        AND el.category = ${opts.category}
        AND (el.title ILIKE ${search} OR el.description ILIKE ${search})
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.search && opts.platform) {
    const search = `%${opts.search}%`;
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
        AND ${opts.platform} = ANY(el.platforms)
        AND (el.title ILIKE ${search} OR el.description ILIKE ${search})
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.category && opts.platform) {
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
        AND el.category = ${opts.category}
        AND ${opts.platform} = ANY(el.platforms)
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.search) {
    const search = `%${opts.search}%`;
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
        AND (el.title ILIKE ${search} OR el.description ILIKE ${search})
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.category) {
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
        AND el.category = ${opts.category}
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.platform) {
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
        AND ${opts.platform} = ANY(el.platforms)
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${status}
      ORDER BY ${opts.sort === "top-rated" ? sql`el.rating_avg` : opts.sort === "most-downloaded" ? sql`el.download_count` : sql`el.created_at`} DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }
}

export async function getExchangeListingBySlug(slug: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username, u.email as author_email
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.slug = ${slug}
  `;
  return rows[0] || null;
}

export async function getExchangeListingsByUser(userId: number) {
  // PERF: explicit columns — never SELECT * on exchange_listings (file_data
  // is BYTEA, can be hundreds of KB per row; community-imported listings
  // pulled the user's whole library through Vercel/Postgres on every load).
  const sql = getDb();
  return sql`
    SELECT id, user_id, title, slug, description, category, platforms, content,
           file_name, file_size, status, rejection_reason, download_count,
           rating_avg, rating_count, created_at, updated_at, screenshot_url,
           source_url, source_author, forked_from, view_count, current_version, tags
    FROM exchange_listings
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
}

export async function updateExchangeListing(id: number, userId: number, data: {
  title?: string;
  description?: string;
  category?: string;
  platforms?: string[];
  content?: string | null;
}) {
  const sql = getDb();
  const listing = await sql`SELECT * FROM exchange_listings WHERE id = ${id} AND user_id = ${userId}`;
  if (listing.length === 0) return null;

  if (data.title !== undefined) await sql`UPDATE exchange_listings SET title = ${data.title}, updated_at = NOW() WHERE id = ${id}`;
  if (data.description !== undefined) await sql`UPDATE exchange_listings SET description = ${data.description}, updated_at = NOW() WHERE id = ${id}`;
  if (data.category !== undefined) await sql`UPDATE exchange_listings SET category = ${data.category}, updated_at = NOW() WHERE id = ${id}`;
  if (data.platforms !== undefined) await sql`UPDATE exchange_listings SET platforms = ${data.platforms}, updated_at = NOW() WHERE id = ${id}`;
  if (data.content !== undefined) await sql`UPDATE exchange_listings SET content = ${data.content}, updated_at = NOW() WHERE id = ${id}`;

  const updated = await sql`SELECT * FROM exchange_listings WHERE id = ${id}`;
  return updated[0];
}

export async function deleteExchangeListing(id: number, userId: number, isAdmin = false) {
  const sql = getDb();
  if (isAdmin) {
    await sql`DELETE FROM exchange_listings WHERE id = ${id}`;
  } else {
    await sql`DELETE FROM exchange_listings WHERE id = ${id} AND user_id = ${userId}`;
  }
}

export async function incrementExchangeDownload(listingId: number, userId: number | null, ip: string) {
  const sql = getDb();
  await sql`UPDATE exchange_listings SET download_count = download_count + 1 WHERE id = ${listingId}`;
  await sql`INSERT INTO exchange_downloads (listing_id, user_id, ip) VALUES (${listingId}, ${userId}, ${ip})`;
}

// ─── EXCHANGE REVIEWS ───
export async function createExchangeReview(listingId: number, userId: number, rating: number, comment: string | null) {
  const sql = getDb();
  const result = await sql`
    INSERT INTO exchange_reviews (listing_id, user_id, rating, comment)
    VALUES (${listingId}, ${userId}, ${rating}, ${comment})
    ON CONFLICT (listing_id, user_id) DO UPDATE SET rating = ${rating}, comment = ${comment}
    RETURNING *
  `;
  // Update denormalized rating on listing
  await sql`
    UPDATE exchange_listings SET
      rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM exchange_reviews WHERE listing_id = ${listingId}),
      rating_count = (SELECT COUNT(*) FROM exchange_reviews WHERE listing_id = ${listingId})
    WHERE id = ${listingId}
  `;
  return result[0];
}

export async function getExchangeReviews(listingId: number) {
  const sql = getDb();
  return sql`
    SELECT er.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar, u.username as reviewer_username
    FROM exchange_reviews er
    JOIN users u ON er.user_id = u.id
    WHERE er.listing_id = ${listingId}
    ORDER BY er.created_at DESC
  `;
}

// ─── EXCHANGE ADMIN ───
export async function getPendingExchangeListings(limit = 50, offset = 0) {
  const sql = getDb();
  return sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username, u.email as author_email
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.status = 'pending'
    ORDER BY el.created_at ASC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function moderateExchangeListing(listingId: number, action: "approve" | "reject", reason?: string) {
  const sql = getDb();
  if (action === "approve") {
    await sql`UPDATE exchange_listings SET status = 'approved', updated_at = NOW() WHERE id = ${listingId}`;
  } else {
    await sql`UPDATE exchange_listings SET status = 'rejected', rejection_reason = ${reason || null}, updated_at = NOW() WHERE id = ${listingId}`;
  }
}

export async function getAllExchangeListings(opts: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const sql = getDb();
  const limit = opts.limit || 50;
  const offset = opts.offset || 0;

  if (opts.status && opts.search) {
    const search = `%${opts.search}%`;
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username, u.email as author_email
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${opts.status}
        AND (el.title ILIKE ${search} OR el.description ILIKE ${search} OR u.email ILIKE ${search})
      ORDER BY el.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.status) {
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username, u.email as author_email
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.status = ${opts.status}
      ORDER BY el.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (opts.search) {
    const search = `%${opts.search}%`;
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username, u.email as author_email
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE (el.title ILIKE ${search} OR el.description ILIKE ${search} OR u.email ILIKE ${search})
      ORDER BY el.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    return sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username, u.email as author_email
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      ORDER BY el.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }
}

export async function adminUpdateExchangeListing(id: number, data: {
  title?: string;
  description?: string;
  category?: string;
  platforms?: string[];
  content?: string | null;
  status?: string;
  screenshot_url?: string | null;
}) {
  const sql = getDb();
  if (data.title !== undefined) await sql`UPDATE exchange_listings SET title = ${data.title}, updated_at = NOW() WHERE id = ${id}`;
  if (data.description !== undefined) await sql`UPDATE exchange_listings SET description = ${data.description}, updated_at = NOW() WHERE id = ${id}`;
  if (data.category !== undefined) await sql`UPDATE exchange_listings SET category = ${data.category}, updated_at = NOW() WHERE id = ${id}`;
  if (data.platforms !== undefined) await sql`UPDATE exchange_listings SET platforms = ${data.platforms}, updated_at = NOW() WHERE id = ${id}`;
  if (data.content !== undefined) await sql`UPDATE exchange_listings SET content = ${data.content}, updated_at = NOW() WHERE id = ${id}`;
  if (data.status !== undefined) await sql`UPDATE exchange_listings SET status = ${data.status}, updated_at = NOW() WHERE id = ${id}`;
  if (data.screenshot_url !== undefined) await sql`UPDATE exchange_listings SET screenshot_url = ${data.screenshot_url}, updated_at = NOW() WHERE id = ${id}`;
  const updated = await sql`SELECT * FROM exchange_listings WHERE id = ${id}`;
  return updated[0] || null;
}

export async function getExchangeListingById(id: number) {
  const sql = getDb();
  const rows = await sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username, u.email as author_email
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.id = ${id}
  `;
  return rows[0] || null;
}

export async function getAllExchangeReviews(limit = 50, offset = 0) {
  const sql = getDb();
  return sql`
    SELECT er.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar, u.username as reviewer_username,
           el.title as listing_title, el.slug as listing_slug
    FROM exchange_reviews er
    JOIN users u ON er.user_id = u.id
    JOIN exchange_listings el ON er.listing_id = el.id
    ORDER BY er.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function deleteExchangeReview(reviewId: number) {
  const sql = getDb();
  // Get the listing_id before deleting so we can update the rating
  const review = await sql`SELECT listing_id FROM exchange_reviews WHERE id = ${reviewId}`;
  await sql`DELETE FROM exchange_reviews WHERE id = ${reviewId}`;
  // Update denormalized rating
  if (review.length > 0) {
    const listingId = review[0].listing_id;
    await sql`
      UPDATE exchange_listings SET
        rating_avg = COALESCE((SELECT AVG(rating) FROM exchange_reviews WHERE listing_id = ${listingId}), 0),
        rating_count = (SELECT COUNT(*) FROM exchange_reviews WHERE listing_id = ${listingId})
      WHERE id = ${listingId}
    `;
  }
}

export async function getExchangeStats() {
  const sql = getDb();
  // Serial — Promise.all on this connection layer caused the admin
  // dashboard / exchange to hang in production. Single query equivalent
  // would be cleaner; for now serial works and is fast enough.
  const total = await sql`SELECT COUNT(*) as count FROM exchange_listings`;
  const pending = await sql`SELECT COUNT(*) as count FROM exchange_listings WHERE status = 'pending'`;
  const approved = await sql`SELECT COUNT(*) as count FROM exchange_listings WHERE status = 'approved'`;
  const downloads = await sql`SELECT COALESCE(SUM(download_count), 0) as count FROM exchange_listings`;
  return {
    totalListings: parseInt(total[0].count as string),
    pendingCount: parseInt(pending[0].count as string),
    approvedCount: parseInt(approved[0].count as string),
    totalDownloads: parseInt(downloads[0].count as string),
  };
}

// ─── EXCHANGE: COLLECTIONS ───
export async function createExchangeCollection(userId: number, title: string, description: string) {
  const sql = getDb();
  const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
  const result = await sql`
    INSERT INTO exchange_collections (user_id, title, slug, description)
    VALUES (${userId}, ${title}, ${"temp-" + Date.now()}, ${description})
    RETURNING *
  `;
  const id = result[0].id;
  const finalSlug = `${slug}-${id}`;
  await sql`UPDATE exchange_collections SET slug = ${finalSlug} WHERE id = ${id}`;
  result[0].slug = finalSlug;
  return result[0];
}

export async function addToCollection(collectionId: number, listingId: number) {
  const sql = getDb();
  await sql`
    INSERT INTO exchange_collection_items (collection_id, listing_id)
    VALUES (${collectionId}, ${listingId})
    ON CONFLICT (collection_id, listing_id) DO NOTHING
  `;
}

export async function removeFromCollection(collectionId: number, listingId: number) {
  const sql = getDb();
  await sql`DELETE FROM exchange_collection_items WHERE collection_id = ${collectionId} AND listing_id = ${listingId}`;
}

export async function getCollection(slug: string) {
  const sql = getDb();
  const collection = await sql`
    SELECT ec.*, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
    FROM exchange_collections ec
    JOIN users u ON ec.user_id = u.id
    WHERE ec.slug = ${slug}
  `;
  if (collection.length === 0) return null;

  const items = await sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
    FROM exchange_collection_items eci
    JOIN exchange_listings el ON eci.listing_id = el.id
    JOIN users u ON el.user_id = u.id
    WHERE eci.collection_id = ${collection[0].id} AND el.status = 'approved'
    ORDER BY eci.sort_order ASC
  `;

  return {
    ...collection[0],
    items: items.map((l: Record<string, unknown>) => { const { file_data, ...rest } = l; return rest; }),
  };
}

export async function getPublicCollections(limit = 20) {
  const sql = getDb();
  return sql`
    SELECT ec.*, u.name as author_name, u.avatar_url as author_avatar,
      (SELECT COUNT(*) FROM exchange_collection_items WHERE collection_id = ec.id) as item_count
    FROM exchange_collections ec
    JOIN users u ON ec.user_id = u.id
    WHERE ec.is_public = true
    ORDER BY ec.created_at DESC
    LIMIT ${limit}
  `;
}

export async function getUserCollections(userId: number) {
  const sql = getDb();
  return sql`
    SELECT ec.*,
      (SELECT COUNT(*) FROM exchange_collection_items WHERE collection_id = ec.id) as item_count
    FROM exchange_collections ec
    WHERE ec.user_id = ${userId}
    ORDER BY ec.created_at DESC
  `;
}

export async function deleteCollection(collectionId: number, userId: number) {
  const sql = getDb();
  await sql`DELETE FROM exchange_collections WHERE id = ${collectionId} AND user_id = ${userId}`;
}

// ─── EXCHANGE: REQUESTS ───
export async function createExchangeRequest(userId: number, data: { title: string; description: string; category?: string; platforms?: string[] }) {
  const sql = getDb();
  const result = await sql`
    INSERT INTO exchange_requests (user_id, title, description, category, platforms)
    VALUES (${userId}, ${data.title}, ${data.description}, ${data.category || null}, ${data.platforms || []})
    RETURNING *
  `;
  return result[0];
}

export async function getExchangeRequests(sort = "newest", limit = 50) {
  const sql = getDb();
  if (sort === "most-upvoted") {
    return sql`
      SELECT er.*, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
      FROM exchange_requests er
      JOIN users u ON er.user_id = u.id
      WHERE er.status = 'open'
      ORDER BY er.upvote_count DESC, er.created_at DESC
      LIMIT ${limit}
    `;
  }
  return sql`
    SELECT er.*, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
    FROM exchange_requests er
    JOIN users u ON er.user_id = u.id
    WHERE er.status = 'open'
    ORDER BY er.created_at DESC
    LIMIT ${limit}
  `;
}

export async function upvoteExchangeRequest(requestId: number, userId: number) {
  const sql = getDb();
  const existing = await sql`SELECT id FROM exchange_request_upvotes WHERE request_id = ${requestId} AND user_id = ${userId}`;
  if (existing.length > 0) {
    // Undo upvote
    await sql`DELETE FROM exchange_request_upvotes WHERE request_id = ${requestId} AND user_id = ${userId}`;
    await sql`UPDATE exchange_requests SET upvote_count = upvote_count - 1 WHERE id = ${requestId}`;
    return false;
  } else {
    await sql`INSERT INTO exchange_request_upvotes (request_id, user_id) VALUES (${requestId}, ${userId})`;
    await sql`UPDATE exchange_requests SET upvote_count = upvote_count + 1 WHERE id = ${requestId}`;
    return true;
  }
}

export async function getUserUpvotes(userId: number) {
  const sql = getDb();
  const rows = await sql`SELECT request_id FROM exchange_request_upvotes WHERE user_id = ${userId}`;
  return rows.map((r: Record<string, unknown>) => r.request_id as number);
}

export async function getRelatedListings(listingId: number, category: string, limit = 4) {
  const sql = getDb();
  return sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.status = 'approved' AND el.id != ${listingId} AND el.category = ${category}
    ORDER BY el.download_count DESC, el.rating_avg DESC
    LIMIT ${limit}
  `;
}

// ─── EXCHANGE: FOLLOW CREATORS ───
export async function followUser(followerId: number, followedId: number) {
  const sql = getDb();
  await sql`
    INSERT INTO exchange_follows (follower_id, followed_id)
    VALUES (${followerId}, ${followedId})
    ON CONFLICT (follower_id, followed_id) DO NOTHING
  `;
}

export async function unfollowUser(followerId: number, followedId: number) {
  const sql = getDb();
  await sql`DELETE FROM exchange_follows WHERE follower_id = ${followerId} AND followed_id = ${followedId}`;
}

export async function isFollowing(followerId: number, followedId: number): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`SELECT 1 FROM exchange_follows WHERE follower_id = ${followerId} AND followed_id = ${followedId}`;
  return rows.length > 0;
}

export async function getFollowerCount(userId: number): Promise<number> {
  const sql = getDb();
  const rows = await sql`SELECT COUNT(*) as count FROM exchange_follows WHERE followed_id = ${userId}`;
  return parseInt(rows[0].count as string);
}

export async function getFollowingCount(userId: number): Promise<number> {
  const sql = getDb();
  const rows = await sql`SELECT COUNT(*) as count FROM exchange_follows WHERE follower_id = ${userId}`;
  return parseInt(rows[0].count as string);
}

export async function getFollowingFeed(userId: number, limit = 30) {
  const sql = getDb();
  return sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.username as author_username, u.avatar_url as author_avatar
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.user_id IN (SELECT followed_id FROM exchange_follows WHERE follower_id = ${userId})
      AND el.status = 'approved'
    ORDER BY el.created_at DESC
    LIMIT ${limit}
  `;
}

// ─── EXCHANGE: TAGS ───
export async function updateListingTags(listingId: number, userId: number, tags: string[]) {
  const sql = getDb();
  // Normalize tags: lowercase, trim, dedupe, max 10
  const cleanTags = [...new Set(tags.map((t) => t.toLowerCase().trim()).filter((t) => t.length > 0 && t.length < 30))].slice(0, 10);
  await sql`UPDATE exchange_listings SET tags = ${cleanTags} WHERE id = ${listingId} AND user_id = ${userId}`;
}

export async function getPopularTags(limit = 30) {
  const sql = getDb();
  return sql`
    SELECT unnest(tags) as tag, COUNT(*) as count
    FROM exchange_listings
    WHERE status = 'approved' AND tags IS NOT NULL
    GROUP BY tag
    ORDER BY count DESC
    LIMIT ${limit}
  `;
}

export async function getListingsByTag(tag: string, limit = 30) {
  const sql = getDb();
  return sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.username as author_username, u.avatar_url as author_avatar
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.status = 'approved' AND ${tag} = ANY(el.tags)
    ORDER BY el.download_count DESC, el.created_at DESC
    LIMIT ${limit}
  `;
}

// ─── EXCHANGE: SKILL STACKS ───
export async function createStack(userId: number, title: string, description: string) {
  const sql = getDb();
  const slugBase = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
  const result = await sql`
    INSERT INTO exchange_stacks (user_id, title, slug, description)
    VALUES (${userId}, ${title}, ${"temp-" + Date.now()}, ${description})
    RETURNING *
  `;
  const id = result[0].id;
  const finalSlug = `${slugBase}-${id}`;
  await sql`UPDATE exchange_stacks SET slug = ${finalSlug} WHERE id = ${id}`;
  result[0].slug = finalSlug;
  return result[0];
}

export async function getStack(slug: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT es.*, u.username as author_username, u.display_name as author_display, u.avatar_url as author_avatar, u.is_verified
    FROM exchange_stacks es
    JOIN users u ON es.user_id = u.id
    WHERE es.slug = ${slug} AND es.is_public = true
  `;
  if (rows.length === 0) return null;

  const items = await sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.username as author_username, u.avatar_url as author_avatar
    FROM exchange_stack_items esi
    JOIN exchange_listings el ON esi.listing_id = el.id
    JOIN users u ON el.user_id = u.id
    WHERE esi.stack_id = ${rows[0].id} AND el.status = 'approved'
    ORDER BY esi.sort_order ASC, esi.added_at ASC
  `;

  return {
    ...rows[0],
    items: items.map((i: Record<string, unknown>) => { const { file_data, author_name, author_email, ...rest } = i; return rest; }),
  };
}

export async function addToStack(stackId: number, listingId: number, userId: number) {
  const sql = getDb();
  // Verify ownership
  const stack = await sql`SELECT user_id FROM exchange_stacks WHERE id = ${stackId}`;
  if (stack.length === 0 || stack[0].user_id !== userId) return { error: "Not your stack" };
  await sql`
    INSERT INTO exchange_stack_items (stack_id, listing_id)
    VALUES (${stackId}, ${listingId})
    ON CONFLICT (stack_id, listing_id) DO NOTHING
  `;
  return { ok: true };
}

export async function removeFromStack(stackId: number, listingId: number, userId: number) {
  const sql = getDb();
  const stack = await sql`SELECT user_id FROM exchange_stacks WHERE id = ${stackId}`;
  if (stack.length === 0 || stack[0].user_id !== userId) return { error: "Not your stack" };
  await sql`DELETE FROM exchange_stack_items WHERE stack_id = ${stackId} AND listing_id = ${listingId}`;
  return { ok: true };
}

export async function getPublicStacks(limit = 30) {
  const sql = getDb();
  return sql`
    SELECT es.*, u.username as author_username, u.avatar_url as author_avatar,
      (SELECT COUNT(*) FROM exchange_stack_items WHERE stack_id = es.id) as item_count
    FROM exchange_stacks es
    JOIN users u ON es.user_id = u.id
    WHERE es.is_public = true
    ORDER BY es.download_count DESC, es.created_at DESC
    LIMIT ${limit}
  `;
}

export async function getUserStacks(userId: number) {
  const sql = getDb();
  return sql`
    SELECT es.*,
      (SELECT COUNT(*) FROM exchange_stack_items WHERE stack_id = es.id) as item_count
    FROM exchange_stacks es
    WHERE es.user_id = ${userId}
    ORDER BY es.created_at DESC
  `;
}

export async function incrementStackDownload(stackId: number) {
  const sql = getDb();
  await sql`UPDATE exchange_stacks SET download_count = download_count + 1 WHERE id = ${stackId}`;
}

export async function deleteStack(stackId: number, userId: number) {
  const sql = getDb();
  await sql`DELETE FROM exchange_stacks WHERE id = ${stackId} AND user_id = ${userId}`;
}

// ─── EXCHANGE: VERSIONS ───
export async function createExchangeVersion(listingId: number, version: string, changelog: string, content: string) {
  const sql = getDb();
  const result = await sql`
    INSERT INTO exchange_versions (listing_id, version, changelog, content)
    VALUES (${listingId}, ${version}, ${changelog}, ${content})
    RETURNING *
  `;
  await sql`UPDATE exchange_listings SET current_version = ${version}, updated_at = NOW() WHERE id = ${listingId}`;
  return result[0];
}

export async function getExchangeVersions(listingId: number) {
  const sql = getDb();
  return sql`
    SELECT * FROM exchange_versions WHERE listing_id = ${listingId} ORDER BY created_at DESC
  `;
}

// ─── EXCHANGE: COMMENTS ───
export async function createExchangeComment(listingId: number, userId: number, body: string, parentId?: number) {
  const sql = getDb();
  const result = await sql`
    INSERT INTO exchange_comments (listing_id, user_id, body, parent_id)
    VALUES (${listingId}, ${userId}, ${body}, ${parentId || null})
    RETURNING *
  `;
  return result[0];
}

export async function getExchangeComments(listingId: number) {
  const sql = getDb();
  return sql`
    SELECT ec.*, u.username, u.display_name, u.avatar_url, u.is_verified
    FROM exchange_comments ec
    JOIN users u ON ec.user_id = u.id
    WHERE ec.listing_id = ${listingId}
    ORDER BY ec.created_at ASC
  `;
}

export async function deleteExchangeComment(commentId: number, userId: number, isAdmin: boolean) {
  const sql = getDb();
  if (isAdmin) {
    await sql`DELETE FROM exchange_comments WHERE id = ${commentId}`;
  } else {
    await sql`DELETE FROM exchange_comments WHERE id = ${commentId} AND user_id = ${userId}`;
  }
}

// ─── EXCHANGE: CREATOR ANALYTICS ───
export async function incrementExchangeView(listingId: number) {
  const sql = getDb();
  await sql`UPDATE exchange_listings SET view_count = view_count + 1 WHERE id = ${listingId}`;
}

export async function getCreatorAnalytics(userId: number) {
  const sql = getDb();
  // Serial — Promise.all hangs in prod on this conn pool.
  const totals = await sql`
    SELECT
      COUNT(*) as total_listings,
      COALESCE(SUM(view_count), 0) as total_views,
      COALESCE(SUM(download_count), 0) as total_downloads,
      COALESCE(AVG(CASE WHEN rating_count > 0 THEN rating_avg ELSE NULL END), 0) as avg_rating,
      COALESCE(SUM(rating_count), 0) as total_reviews
    FROM exchange_listings
    WHERE user_id = ${userId} AND status = 'approved'
  `;
  const topListings = await sql`
    SELECT id, title, slug, view_count, download_count, rating_avg, rating_count
    FROM exchange_listings
    WHERE user_id = ${userId} AND status = 'approved'
    ORDER BY download_count DESC
    LIMIT 10
  `;
  const monthlyDownloads = await sql`
    SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count
    FROM exchange_downloads
    WHERE listing_id IN (SELECT id FROM exchange_listings WHERE user_id = ${userId})
    AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date ASC
  `;

  return {
    totals: {
      listings: parseInt(totals[0].total_listings as string),
      views: parseInt(totals[0].total_views as string),
      downloads: parseInt(totals[0].total_downloads as string),
      avgRating: parseFloat(totals[0].avg_rating as string),
      reviews: parseInt(totals[0].total_reviews as string),
    },
    topListings,
    downloadsPerDay: monthlyDownloads,
  };
}

// ─── EXCHANGE: REMIX TREES ───
export async function getListingRemixTree(listingId: number): Promise<{ original: Record<string, unknown> | null; forks: Record<string, unknown>[] }> {
  const sql = getDb();
  // Get the listing
  const current = await sql`SELECT * FROM exchange_listings WHERE id = ${listingId}`;
  if (current.length === 0) return { original: null, forks: [] };

  // Get the original (if this is a fork)
  let original = null;
  if (current[0].forked_from) {
    const orig = await sql`
      SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.username as author_username, u.display_name as author_display
      FROM exchange_listings el
      JOIN users u ON el.user_id = u.id
      WHERE el.id = ${current[0].forked_from}
    `;
    if (orig.length > 0) {
      const { file_data, author_name, author_email, ...rest } = orig[0];
      original = rest;
    }
  }

  // Get forks of this listing
  const forks = await sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.username as author_username, u.display_name as author_display
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.forked_from = ${listingId} AND el.status = 'approved'
    ORDER BY el.created_at DESC
  `;
  const cleanForks = forks.map(({ file_data, author_name, author_email, ...rest }) => rest);

  return { original, forks: cleanForks };
}

// ─── EXCHANGE: SEMANTIC SEARCH (simple text-based for now) ───
export async function semanticSearchListings(query: string, limit = 20) {
  const sql = getDb();
  // Use PostgreSQL full-text search with ranking
  const searchQuery = query.trim().split(/\s+/).join(" | ");
  return sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.username as author_username, u.avatar_url as author_avatar,
      ts_rank(
        to_tsvector('english', el.title || ' ' || el.description || ' ' || COALESCE(el.content, '')),
        to_tsquery('english', ${searchQuery})
      ) as rank
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.status = 'approved'
      AND to_tsvector('english', el.title || ' ' || el.description || ' ' || COALESCE(el.content, ''))
          @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT ${limit}
  `;
}

// ─── EXCHANGE: VERIFIED USER ───
export async function setUserVerified(userId: number, verified: boolean) {
  const sql = getDb();
  await sql`UPDATE users SET is_verified = ${verified} WHERE id = ${userId}`;
}

// ─── EXCHANGE: TRENDING ───
export async function getTrendingExchangeListings(limit = 6) {
  const sql = getDb();
  // Trending = combination of recent downloads + recent rating activity, weighted toward recency
  return sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar,
      (el.download_count * 0.3 + el.rating_count * 2 + el.rating_avg * 1.5 +
       CASE WHEN el.created_at > NOW() - INTERVAL '7 days' THEN 10 ELSE 0 END +
       CASE WHEN el.created_at > NOW() - INTERVAL '30 days' THEN 5 ELSE 0 END
      ) as trending_score
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.status = 'approved'
    ORDER BY trending_score DESC, el.created_at DESC
    LIMIT ${limit}
  `;
}

export async function getFeaturedExchangeListings(limit = 3) {
  const sql = getDb();
  // Featured = highest rated with minimum 1 review, or newest with most downloads
  return sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.status = 'approved'
    ORDER BY el.rating_avg DESC, el.download_count DESC
    LIMIT ${limit}
  `;
}

// ─── EXCHANGE: USER PROFILES ───
export async function getExchangeUserProfile(userId: number) {
  const sql = getDb();
  const user = await sql`SELECT id, name, username, display_name, avatar_url, bio, created_at FROM users WHERE id = ${userId}`;
  if (user.length === 0) return null;

  // Serial — Promise.all hangs in prod on this conn pool.
  const listings = await sql`
    SELECT el.id, el.user_id, el.title, el.slug, el.description, el.category, el.platforms, el.content, el.file_name, el.file_size, el.status, el.rejection_reason, el.download_count, el.rating_avg, el.rating_count, el.created_at, el.updated_at, el.screenshot_url, el.source_url, el.source_author, el.forked_from, el.view_count, el.current_version, el.tags, u.name as author_name, u.avatar_url as author_avatar, u.username as author_username
    FROM exchange_listings el
    JOIN users u ON el.user_id = u.id
    WHERE el.user_id = ${userId} AND el.status = 'approved'
    ORDER BY el.created_at DESC
  `;
  const stats = await sql`
    SELECT
      COUNT(*) as total_listings,
      COALESCE(SUM(download_count), 0) as total_downloads,
      COALESCE(AVG(CASE WHEN rating_count > 0 THEN rating_avg ELSE NULL END), 0) as avg_rating,
      COALESCE(SUM(rating_count), 0) as total_reviews
    FROM exchange_listings
    WHERE user_id = ${userId} AND status = 'approved'
  `;

  return {
    user: user[0],
    listings: listings.map((l: Record<string, unknown>) => { const { file_data, ...rest } = l; return rest; }),
    stats: {
      totalListings: parseInt(stats[0].total_listings as string),
      totalDownloads: parseInt(stats[0].total_downloads as string),
      avgRating: parseFloat(stats[0].avg_rating as string),
      totalReviews: parseInt(stats[0].total_reviews as string),
    },
  };
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
