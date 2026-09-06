import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { AnalyticsTracker } from "./analytics-tracker";
import { BackToTop } from "./components";
import { MAKOBOT_VERSION, SITE_LAST_UPDATED } from "@/lib/version";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0061aa",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://makobot.com"),
  title: {
    default: "MakoBot — The AI Assistant That Lives on Your PC and Never Forgets",
    template: "%s — MakoBot",
  },
  description:
    "MakoBot watches your inbox, keeps your calendar, talks and listens, and remembers every project and conversation, all on your own Windows PC. She briefs Claude Code and every AI tool you use. Free, no subscription.",
  keywords: [
    "AI assistant for Windows",
    "local AI assistant",
    "AI email assistant",
    "AI memory",
    "Claude Code memory",
    "AI second opinion",
    "voice assistant Windows",
    "private AI assistant",
    "MCP server",
    "Windows app",
    "MakoBot",
    "Mako Logics",
    "MakoBytes",
  ],
  openGraph: {
    title: "MakoBot — The AI Assistant That Lives on Your PC and Never Forgets",
    description:
      "Mail, calendar, voice and memory, all on your own Windows machine. She briefs Claude Code and every AI tool you use. Free, no subscription.",
    url: "https://makobot.com",
    siteName: "MakoBot",
    type: "website",
    images: [
      {
        url: "https://makobot.com/images/og-v4.jpg",
        width: 1376,
        height: 768,
        alt: "MakoBot, a small silver robot with a glowing blue brain, on a home-office desk beside a smiling assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakoBot — The AI Assistant That Lives on Your PC and Never Forgets",
    description:
      "Mail, calendar, voice and memory, all on your own Windows machine. She briefs Claude Code and every AI tool you use. Free, no subscription.",
    images: ["https://makobot.com/images/og-v4.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "MakoBot",
      description:
        "A personal AI assistant for Windows that watches your email, keeps your calendar and to-do list, talks and listens, and remembers every project and conversation on your own machine. Briefs Claude Code and every AI tool you use.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Windows 10, Windows 11",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: "https://makobot.com",
      downloadUrl: "https://makobot.com/get-key",
      softwareVersion: MAKOBOT_VERSION,
      dateModified: SITE_LAST_UPDATED,
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[#0061aa] focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0061aa]"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <AnalyticsTracker />
          <div id="main-content" tabIndex={-1} className="flex-1 flex flex-col outline-none">
            {children}
          </div>
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
