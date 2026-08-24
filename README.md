This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment variables

Set these in Vercel (Production). Anything marked **Sensitive** there comes
back as an empty string from `vercel env pull`, so a local `.env.local` will
show e.g. `DATABASE_URL=""` — that is expected, not corruption.

| Variable | What it does |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres connection string (pooled). |
| `AUTH_SECRET` | NextAuth session encryption key. |
| `NEXTAUTH_URL` / `AUTH_TRUST_HOST` | Canonical site URL for OAuth callbacks. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub sign-in. |
| `OWNER_EMAILS` | **Admin lockout insurance — see below.** |
| `LICENSE_KEY_SECRET` | Signs issued license keys. |
| `SETUP_KEY` | Guards `POST /api/admin/setup` (table creation). |
| `CURRENT_BUILD` / `DOWNLOAD_URL` | Displayed build number and installer link. |

### `OWNER_EMAILS` — don't skip this one

`/admin` is gated on `session.user.isAdmin`, which `lib/auth.ts` re-reads
from the `users.is_admin` column on **every session refresh**. If that
column is ever cleared — a bad migration, a stray `UPDATE`, a rebuilt
table — the owner is locked out of the admin dashboard with no way back in
through the UI, because `/api/admin/diagnostic` is itself admin-gated.

`OWNER_EMAILS` is the way back in: a comma-separated allowlist whose
addresses get `is_admin = TRUE` re-asserted on every successful OAuth
sign-in.

```
OWNER_EMAILS=someone@example.com,someone-else@example.com
```

Two things to know:

- It only takes effect on a deployment created **after** the variable was
  added. Changing an env var does not affect deployments already running.
- It fires on **sign-in**, not on an existing session. After setting it,
  sign out and back in.

Promotion runs only on a successful OAuth sign-in, never from a
session-only callback, so a stolen session cannot use it to escalate.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
