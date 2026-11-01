"use client";

import { useEffect, useState } from "react";

interface Signup {
  id: number;
  email: string;
  source: string | null;
  created_at: string;
}

/** The release waitlist: people to email once when MakoBot is back (lib/offline.ts). */
export default function AdminWaitlistPage() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/waitlist")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Could not load the list (${res.status}).`);
        setSignups(data.signups || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the list."))
      .finally(() => setLoading(false));
  }, []);

  async function copyAll() {
    await navigator.clipboard.writeText(signups.map((s) => s.email).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Waitlist</h1>
          <p className="text-sm text-[#777777] mt-1">
            People who asked to hear when MakoBot is back. Email them once on relaunch.
          </p>
        </div>
        {signups.length > 0 && (
          <button
            type="button"
            onClick={copyAll}
            className="px-4 py-2 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold"
          >
            {copied ? "Copied!" : `Copy all ${signups.length} emails`}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-[#777777]">Loading…</p>
      ) : error ? (
        <p role="alert" className="text-sm text-[#a8232b] bg-[#fef2f2] border border-[#ffcaca] rounded-lg px-3 py-2">{error}</p>
      ) : signups.length === 0 ? (
        <p className="text-[#777777]">Nobody has signed up yet.</p>
      ) : (
        <table className="w-full text-sm bg-white border border-[#dbdbdb] rounded-lg overflow-hidden">
          <thead className="bg-[#f8f9fb] text-left text-xs uppercase tracking-wider text-[#777777]">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Signed up from</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {signups.map((s) => (
              <tr key={s.id} className="border-t border-[#dbdbdb]">
                <td className="px-4 py-3 text-[#333333]">{s.email}</td>
                <td className="px-4 py-3 text-[#777777]">{s.source ?? "unknown"}</td>
                <td className="px-4 py-3 text-[#777777] tabular-nums">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
