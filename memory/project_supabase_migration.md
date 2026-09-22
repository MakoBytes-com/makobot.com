---
name: Supabase Migration (Vercel breach response)
description: Neon → Supabase cutover and post-Vercel-breach secret rotation completed 2026-04-29. Project ref, connection details, what changed in code.
type: project
originSessionId: b168ba1e-6ccc-46c8-b9fa-210af5e0a090
---
# makobot.com — Supabase migration + secret rotation (2026-04-29)

## Context — the Vercel April 2026 security incident

Russell's Vercel dashboard flagged 7 env vars on `mako-studi/makobot.com`
as "Needs Attention" (i.e., they were stored without the **Sensitive**
flag at the time of the incident, so they're potentially exposed):
DATABASE_URL, AUTH_SECRET, SETUP_KEY, LICENSE_KEY_SECRET,
GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_SECRET, GITHUB_TOKEN.

Russell asked to migrate off Neon entirely (he pays for Supabase, not
Neon) and rotate everything in one pass.

## Where the database lives now

- **Supabase project ref:** `ddfkssvuyeyrmjstvljk`
- **Project name:** `makobot`
- **Organization:** `Mako Logics` (slug `grfmpihjnzfspngyndzo`, Pro plan)
- **Region:** `us-east-1` (matches Vercel iad1)
- **Postgres version:** 17.6.x

## Connection strings — when to use which

- **Transaction-mode pooler — port 6543** — used at runtime by the
  Next.js app via `DATABASE_URL`. pgBouncer in transaction mode; needs
  `prepare: false` on the postgres-js client.
  Host: `aws-1-us-east-1.pooler.supabase.com`
- **Session-mode pooler — port 5432, same host** — use for
  pg_dump/long-running admin scripts. (No backup workflow yet on
  makobot.com — would go here if added.)
- **Direct connection — port 5432, host `db.<ref>.supabase.co`** — IPv6
  only on free/pro tier. Useful for local one-shots; **do NOT use from
  GitHub Actions** (runners are IPv4-only).

## Stored secret locations (chmod 600 on Russell's machine)

- `~/.aimemory/makobot-supabase-ref.txt` — project ref
- `~/.aimemory/makobot-supabase-db-pw.txt` — DB password (48-char hex)
- `~/.aimemory/makobot-vercel-DATABASE_URL.txt` — full pooled connection string
- `~/.aimemory/makobot-vercel-AUTH_SECRET.txt`
- `~/.aimemory/makobot-vercel-SETUP_KEY.txt`
- `~/.aimemory/makobot-vercel-LICENSE_KEY_SECRET.txt`
- `~/.aimemory/makobot-vercel-GOOGLE_CLIENT_SECRET.txt`
- `~/.aimemory/makobot-vercel-GITHUB_CLIENT_SECRET.txt`
- `~/.aimemory/makobot-vercel-GITHUB_TOKEN.txt`

Rotate everything when convenient if any of these files are ever
suspected of leaking.

## Code changes (commit `46739d4`)

- Driver swap: `@neondatabase/serverless` → `postgres` (postgres-js).
  postgres-js works against any Postgres (Neon, Supabase, RDS, etc.),
  unlike the Neon HTTP driver which is Neon-only.
- `lib/db.ts`: module-level cached client via `getDb()`. Uses
  `{ ssl: "require", prepare: false, max: 1 }` for serverless +
  pgBouncer transaction-mode compatibility.
- 11 other files (all the API routes that previously did
  `const sql = neon(process.env.DATABASE_URL!)`) now `import { getDb }
  from "@/lib/db"` and call `getDb()` — single shared connection pool.
- Removed `@neondatabase/serverless` dependency.
- 1 typecheck fix in `app/api/admin/exchange/seed/route.ts` — postgres-js
  is stricter than Neon about `string | null | undefined` interpolation;
  added an early return when `session.user.email` is missing.

## Migration script (one-shot, kept for reference)

`scripts/migrate-to-supabase.mjs` — pulls schema from Neon's
information_schema + pg_constraint + pg_indexes, recreates on Supabase,
copies data, defers FK constraints until after data copy, resets
sequences. Used once, lives in repo as historical/reproduction reference.

## What was migrated

- 17 tables, full schema + data. Includes tables NOT defined in
  `setupDatabase()` (drift between code and live DB): `exchange_follows`,
  `exchange_stacks`, `exchange_stack_items`, `exchange_versions`,
  `exchange_comments`. Also several columns added in-place over time:
  `tags`, `view_count`, `forked_from`, `current_version`, `is_verified`,
  `avatar_data`, `avatar_type`.
- Row counts at cutover: 3 users, 2 license_keys, 22 downloads, 22
  events, 588 page_views, 775 exchange_listings.

## All 7 secrets rotated and re-added as Sensitive on Vercel

DATABASE_URL (now Supabase URL), AUTH_SECRET, SETUP_KEY,
LICENSE_KEY_SECRET, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_SECRET,
GITHUB_TOKEN. All marked Sensitive — `vercel env pull` returns them
empty by design (they're unreadable post-creation).

## Cleanup completed by Russell

- Old Google OAuth client secret on `makobytes` Cloud project →
  Disabled, then deleted after 24h.
- Old GitHub OAuth client secret on the MakoBot OAuth app → deleted.
- Old classic GitHub PATs → deleted.
- **Neon project deleted entirely** — closes the breach because the
  leaked Neon connection string now points at a database that no longer
  exists.

## RLS posture

**Configured 2026-04-29 same day.** All 17 public-schema tables have
Row Level Security enabled with no policies (matches the
makologics-com posture).

- App connects as `postgres` superuser via DATABASE_URL → bypasses RLS,
  reads/writes everything normally. No app code change needed.
- Supabase auto-exposes public-schema tables via PostgREST
  (`/rest/v1/*`) accessible with the project's anon key. With RLS
  enabled and zero policies, the `anon` and `authenticated` roles see
  zero rows. Verified post-RLS: `curl -H "apikey: $ANON"
  /rest/v1/users` returns `[]`, same for `/rest/v1/license_keys`.
- If we ever adopt Supabase Auth or the Supabase JS client for any
  feature, we'll need actual policies. Today, deny-all is correct —
  no app code path goes through PostgREST.

Hardening script: `scripts/harden-supabase.mjs` (one-shot, can re-run
to verify state).

## Critical gotchas captured this session

- pgBouncer transaction-mode (port 6543) **breaks prepared statements**
  silently. postgres-js MUST have `prepare: false` or parameterized
  queries fail in production. Local direct-connect dev masks this.
- Vercel `vercel env add NAME ENV --sensitive` reading from `echo`'d
  stdin can store the trailing newline. Caused "invalid_client" errors
  from Google's token endpoint until re-added with `printf '%s'`.
  See feedback memory: feedback_vercel_env_add_no_newline.md.
- Sensitive env vars are NOT readable via `vercel env pull` — that's
  by design. Don't use a one-char value as evidence the secret is
  missing; it just means the CLI redacted it.

## Verification post-cutover

- All 7 sensitive vars confirmed rotated to new Sensitive values.
- Live site responds HTTP 200; Google sign-in confirmed working
  end-to-end (Russell signed in fresh, his User row persisted from
  migration with admin flag intact).
- Old Neon project deleted by Russell — leaked URL now dead.
