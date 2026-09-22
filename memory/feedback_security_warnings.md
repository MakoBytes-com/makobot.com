---
name: Proactive Security Warnings
description: Always flag security risks before building, never let Russell discover them after
type: feedback
originSessionId: 041d64b3-57a7-45db-a2e1-748271ebc158
---
Always warn Russell about security risks BEFORE building a feature, not after.

**Why:** Russell is not a security expert and relies on Claude to catch these issues. The claim system was built with a hole (anyone could steal listings) and Russell had to catch it himself. That should never happen.

**How to apply:** Before implementing any feature that involves user input, authentication, ownership, permissions, or data access:
1. Think through abuse scenarios (what could a bad actor do?)
2. Flag the risks to Russell in plain English before writing code
3. Build the secure version from the start, not as a fix after
4. Specifically watch for: unauthorized access, ownership spoofing, data leakage (real names, emails), privilege escalation, CSRF, XSS in user-submitted content
