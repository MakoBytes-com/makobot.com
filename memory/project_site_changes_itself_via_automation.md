---
name: project_site_changes_itself_via_automation
description: "makobot.com's master branch takes autonomous pushes that auto-deploy to production — \"I didn't change anything\" has a real mechanism."
metadata: 
  node_type: memory
  type: project
  originSessionId: 14bab693-7138-4bdd-9d93-43d967594269
  modified: 2026-08-24T18:21:34.792Z
---

makobot.com production deploys on every push to `master`, and **several
automations push to master without Russell doing anything**. When he says
"I don't know how this site got changed", check these before assuming he
or a session did it:

1. **Dependabot auto-merge.** `.github` is configured to auto-merge patch
   AND minor grouped bumps once checks are green. On 2026-08-24 at 08:11
   CDT, PR #38 merged itself and deployed `next` 16.3.0 -> 16.3.2, `jose`
   6.2.8 -> 6.2.9, `lucide-react` 1.30 -> 1.33. Russell's local clone knew
   nothing about it — he was 3 commits behind production.
2. **Nightly self-backup workflows.** `chore(backup): nightly self-backup
   to a release asset` and `chore(backup): this project backs up its own
   database` push commits to master on a schedule, each triggering a
   production build.
3. **The Claude duty-officer workflow**, which opens PRs on its own.

**Always `git fetch` and compare local vs `origin/master` at session start
here.** A clean working tree does NOT mean local matches production. On
2026-08-24 local `master` was at 281c508 while production was 3 commits
ahead — reading local files would have described a site that wasn't live.

`vercel.json` only disables deploys for `dependabot/**` *branches*; once a
dependabot PR is MERGED to master, that merge deploys normally. The guard
stops preview builds, not the auto-merge deploy.

See [[project_overview]] and [[reference_vercel_github_integration]].
