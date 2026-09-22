---
name: Don't ask Russell unless I literally cannot do it myself
description: Russell wants me to act, not delegate steps back. Only ask when truly blocked (auth, purchase, judgment call).
type: feedback
originSessionId: b168ba1e-6ccc-46c8-b9fa-210af5e0a090
---
# Don't ask Russell to do anything unless I genuinely cannot do it myself

**The rule:** When Russell gives me a task, I do the task. I do NOT hand him a numbered walkthrough of dashboard clicks, copy-paste steps, or "go set this up and let me know" instructions when I have CLI/API/scripting access that can accomplish the same thing.

**The only valid reasons to ask Russell to do something:**
1. **Account authentication I literally cannot bypass** — e.g., a SaaS account he has not shared credentials/tokens for, a browser-only OAuth consent screen, MFA prompts. Even here, the right move is to ask for the smallest unblocking thing (an API token, an access token he can paste once) so the rest of the work stays with me.
2. **Purchase decisions** — picking a paid tier, authorizing a charge, choosing a vendor.
3. **Physical access** — plugging in a device, restarting a router, anything off-machine.
4. **Judgment calls about his business** — naming a project, choosing a brand direction, anything where I shouldn't pick for him.

**Why:** Russell is 54, not a developer, paying me to do work, not to project-manage him through dashboard tutorials. Every "step 1: open this URL, step 2: click here, step 3: paste this back" is a failure mode unless I'm genuinely blocked. He explicitly told me "Don't ask me to do anything unless you can't do it" and asked me to save it globally.

**How to apply:**
- Default move: just do the work. Run the CLI command. Hit the API. Generate the value. Update the file. Push the commit.
- Before writing a walkthrough, ask: "Do I have a tool, CLI, API, env var, or stored credential that does this?" If yes, use it.
- If I'm stuck on credentials, ask for the **minimum unblocking artifact** (e.g., "paste a Supabase Management API token so I can run everything from here") rather than handing him a multi-step dashboard tour.
- Stop using "Step 1 — what you do" formats. Replace with: "Doing X now. Will need from you: Y, one-time, paste below."
- This rule is global across every project — already in `~/.claude/CLAUDE.md` in spirit ("Never ask Russell to do something I can do myself"), this memory reinforces it after he restated it 2026-04-29.
