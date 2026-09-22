# Session Summary — 2026-09-10

**State: clean.** master pushed through commit 7523c50, deployed, verified live. Nothing open.

## What shipped today
1. **Microsoft Store presence** (915e6d3): MakoBot approved on the Store 2026-09-09, product 9NH5KTRLRQ7Q, listing live at https://apps.microsoft.com/detail/9NH5KTRLRQ7Q. Official MS badge (self-hosted /images/ms-store-badge-v1.svg) beside the direct CTA in hero, download section, get-key page. Logo component now renders the real robot app icon (/images/makobot-icon-v1.webp from the app's makobot-logo-256.png) instead of the drawn "M". Store URL in JSON-LD (installUrl+sameAs) and llms.txt. Store edition needs NO key (per lib/knowledge.ts); direct download keeps the free key. SITE_LAST_UPDATED → 2026-09-10.
2. **Badge width fix** (96ee270): explicit pixel width; width:auto collapsed to 0 in flex.
3. **Header polish** (7523c50): navy-gradient wordmark nav+footer, navy link hovers, mobile Contact menu-close fix.

## Notes for next session
- Dependabot merged a minor-and-patch bump (c38f3a3) same day; rebased on it, rebuilt clean.
- App build number shown on site is 394 (env-driven), version 3.0.0.
