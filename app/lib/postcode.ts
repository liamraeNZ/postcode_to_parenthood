/**
 * Shared postcode utilities — isomorphic (safe for both worker and client).
 *
 * These pure string functions are used by both the Cloudflare Worker backend
 * and the client-side postcode service. Keep them free of environment-specific
 * dependencies (no DOM, no Node, no Cloudflare bindings).
 */

/**
 * Normalizes a UK postcode by trimming, uppercasing, and removing all whitespace.
 * e.g. " sw1a 1aa " → "SW1A1AA"
 */
export function normalizePostcode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Normalizes an ODS code or outcode by trimming and uppercasing.
 */
export function normalizeOdsCode(input: string): string {
  return input.trim().toUpperCase();
}

/**
 * Redacts a normalized postcode for logging — shows first 3 chars, masks the rest.
 * e.g. "SW1A1AA" → "SW1****"
 */
export function redactPostcodeForLogs(normalizedPostcode: string): string {
  if (!normalizedPostcode) return '';
  const visible = normalizedPostcode.slice(0, Math.min(3, normalizedPostcode.length));
  return `${visible}${'*'.repeat(Math.max(0, normalizedPostcode.length - visible.length))}`;
}

/**
 * Returns true if the input looks like a plausible UK postcode (alphanumeric + spaces, ≤16 chars).
 * Used as a fast pre-validation before hitting external APIs.
 */
export function isReasonablePostcodeInput(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (trimmed.length > 16) return false;
  return /^[A-Za-z0-9 ]+$/.test(trimmed);
}
