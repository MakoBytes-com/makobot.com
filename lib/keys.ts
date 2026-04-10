import { createHmac } from "crypto";

const KEY_SECRET = process.env.LICENSE_KEY_SECRET || "makobot-default-secret-change-me";

/**
 * Generate a license key for a user.
 * Format: MAKO-XXXX-XXXX-XXXX-XXXX
 *
 * The key is deterministic based on email — same email always gets same key.
 * This means the C# app can validate offline using the same algorithm.
 */
export function generateLicenseKey(email: string): string {
  const hmac = createHmac("sha256", KEY_SECRET);
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
