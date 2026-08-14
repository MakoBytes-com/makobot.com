import { NextRequest, NextResponse } from "next/server";
import { getKeyByString, trackEvent } from "@/lib/db";

// License validation for the MakoBot desktop app (Build 319+).
//
// POST { key: "MAKO-XXXX-XXXX-XXXX-XXXX", version?: "2.0.0.319" }
//
// Response (always 200 unless rate-limited or malformed):
//   { "valid": true,  "status": "active",  "tier": "free" | "pro" }
//   { "valid": false, "status": "revoked", "tier": null }
//   { "valid": false, "status": "not_found", "tier": null }
//
// The app calls this at activation (fail-closed: no server confirmation, no
// activation) and daily for the stored key (fail-open: if this endpoint is
// unreachable the app keeps running — an outage here must never lock users
// out). Key space is 16 hex chars, so enumeration via this endpoint is not
// practical; the per-IP limit below blunts scripted probing anyway.

const KEY_RX = /^MAKO-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;

// Per-IP rate limit, 10/min in-memory (per warm instance — same tradeoff as
// the /api/analytics beacon). Legit traffic is one call at activation and one
// a day per install.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, { n: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.n++;
  return h.n > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").slice(0, 100);
    if (rateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

    const body = await req.json().catch(() => ({}));
    const key = typeof body.key === "string" ? body.key.trim().toUpperCase().slice(0, 50) : "";
    const version = typeof body.version === "string" ? body.version.slice(0, 50) : null;

    if (!KEY_RX.test(key)) {
      return NextResponse.json({ valid: false, status: "not_found", tier: null }, { status: 400 });
    }

    const row = await getKeyByString(key);
    const status = row ? (row.status === "active" ? "active" : "revoked") : "not_found";
    const valid = status === "active";

    // Masked key in the event log — the full key IS the credential.
    await trackEvent(
      "key_validate",
      { key: `MAKO-…${key.slice(-4)}`, result: status, version },
      row ? Number(row.user_id) : null,
      ip
    ).catch(() => {});

    return NextResponse.json({ valid, status, tier: valid ? row.tier : null });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
