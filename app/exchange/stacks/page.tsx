"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Footer } from "../../components";

interface Stack {
  id: number;
  title: string;
  slug: string;
  description: string;
  author_username: string;
  author_avatar: string;
  download_count: number;
  item_count: number;
  created_at: string;
}

export default function StacksPage() {
  const { data: session } = useSession();
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exchange/stacks")
      .then((r) => r.json())
      .then((d) => setStacks(d.stacks || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#E8EDF3]">Skill Stacks</h1>
              <p className="text-[#8B95A8] mt-1">Bundle multiple skills, configs, and tools into a single install</p>
            </div>
            {session?.user && (
              <Link
                href="/exchange/stacks/create"
                className="inline-flex items-center px-5 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold transition-colors"
              >
                <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Stack
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#252B3B] rounded-xl p-5 border border-[#374151] animate-pulse h-40" />
              ))}
            </div>
          ) : stacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {stacks.map((s) => (
                <Link
                  key={s.id}
                  href={`/exchange/stacks/${s.slug}`}
                  className="block bg-[#252B3B] rounded-xl p-5 border border-[#374151] feature-card"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2}>
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wide">Stack</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#E8EDF3] mb-2 line-clamp-1">{s.title}</h3>
                  <p className="text-sm text-[#8B95A8] mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
                  <div className="flex items-center justify-between text-xs text-[#6B7280] pt-3 border-t border-[#374151]/50">
                    <span>{s.item_count} items</span>
                    <span>{s.download_count} downloads</span>
                  </div>
                  <div className="mt-2 text-xs text-[#3B82F6]">@{s.author_username}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#8B95A8] text-lg mb-2">No stacks yet.</p>
              <p className="text-[#6B7280] text-sm">Be the first to curate a collection.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
