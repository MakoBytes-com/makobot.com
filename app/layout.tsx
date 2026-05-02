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
    default: "MakoBot — Local AI Workbench for Windows",
    template: "%s — MakoBot",
  },
  description:
    "Free local AI Workbench for Windows. Permanent memory across every AI tool you use, plus one-line plug-ins that cross-check answers with GPT, Claude, and Gemini.",
  keywords: [
    "AI workbench",
    "AI memory",
    "AI memory tool",
    "Claude Code memory",
    "multi-model AI",
    "AI second opinion",
    "AI session persistence",
    "AI coding tools",
    "developer tools",
    "Cursor AI memory",
    "ChatGPT memory",
    "Windows app",
    "MCP server",
    "MakoBot",
    "Mako Logics",
    "MakoBytes",
  ],
  openGraph: {
    title: "MakoBot — Local AI Workbench for Windows",
    description:
      "Free local AI Workbench for Windows. Permanent memory across every AI tool, plus one-line plug-ins that cross-check answers with GPT, Claude, and Gemini.",
    url: "https://makobot.com",
    siteName: "MakoBot",
    type: "website",
    images: [
      {
        url: "https://makobot.com/images/og.jpg",
        width: 1392,
        height: 752,
        alt: "MakoBot — Local AI Workbench",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakoBot — Local AI Workbench for Windows",
    description:
      "Free local AI Workbench for Windows. Memory + multi-model plug-ins for every AI coding tool you use.",
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
        "Local AI Workbench for Windows. Gives every AI coding tool persistent searchable memory across every project, plus one-line plug-ins that fan out to GPT, Claude, and Gemini for second opinions on any answer.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows 10, Windows 11",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: "https://makobot.com",
      downloadUrl: "https://makobot.com/get-key",
      softwareVersion: MAKOBOT_VERSION,
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
    {
      "@type": "VideoObject",
      name: "MakoBot — Local AI Workbench for Windows",
      description:
        "Five-second hero loop showing the MakoBot local AI Workbench, the desktop app that gives every AI coding tool you use persistent memory and cross-checked second opinions.",
      thumbnailUrl: "https://makobot.com/images/hero-poster.jpg",
      contentUrl: "https://makobot.com/videos/hero.mp4",
      uploadDate: SITE_LAST_UPDATED,
      duration: "PT5S",
      publisher: {
        "@type": "Organization",
        name: "Mako Logics",
        url: "https://makobot.com",
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
