/**
 * Centralized theme tokens for use in TypeScript/JavaScript contexts
 * (e.g. Leaflet inline styles, canvas rendering).
 *
 * These values mirror the CSS custom properties defined in index.css.
 * To change the colour scheme, update the values here AND in index.css.
 */

// ─── Map choropleth scale ───────────────────────────────────────────────────

export const MAP_COLORS = {
  /** 3+ cycles — meets NICE guidelines */
  excellent: '#34D399',
  /** 2 cycles */
  good: '#FBBF24',
  /** 1 cycle */
  fair: '#FB923C',
  /** 0 cycles — not funded */
  poor: '#F87171',
  /** No data available */
  noData: '#D1D5DB',
} as const;

// ─── Map UI ─────────────────────────────────────────────────────────────────

export const MAP_UI = {
  border: '#6B7280',
  borderHover: '#1F2937',
  legendText: '#374151',
  userMarkerFill: '#2563EB',
  userMarkerStroke: '#FFFFFF',
} as const;

// ─── Cycle badge colours (Tailwind arbitrary-value classes) ─────────────────

export const CYCLE_BADGE = {
  0: { bg: 'bg-[var(--color-cycle-0-bg)]', text: 'text-[var(--color-cycle-0-text)]', label: 'text-[var(--color-cycle-0-text)]' },
  1: { bg: 'bg-[var(--color-cycle-1-bg)]', text: 'text-[var(--color-cycle-1-text)]', label: 'text-[var(--color-cycle-1-label)]' },
  2: { bg: 'bg-[var(--color-cycle-2-bg)]', text: 'text-[var(--color-cycle-2-text)]', label: 'text-[var(--color-cycle-2-label)]' },
  3: { bg: 'bg-[var(--color-cycle-3-bg)]', text: 'text-[var(--color-cycle-3-text)]', label: 'text-[var(--color-cycle-3-label)]' },
} as const;

// ─── Status badge colours ───────────────────────────────────────────────────

export const STATUS_BADGE = {
  improved: 'bg-[var(--color-status-improved-bg)] text-[var(--color-status-improved-text)]',
  worse: 'bg-[var(--color-status-worse-bg)] text-[var(--color-status-worse-text)]',
  neutral: 'bg-cream text-charcoal',
} as const;

// ─── Focus ring ─────────────────────────────────────────────────────────────

export const FOCUS_RING_SHADOW = '0 0 0 3px var(--color-focus-ring)';
