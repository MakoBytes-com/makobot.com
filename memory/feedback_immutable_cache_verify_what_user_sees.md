---
name: feedback_immutable_cache_verify_what_user_sees
description: curl proving a file is correct on the server proves NOTHING about what Russell sees — immutable cache headers mean his browser never refetches. Version the filename.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 14bab693-7138-4bdd-9d93-43d967594269
  modified: 2026-08-24T19:13:56.392Z
---

On 2026-08-24 Russell said the makobot.com hero was wrong. I restored the
files, verified with `curl` that the server returned the right bytes, and
told him it was fixed. **Six times.** He kept saying it was still broken.
He was right every time.

`/videos/*` and `/images/*` on the Mako fleet are served with
`Cache-Control: public, max-age=31536000, immutable`. **`immutable` means
the browser will never revalidate — not on reload, not on Ctrl+Shift+R.**
Commit 281c508 had swapped `hero.mp4` in place (robot footage ->  dark
Electron app capture) under an unchanged URL. Every browser that had
loaded the page held the wrong bytes for a year. Restoring the file
server-side literally could not reach anyone who had already visited.

**Why:** `curl` has no cache. It always sees the server. Russell's Chrome
has a year-long immutable entry. We were looking at two different files
and I kept quoting curl at him as proof.

**How to apply:**
1. **Replacing any media on a live site = new filename.** Bump a `-vN`
   suffix. Never overwrite `hero.mp4` / `logo.png` in place. This is the
   existing [[version-media-filenames-on-replace]] convention — I broke it
   and it cost an afternoon.
2. **When Russell says something is still wrong after I "verified" it,
   the verification method is the suspect, not his eyes.** Check the
   response headers and ask what a *cached* client would see.
3. `curl -sLI <asset>` and read `Cache-Control` BEFORE claiming any media
   change is live.
4. Auditing a swapped asset: `git show --stat <commit>` — a `Bin A -> B`
   line with the filename unchanged is the danger sign. Deleted+added
   under new names is safe.

Also: don't blame the user's environment. I told him the MakoBot desktop
app was covering his browser. It wasn't. He replied "ITS NOT THE FUCKING
DESKTOP APP" and he was correct — the dark panel he was pointing at was
the stale hero video playing inside the website.

See [[project_site_changes_itself_via_automation]].
