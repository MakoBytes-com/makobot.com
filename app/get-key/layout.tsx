import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Free License Key — MakoBot AI Memory Tool Download",
  description:
    "Sign in with Google to get your free MakoBot license key and download the AI memory desktop app for Windows. Works with Claude Code, Cursor, ChatGPT, and more.",
  alternates: { canonical: "https://makobot.com/get-key" },
  openGraph: {
    title: "Get Free License Key — MakoBot AI Memory Tool",
    description: "Sign in to get your free license key and download MakoBot for Windows.",
    url: "https://makobot.com/get-key",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Free License Key — MakoBot",
    description: "Sign in to get your free license key and download MakoBot for Windows.",
  },
};

export default function GetKeyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
