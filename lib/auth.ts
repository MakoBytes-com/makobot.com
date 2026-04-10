import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser, getUserByEmail } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false;

      await findOrCreateUser({
        google_id: profile.sub as string,
        email: profile.email,
        name: (profile.name as string) || "",
        avatar_url: (profile.picture as string) || "",
      });

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
