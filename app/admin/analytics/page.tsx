"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  totals: {
    pageViews30d: number;
    uniqueVisitors30d: number;
    totalDownloads: number;
    totalUsers: number;
  };
  charts: {
    pageViewsPerDay: Array<{ date: string; count: number }>;
    downloadsPerDay: Array<{ date: string; count: number }>;
    signupsPerDay: Array<{ date: string; count: number }>;
  };
  topPages: Array<{ path: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  outsideReferrals: {
    external: Array<{ hostname: string; count: number | string }>;
    directCount: number;
  };
}

// Map a hostname to a friendly source name + category. The dictionary covers
// the common search engines, social, AI tools, and dev communities; anything
// not matched falls through to "Other" with the bare hostname shown.
type SourceCategory = "Search" | "Social" | "AI" | "Community" | "Email" | "Direct" | "Other";
interface SourceMatch {
  name: string;
  category: SourceCategory;
  icon: string;
}

function classifySource(hostname: string): SourceMatch {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  // Search engines
  if (h.startsWith("google.") || h === "google" || /^google\.[a-z.]+$/.test(h)) return { name: "Google", category: "Search", icon: "🔍" };
  if (h.includes("bing.com")) return { name: "Bing", category: "Search", icon: "🔍" };
  if (h.includes("duckduckgo.com")) return { name: "DuckDuckGo", category: "Search", icon: "🦆" };
  if (h.includes("yahoo.com")) return { name: "Yahoo", category: "Search", icon: "🔍" };
  if (h.includes("yandex.")) return { name: "Yandex", category: "Search", icon: "🔍" };
  if (h.includes("baidu.com")) return { name: "Baidu", category: "Search", icon: "🔍" };
  if (h.includes("ecosia.org")) return { name: "Ecosia", category: "Search", icon: "🌱" };
  if (h.includes("brave.com") || h.includes("search.brave.com")) return { name: "Brave Search", category: "Search", icon: "🦁" };
  if (h.includes("kagi.com")) return { name: "Kagi", category: "Search", icon: "🔍" };

  // AI tools
  if (h === "chatgpt.com" || h.includes("chat.openai.com") || h.includes("openai.com")) return { name: "ChatGPT", category: "AI", icon: "🤖" };
  if (h === "claude.ai" || h.includes("anthropic.com")) return { name: "Claude", category: "AI", icon: "🤖" };
  if (h.includes("gemini.google.com")) return { name: "Gemini", category: "AI", icon: "🤖" };
  if (h === "perplexity.ai" || h.endsWith(".perplexity.ai")) return { name: "Perplexity", category: "AI", icon: "🤖" };
  if (h.includes("copilot.microsoft.com")) return { name: "Copilot", category: "AI", icon: "🤖" };
  if (h.includes("you.com")) return { name: "You.com", category: "AI", icon: "🤖" };
  if (h.includes("phind.com")) return { name: "Phind", category: "AI", icon: "🤖" };

  // Social / sharing
  if (h.includes("reddit.com")) return { name: "Reddit", category: "Social", icon: "🟧" };
  if (h === "twitter.com" || h === "x.com" || h === "t.co" || h.endsWith(".twitter.com") || h.endsWith(".x.com")) return { name: "Twitter / X", category: "Social", icon: "🐦" };
  if (h.includes("linkedin.com") || h === "lnkd.in") return { name: "LinkedIn", category: "Social", icon: "💼" };
  if (h.includes("facebook.com") || h === "fb.com" || h === "l.facebook.com") return { name: "Facebook", category: "Social", icon: "📘" };
  if (h.includes("youtube.com") || h === "youtu.be") return { name: "YouTube", category: "Social", icon: "▶️" };
  if (h === "discord.com" || h === "discord.gg" || h.endsWith(".discord.com")) return { name: "Discord", category: "Social", icon: "💬" };
  if (h.includes("mastodon")) return { name: "Mastodon", category: "Social", icon: "🐘" };
  if (h.includes("threads.net")) return { name: "Threads", category: "Social", icon: "🧵" };
  if (h.includes("bsky.app") || h.includes("bsky.social")) return { name: "Bluesky", category: "Social", icon: "🦋" };
  if (h.includes("tiktok.com")) return { name: "TikTok", category: "Social", icon: "🎵" };
  if (h.includes("instagram.com")) return { name: "Instagram", category: "Social", icon: "📸" };

  // Dev communities
  if (h.includes("news.ycombinator.com") || h === "hn.algolia.com") return { name: "Hacker News", category: "Community", icon: "🟧" };
  if (h.includes("producthunt.com")) return { name: "Product Hunt", category: "Community", icon: "🚀" };
  if (h.includes("github.com") || h === "gist.github.com") return { name: "GitHub", category: "Community", icon: "🐙" };
  if (h.includes("stackoverflow.com")) return { name: "Stack Overflow", category: "Community", icon: "📚" };
  if (h.includes("dev.to")) return { name: "DEV.to", category: "Community", icon: "💻" };
  if (h.includes("medium.com")) return { name: "Medium", category: "Community", icon: "📝" };
  if (h.includes("substack.com") || h.endsWith(".substack.com")) return { name: "Substack", category: "Community", icon: "✉️" };
  if (h.includes("indiehackers.com")) return { name: "Indie Hackers", category: "Community", icon: "🛠️" };

  // Email
  if (h === "mail.google.com" || h === "outlook.live.com" || h === "outlook.office.com" || h.includes("yahoomail")) return { name: hostname, category: "Email", icon: "📧" };

  // Anything else — keep the raw hostname so Russell can spot patterns.
  return { name: hostname, category: "Other", icon: "🌐" };
}

interface AggregatedSource {
  name: string;
  category: SourceCategory;
  icon: string;
  count: number;
  hostnames: string[];
}

function aggregateSources(
  external: Array<{ hostname: string; count: number | string }>,
  directCount: number,
): AggregatedSource[] {
  const map = new Map<string, AggregatedSource>();
  for (const row of external) {
    if (!row.hostname) continue;
    const c = typeof row.count === "string" ? parseInt(row.count) : row.count;
    if (!Number.isFinite(c) || c <= 0) continue;
    const cls = classifySource(row.hostname);
    const key = `${cls.name}::${cls.category}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += c;
      if (!existing.hostnames.includes(row.hostname)) existing.hostnames.push(row.hostname);
    } else {
      map.set(key, { name: cls.name, category: cls.category, icon: cls.icon, count: c, hostnames: [row.hostname] });
    }
  }
  if (directCount > 0) {
    map.set("Direct::Direct", {
      name: "Direct (no referrer)",
      category: "Direct",
      icon: "🔗",
      count: directCount,
      hostnames: [],
    });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

const CATEGORY_COLORS: Record<SourceCategory, string> = {
  Search: "#0061aa",
  Social: "#EC4899",
  AI: "#8B5CF6",
  Community: "#F59E0B",
  Email: "#14B8A6",
  Direct: "#10B981",
  Other: "#999999",
};

const COLORS = ["#0061aa", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#6366F1", "#14B8A6", "#F97316"];

const chartTheme = {
  grid: "#dbdbdb",
  text: "#777777",
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#777777]">Loading analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  const conversionRate =
    data.totals.totalUsers > 0
      ? ((data.totals.totalDownloads / data.totals.totalUsers) * 100).toFixed(1)
      : "0";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f8f9fb] rounded-xl p-5 border border-[#dbdbdb]">
          <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Page Views (30d)</p>
          <p className="text-2xl font-bold text-[#EC4899]">{data.totals.pageViews30d.toLocaleString()}</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-5 border border-[#dbdbdb]">
          <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Unique Visitors (30d)</p>
          <p className="text-2xl font-bold text-[#8B5CF6]">{data.totals.uniqueVisitors30d.toLocaleString()}</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-5 border border-[#dbdbdb]">
          <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Total Downloads</p>
          <p className="text-2xl font-bold text-[#10B981]">{data.totals.totalDownloads.toLocaleString()}</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-5 border border-[#dbdbdb]">
          <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-[#F59E0B]">{conversionRate}%</p>
          <p className="text-xs text-[#999999]">signup → download</p>
        </div>
      </div>

      {/* Main traffic chart */}
      <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] mb-6">
        <h3 className="text-sm font-medium text-[#777777] mb-4">Traffic Overview (30 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.charts.pageViewsPerDay}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis
              dataKey="date"
              tick={{ fill: chartTheme.text, fontSize: 11 }}
              tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
            />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#ffffff", border: "1px solid #dbdbdb", borderRadius: 8, color: "#333333" }}
            />
            <Area type="monotone" dataKey="count" stroke="#EC4899" fill="#EC4899" fillOpacity={0.1} name="Page Views" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Signups vs Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Signups vs Downloads (30 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.charts.signupsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis
                dataKey="date"
                tick={{ fill: chartTheme.text, fontSize: 11 }}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
              />
              <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #dbdbdb", borderRadius: 8, color: "#333333" }}
              />
              <Bar dataKey="count" fill="#0061aa" radius={[4, 4, 0, 0]} name="Signups" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top pages pie */}
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Top Pages</h3>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-[#777777] text-center py-8">No data yet</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={data.topPages.slice(0, 6)}
                    dataKey="count"
                    nameKey="path"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    strokeWidth={0}
                  >
                    {data.topPages.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#ffffff", border: "1px solid #dbdbdb", borderRadius: 8, color: "#333333" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.topPages.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-[#555555] truncate flex-1">{p.path}</span>
                    <span className="text-[#777777] font-mono text-xs">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Outside Referrals — friendly source breakdown */}
      {(() => {
        const sources = data.outsideReferrals
          ? aggregateSources(data.outsideReferrals.external, data.outsideReferrals.directCount)
          : [];
        const totalSourceVisits = sources.reduce((s, x) => s + x.count, 0);
        const externalVisits = sources.filter((s) => s.category !== "Direct").reduce((sum, x) => sum + x.count, 0);
        const directVisits = data.outsideReferrals?.directCount || 0;

        return (
          <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#777777]">Outside Referrals (30 days)</h3>
              <div className="flex gap-4 text-xs">
                <span className="text-[#777777]">
                  External: <span className="text-[#0061aa] font-mono font-semibold">{externalVisits.toLocaleString()}</span>
                </span>
                <span className="text-[#777777]">
                  Direct: <span className="text-[#10B981] font-mono font-semibold">{directVisits.toLocaleString()}</span>
                </span>
              </div>
            </div>

            {sources.length === 0 ? (
              <p className="text-sm text-[#777777] py-4">No outside referral data yet — visits show up here once people start arriving from search engines, social, AI tools, etc.</p>
            ) : (
              <div className="space-y-2">
                {sources.map((s, i) => {
                  const maxCount = sources[0].count || 1;
                  const pct = (s.count / maxCount) * 100;
                  const sharePct = totalSourceVisits > 0 ? ((s.count / totalSourceVisits) * 100).toFixed(1) : "0";
                  const color = CATEGORY_COLORS[s.category];
                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-shrink-0">{s.icon}</span>
                          <span className="text-[#333333] font-medium truncate">{s.name}</span>
                          <span
                            className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{ background: `${color}22`, color }}
                          >
                            {s.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-[#777777] text-xs font-mono">{sharePct}%</span>
                          <span className="text-[#555555] font-mono">{s.count.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#ffffff] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      {s.hostnames.length > 0 && s.hostnames.length <= 4 && s.hostnames[0] !== s.name.toLowerCase() && (
                        <p className="text-[10px] text-[#777777] mt-1 ml-7 font-mono truncate">
                          {s.hostnames.join(" · ")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Referrers table */}
      <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
        <h3 className="text-sm font-medium text-[#777777] mb-4">Top Referrers (raw URLs, 30 days)</h3>
        {data.topReferrers.length === 0 ? (
          <p className="text-sm text-[#777777]">No referrer data yet</p>
        ) : (
          <div className="space-y-3">
            {data.topReferrers.map((r, i) => {
              const maxCount = data.topReferrers[0]?.count || 1;
              const pct = (r.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#555555] truncate mr-4">{r.referrer}</span>
                    <span className="text-[#777777] font-mono flex-shrink-0">{r.count}</span>
                  </div>
                  <div className="h-1.5 bg-[#ffffff] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#0061aa]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
