/**
 * Returns Tailwind classes for the Cycles Offered card based on the number of cycles.
 * Uses a fertility/healthcare-appropriate colour palette:
 *   0  → rose/red (no cycles funded)
 *   1  → amber/yellow (minimal provision)
 *   2  → warm amber-green (moderate)
 *   3+ → green (meets NICE guidelines)
 */
export function getCycleColorClasses(cycles: number): { bg: string; text: string; label: string } {
  if (cycles === 0) {
    // Rose — no funded cycles (WCAG AA: #9B1C1C on #FDE8E8 ≈ 7.2:1)
    return { bg: 'bg-[#FDE8E8]', text: 'text-[#9B1C1C]', label: 'text-[#9B1C1C]' };
  }
  if (cycles === 1) {
    // Warm amber — minimal provision (WCAG AA: #78350F on #FEF3C7 ≈ 8.1:1)
    return { bg: 'bg-[#FEF3C7]', text: 'text-[#78350F]', label: 'text-[#92400E]' };
  }
  if (cycles === 2) {
    // Teal — moderate provision (WCAG AA: #134E4A on #CCFBF1 ≈ 8.5:1)
    return { bg: 'bg-[#CCFBF1]', text: 'text-[#134E4A]', label: 'text-[#115E59]' };
  }
  // 3+ — Green — meets NICE guidelines (WCAG AA: #065F46 on #D1FAE5 ≈ 7.4:1)
  return { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', label: 'text-[#047857]' };
}
