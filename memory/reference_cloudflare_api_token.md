---
name: Cloudflare API token â€” DNS edit on Russell's active zones
description: Persistent Cloudflare API token scoped to DNS:Edit for makobot.com, makobytes.com, [retired project].ai, and toppaws.com. Use this for DNS changes across those zones without having Russell re-auth.
type: reference
originSessionId: facd7558-d57b-4425-b28b-d638713ac79e
---
# Cloudflare DNS edit token

> âš ï¸ **DEAD â€” verified invalid 2026-06-09** (`/user/tokens/verify` â†’ "Invalid API Token";
> revoked or rolled since creation). Do not use. Live replacement tokens are documented in
> the makoanswer project memory: `reference-cloudflare-tokens.md` (Token A also does Turnstile).

**Token value:** `cfut_[REDACTED-cloudflare-token]`
**Token ID:** `b3e0f54bc93b3cfda720033378795185`
**Status:** ~~active~~ **INVALID as of 2026-06-09**
**Created:** 2026-04-19

## Scope
- **Permission:** Zone â†’ DNS â†’ Edit
- **Zones:**
  - `makobot.com` (ID `fa4cf6e737db8513adfe71ba4d3202f0`)
  - `makobytes.com` (ID `7b60267cd7e8e0fe479e0ab53f4757a3`)
  - `[retired project].ai` (ID `d618ed07d3b817fb64bb460aa8370b67`)
  - `toppaws.com` (ID `1a84477cfdc6217e6a1de768de76e550`)
- Cannot touch billing, account settings, other zones, or anything beyond DNS on those 4 zones.

## Usage pattern
```bash
export CF_TOKEN='cfut_[REDACTED-cloudflare-token]'
curl -s -H "Authorization: Bearer $CF_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/<zone_id>/dns_records?per_page=100"
```

For other common ops see [reference_vercel_github_integration.md](reference_vercel_github_integration.md) pattern of env-var + curl + python-json parsing.

## Revoking / rolling if needed

**Dashboard:** https://dash.cloudflare.com/profile/api-tokens â†’ find "Edit zone DNS" â†’ choose **Roll** (keep scope, new value) or **Delete** (kill it entirely).

**Via API (would need another auth method):** `DELETE /user/tokens/b3e0f54bc93b3cfda720033378795185`.

## When to add more zones

If Russell asks to edit DNS on a zone not in the scope above, don't use this token on that zone â€” it'll return 403. Either:
1. Have Russell extend the existing token's zone list (same URL as dashboard above â†’ edit the token)
2. Or create a new narrowly-scoped token

## Operational notes learned this session (2026-04-19)

- **Cloudflare's public DNS resolver (1.1.1.1) caches negative responses.** After a pre-check that finds a record missing, adding it and querying again immediately often returns `(none)` for up to 5 minutes. Either wait it out, try Google 8.8.8.8 in parallel, or know it's a cache artifact not a real problem.
- **TXT records >255 chars get split into multiple strings.** A DKIM value of ~400 chars shows up in the Cloudflare API as `"string1" "string2"` â€” valid DNS syntax. When comparing stored-vs-sent DKIM values, normalize by removing outer quotes and interior `" "` splits before diffing.
- **Don't strip outer quotes blindly in the diff.** Cloudflare's API `content` field sometimes includes outer `"..."`, sometimes doesn't, depending on the record. Compare by semantic value, not string equality.
