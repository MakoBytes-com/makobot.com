---
name: Never use Russell's personal info in any project
description: Hard rule — never put Russell's personal email, address, phone, or other personal contact info in any product, FAQ, page, script, or public-facing artifact. Use admin@<projectdomain> instead.
type: feedback
originSessionId: facd7558-d57b-4425-b28b-d638713ac79e
---
**Never use Russell's personal contact info (personal email, phone, address, etc.) anywhere in a product, FAQ, help page, contact form, legal page, seed data, or any other public-facing surface.**

**Why:** Russell runs his businesses (Mako Logics / Makologics MSP) and portfolio / learning projects (aipromptshive.com, toppaws.com, mako.studio) separately from his personal identity. Personal info on a public site is a privacy and spam risk and blurs the personal/business line.

**How to apply:**
- For contact addresses on any site we work on, default to `admin@<projectdomain>` (e.g. `admin@aipromptshive.com`, `admin@toppaws.com`, `admin@makobot.com`).
- If a site needs a support email and there's no explicit "admin@" mailbox yet, still write `admin@<domain>` in the content — Russell will create the mailbox. Don't substitute a personal fallback.
- For client projects (BuffaloSealandGasket, woodlandsfamilypsychiatry, etc.), use the client's own contact channels — never Russell's.
- This rule applies to FAQ entries, privacy policies, terms of service, takedown pages, footers, about pages, any seed data, and any copy I write.
- Git commits, code comments, and memory files are fine to mention Russell by name internally — this rule is about **public-facing product content** only.

Incident that prompted this: I seeded aipromptshive.com's FAQ with `russell.sailors@gmail.com` as a contact. Russell removed it and instructed me to use `admin@aipromptshive.com` instead, and generalized the rule to all projects.
