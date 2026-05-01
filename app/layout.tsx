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
  title: "MakoBot — Your local AI Workbench: Memory, Search, AI Tools",
  description:
    "MakoBot is the free local AI Workbench for Windows. Gives Claude Code, Cursor, ChatGPT, and Gemini permanent searchable memory across every project, plus one-line plug-ins (@verify, @audit, @codereview, @designreview, @contractreview) that fan out to GPT, Claude, and Gemini for second opinions.",
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
    title: "MakoBot — Your local AI Workbench: Memory, Search, AI Tools",
    description:
      "Free local AI Workbench for Windows. Permanent searchable memory across every project + one-line plug-ins that cross-check answers against GPT, Claude, and Gemini.",
    url: "https://makobot.com",
    siteName: "MakoBot",
    type: "website",
    images: [
      {
        url: "https://makobot.com/images/og.jpg",
        width: 1392,
        height: 752,
        alt: "MakoBot — Your local AI Workbench",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakoBot — Your local AI Workbench: Memory, Search, AI Tools",
    description:
      "Free local AI Workbench for Windows. Memory + search + multi-model plug-ins for every AI coding tool you use.",
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
