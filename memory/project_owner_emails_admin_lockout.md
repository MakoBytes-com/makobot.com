---
name: project_owner_emails_admin_lockout
description: makobot.com /admin is gated on users.is_admin from the DB; OWNER_EMAILS is the re-promote net, and its Mako half is inert because that address has never signed in.
metadata:
  node_type: memory
  type: project
  originSessionId: 14bab693-7138-4bdd-9d93-43d967594269
  modified: 2026-09-25T01:46:50.270Z
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
- **Blocked on:** Google's one-time SMS code for `admin@makobytes.com`
  (needs Russell's phone). Check MakoBot memory for the makobytes tab
  confirming it signs in.
- **Step 2, once it signs in:** sign in to makobot.com with Google as
  `admin@makobytes.com` (Playwright), confirm a `users` row with
  `is_admin = TRUE`, then PATCH `jaalrsdlOon7RamW` to just
  `admin@makobytes.com`, redeploy, verify live. The Gmail row keeps its
  DB `is_admin`, so Russell keeps normal access.

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
