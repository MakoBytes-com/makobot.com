---
name: Walkthrough component — animated hero tour
description: Self-contained React component on the makobot.com hero that auto-plays a 60-sec tour through 10 redacted dashboard screenshots. Replaced two static images.
type: project
---

Built 2026-05-01. Lives in [app/components.tsx](app/components.tsx) as `export function Walkthrough()` (search "WALK_SCENES"). Imported and rendered in [app/page.tsx](app/page.tsx) where the two static `<Image>` components used to sit.

## What it does

Auto-plays a **60-second product tour** of the MakoBot dashboard. 12 scenes:
1. Title card — "MakoBot — Your local AI Workbench" (3s)
2. About tab — Three pillars (5s)
3. Activity tab — Live dashboard (5.5s)
4. Projects tab — Auto-discovers (4.5s)
5. Notes tab — Capture decisions (5s)
6. Skills tab — Reusable AI behaviors (5s)
7. Commands (God Mode) tab — Hard rules (5s)
8. AI Tools Plug-ins — Five trigger words (7s)
9. Providers — BYOK keys (5s)
10. Prefs — Write your style once (4.5s)
11. Privacy tab — 100% local (4.5s)
12. CTA — Stop losing your AI work / Download for Windows (6s)

Then loops continuously.

## Implementation notes

- **`"use client"`** — uses `useState`, `useEffect`, `useRef`, `useMemo`. The whole `app/components.tsx` file was already client-side so `Walkthrough` slotted in cleanly.
- **`requestAnimationFrame`** loop drives scene transitions on a single timeline. Scene index is computed from elapsed ms against `WALK_SCENES[].dur` offsets.
- **`IntersectionObserver`** pauses the loop when the component is off-screen (saves CPU on long pages). Threshold 0.25.
- **Ken Burns effect** — three pan variants (`walk-kb-tl`, `walk-kb-tr`, `walk-kb-bd`) defined in `<style jsx>`. Each scene picks one, animation duration matches scene duration via `--scene-dur` CSS variable.
- **Outer container is dark** (`bg-[#001321]`, Bulldog brand-950) — this is intentional. The dashboard screenshots inside are dark-themed app captures, captions overlay them with white text + black text-shadow, and during scene crossfades the dark container shows through cleanly. Don't change to cream — it'll break the captions.

## Source assets

10 redacted dashboard screenshots in [public/images/walkthrough/](public/images/walkthrough/), named `01-about.webp` through `10-privacy.webp`. PNG → WebP conversion done by [scripts/convert-walkthrough-to-webp.mjs](scripts/convert-walkthrough-to-webp.mjs) using Sharp (already in node_modules from Next.js). 2.5 MB → 1.1 MB total (56% smaller).

If Russell ever recaptures + redacts new dashboard screenshots:
1. Drop the PNGs in `public/images/walkthrough/` with the same filenames
2. Run `node scripts/convert-walkthrough-to-webp.mjs` from the project root
3. The script auto-deletes the PNG originals after conversion
4. Component picks up the new WebPs with no code changes

## Why this isn't an `<video>` element

We considered recording the walkthrough with Snagit and shipping an MP4 hero. Decided against it because: (1) recording loop creates a roundtrip that takes Russell out of flow, (2) the React component is text-readable/SEO-friendly (real h1, real captions in DOM), (3) updating a single screenshot doesn't require re-recording an MP4, just re-running the WebP script. The `feedback_real_footage_for_demos.md` rule (real footage > AI for hero) is still satisfied because the screenshots ARE real product UI.

## Caption positioning gotcha (already fixed, but record for future)

Original captions used `absolute left-1/2 -translate-x-1/2 w-[92%]` plus an inline `transform` that overrode Tailwind's translate composition, causing the captions to clip on the left of the container under some widths. Fixed in commit `2839e9a` by switching to transform-free centering: `absolute inset-x-0 flex justify-center`. Don't revert that pattern.
