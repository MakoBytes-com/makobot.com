---
name: Vercel env add must use printf, not echo
description: When piping secret values into `vercel env add NAME ENV --sensitive`, use `printf '%s'` not `echo` — echo's trailing newline gets stored as part of the value and breaks downstream verification.
type: feedback
originSessionId: b168ba1e-6ccc-46c8-b9fa-210af5e0a090
---
# Use `printf '%s'` (not `echo`) when piping into `vercel env add`

When stdin'ing a secret value into `vercel env add NAME ENV --sensitive`,
**`echo "$VALUE"` appends a literal newline that Vercel stores as part
of the env var value**. The value becomes `"actual-value\n"` instead of
`"actual-value"`.

This silently passes any local-side verification (the saved value on
disk is correct; direct calls from your machine work fine). It only
fails when the runtime sends the env var to a third-party API that
does an exact-string comparison. Then you get errors like
"invalid_client" or "invalid signature" with no obvious cause.

**Why:** Russell's Vercel breach response on 2026-04-29 had this exact
failure mode. After rotating GOOGLE_CLIENT_SECRET via
`echo "$NEW_GOOGLE_SECRET" | vercel env add ... --sensitive`, sign-in
broke with "invalid_client". My direct test of the same value against
Google's token endpoint succeeded (returned `invalid_grant` for fake
code, which means the client credentials themselves were valid). The
mangling was at Vercel's input. Re-running with `printf '%s' "$VALUE"`
fixed it on the next deploy.

**How to apply:**

```bash
# WRONG — adds trailing newline to stored value
echo "$NEW_SECRET" | vercel env add NAME production --sensitive

# RIGHT
printf '%s' "$NEW_SECRET" | vercel env add NAME production --sensitive

# Or read from a file that was created with newline-stripping
VALUE=$(tr -d '\n' < /path/to/secret.txt)
printf '%s' "$VALUE" | vercel env add NAME production --sensitive
```

Same precaution applies to any CLI that reads a secret from stdin
(`gh secret set`, `flyctl secrets set`, `aws secretsmanager`,
`supabase secrets set`, etc.) — use `printf` and verify length matches
expected.

Once a value is set as Sensitive on Vercel, you cannot pull it back
out via `vercel env pull` to verify (by design). The fastest diagnostic
is to deploy a tiny test endpoint that prints `process.env.NAME.length`
or to ask the third-party API what it received via runtime logs (the
Vercel `auth.js` runtime logs surfaced "invalid_client" with the bad
secret length, which is what unblocked us).
