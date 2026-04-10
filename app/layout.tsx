import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { AnalyticsTracker } from "./analytics-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makobot.com"),
  alternates: {
    canonical: "/",
  },
  title: "MakoBot — AI Memory for Claude Code, Cursor & Every Coding Tool",
  description:
    "MakoBot is a free AI memory tool for Windows that gives Claude Code, Cursor, ChatGPT, and Gemini persistent session memory. It automatically records code changes, conversations, and decisions so every new AI session picks up where you left off.",
  keywords: [
    "AI memory",
    "AI memory tool",
    "Claude Code memory",
    "AI session persistence",
    "AI coding tools",
    "developer tools",
    "Cursor AI memory",
    "ChatGPT memory",
    "Windows app",
    "MakoBot",
    "Mako Logics",
  ],
  openGraph: {
    title: "MakoBot — AI Memory for Claude Code, Cursor & Every Coding Tool",
    description:
      "Free AI memory tool that gives Claude Code, Cursor, ChatGPT, and Gemini persistent session memory. Never re-explain your projects again.",
    url: "https://makobot.com",
    siteName: "MakoBot",
    type: "website",
    images: [
      {
        url: "https://makobot.com/images/og.jpg",
        width: 1392,
        height: 752,
        alt: "MakoBot — AI Memory for Every Coding Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakoBot — AI Memory for Claude Code, Cursor & Every Coding Tool",
    description:
      "Free AI memory tool for Windows. Gives every AI coding tool persistent session memory.",
    images: ["https://makobot.com/images/og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "MakoBot",
      description:
        "AI memory tool that gives your AI coding tools persistent session memory. Automatically records code changes, conversations, and notes into a central brain.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows 10, Windows 11",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: "https://makobot.com",
      downloadUrl: "https://makobot.com/get-key",
      softwareVersion: "2.0.0",
      author: {
        "@type": "Organization",
        name: "Mako Logics",
        url: "https://makobot.com",
      },
    },
    {
      "@type": "WebSite",
      name: "MakoBot",
      url: "https://makobot.com",
    },
    {
      "@type": "Organization",
      name: "Mako Logics",
      url: "https://makobot.com",
      brand: {
        "@type": "Brand",
        name: "MakoBytes",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <AnalyticsTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
