"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Footer } from "../../../components";
import { ListingCard } from "../../components";
import type { ExchangeListing } from "@/lib/exchange";

interface CollectionDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  author_name: string;
  author_avatar: string;
  author_username: string;
  user_id: number;
  created_at: string;
  items: ExchangeListing[];
}

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/exchange/collections/${slug}`)
      .then((r) => r.json())
      .then((data) => setCollection(data.collection || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-[#dbdbdb] rounded w-1/3 mb-4" />
          <div className="h-4 bg-[#dbdbdb] rounded w-2/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-[#dbdbdb] rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Collection not found</h1>
          <Link href="/exchange/collections" className="text-[#0061aa]">Back to Collections</Link>
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
            <Link href="/exchange" className="text-[#0061aa] hover:text-[#60A5FA] font-medium transition-colors">Exchange</Link>
            <span className="text-[#777777]">/</span>
            <Link href="/exchange/collections" className="text-[#0061aa] hover:text-[#60A5FA] font-medium transition-colors">Collections</Link>
            <span className="text-[#777777]">/</span>
            <span className="text-[#333333] font-medium">{collection.title}</span>
          </div>

          <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] mb-8">
            <h1 className="text-2xl font-bold text-[#333333] mb-2">{collection.title}</h1>
            <p className="text-sm text-[#777777] mb-4">{collection.description}</p>
            <div className="flex items-center gap-4 text-xs text-[#999999]">
              <Link href={`/exchange/user/${collection.user_id}`} className="flex items-center gap-2 hover:opacity-80">
                {collection.author_avatar && <img src={collection.author_avatar} alt="" className="w-5 h-5 rounded-full" />}
                <span className="text-[#0061aa] font-medium">@{collection.author_username || "user"}</span>
              </Link>
              <span>{collection.items.length} items</span>
              <span>{new Date(collection.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {collection.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {collection.items.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#f8f9fb] rounded-xl border border-[#dbdbdb]">
              <p className="text-[#777777]">This collection is empty.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
