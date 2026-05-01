/**
 * Returns a hex fill colour for a given cycles_offered value,
 * used to style ICB boundary polygons on the choropleth map.
 *
 *   null/undefined → grey  (#D1D5DB) — no data available
 *   0             → red   (#F87171) — not funded
 *   1             → amber (#FBBF24) — minimal provision
 *   2             → orange (#FB923C) — below NICE guidelines
 *   3+            → green (#34D399) — meets NICE guidelines
 */
export function getMapFillColor(cycles: number | null): string {
  if (cycles === null || cycles === undefined) return '#D1D5DB'; // grey — no data
  if (cycles === 0) return '#F87171'; // red — not funded
  if (cycles === 1) return '#FB923C'; // orange — 1 cycle
  if (cycles === 2) return '#FBBF24'; // amber — 2 cycles
  return '#34D399'; // green — 3+ cycles
}
