import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

// One-shot DB optimization — adds indexes the post-Neon→Supabase migration
// didn't carry over. Idempotent (CREATE INDEX IF NOT EXISTS), admin-gated.
//
// The dashboard times out without these indexes because the analytics
// queries do `WHERE created_at > ...` against page_views / events / downloads
// — a sequential scan of every row in those tables. With proper indexes
// these queries return in milliseconds.
//
// Hit GET /api/admin/optimize-db once and the dashboard will be fast forever.
export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const created: string[] = [];
  const errors: { name: string; error: string }[] = [];

  // Each index targets a known-slow query in the admin dashboard or exchange.
  // BRIN would be even better for time-series but BTREE is universally
  // available + Supabase's autovacuum keeps them lean.
  const indexes = [
    { name: "idx_page_views_created_at", sql: `CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC)` },
    { name: "idx_page_views_path", sql: `CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path)` },
    { name: "idx_page_views_referrer", sql: `CREATE INDEX IF NOT EXISTS idx_page_views_referrer ON page_views (referrer) WHERE referrer IS NOT NULL` },
    { name: "idx_page_views_ip", sql: `CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views (ip)` },
    { name: "idx_events_created_at", sql: `CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC)` },
    { name: "idx_events_type", sql: `CREATE INDEX IF NOT EXISTS idx_events_type ON events (type)` },
    { name: "idx_downloads_created_at", sql: `CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads (created_at DESC)` },
    { name: "idx_downloads_user_id", sql: `CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads (user_id)` },
    { name: "idx_license_keys_user_id", sql: `CREATE INDEX IF NOT EXISTS idx_license_keys_user_id ON license_keys (user_id)` },
    { name: "idx_license_keys_status", sql: `CREATE INDEX IF NOT EXISTS idx_license_keys_status ON license_keys (status)` },
    { name: "idx_exchange_listings_status", sql: `CREATE INDEX IF NOT EXISTS idx_exchange_listings_status ON exchange_listings (status)` },
    { name: "idx_exchange_listings_user_id", sql: `CREATE INDEX IF NOT EXISTS idx_exchange_listings_user_id ON exchange_listings (user_id)` },
    { name: "idx_exchange_listings_created_at", sql: `CREATE INDEX IF NOT EXISTS idx_exchange_listings_created_at ON exchange_listings (created_at DESC)` },
    { name: "idx_exchange_listings_category", sql: `CREATE INDEX IF NOT EXISTS idx_exchange_listings_category ON exchange_listings (category)` },
    { name: "idx_users_email_lower", sql: `CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email))` },
    { name: "idx_users_created_at", sql: `CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC)` },
  ];

  for (const idx of indexes) {
    try {
      await sql.unsafe(idx.sql);
      created.push(idx.name);
    } catch (err) {
      errors.push({ name: idx.name, error: (err as Error).message });
    }
  }

  // ANALYZE so the planner picks up the new indexes immediately.
  const analyzeTables = ["page_views", "events", "downloads", "license_keys", "exchange_listings", "users"];
  for (const t of analyzeTables) {
    try { await sql.unsafe(`ANALYZE "${t}"`); } catch { /* skip */ }
  }

  return NextResponse.json({
    ranAt: new Date().toISOString(),
    indexesCreatedOrAlreadyExisted: created,
    errors,
    nextStep: "Reload /admin — dashboard should be fast now.",
  });
}
