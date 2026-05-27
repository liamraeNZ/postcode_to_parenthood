// Re-export shared postcode utilities from the single source of truth.
// The `normalizeUpperTrim` alias is kept for backward compatibility with gpIcb.ts.
export { normalizePostcode, redactPostcodeForLogs } from '@/lib/postcode';

/**
 * Alias for normalizeOdsCode — trims and uppercases.
 * Used by the client-side GP ICB lookup.
 */
export function normalizeUpperTrim(input: string): string {
  return input.trim().toUpperCase();
}
