import { CYCLE_BADGE } from './theme';

/**
 * Returns Tailwind classes for the Cycles Offered card based on the number of cycles.
 * Uses a fertility/healthcare-appropriate colour palette:
 *   0  → rose/red (no cycles funded)
 *   1  → amber/yellow (minimal provision)
 *   2  → warm amber-green (moderate)
 *   3+ → green (meets NICE guidelines)
 */
export function getCycleColorClasses(cycles: number): { bg: string; text: string; label: string } {
  if (cycles === 0) return CYCLE_BADGE[0];
  if (cycles === 1) return CYCLE_BADGE[1];
  if (cycles === 2) return CYCLE_BADGE[2];
  return CYCLE_BADGE[3];
}
