"use client";
import { Avatar } from "../../components";

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

  // Delete flow. Deleting a user cannot be undone, so it is a two-step:
  // open the panel, then type the email exactly before the button enables.
  const [confirming, setConfirming] = useState<User | null>(null);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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

  function openDelete(user: User) {
    setConfirming(user);
    setTyped("");
    setError("");
    setNotice("");
  }

  async function confirmDelete() {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: confirming.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not delete this user.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== confirming.id));
      const r = data.removed || {};
      setNotice(
        `Deleted ${data.email}. Revoked ${r.keysRevoked ?? 0} licence key(s), ` +
          `removed ${r.listingsDeleted ?? 0} listing(s) and ${r.commentsDeleted ?? 0} comment(s). ` +
          `${r.downloadsDetached ?? 0} download record(s) kept for stats but no longer linked to anyone.`
      );
      setConfirming(null);
    } catch (e) {
      setError((e as Error).message || "Could not delete this user.");
    } finally {
      setDeleting(false);
    }
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
        <span className="text-sm text-[#777777]">{users.length} total</span>
      </div>

      {notice && (
        <div className="mb-6 rounded-lg border border-[#10B981]/40 bg-[#10B981]/10 px-4 py-3 text-sm text-[#333333]">
          {notice}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-[#f8f9fb] border border-[#dbdbdb] rounded-lg px-4 py-3 text-sm text-[#333333] placeholder-[#999999] focus:outline-none focus:border-[#0061aa]"
        />
      </div>

      {loading ? (
        <p className="text-[#777777]">Loading users...</p>
      ) : (
        <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#ffffff] text-[#777777] text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-center px-4 py-3 font-medium">Keys</th>
                  <th className="text-center px-4 py-3 font-medium">Downloads</th>
                  <th className="text-center px-4 py-3 font-medium">Admin</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                  <th className="text-center px-4 py-3 font-medium">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-t border-[#dbdbdb]/50 hover:bg-[#dbdbdb]/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar_url} name={user.name} size={32} />
                        <span className="text-[#333333] font-medium">{user.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#555555]">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[#0061aa] font-mono">{user.key_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[#10B981] font-mono">{user.download_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.is_admin
                            ? "bg-[#0061aa]/20 text-[#0061aa] hover:bg-[#0061aa]/30"
                            : "bg-[#dbdbdb] text-[#999999] hover:bg-[#777777]"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#999999]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.is_admin ? (
                        <span
                          className="text-xs text-[#999999]"
                          title="Admins are protected. Switch them to User first, then delete."
                        >
                          protected
                        </span>
                      ) : (
                        <button
                          onClick={() => openDelete(user)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-[#DC2626] border border-[#DC2626]/40 hover:bg-[#DC2626] hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#999999]">
                      {search ? "No users match your search" : "No users yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white border border-[#dbdbdb] p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#333333] mb-2">
              Delete {confirming.name || confirming.email}?
            </h2>
            <p className="text-sm text-[#555555] leading-relaxed mb-4">
              This cannot be undone. Here is exactly what happens:
            </p>

            <ul className="text-sm text-[#555555] space-y-2 mb-5">
              <li>
                <strong className="text-[#333333]">{confirming.key_count} licence key(s)</strong>{" "}
                are deleted — their copy of MakoBot will stop validating.
              </li>
              <li>
                Their{" "}
                <strong className="text-[#333333]">
                  {confirming.download_count} download record(s)
                </strong>{" "}
                are <em>kept</em> so your stats stay accurate, but are no longer
                linked to a person.
              </li>
              <li>The account itself is removed. They can sign up again from scratch.</li>
            </ul>

            <label className="block text-sm text-[#555555] mb-2">
              Type <span className="font-mono text-[#333333]">{confirming.email}</span> to confirm:
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
              className="w-full bg-[#f8f9fb] border border-[#dbdbdb] rounded-lg px-4 py-3 text-sm text-[#333333] mb-4 focus:outline-none focus:border-[#DC2626]"
            />

            {error && (
              <p className="text-sm text-[#DC2626] mb-4 leading-relaxed">{error}</p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirming(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-lg border border-[#dbdbdb] text-[#555555] font-medium hover:border-[#777777] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting || typed.trim() !== confirming.email}
                className="px-5 py-2.5 rounded-lg bg-[#DC2626] text-white font-semibold hover:bg-[#a8232b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting…" : "Delete this user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
