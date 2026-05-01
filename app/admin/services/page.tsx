"use client";

const services = [
  {
    name: "Vercel",
    url: "https://vercel.com/mako-studi/makobot-com",
    description: "Hosting and deployment platform. makobot.com is deployed here with automatic deploys on git push. Manages SSL, CDN, and serverless functions.",
    category: "Hosting",
  },
  {
    name: "GitHub",
    url: "https://github.com/MakoBytes-com/makobot.com",
    description: "Source code repository. Public repo under the MakoBytes-com org (renamed from russellsailors-hub; old URL still 301-redirects). All code changes are pushed here and auto-deployed by Vercel.",
    category: "Code",
  },
  {
    name: "Neon",
    url: "https://console.neon.tech",
    description: "Serverless PostgreSQL database. Stores users, license keys, downloads, analytics, and the AI Skills Exchange (listings, reviews, downloads). Project: makobot, Region: US East 1.",
    category: "Database",
  },
  {
    name: "Google Cloud Console (OAuth)",
    url: "https://console.cloud.google.com/apis/credentials",
    description: "Google OAuth credentials for user sign-in. Project: MakoBot. Client ID: 1055659970585-... Used by NextAuth for Google sign-in on /get-key.",
    category: "Auth",
  },
  {
    name: "Cloudflare",
    url: "https://dash.cloudflare.com",
    description: "DNS management for makobot.com domain. Points to Vercel. Also provides DDoS protection and caching.",
    category: "DNS",
  },
  {
    name: "Azure Portal (Code Signing)",
    url: "https://portal.azure.com/#view/Microsoft_Azure_TrustedSigning",
    description: "Azure Trusted Signing for code-signing the MakoBot desktop app. Account: rsailors@makologics.com. Resource: makologics (East US). Signing active — every build signed by Mako Logics LLC. Intermediate CA rotates (EOC CA 04, AOC CA 03, AOC CA 04) — Build 84 currently live.",
    category: "Security",
  },
  {
    name: "GitHub Releases (Downloads)",
    url: "https://github.com/MakoBytes-com/makobot.com/releases",
    description: "MakoBot-Setup.zip (desktop app installer, signed with Azure Trusted Signing) is hosted on GitHub Releases on the makobot.com repo. v2.0.0 Build 84 is the current release. Ships the self-healing ClaudeInjector fix, reference-based skills injection (232 KB → 12 KB per project file), and segment-rotation logging so nothing is ever dropped. Auto-updater is in-app since Build 78 — users update without leaving MakoBot. The /get-key download button points here via the DOWNLOAD_URL env var.",
    category: "Distribution",
  },
  {
    name: "Google Search Console",
    url: "https://search.google.com/search-console",
    description: "SEO monitoring and search performance data for makobot.com. Submit sitemaps, check indexing status, monitor search queries.",
    category: "SEO",
  },
];

export default function AdminServicesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#333333] mb-2">Services & Vendors</h1>
      <p className="text-[#777777] mb-8">All third-party services used by makobot.com with direct links to their dashboards.</p>

      <div className="space-y-4">
        {services.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#f8f9fb] rounded-xl p-5 border border-[#dbdbdb] hover:border-[#0061aa]/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold text-[#333333] group-hover:text-[#0061aa] transition-colors">
                    {s.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0061aa]/10 text-[#0061aa]">
                    {s.category}
                  </span>
                </div>
                <p className="text-sm text-[#777777] leading-relaxed">{s.description}</p>
                <p className="text-xs text-[#999999] mt-2 group-hover:text-[#0061aa] transition-colors">{s.url}</p>
              </div>
              <svg className="w-5 h-5 text-[#999999] group-hover:text-[#0061aa] transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
