import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { findOrCreateUser, getUserByEmail, getDb } from "./db";

// Owner-email allowlist. Comma-separated list of emails in OWNER_EMAILS env var.
// On every sign-in we re-assert is_admin = true for these accounts so a bad
// migration, accidental UPDATE, or someone clearing the flag in the DB can't
// lock the owner out of /admin. Auto-promotion runs only on a successful
// OAuth sign-in, never via session-only callbacks (so a stolen session
// can't escalate).
const OWNER_EMAILS = (process.env.OWNER_EMAILS || "")
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile, account }) {
      if (!profile?.email) return false;

      const provider = account?.provider || "google";

      // Use provider-specific ID as the google_id field (it's really just "oauth_id")
      const oauthId =
        provider === "github"
          ? `github-${profile.id || profile.sub}`
          : (profile.sub as string);

      // GitHub avatar is profile.avatar_url, Google is profile.picture
      const avatarUrl =
        (profile.avatar_url as string) ||
        (profile.picture as string) ||
        "";

      // GitHub login (username)
      const githubUsername =
        provider === "github" ? (profile.login as string) || undefined : undefined;

      await findOrCreateUser({
        google_id: oauthId,
        email: profile.email,
        name: (profile.name as string) || (profile.login as string) || "",
        avatar_url: avatarUrl,
        github_username: githubUsername,
      });

      // Owner auto-promote: if this email is in OWNER_EMAILS, ensure is_admin=true.
      // Idempotent — runs every sign-in but only writes when needed.
      try {
        const lowered = profile.email.toLowerCase();
        if (OWNER_EMAILS.includes(lowered)) {
          const sql = getDb();
          await sql`UPDATE users SET is_admin = TRUE WHERE LOWER(email) = ${lowered} AND is_admin = FALSE`;
        }
      } catch {
        // Don't block sign-in on a promotion failure — admin can be set manually
        // via scripts/promote-admin.mjs or SQL.
      }

      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await getUserByEmail(session.user.email);
        if (dbUser) {
          session.user.id = String(dbUser.id);
          session.user.isAdmin = dbUser.is_admin as boolean;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/get-key",
  },
});
