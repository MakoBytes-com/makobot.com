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
} from "recharts";

interface Stats {
  totals: {
    totalUsers: number;
    totalKeys: number;
    activeKeys: number;
    totalDownloads: number;
    pageViews30d: number;
    uniqueVisitors30d: number;
  };
  charts: {
    signupsPerDay: Array<{ date: string; count: number }>;
    downloadsPerDay: Array<{ date: string; count: number }>;
    pageViewsPerDay: Array<{ date: string; count: number }>;
  };
  topPages: Array<{ path: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  recentEvents: Array<{
    id: number;
    type: string;
    data: Record<string, unknown>;
    email: string;
    name: string;
    created_at: string;
  }>;
  recentDownloads: Array<{
    id: number;
    email: string;
    name: string;
    version: string;
    created_at: string;
    ip: string;
    user_agent: string;
  }>;
}

function StatCard({
  label,
  value,
  color = "#0061aa",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
      <p className="text-sm text-[#777777] mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

const chartTheme = {
  bg: "#f8f9fb",
  grid: "#dbdbdb",
  text: "#777777",
  blue: "#0061aa",
  green: "#10B981",
  purple: "#8B5CF6",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load stats");
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#777777]">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#DC2626]">Error: {error || "Failed to load"}</p>
      </div>
    );
  }

  const { totals, charts, topPages, topReferrers, recentEvents, recentDownloads } = stats;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Users" value={totals.totalUsers} color="#0061aa" />
        <StatCard label="Active Keys" value={totals.activeKeys} color="#10B981" />
        <StatCard label="Total Keys" value={totals.totalKeys} color="#8B5CF6" />
        <StatCard label="Downloads" value={totals.totalDownloads} color="#F59E0B" />
        <StatCard label="Page Views (30d)" value={totals.pageViews30d} color="#EC4899" />
        <StatCard label="Unique Visitors (30d)" value={totals.uniqueVisitors30d} color="#6366F1" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Signups chart */}
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Signups (30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={charts.signupsPerDay}>
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
              <Area type="monotone" dataKey="count" stroke={chartTheme.blue} fill={chartTheme.blue} fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Downloads chart */}
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Downloads (30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.downloadsPerDay}>
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
              <Bar dataKey="count" fill={chartTheme.green} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Page views chart */}
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Page Views (30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={charts.pageViewsPerDay}>
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
              <Area type="monotone" dataKey="count" stroke={chartTheme.purple} fill={chartTheme.purple} fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top pages + referrers */}
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Top Pages & Referrers</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#999999] uppercase tracking-wider mb-2">Pages</p>
              {topPages.length === 0 ? (
                <p className="text-xs text-[#777777]">No data yet</p>
              ) : (
                topPages.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-[#555555] truncate mr-4">{p.path}</span>
                    <span className="text-[#777777] font-mono">{p.count}</span>
                  </div>
                ))
              )}
            </div>
            <div>
              <p className="text-xs text-[#999999] uppercase tracking-wider mb-2">Referrers</p>
              {topReferrers.length === 0 ? (
                <p className="text-xs text-[#777777]">No data yet</p>
              ) : (
                topReferrers.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-[#555555] truncate mr-4">{r.referrer}</span>
                    <span className="text-[#777777] font-mono">{r.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent downloads */}
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Recent Downloads</h3>
          {recentDownloads.length === 0 ? (
            <p className="text-sm text-[#777777]">No downloads yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#999999] text-xs border-b border-[#dbdbdb]">
                    <th className="text-left py-2 font-medium">User</th>
                    <th className="text-left py-2 font-medium">Version</th>
                    <th className="text-left py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDownloads.map((d) => (
                    <tr key={d.id} className="border-b border-[#dbdbdb]/30">
                      <td className="py-2 text-[#555555]">{d.email}</td>
                      <td className="py-2 text-[#777777]">{d.version}</td>
                      <td className="py-2 text-[#999999]">
                        {new Date(d.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent events */}
        <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
          <h3 className="text-sm font-medium text-[#777777] mb-4">Recent Events</h3>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-[#777777]">No events yet</p>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((e) => (
                <div key={e.id} className="flex items-start gap-3 py-2 border-b border-[#dbdbdb]/30">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-[#dbdbdb] text-[#555555]">
                    {e.type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#555555] truncate">{e.email || "anonymous"}</p>
                    <p className="text-xs text-[#999999]">
                      {new Date(e.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
