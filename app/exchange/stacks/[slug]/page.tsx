"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Footer } from "../../../components";
import { ListingCard } from "../../components";
import type { ExchangeListing } from "@/lib/exchange";

interface Stack {
  id: number;
  title: string;
  slug: string;
  description: string;
  user_id: number;
  author_username: string;
  author_display: string;
  author_avatar: string;
  is_verified: boolean;
  download_count: number;
  items: ExchangeListing[];
  created_at: string;
}

export default function StackDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const [stack, setStack] = useState<Stack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/exchange/stacks/${slug}`)
      .then((r) => r.json())
      .then((d) => setStack(d.stack || null))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleDownloadAll() {
    if (!stack) return;
    // Record the stack download
    await fetch(`/api/exchange/stacks/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "download" }),
    });
    // Combine all items into a single text bundle
    const bundle = stack.items
      .map((item, i) => `# ${i + 1}. ${item.title}\n\n## Description\n${item.description}\n\n## Content\n\n${item.content || "(No content)"}\n\n---\n`)
      .join("\n");
    const fullBundle = `# ${stack.title}\n\n${stack.description}\n\n---\n\n${bundle}`;
    const blob = new Blob([fullBundle], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stack.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStack((prev) => prev ? { ...prev, download_count: prev.download_count + 1 } : prev);
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-[#dbdbdb] rounded w-1/3 mb-4" />
          <div className="h-4 bg-[#dbdbdb] rounded w-2/3 mb-8" />
        </div>
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Stack not found</h1>
          <Link href="/exchange/stacks" className="text-[#0061aa]">Back to Stacks</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/exchange" className="text-[#0061aa] hover:text-[#60A5FA]">Exchange</Link>
            <span className="text-[#777777]">/</span>
            <Link href="/exchange/stacks" className="text-[#0061aa] hover:text-[#60A5FA]">Stacks</Link>
            <span className="text-[#777777]">/</span>
            <span className="text-[#333333]">{stack.title}</span>
          </div>

          {/* Header */}
          <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0061aa" strokeWidth={2}>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span className="text-sm font-semibold text-[#0061aa] uppercase tracking-wide">Skill Stack</span>
            </div>
            <h1 className="text-3xl font-bold text-[#333333] mb-3">{stack.title}</h1>
            <p className="text-sm text-[#555555] leading-relaxed mb-4">{stack.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#777777] mb-4">
              <Link href={`/exchange/user/${stack.user_id}`} className="flex items-center gap-2 hover:opacity-80">
                {stack.author_avatar && <img src={stack.author_avatar} alt="" className="w-6 h-6 rounded-full" />}
                <span className="text-[#0061aa] font-medium">@{stack.author_username}</span>
              </Link>
              <span>{stack.items.length} items</span>
              <span>{stack.download_count} downloads</span>
              <span>{new Date(stack.created_at).toLocaleDateString()}</span>
            </div>

            {stack.items.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="inline-flex items-center px-6 py-2.5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white font-semibold text-sm transition-colors"
              >
                <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Entire Stack
              </button>
            )}
          </div>

          {/* Items */}
          <h2 className="text-lg font-bold text-[#333333] mb-4">What's Inside ({stack.items.length})</h2>
          {stack.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stack.items.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#f8f9fb] rounded-xl border border-[#dbdbdb]">
              <p className="text-[#777777]">This stack is empty.</p>
              {session?.user?.id === String(stack.user_id) && (
                <p className="text-sm text-[#999999] mt-2">Browse the exchange and add listings to your stack.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
