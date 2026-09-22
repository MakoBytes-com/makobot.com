---
name: Security headers are a non-negotiable baseline
description: HARD RULE — every public site gets HSTS + X-CTO + X-Frame + Referrer-Policy + Permissions-Policy + CSP before it ships. Codified 2026-05-01 after fleet audit found 9/13 domains exposed.
type: feedback
originSessionId: a5b4d713-7d05-47fe-880b-631ef2594e88
---
# HARD RULE — Security headers are a baseline, not a "future improvement"

Every public-facing site I touch (client, portfolio, Mako, side experiment,
scratch — no exceptions) gets these headers before it ships:

1. `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
2. `X-Content-Type-Options: nosniff`
3. `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'none'` (belt + suspenders)
4. `Referrer-Policy: strict-origin-when-cross-origin`
5. `Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()` (deny by default; add allows only as needed)
6. `Content-Security-Policy` — tuned per site, Report-Only first, audit with Puppeteer, flip to enforce when console is clean
7. `Cache-Control: public, max-age=31536000, immutable` on long-lived static asset folders

**Why:** On 2026-05-01, after shipping CSP on makobot.com and makologics.com,
Russell asked me to audit the rest of his fleet. Of ~13 production domains:

- 3 fully locked down (makobot.com, makologics.com, toppaws.com)
- 4 partial (had every other header but missing CSP)
- 4 wide open (only HSTS, missing every other header)
- 2 client sites on Apache with zero or near-zero security headers
  (BuffaloSealandGasket, bulldogsecurityservice — and woodlandsfamilypsychiatry on
  Wix had similarly minimal coverage)

Russell's words verbatim: **"Fix them all and then make a global rule to never ship
broken sites with security issues. This cant happen again. Security is number 1."**

**How to apply:**
- At session start on ANY web project, run
  `curl -sLI https://<domain>/ | grep -iE "^(content-security-policy|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy)"`
  and verify all 6 categories are present. If any are missing, fix before
  doing the user's actual ask — treat missing security headers as broken
  code, not a future improvement.
- Stack-specific delivery: Next.js → `next.config.ts/mjs` `headers()`,
  Vite/static → `vercel.json`, Apache → `.htaccess`, WordPress → `.htaccess`
  + plugin, hosted CMS (Wix/Squarespace) → flag limitation, offer migration.
- Reference implementation: `makobot.com/next.config.ts` (commit `53142fd`).
- Never ship enforcing CSP without auditing first via the Puppeteer script at
  `~/AppData/Local/Temp/csp-audit/audit.mjs`. A missed allow rule will break
  the live site.

**Reference rule in global CLAUDE.md:** the canonical version of this rule
lives in `~/.claude/CLAUDE.md` under the "Watch Russell's back on every
project" block, marked `HARD RULE — Security headers are a non-negotiable
baseline on every public site`. This memory is the project-side record of
when/why it was codified.
