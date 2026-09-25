---
name: project_owner_emails_admin_lockout
description: makobot.com /admin is gated on users.is_admin from the DB; OWNER_EMAILS (the re-promote net) is exactly admin@makobytes.com since 2026-09-25, Gmail removed, proven live.
metadata:
  node_type: memory
  type: project
  originSessionId: 14bab693-7138-4bdd-9d93-43d967594269
  modified: 2026-09-25T02:19:42.273Z
---

`/admin` on makobot.com renders "Admin Access Required" whenever
`session.user.isAdmin` is falsy. That flag is **re-read from Postgres on
every session refresh** in `lib/auth.ts`, so admin access depends on the
`users.is_admin` column, not on the session alone.

`lib/auth.ts` has a deliberate safety net: any address listed in the
`OWNER_EMAILS` env var gets `is_admin = TRUE` re-asserted on every
successful OAuth sign-in, specifically "so a bad migration, accidental
UPDATE, or someone clearing the flag in the DB can't lock the owner out".

## Verified state, 2026-09-21

- Production `OWNER_EMAILS` = `russell.sailors@gmail.com,rsailors@makologics.com`.
  **Production only** — not set in Preview or Development. Armed: the live
  deployment postdates the variable.
- `public.users` holds exactly **two** rows: id 1
  `russell.sailors@gmail.com` (`google_id` `103781620149082181457`,
  username `bear`, `is_admin = TRUE`, created 2026-04-11) and id 2
  `community@makobot.com` (system placeholder, `is_admin = FALSE`).
- **`rsailors@makologics.com` has never signed in — there is no row for
  it.** The promote statement is
  `UPDATE users SET is_admin = TRUE WHERE LOWER(email) = ...`, which
  matches zero rows when the user does not exist. So the Mako half of
  `OWNER_EMAILS` is **inert**: it has never done anything and cannot until
  that address completes an OAuth sign-in.
- makobot.com offers **Google and GitHub only** as providers.
  makologics.com runs **Microsoft 365 behind AppRiver** (MX
  `*.arsmtp.com`, SPF `include:spf.protection.outlook.com`, `MS=` domain
  token) — it is **not** Google Workspace, so `rsailors@makologics.com` is
  not a Google identity. No public GitHub account carries that address
  either. There is no known way for the Mako address to authenticate.

**Consequence:** removing the Gmail from `OWNER_EMAILS` would *not* revoke
admin today (that comes from `users.is_admin`, still TRUE), but it would
disarm the only working lockout insurance and leave a net pointing at an
identity that cannot sign in. Do not remove it until a Mako identity has
actually signed in once and been seen in `public.users`.

## Gmail removal in progress, 2026-09-24

Goal: get the personal Gmail out of `OWNER_EMAILS` without ever leaving the
net pointed only at identities that cannot sign in. The Mako identity is
**`admin@makobytes.com`**, a free Google Cloud Identity created by the
makobytes.com session (password: `C:\Dev\makobytes.com\.env.local`,
`GOOGLE_ADMIN_ACCOUNT_PASSWORD`). Decision: makobot.com reuses it. Do NOT
create a second Cloud Identity.

- **Step 1 DONE 2026-09-25T01:42Z.** Env entry `jaalrsdlOon7RamW` (target
  asserted exactly `["production"]`, type encrypted) PATCHed in place to
  `russell.sailors@gmail.com,rsailors@makologics.com,admin@makobytes.com`.
  Redeployed prod (`dpl_6wvED1oxRXoxMJhnjXKZjuHQTPXc`, same commit
  `11dbe6e`). Re-pulled to temp: exact value, no BOM, no CR, no ciphertext.
  Live site 200, all headers, no console errors.
- DB at that moment: id 1 Gmail `is_admin = TRUE`, id 2 community, no
  `admin@makobytes.com` row.
- (Was blocked on Google's SMS challenge; the makobytes tab cleared it
  with Steven Thurmond's phone later that night.)

## DONE 2026-09-25T02:12Z — OWNER_EMAILS is now exactly `admin@makobytes.com`

- Signed in to LIVE makobot.com with Google as `admin@makobytes.com`
  (Playwright, no SMS prompt). That created **users id 4**,
  `admin@makobytes.com`, promoted to `is_admin = TRUE` by the OWNER_EMAILS
  net on its first sign-in. /admin Dashboard rendered.
- `jaalrsdlOon7RamW` metadata re-checked (only OWNER_EMAILS entry, type
  encrypted, target exactly `["production"]`), PATCHed in place to
  `admin@makobytes.com`. Redeployed `dpl_36vTHQQnorMYaGnvjKCdKM8Fs2mg`,
  READY. Signed out (/admin then shows "Admin Access Required"), signed
  back in as admin@makobytes.com → Dashboard. Temp re-pull: exact value, no
  BOM, no CR, no `eyJ2IjoidjIi`, no Gmail anywhere in production env.
- Users now: id 1 Gmail `is_admin = TRUE` (Russell's normal access, kept
  by the DB flag, not by OWNER_EMAILS), id 2 community, id 4
  admin@makobytes.com `is_admin = TRUE`.
- **Lockout recovery path from now on:** sign in with Google as
  admin@makobytes.com. Google may send its "verify it's you" codes for that
  account to Steven Thurmond's mobile.
- `rsailors@makologics.com` dropped from the list — it was inert (M365,
  can never do Google/GitHub OAuth).
- Local `.env.local` never held OWNER_EMAILS or the Gmail. A stale
  gitignored `.env.production` (2026-05-01 plaintext pull of prod secrets,
  never committed) was deleted.

Same session, found while checking headers: the bare domain was a Vercel
domain-level redirect, which answers before next.config and sent only
`max-age=63072000` HSTS. Moved it into `next.config.ts` `redirects()` (host
`makobot.com` → `https://www.makobot.com/:path*`, commit `6fc36ca`) and set
the Vercel domain's redirect to null, so the 308 now carries the full header
set. The Google OAuth callback lands on the apex and survives the hop
(proven by a live sign-in). Then pointed every canonical, og:url, JSON-LD
url, sitemap entry and robots Sitemap line at www (commit `fef339f`) — they
had all named the apex, i.e. a canonical that redirects. **If the apex
ever needs to become primary, re-add the redirect in the Vercel domain
settings only after removing the next.config rule, or it loops.**

`ALERT_EMAIL` = `admin@makobot.com` and `MAIL_FROM` =
`MakoBot <support@makobot.com>` — already product addresses, no personal
address anywhere else in the env.

Debugging note: **`vercel env pull` writes `DATABASE_URL=""` and blanks
every other Sensitive value** (AUTH_SECRET, DATABASE_URL, both OAuth
secrets, LICENSE_KEY_SECRET, SETUP_KEY). That is the Sensitive type, not
corruption. Pull to a **temp file**, never over `.env.local`, or you
destroy working local values. To query the DB use the pooler directly:
ref + password in `~/.aimemory/makobot-supabase-*.txt`, host
`aws-1-us-east-1.pooler.supabase.com`, port 5432, user `postgres.<ref>`.
Select explicit columns — `SELECT *` on `users` drags a ~50KB `avatar_data`
BYTEA per row.

`/api/admin/diagnostic` is itself admin-gated, so it is useless for
diagnosing a lockout. `/api/admin/setup` only creates tables.

See [[project_supabase_migration]] and [[feedback_vercel_env_add_no_newline]].
