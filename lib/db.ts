import { neon } from "@neondatabase/serverless";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
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
}

// ─── USERS ───
export async function findOrCreateUser(profile: {
  google_id: string;
  email: string;
  name: string;
  avatar_url: string;
}) {
  const sql = getDb();
  const existing = await sql`
    SELECT * FROM users WHERE google_id = ${profile.google_id}
  `;
  if (existing.length > 0) return existing[0];

  const result = await sql`
    INSERT INTO users (google_id, email, name, avatar_url)
    VALUES (${profile.google_id}, ${profile.email}, ${profile.name}, ${profile.avatar_url})
    RETURNING *
  `;
  return result[0];
}

export async function getUserByEmail(email: string) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows[0] || null;
}

export async function getUserById(id: number) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  return rows[0] || null;
}

export async function getAllUsers(limit = 100, offset = 0) {
  const sql = getDb();
  return sql`
    SELECT u.*,
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
    SELECT lk.*, u.email, u.name
    FROM license_keys lk
    JOIN users u ON lk.user_id = u.id
    ORDER BY lk.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
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
