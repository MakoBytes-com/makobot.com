---
name: makobot.com uses Bulldog-light, not dark
description: Russell rejected the original dark theme on makobot.com 2026-05-01 and asked for a literal copy of bulldogsecurityservice.com's palette. Use these tokens.
type: feedback
---

makobot.com uses a Bulldog-cloned light theme as of 2026-05-01. **Do not introduce dark-theme tokens.**

**Why:** The original dark theme (`#1E2330` page bg, `#3B82F6` electric blue, `#E8EDF3` text) read as "another dark AI SaaS landing page #87." Russell explicitly said it was too dark and asked to "literally copy the color scheme" from bulldogsecurityservice.com. Note the contrast with the **MakoBot desktop app** which stays dark per his global preference — the marketing site is intentionally a different surface.

**How to apply** — when editing makobot.com files, use these tokens:

```
Backgrounds:
  white body:          #ffffff
  alternating section: #eef2f7   (slightly deeper than cream cards so transitions read)
  card:                #f8f9fb   (cream, sits on the section)
  light blue tint:     #e6f0f9   (chips, hover, active states)

Brand:
  navy primary:        #0061aa   (CTAs, headings, links)
  navy hover:          #004d88
  brand-300 light:     #66a5db   (gradient stops, brighter accents)
  brand-950 dark:      #001321   (Walkthrough component bg only — see below)

Text:
  ink:                 #333333   (h1/h2/body)
  secondary:           #555555
  muted:               #777777
  dim:                 #999999

Borders:
  soft:                #dbdbdb

AI badges (kept colorful for variety):
  purple:  #8B5CF6 (Antigravity)
  amber:   #F59E0B (Cursor)
  green:   #10B981 (Windsurf)
  pink:    #EC4899 (Gemini)
  indigo:  #6366F1 (ChatGPT)
```

**Walkthrough component is the one exception** — its outer container is `bg-[#001321]` (Bulldog brand-950 darkest navy) so the dark dashboard screenshots inside have the right backdrop and white captions remain readable. Don't accidentally swap it back to cream.

**Anti-pattern:** Do not reintroduce `#1E2330`, `#252B3B`, `#0d1117`, `#1A1F2E`, `#0F1419`, `#374151`, `#3B82F6`, `#E8EDF3`, `#C0C8D8`, `#8B95A8`, `#06B6D4` anywhere on the site. They were the old dark palette and were systematically swapped out.
