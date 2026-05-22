/**
 * Virtual GP Practice Detection
 *
 * The ODS/ORD API does NOT expose a "virtual" or "digital-first" flag for GP practices.
 * Virtual GP detection therefore uses a manually maintained allowlist of known ODS codes
 * for practices where patients are formally registered and which determine their ICB assignment.
 *
 * GP at Hand (eMed, formerly Babylon) is currently the only major virtual GP provider with
 * its own distinct ODS-registered practice. LIVI and Push Doctor operate as platforms
 * connecting to existing physical practices — patients remain registered at their physical GP,
 * so those don't affect ICB determination.
 *
 * This allowlist is honest, maintainable, and doesn't pretend to be comprehensive.
 * Add new codes as they emerge — this is a small, finite set.
 */

/** Known virtual GP practice ODS codes, manually maintained. */
const VIRTUAL_GP_ODS_CODES = new Set([
  'E85124', // GP at Hand (eMed, formerly Babylon) — Lillie Road Surgery, registered with NHS West and North London ICB
]);

/** Secondary heuristic: name patterns for practices not yet in the allowlist. */
const VIRTUAL_GP_NAME_PATTERNS = [
  'GP AT HAND',
  'EMED',
  'DIGITAL FIRST',
];

/**
 * Returns true if the given practice is a known virtual/online GP service.
 *
 * Checks the hardcoded ODS code allowlist first (authoritative), then falls back
 * to name-pattern heuristics as a secondary signal.
 */
export function isVirtualGpPractice(odsCode: string, name: string): boolean {
  if (VIRTUAL_GP_ODS_CODES.has(odsCode)) return true;
  const upper = name.toUpperCase();
  return VIRTUAL_GP_NAME_PATTERNS.some((pattern) => upper.includes(pattern));
}
