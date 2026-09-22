# makobot.com — Memory Index

_Migrated 2026-07-25 from the old Desktop-path memory folder (project moved to
`OneDrive - Mako Logics LLC\Business\Mako Studio\...`). Old folder kept as frozen copy._

- [Session Summary](session_summary.md) — latest session state; read first on recover
- [Build Progress](build_progress.md) — running log of site milestones and publishes
- [Project Overview](project_overview.md) — what makobot.com is, stack, infra, endpoints
- [Vercel ↔ GitHub runbook](reference_vercel_github_integration.md) — diagnose and fix broken auto-deploys across any of Russell's projects
- [Cloudflare API token](reference_cloudflare_api_token.md) — persistent DNS:Edit token for makobot.com, makobytes.com, [retired project].ai, toppaws.com (also works on aipromptshive.com)
- [ThreatDown OneView API](reference_threatdown_oneview_api.md) — MSP endpoint-security API: creds in ~/.makologics, Mako account IDs, close-SA + exclusion endpoints, 2026-08-14 FP cleanup state
- [Email setup runbook](reference_email_setup_runbook.md) — how to add cPanel email on host10.makologics.com to a Cloudflare-DNS domain
- [Never use personal info](feedback_never_use_personal_info.md) — hard rule: no personal email/phone/address in product copy, FAQs, seed data, or any public-facing surface on any project. Default to `admin@<projectdomain>`.
- [Don't ask unless blocked](feedback_dont_ask_unless_blocked.md) — do the work via CLI/API; only ask Russell when I literally can't (unshared auth, purchase, judgment call).
- [Supabase migration + breach response](project_supabase_migration.md) — Neon→Supabase cutover 2026-04-29; project ref `ddfkssvuyeyrmjstvljk`, postgres-js `prepare:false`, RLS still TODO.
- [Vercel env add: printf not echo](feedback_vercel_env_add_no_newline.md) — `echo | vercel env add` stores trailing newline; use `printf '%s'`. Bit us mid-rotation.
- [Always fix, don't wait](feedback_always_fix_dont_wait.md) — fix found issues inline, don't surface as TODO. Authorization for parent task implies authorization for related fixes.
- [Bulldog-light theme tokens](feedback_light_theme_bulldog.md) — site is on a literal copy of bulldogsecurityservice.com's palette as of 2026-05-01. Navy `#0061aa`, white body, cream cards, `#eef2f7` alternating sections. Walkthrough container kept dark (`#001321`) on purpose.
- [Walkthrough component](project_walkthrough_component.md) — auto-playing 60-sec animated hero tour built in React (no MP4). Replaces two static dashboard images. Source assets in `public/images/walkthrough/`.
- [Russell is a developer](feedback_author_copy_developer.md) — never frame him as a "non-developer." He career-pivoted into AI. Story headline: "Built by a developer who embraced AI."
- [Security headers baseline](feedback_security_headers_baseline.md) — HARD RULE: every public site gets HSTS + X-CTO + X-Frame + Referrer + Permissions + CSP before it ships. Codified 2026-05-01 after fleet audit found 9/13 domains exposed.
- [Cover Russell's ass — full baseline](feedback_cover_my_ass_baseline.md) — HARD RULE: at session start on any web project, run the full triage (security, deps, SEO, a11y, perf, compliance). Fix CRITICAL+HIGH inline. Codified 2026-05-02.
- **Skills Exchange fully GONE 2026-08-24** — code (commit `e2e2a31`: 53 files, `lib/db.ts` 1891→791 lines, `/exchange*` 301s to `/`) **and all 12 `exchange_*` database tables DROPPED**, including 1,097 listings. Russell said "do not back it up" — **there is no backup, this is unrecoverable**. DB now has 8 tables: app_versions, downloads, events, license_keys, page_views, site_settings, update_events, users. `deleteUser()`'s `to_regclass` guard now correctly skips exchange cleanup. Details in [Build Progress](build_progress.md).
- **Supabase DB access for makobot** — creds live in `~/.aimemory/makobot-supabase-ref.txt` + `makobot-supabase-db-pw.txt`. Pooler host is **`aws-1-us-east-1`** (NOT aws-0 — that returns "tenant not found"), session mode port 5432 for DDL, user `postgres.<ref>`. The `~/.supabase/access-token` on this machine is the **GovSprint** account and 403s on makobot.
- [Walkthrough component](project_walkthrough_component.md) — **no longer rendered** as of 2026-08-24; component still exists in components.tsx.
- [Immutable cache: curl ≠ what Russell sees](feedback_immutable_cache_verify_what_user_sees.md) — /videos/* and /images/* are `immutable` for a year. Replacing media in place NEVER reaches existing visitors. Version the filename; check Cache-Control before claiming a media fix is live.
- [The site changes itself via automation](project_site_changes_itself_via_automation.md) — Dependabot auto-merge + nightly backup workflows push to master and auto-deploy. ALWAYS `git fetch` first; a clean tree ≠ matching production.
- [OWNER_EMAILS / admin lockout](project_owner_emails_admin_lockout.md) — /admin gates on `users.is_admin` from the DB; the OWNER_EMAILS re-promote net was unset until 2026-08-24. Also: `vercel env pull` blanks all Sensitive values.

Note: aipromptshive.com memory used to live here by mistake. It has been moved to `c--...-Web-Projects-aipromptshive-com/memory/`. If you're working on aipromptshive.com, pull that folder's MEMORY.md instead.
