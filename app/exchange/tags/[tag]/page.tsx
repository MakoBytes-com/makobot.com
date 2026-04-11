"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Footer } from "../../../components";
import { ListingCard } from "../../components";
import type { ExchangeListing } from "@/lib/exchange";

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const [listings, setListings] = useState<ExchangeListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tag) return;
    fetch(`/api/exchange/tags?tag=${encodeURIComponent(tag)}`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .finally(() => setLoading(false));
  }, [tag]);

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/exchange" className="text-[#3B82F6] hover:text-[#60A5FA]">Exchange</Link>
            <span className="text-[#4B5563]">/</span>
            <span className="text-[#E8EDF3]">Tag: {tag}</span>
          </div>
          <h1 className="text-3xl font-bold text-[#E8EDF3] mb-2">
            <span className="text-[#EC4899]">#</span>{tag}
          </h1>
          <p className="text-[#8B95A8] mb-8">Listings tagged with {tag}</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#252B3B] rounded-xl p-5 border border-[#374151] animate-pulse h-48" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#8B95A8]">No listings tagged with "{tag}" yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
