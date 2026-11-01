import type { Metadata } from "next";

// Offline since 2026-11-01 (lib/offline.ts): this page is the release
// waitlist, so it says that instead of promising a key and a download.
export const metadata: Metadata = {
  title: "MakoBot is offline for now, get notified when it's back",
  description:
    "MakoBot, the Windows AI assistant from Mako Logics, is offline while the next release is built. Leave your email and we'll tell you when it's back.",
  alternates: { canonical: "https://www.makobot.com/get-key" },
  openGraph: {
    title: "MakoBot is offline for now",
    description: "Leave your email and we'll tell you when MakoBot is back.",
    url: "https://www.makobot.com/get-key",
  },
  twitter: {
    card: "summary_large_image",
    title: "MakoBot is offline for now",
    description: "Leave your email and we'll tell you when MakoBot is back.",
  },
};

export default function GetKeyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
