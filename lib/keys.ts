import { createHmac } from "crypto";

// Build 316 audit (HIGH): fail CLOSED, never fall back to a hardcoded string.
// License keys are HMAC(secret, email) and the C# app validates offline with
// the same secret — so a source-visible default would let anyone forge a
// valid key for any email if the env var were ever missing. Resolved lazily
// (inside key generation, not at module load) so a missing var fails the
// actual request, never the build/import.
function keySecret(): string {
  const s = process.env.LICENSE_KEY_SECRET;
  if (!s) {
    throw new Error("LICENSE_KEY_SECRET is not set — refusing to issue license keys with a default secret.");
  }
  return s;
}

/**
 * Generate a license key for a user.
 * Format: MAKO-XXXX-XXXX-XXXX-XXXX
 *
 * The key is deterministic based on email — same email always gets same key.
 * This means the C# app can validate offline using the same algorithm.
 */
export function generateLicenseKey(email: string): string {
  const hmac = createHmac("sha256", keySecret());
  hmac.update(email.toLowerCase().trim());
  const hash = hmac.digest("hex");

  // Take 16 chars from the hash and format as MAKO-XXXX-XXXX-XXXX-XXXX
  const chars = hash.substring(0, 16).toUpperCase();
  return `MAKO-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}-${chars.slice(12, 16)}`;
}

/**
 * Validate a key format (basic check).
 * Returns true if the key matches MAKO-XXXX-XXXX-XXXX-XXXX pattern.
 */
export function isValidKeyFormat(key: string): boolean {
  return /^MAKO-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(key);
}

/**
 * Validate a key against an email (full verification).
 */
export function validateKey(email: string, key: string): boolean {
  const expected = generateLicenseKey(email);
  return expected === key;
}
