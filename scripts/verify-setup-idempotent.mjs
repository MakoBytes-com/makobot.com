import postgres from "postgres";
const sql = postgres(process.env.SUPA_URL, { ssl: "require", max: 1, prepare: false });
const stmts = [
  `CREATE TABLE IF NOT EXISTS exchange_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) NOT NULL,
    followed_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, followed_id)
  )`,
  `CREATE TABLE IF NOT EXISTS exchange_stacks (
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
  )`,
  `CREATE TABLE IF NOT EXISTS exchange_stack_items (
    id SERIAL PRIMARY KEY,
    stack_id INTEGER REFERENCES exchange_stacks(id) ON DELETE CASCADE NOT NULL,
    listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(stack_id, listing_id)
  )`,
  `CREATE TABLE IF NOT EXISTS exchange_versions (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
    version VARCHAR(20) NOT NULL,
    changelog TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS exchange_comments (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES exchange_listings(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    parent_id INTEGER REFERENCES exchange_comments(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS source_url TEXT`,
  `ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS source_author VARCHAR(200)`,
  `ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS forked_from INTEGER`,
  `ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0`,
  `ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS current_version VARCHAR(20) DEFAULT '1.0.0'`,
  `ALTER TABLE exchange_listings ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_type VARCHAR(50)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_data BYTEA`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE`,
];
let ok = 0, fail = 0;
for (const s of stmts) {
  try { await sql.unsafe(s); console.log("  OK:  ", s.split("\n")[0].slice(0, 80)); ok++; }
  catch (e) { console.error("  FAIL:", e.message, "\n        for:", s.split("\n")[0]); fail++; }
}
console.log(`\n${ok} succeeded, ${fail} failed`);
await sql.end();
