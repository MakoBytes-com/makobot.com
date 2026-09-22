---
name: Build Progress
description: makobot.com website build tracking
type: project
updated: 2026-04-10
originSessionId: 041d64b3-57a7-45db-a2e1-748271ebc158
---
# makobot.com Website Build

## Status: AI Skills Exchange live with full feature set

## URLs
- **Live:** https://makobot.com (Cloudflare DNS -> Vercel)
- **Exchange:** https://makobot.com/exchange
- **GitHub:** https://github.com/russellsailors-hub/makobot.com
- **Vercel:** mako-studi/makobot.com

## Stack
- Next.js 16.2.3 + TypeScript + Tailwind CSS v4 + NextAuth + Neon Postgres + Recharts
- Dark theme (#1E2330 bg, #3B82F6 blue accents)

## DB Tables (11 total)
- users, license_keys, downloads, page_views, events (original 5)
- exchange_listings, exchange_reviews, exchange_downloads (exchange core)
- exchange_collections, exchange_collection_items (bundles)
- exchange_requests, exchange_request_upvotes (request board)

## AI Skills Exchange — Full Feature Set
- 6 categories: Skills, Global Configs, MCP Servers, Prompts, Hooks, Agents
- 9 platform tags: Claude, ChatGPT, Gemini, Cursor, Windsurf, Copilot, Midjourney, Stable Diffusion, Universal
- Browse with category tabs, platform filters, search, sort, pagination (21/page)
- Trending algorithm + Featured section on browse page
- Listing detail pages with content preview, download, reviews
- One-click install box with platform-specific commands + copy buttons
- Share button (native share API or clipboard)
- Copy All Content button
- Remix/Fork button (create derivative listings)
- Screenshot/preview image support
- User profiles at /exchange/user/[id] with stats
- Collections/Bundles system (create, browse, add/remove items)
- Skill Request Board with upvoting (/exchange/requests)
- Import from GitHub URL (auto-detect category, platforms, extract frontmatter)
- "Also Popular" related listings on detail pages
- Clickable author names linking to profiles
- Admin moderation (approve/reject, inline edit, delete, review management)
- Sub-navigation bar across all exchange pages
- 20 seed listings across all categories

## Other Site Features
- Landing page with 11 sections
- /get-key — Google OAuth sign-in, license key, download
- /admin — Full dashboard (stats, users, keys, analytics, exchange, services)
- /admin/services — Vendor links (Vercel, GitHub, Neon, Google OAuth, Cloudflare, Azure, etc.)
- Privacy policy + terms of service
- SEO (robots.ts, sitemap.ts, meta tags, JSON-LD)

## Env Vars (Vercel, Production only)
- DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET
- LICENSE_KEY_SECRET, SETUP_KEY, DOWNLOAD_URL, NEXTAUTH_URL, AUTH_TRUST_HOST

## Completed (previously pending)
- [x] Azure Trusted Signing — verified, app signed, signed build published
- [x] AI auto-moderation for submissions

## Status: Everything shipped. No pending items.
