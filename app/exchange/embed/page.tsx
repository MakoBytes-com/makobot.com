"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Footer } from "../../components";

function EmbedContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const [copied, setCopied] = useState<string | null>(null);

  const badgeUrl = `https://makobot.com/api/exchange/badge?slug=${slug}`;
  const listingUrl = `https://makobot.com/exchange/${slug}`;

  const markdownCode = `[![Featured on MakoBot Exchange](${badgeUrl})](${listingUrl})`;
  const htmlCode = `<a href="${listingUrl}"><img src="${badgeUrl}" alt="Featured on MakoBot Exchange" /></a>`;
  const reactCode = `<a href="${listingUrl}">\n  <img src="${badgeUrl}" alt="Featured on MakoBot Exchange" />\n</a>`;

  function copy(code: string, label: string) {
    navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/exchange" className="text-[#0061aa] hover:text-[#60A5FA] font-medium">Exchange</Link>
            <span className="text-[#777777]">/</span>
            <span className="text-[#333333] font-medium">Embed Badge</span>
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-2">Embed a Badge</h1>
          <p className="text-[#777777] mb-8">
            Show off your listing on your own website, README, or blog. Every embed drives traffic back to your listing.
          </p>

          {slug && (
            <>
              {/* Preview */}
              <div className="bg-[#f8f9fb] rounded-xl p-8 border border-[#dbdbdb] mb-6 text-center">
                <p className="text-xs text-[#999999] uppercase tracking-wide mb-4">Preview</p>
                <img src={badgeUrl} alt="MakoBot Badge" className="mx-auto" />
              </div>

              {/* Markdown */}
              <div className="mb-4">
                <label className="text-sm font-medium text-[#333333] mb-2 block">Markdown (for GitHub READMEs)</label>
                <div className="flex gap-2">
                  <code className="flex-1 bg-[#ffffff] rounded-lg px-3 py-2.5 text-xs text-[#555555] font-mono border border-[#dbdbdb] overflow-x-auto">
                    {markdownCode}
                  </code>
                  <button
                    onClick={() => copy(markdownCode, "md")}
                    className="shrink-0 px-4 py-2.5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-xs font-semibold"
                  >
                    {copied === "md" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* HTML */}
              <div className="mb-4">
                <label className="text-sm font-medium text-[#333333] mb-2 block">HTML (for websites)</label>
                <div className="flex gap-2">
                  <code className="flex-1 bg-[#ffffff] rounded-lg px-3 py-2.5 text-xs text-[#555555] font-mono border border-[#dbdbdb] overflow-x-auto">
                    {htmlCode}
                  </code>
                  <button
                    onClick={() => copy(htmlCode, "html")}
                    className="shrink-0 px-4 py-2.5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-xs font-semibold"
                  >
                    {copied === "html" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* React/JSX */}
              <div className="mb-4">
                <label className="text-sm font-medium text-[#333333] mb-2 block">React / JSX</label>
                <div className="flex gap-2">
                  <pre className="flex-1 bg-[#ffffff] rounded-lg px-3 py-2.5 text-xs text-[#555555] font-mono border border-[#dbdbdb] overflow-x-auto">
                    {reactCode}
                  </pre>
                  <button
                    onClick={() => copy(reactCode, "react")}
                    className="shrink-0 px-4 py-2.5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-xs font-semibold"
                  >
                    {copied === "react" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="bg-[#0061aa]/10 border border-[#0061aa]/30 rounded-lg px-4 py-3 text-sm text-[#0061aa] mt-6">
                The badge auto-updates with your current download count. Paste it anywhere that accepts images.
              </div>
            </>
          )}

          {!slug && (
            <div className="text-center py-16">
              <p className="text-[#777777] mb-4">No listing selected.</p>
              <Link href="/exchange" className="text-[#0061aa]">Browse the Exchange</Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense>
      <EmbedContent />
    </Suspense>
  );
}
