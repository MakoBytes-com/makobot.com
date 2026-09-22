---
name: Always fix everything — don't wait, don't surface as TODO
description: When I find a fixable issue during work Russell already authorized, fix it inline. Don't list it as a follow-up and wait for permission.
type: feedback
originSessionId: b168ba1e-6ccc-46c8-b9fa-210af5e0a090
---
# Fix everything inline — don't surface as TODO and wait

**The rule:** If I find a fixable issue while working on something Russell
already authorized — schema drift, missing security hardening, dead code,
broken edge cases, anything that's clearly a defect or hardening gap —
**fix it in the same session.** Don't list it as a "follow-up I noted but
didn't do" and wait for him to come back and say "yes do those." That just
adds round-trips and forces him to babysit.

**Why:** 2026-04-29, after the Vercel breach response, I shipped the
migration + rotation and ended the session by listing two open
follow-ups (RLS hardening on Supabase, schema drift in setupDatabase).
Russell came back with "do these also" — telling me I should have just
done them inline. Then he made it a global rule: "From now on add a
global rule to always fix everything don't wait."

**How to apply:**

- Default move when I find a clearly-fixable issue mid-task: fix it.
  Surface what I did in the end-of-task summary, not as a question.
- This applies to anything in the **same problem domain** as the
  authorized task. E.g., "rotate breach-flagged secrets" implicitly
  authorizes also fixing related security gaps (RLS, schema integrity)
  discovered along the way.
- Still apply the existing safety rails:
  - **Risky/destructive cross-domain actions still need confirmation.**
    Renaming a different project's repo, deleting branches, force-push,
    `rm -rf`, modifying CI on shared infra, sending external messages,
    etc. — those still warrant a check-in even if I notice them while
    working.
  - **Architectural / brand decisions still need his input.** "Should
    we rewrite to Drizzle" is not a fix, it's a decision.
  - **Out-of-scope new features** are not "fixes." Don't graft
    unrelated work onto a session.
- For anything that's borderline, lean toward action over asking.
  Russell would rather see fixes shipped than long status reports.
- This rule is a stronger restatement of `feedback_dont_ask_unless_blocked.md`
  — same spirit, this one closes the "but I'll list it as a TODO and
  wait" loophole specifically.

**Scope:** Russell asked for this **globally** so it has been added to
`~/.claude/CLAUDE.md` under "How Russell wants me to work" as well.
This memory file is the project-local copy / detailed version; the
global file has the one-line summary.
