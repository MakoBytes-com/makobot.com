---
name: Vercel ↔ GitHub auto-deploy reconnect runbook
description: How to diagnose and fix broken GitHub-to-Vercel auto-deploys across Russell's projects, including lessons from the 2026-04-19 sweep
type: reference
originSessionId: facd7558-d57b-4425-b28b-d638713ac79e
---
# Symptom
`git push origin master` to a project's canonical repo no longer triggers a Vercel production deploy. Old deploys still visible in Vercel dashboard but their age keeps growing past every recent push.

# Why it happens for Russell specifically
Russell renamed his personal GitHub account `russellsailors-hub` org repos → `MakoBytes-com` org. Vercel's stored Git connection doesn't auto-follow GitHub 301 redirects for webhooks — the connection continues to "look correct" in dashboards but silently stops firing. Fix is always a disconnect + reconnect to the canonical URL.

# Diagnosis

## 1. Inventory all Vercel projects + their stored Git connection
```bash
vercel projects ls
```
Then for each project, query the API for the current connection:
```bash
TOKEN=$(grep -oE '"token"\s*:\s*"[^"]+"' "$APPDATA/com.vercel.cli/Data/auth.json" | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
TEAM="team_TkkoMwEd3Iu2Hv4Ybic1JAMD"
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.vercel.com/v9/projects/<project-name>?teamId=$TEAM" \
  | python -c "import sys,json; d=json.load(sys.stdin); l=d.get('link') or {}; print(l.get('org','(none)')+'/'+l.get('repo','')) "
```

## 2. Check each repo's canonical GitHub URL
```bash
gh api repos/<org>/<repo> --jq '.full_name'
```
If `.full_name` differs from the URL you queried, the repo has been renamed/transferred and Vercel needs to be repointed to the new name.

## 3. (Optional) Compare last-push vs last-deploy dates
If `pushed_at` on GitHub is newer than the latest Vercel deployment, auto-deploy is broken. If they match, connection is probably still fine (or nobody's pushed since it broke).

# Fix
Use a temp dir so you don't pollute the current working directory's `.vercel/project.json`:

```bash
TMPD=$(mktemp -d) && cd "$TMPD"
vercel link --yes --project <project-name>
vercel git disconnect --yes
vercel git connect https://github.com/<canonical-org>/<canonical-repo>.git --yes
```

Then update the **local git remote** for the project:
```bash
cd <project-local-folder>
git remote set-url origin https://github.com/<canonical-org>/<canonical-repo>.git
```

# Transferring a GitHub repo to a new org
```bash
MSYS_NO_PATHCONV=1 gh api -X POST "/repos/<old-owner>/<repo>/transfer" -f "new_owner=<new-owner>"
```
`MSYS_NO_PATHCONV=1` is **mandatory on git-bash/Windows** — otherwise git-bash rewrites the URL path as a filesystem path and the call fails. The transfer is async — wait ~5 seconds, then verify with `gh api repos/<old-owner>/<repo> --jq '.full_name'` to confirm the redirect target.

# Gotchas discovered in the 2026-04-19 sweep
- The Claude Code `vercel` CLI plugin wrapper intercepts `vercel env add CURRENT_BUILD preview --yes` and insists on a git-branch arg even when not needed. Workaround: set env vars only on Production via stdin (`echo "84" | vercel env add CURRENT_BUILD production`), or use the Vercel dashboard UI for Preview/Development.
- `vercel ls` only shows deployments; `vercel projects ls` shows the actual projects. Don't confuse them.
- `gh api` private repos return 404 to unauthenticated curl. Always use `gh api` (which carries auth) rather than raw curl when checking private-repo state.
- Each reconnect requires the Vercel GitHub App to be installed on the destination org. If it's not, `vercel git connect` will error — install via https://github.com/apps/vercel/installations/new.
