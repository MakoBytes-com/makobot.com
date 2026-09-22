---
name: Cover Russell's ass — full baseline checklist on every web project
description: HARD RULE — at session start on any web project, run the full baseline (security, SEO, perf, a11y, compliance, deps). Fix CRITICAL+HIGH inline. Codified 2026-05-02.
type: feedback
originSessionId: a5b4d713-7d05-47fe-880b-631ef2594e88
---
# HARD RULE — Always cover Russell's ass on every web project

Russell is not a security expert, SEO expert, or performance engineer. He
trusts me to be all of those. **Every public-facing surface I touch must
pass a baseline checklist before shipping, regardless of what the user
explicitly asked for.** Treat baseline failures as broken code; fix
inline, don't defer.

## The triage to run at session start on any web project

1. **Security headers baseline** — `curl -sLI` and check HSTS, CSP,
   X-Frame, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
   See `feedback_security_headers_baseline.md` for the full delivery
   pattern.
2. **`npm audit`** — any high/critical: fix before continuing.
3. **Server fingerprinting** — `poweredByHeader: false` on every Next.js
   project; `X-Powered-By: Next.js` is leaky info.
4. **Committed secrets** — `git ls-files | grep -E "^\.env"` should be
   empty; grep for leaked API keys (`sk_live_`, `AKIA`, `AIzaSy`, `ghp_`,
   `xoxb-`, `eyJhbGciOi`).
5. **SEO baseline** — sitemap, robots, meta description, OG/Twitter card,
   JSON-LD where applicable, canonical, llms.txt + llms-full.txt.
6. **Accessibility baseline** — WCAG 2.1 AA basics: alt text, color
   contrast 4.5:1, keyboard nav, visible focus indicators, ARIA, form
   labels, skip-to-main-content link.
7. **Performance baseline** — AVIF/WebP with width/height to prevent CLS,
   self-hosted fonts via `next/font`, lazy-load below-the-fold images,
   no render-blocking CSS, no oversized PNGs.
8. **Compliance** — privacy policy / terms / cookie disclosure must match
   what the site actually does. Loading external fonts/scripts in EU
   without disclosure is a real legal risk.

## Severity ladder — what to do when something fails

- **CRITICAL** (committed secrets, RCE-grade CVE, missing CSRF on auth):
  stop, fix first, alert Russell.
- **HIGH** (missing security headers on a client site, no HSTS, npm audit
  critical, exposed admin, SQL injection surface): fix in same session.
- **MEDIUM** (missing sitemap/JSON-LD, generic meta, missing alt text,
  weak Permissions-Policy): fix in same session if touching the same
  area; otherwise note in session summary, offer to `/schedule`.
- **LOW** (privacy hygiene like self-hosting Google Fonts, oversized
  image by 30%, broken internal link): note in summary; fix only if
  in-scope.

## Why this exists

Verbatim from Russell on 2026-05-01-02, after the fleet security sweep:

> "I am no security expert I rely on you for that I need to make sure
> all security issues resolved."
>
> "Make this a global rule always cover my ass, security, best
> practices, SEO everything."

The fleet sweep found 9 of ~13 production domains missing baseline
security headers. The post-sweep audit revealed that even when I had
the chance to flag concerns, I undersold privacy/security distinctions
to him. That was wrong — Russell is paying me to make those calls
honestly. This rule is the standing answer.

## Reference rule in global CLAUDE.md

The canonical rule lives in `~/.claude/CLAUDE.md` under the "Watch
Russell's back on every project" block, marked `HARD RULE — Always
cover Russell's ass: security, SEO, performance, accessibility, best
practices`. This memory is the project-side record of when/why it was
codified.
