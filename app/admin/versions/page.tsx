"use client";

import { useEffect, useState } from "react";

interface AppVersion {
  version: string;
  build_number: number;
  status: "ok" | "deprecated" | "blocked";
  message: string | null;
  released_at: string;
  updated_at: string;
}

export default function AdminVersionsPage() {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addVersion, setAddVersion] = useState("");
  const [addBuild, setAddBuild] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/versions");
    const data = await res.json();
    setVersions(data.versions || []);
    setLoading(false);
  }

  async function flip(v: AppVersion, newStatus: AppVersion["status"]) {
    let message = v.message;
    if (newStatus !== "ok") {
      const promptText = newStatus === "blocked"
        ? "Block reason (shown to user — be clear about WHY they need to upgrade NOW):"
        : "Deprecation reason (shown as a soft yellow banner to users):";
      const m = window.prompt(promptText, v.message || "");
      if (m === null) return;
      message = m;
    }
    if (newStatus === "blocked") {
      const ok = window.confirm(
        `BLOCK Build ${v.build_number} (${v.version})?\n\n` +
        `This will hard-stop every running instance within ~1 hour. Users will see a modal forcing them to upgrade.\n\n` +
        `Are you sure?`
      );
      if (!ok) return;
    }
    await fetch("/api/admin/versions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version: v.version, status: newStatus, message }),
    });
    await load();
  }

  async function addRow() {
    const buildNum = parseInt(addBuild);
    if (!addVersion || !Number.isFinite(buildNum)) {
      alert("Need both version (e.g. 2.0.0.103) and build number (e.g. 103)");
      return;
    }
    await fetch("/api/admin/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version: addVersion, buildNumber: buildNum, status: "ok" }),
    });
    setAddVersion("");
    setAddBuild("");
    setShowAdd(false);
    await load();
  }

  function statusPill(status: string) {
    const map: Record<string, { bg: string; fg: string; label: string }> = {
      ok: { bg: "#10B98120", fg: "#10B981", label: "OK" },
      deprecated: { bg: "#F59E0B20", fg: "#F59E0B", label: "DEPRECATED" },
      blocked: { bg: "#DC262620", fg: "#DC2626", label: "BLOCKED" },
    };
    const s = map[status] || map.ok;
    return (
      <span style={{ background: s.bg, color: s.fg }} className="px-2 py-1 rounded text-xs font-mono font-bold">
        {s.label}
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">App Versions — Kill Switch</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold"
        >
          {showAdd ? "Cancel" : "+ Register Version"}
        </button>
      </div>

      <p className="text-sm text-[#777777] mb-6 max-w-3xl">
        Each row is a published MakoBot build. Flip a row to{" "}
        <span className="text-[#F59E0B] font-mono">DEPRECATED</span> to show a
        soft yellow banner to users on that build (recommend they update). Flip
        to <span className="text-[#DC2626] font-mono">BLOCKED</span> to hard-stop
        the app on that build — users see a modal forcing them to upgrade. The
        desktop client polls this every hour, so changes propagate within ~60 minutes.
        Use BLOCKED only for genuinely dangerous bugs (memory leaks, data corruption,
        security holes).
      </p>

      {showAdd && (
        <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] p-4 mb-6 flex gap-3 items-end">
          <div>
            <label className="block text-xs text-[#777777] mb-1">Version</label>
            <input
              value={addVersion}
              onChange={(e) => setAddVersion(e.target.value)}
              placeholder="2.0.0.103"
              className="bg-[#ffffff] border border-[#dbdbdb] rounded px-3 py-2 text-sm text-[#333333] font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-[#777777] mb-1">Build #</label>
            <input
              value={addBuild}
              onChange={(e) => setAddBuild(e.target.value)}
              placeholder="103"
              className="bg-[#ffffff] border border-[#dbdbdb] rounded px-3 py-2 text-sm text-[#333333] font-mono w-24"
            />
          </div>
          <button
            onClick={addRow}
            className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold"
          >
            Register
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-[#777777]">Loading...</p>
      ) : versions.length === 0 ? (
        <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] p-8 text-center text-[#777777]">
          No versions registered yet. Register Build 102 + future builds with{" "}
          <span className="text-[#0061aa] font-mono">+ Register Version</span> above.
        </div>
      ) : (
        <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ffffff] text-[#777777] text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Build</th>
                <th className="text-left px-4 py-3 font-medium">Version</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Message</th>
                <th className="text-left px-4 py-3 font-medium">Released</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.version} className="border-t border-[#dbdbdb]/50 hover:bg-[#dbdbdb]/20">
                  <td className="px-4 py-3 text-[#0061aa] font-mono font-bold">{v.build_number}</td>
                  <td className="px-4 py-3 text-[#555555] font-mono">{v.version}</td>
                  <td className="px-4 py-3">{statusPill(v.status)}</td>
                  <td className="px-4 py-3 text-[#777777] text-xs max-w-md truncate">
                    {v.message || <span className="text-[#777777]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[#999999] text-xs whitespace-nowrap">
                    {new Date(v.released_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {v.status !== "ok" && (
                        <button
                          onClick={() => flip(v, "ok")}
                          className="px-2 py-1 text-xs rounded bg-[#10B98120] text-[#10B981] hover:bg-[#10B98140]"
                        >
                          Mark OK
                        </button>
                      )}
                      {v.status !== "deprecated" && (
                        <button
                          onClick={() => flip(v, "deprecated")}
                          className="px-2 py-1 text-xs rounded bg-[#F59E0B20] text-[#F59E0B] hover:bg-[#F59E0B40]"
                        >
                          Deprecate
                        </button>
                      )}
                      {v.status !== "blocked" && (
                        <button
                          onClick={() => flip(v, "blocked")}
                          className="px-2 py-1 text-xs rounded bg-[#DC262620] text-[#DC2626] hover:bg-[#DC262640]"
                        >
                          Block
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
