"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  avatar_url: string;
  is_admin: boolean;
  created_at: string;
  key_count: number;
  download_count: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false));
  }, []);

  async function toggleAdmin(userId: number, currentState: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isAdmin: !currentState }),
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_admin: !u.is_admin } : u))
    );
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-[#8B95A8]">{users.length} total</span>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-[#252B3B] border border-[#374151] rounded-lg px-4 py-3 text-sm text-[#E8EDF3] placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6]"
        />
      </div>

      {loading ? (
        <p className="text-[#8B95A8]">Loading users...</p>
      ) : (
        <div className="bg-[#252B3B] rounded-xl border border-[#374151] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1E2330] text-[#8B95A8] text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-center px-4 py-3 font-medium">Keys</th>
                  <th className="text-center px-4 py-3 font-medium">Downloads</th>
                  <th className="text-center px-4 py-3 font-medium">Admin</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-t border-[#374151]/50 hover:bg-[#374151]/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center text-xs text-[#8B95A8]">
                            {user.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <span className="text-[#E8EDF3] font-medium">{user.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#C0C8D8]">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[#3B82F6] font-mono">{user.key_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[#10B981] font-mono">{user.download_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.is_admin
                            ? "bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30"
                            : "bg-[#374151] text-[#6B7280] hover:bg-[#4B5563]"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                      {search ? "No users match your search" : "No users yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
