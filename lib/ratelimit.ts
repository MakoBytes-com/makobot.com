/**
 * In-memory rate limiting for public routes (fleet pattern, from GovSprint
 * via handpenned). A per-instance guard against casual abuse and runaway
 * clients, not a distributed quota: it resets on deploy and does not
 * coordinate across serverless instances.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Bound memory. Without this a burst of unique IPs grows the map forever.
  if (buckets.size > MAX_KEYS) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
    if (buckets.size > MAX_KEYS) buckets.clear();
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt, retryAfterSeconds: 0 };
  }

  existing.count++;
  const ok = existing.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/** The client IP, however this request reached us. */
export function ipOf(request: Request): string | null {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

/** Best-effort client identity behind Vercel's proxy. */
export function clientKey(request: Request, scope: string): string {
  return `${scope}:${ipOf(request) ?? "unknown"}`;
}

/**
 * The first three octets only: enough to tell one visitor's repeated
 * request from a hundred visitors, which is all a ticket needs an address
 * for. The privacy policy says we do not profile visitors.
 */
export function ipPrefix(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const v4 = ip.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (v4) return `${v4[1]}.x`;
  const v6 = ip.trim().split(":").slice(0, 3).join(":");
  return v6 ? `${v6}::x` : null;
}

export function rateLimitHeaders(r: RateLimitResult, limit: number) {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(r.remaining),
    "X-RateLimit-Reset": String(Math.floor(r.resetAt / 1000)),
    ...(r.ok ? {} : { "Retry-After": String(r.retryAfterSeconds) }),
  };
}
