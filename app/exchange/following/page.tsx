"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Footer } from "../../components";
import { ListingCard } from "../components";
import type { ExchangeListing } from "@/lib/exchange";

export default function FollowingPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<ExchangeListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) { setLoading(false); return; }
    fetch("/api/exchange/listings?sort=newest")
      .then(() => fetch("/api/exchange/listings?feed=following"))
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  if (!session?.user) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#E8EDF3] mb-4">Sign in to see your following feed</h1>
          <Link href="/get-key" className="text-[#3B82F6]">Sign In</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/exchange" className="text-[#3B82F6] hover:text-[#60A5FA]">Exchange</Link>
            <span className="text-[#4B5563]">/</span>
            <span className="text-[#E8EDF3]">Following</span>
          </div>
          <h1 className="text-3xl font-bold text-[#E8EDF3] mb-2">Following</h1>
          <p className="text-[#8B95A8] mb-8">Latest listings from creators you follow</p>

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
              <p className="text-[#8B95A8] text-lg mb-2">Your following feed is empty.</p>
              <p className="text-[#6B7280] text-sm">Follow creators on their profile pages to see their new listings here.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
