/**
 * Lightweight wrapper around Umami's tracking API.
 *
 * Privacy-first: we never send full postcodes — only the outward code
 * (first half, e.g. "SW1A") which identifies a broad area but not an
 * individual household.
 *
 * All event data is anonymous, cookieless, and GDPR-compliant by design.
 */

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void;
    };
  }
}

type EventData = Record<string, string | number>;

/**
 * Track a custom event in Umami. No-ops in development to keep
 * analytics clean, and gracefully handles cases where the script
 * hasn't loaded (e.g. blocked by an ad-blocker).
 */
function track(event: string, data?: EventData): void {
  if (import.meta.env.DEV) return;
  window.umami?.track(event, data);
}

/**
 * Extracts the outward code (first half) from a UK postcode.
 * e.g. "SW1A 1AA" → "SW1A", "EC2A3BP" → "EC2A", "M1 1AA" → "M1"
 */
export function extractOutwardCode(postcode: string): string {
  const cleaned = postcode.trim().toUpperCase().replace(/\s+/g, "");
  // UK postcodes: outward code is everything except the last 3 characters
  if (cleaned.length < 5) return cleaned; // too short to split reliably
  return cleaned.slice(0, -3);
}

// ─── Event helpers ───────────────────────────────────────────────────────────

/** User submitted a postcode search */
export function trackPostcodeSearch(postcode: string): void {
  track("postcode-search", { area: extractOutwardCode(postcode) });
}

/** Postcode search resulted in an error */
export function trackPostcodeSearchError(errorKind: string): void {
  track("postcode-search-error", { kind: errorKind });
}

/** User selected a GP practice from the results list */
export function trackGpSelected(boardSlug?: string): void {
  track("gp-selected", boardSlug ? { board: boardSlug } : undefined);
}

/** User searched for a GP by name */
export function trackGpNameSearch(): void {
  track("gp-name-search");
}

/** User viewed a board/ICB policy page */
export function trackBoardViewed(boardSlug: string): void {
  track("board-viewed", { board: boardSlug });
}

/** User clicked an ICB region on the map */
export function trackMapIcbClick(icbName: string): void {
  track("map-icb-click", { board: icbName });
}

/** User clicked "View local guidance" from the map info panel */
export function trackMapViewGuidance(boardSlug: string): void {
  track("map-view-guidance", { board: boardSlug });
}

/** User clicked "I think I may be eligible" */
export function trackWhatNextEligible(fromBoard?: string): void {
  track("what-next-eligible", fromBoard ? { from: fromBoard } : undefined);
}

/** User clicked "I'm not sure I'm eligible" */
export function trackWhatNextExploring(fromBoard?: string): void {
  track("what-next-exploring", fromBoard ? { from: fromBoard } : undefined);
}

/** User clicked a link to view/download a source document */
export function trackOutboundDocument(boardSlug: string): void {
  track("outbound-document", { board: boardSlug });
}

/** User clicked the contact email link */
export function trackContactEmail(): void {
  track("contact-email");
}
