import { MAP_COLORS } from './theme';

/**
 * Returns a hex fill colour for a given cycles_offered value,
 * used to style ICB boundary polygons on the choropleth map.
 *
 *   null/undefined → grey  — no data available
 *   0             → red   — not funded
 *   1             → amber — minimal provision
 *   2             → orange — below NICE guidelines
 *   3+            → green — meets NICE guidelines
 */
export function getMapFillColor(cycles: number | null): string {
  if (cycles === null || cycles === undefined) return MAP_COLORS.noData;
  if (cycles === 0) return MAP_COLORS.poor;
  if (cycles === 1) return MAP_COLORS.fair;
  if (cycles === 2) return MAP_COLORS.good;
  return MAP_COLORS.excellent;
}
