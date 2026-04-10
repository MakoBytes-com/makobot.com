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
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#6366F1", "#14B8A6", "#F97316"];

const chartTheme = {
  grid: "#374151",
  text: "#8B95A8",
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
        <p className="text-[#8B95A8]">Loading analytics...</p>
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
        <div className="bg-[#252B3B] rounded-xl p-5 border border-[#374151]">
          <p className="text-xs text-[#8B95A8] uppercase tracking-wider mb-1">Page Views (30d)</p>
          <p className="text-2xl font-bold text-[#EC4899]">{data.totals.pageViews30d.toLocaleString()}</p>
        </div>
        <div className="bg-[#252B3B] rounded-xl p-5 border border-[#374151]">
          <p className="text-xs text-[#8B95A8] uppercase tracking-wider mb-1">Unique Visitors (30d)</p>
          <p className="text-2xl font-bold text-[#8B5CF6]">{data.totals.uniqueVisitors30d.toLocaleString()}</p>
        </div>
        <div className="bg-[#252B3B] rounded-xl p-5 border border-[#374151]">
          <p className="text-xs text-[#8B95A8] uppercase tracking-wider mb-1">Total Downloads</p>
          <p className="text-2xl font-bold text-[#10B981]">{data.totals.totalDownloads.toLocaleString()}</p>
        </div>
        <div className="bg-[#252B3B] rounded-xl p-5 border border-[#374151]">
          <p className="text-xs text-[#8B95A8] uppercase tracking-wider mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-[#F59E0B]">{conversionRate}%</p>
          <p className="text-xs text-[#6B7280]">signup → download</p>
        </div>
      </div>

      {/* Main traffic chart */}
      <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151] mb-6">
        <h3 className="text-sm font-medium text-[#8B95A8] mb-4">Traffic Overview (30 days)</h3>
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
              contentStyle={{ background: "#1E2330", border: "1px solid #374151", borderRadius: 8, color: "#E8EDF3" }}
            />
            <Area type="monotone" dataKey="count" stroke="#EC4899" fill="#EC4899" fillOpacity={0.1} name="Page Views" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Signups vs Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151]">
          <h3 className="text-sm font-medium text-[#8B95A8] mb-4">Signups vs Downloads (30 days)</h3>
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
                contentStyle={{ background: "#1E2330", border: "1px solid #374151", borderRadius: 8, color: "#E8EDF3" }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Signups" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top pages pie */}
        <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151]">
          <h3 className="text-sm font-medium text-[#8B95A8] mb-4">Top Pages</h3>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-[#4B5563] text-center py-8">No data yet</p>
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
                    contentStyle={{ background: "#1E2330", border: "1px solid #374151", borderRadius: 8, color: "#E8EDF3" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.topPages.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-[#C0C8D8] truncate flex-1">{p.path}</span>
                    <span className="text-[#8B95A8] font-mono text-xs">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referrers table */}
      <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151]">
        <h3 className="text-sm font-medium text-[#8B95A8] mb-4">Top Referrers (30 days)</h3>
        {data.topReferrers.length === 0 ? (
          <p className="text-sm text-[#4B5563]">No referrer data yet</p>
        ) : (
          <div className="space-y-3">
            {data.topReferrers.map((r, i) => {
              const maxCount = data.topReferrers[0]?.count || 1;
              const pct = (r.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#C0C8D8] truncate mr-4">{r.referrer}</span>
                    <span className="text-[#8B95A8] font-mono flex-shrink-0">{r.count}</span>
                  </div>
                  <div className="h-1.5 bg-[#1E2330] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#3B82F6]" style={{ width: `${pct}%` }} />
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
