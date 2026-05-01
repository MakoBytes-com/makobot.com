"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Footer } from "../../../components";
import { CATEGORIES, PLATFORMS } from "@/lib/exchange";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/exchange/my-listings");
        if (!res.ok) { setNotFound(true); setLoading(false); return; }
        const data = await res.json();
        const listing = data.listings?.find((l: { id: number }) => l.id === parseInt(id));
        if (!listing) { setNotFound(true); setLoading(false); return; }
        setTitle(listing.title);
        setDescription(listing.description);
        setCategory(listing.category);
        setPlatforms(listing.platforms || []);
        setContent(listing.content || "");
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  function togglePlatform(value: string) {
    setPlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !category || platforms.length === 0) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/exchange/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          platforms,
          content: content.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        setSaving(false);
        return;
      }

      router.push("/exchange/my-listings");
    } catch {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Sign in required</h1>
          <Link href="/get-key" className="text-[#0061aa] hover:text-[#004d88]">Sign In</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#dbdbdb] rounded w-1/3" />
            <div className="h-10 bg-[#dbdbdb] rounded" />
            <div className="h-24 bg-[#dbdbdb] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen">
        <div className="pt-8 px-6 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Listing not found</h1>
          <p className="text-[#777777] mb-4">This listing doesn't exist or doesn't belong to you.</p>
          <Link href="/exchange/my-listings" className="text-[#0061aa] hover:text-[#004d88]">Back to My Listings</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/exchange" className="text-[#0061aa] hover:text-[#60A5FA] font-medium transition-colors">Exchange</Link>
            <span className="text-[#777777]">/</span>
            <Link href="/exchange/my-listings" className="text-[#0061aa] hover:text-[#60A5FA] font-medium transition-colors">My Listings</Link>
            <span className="text-[#777777]">/</span>
            <span className="text-[#333333] font-medium">Edit</span>
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-2">Edit Listing</h1>
          <p className="text-[#777777] mb-8">
            Update your listing details. Changes may require re-approval.
          </p>

          {error && (
            <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] rounded-lg px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
                className="w-full px-4 py-3 rounded-lg bg-[#f8f9fb] border border-[#dbdbdb] text-[#333333] text-sm focus:outline-none focus:border-[#0061aa] transition-colors" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#f8f9fb] border border-[#dbdbdb] text-[#333333] text-sm focus:outline-none focus:border-[#0061aa] transition-colors">
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label} — {c.description}</option>
                ))}
              </select>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Platforms *</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button key={p.value} type="button" onClick={() => togglePlatform(p.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      platforms.includes(p.value) ? "text-white" : "bg-[#f8f9fb] text-[#777777] border border-[#dbdbdb] hover:text-[#333333]"
                    }`}
                    style={platforms.includes(p.value) ? { backgroundColor: p.color } : undefined}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} rows={4}
                className="w-full px-4 py-3 rounded-lg bg-[#f8f9fb] border border-[#dbdbdb] text-[#333333] text-sm focus:outline-none focus:border-[#0061aa] transition-colors resize-none" />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10}
                className="w-full px-4 py-3 rounded-lg bg-[#ffffff] border border-[#dbdbdb] text-[#555555] text-sm font-mono focus:outline-none focus:border-[#0061aa] transition-colors resize-none" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving}
                className="flex-1 py-3 rounded-lg bg-[#0061aa] hover:bg-[#004d88] disabled:opacity-50 text-white font-semibold text-base transition-colors">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/exchange/my-listings"
                className="px-6 py-3 rounded-lg bg-[#dbdbdb] hover:bg-[#777777] text-[#333333] font-semibold text-base transition-colors text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
