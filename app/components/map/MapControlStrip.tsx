import { Link } from "react-router";
import { useCallback, type MouseEvent } from "react";

interface MapControlStripProps {
  className?: string;
}

/**
 * Horizontal strip of pill-style action links displayed above the map.
 * Matches the CountryFilter pill pattern (rounded-lg, border-warm-sand-dark, hover:border-sage-btn).
 * Horizontally scrollable on mobile (<768px) with no wrapping.
 */
export function MapControlStrip({ className }: MapControlStripProps) {
  const handleCompareClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      // Try to scroll to BorderContextPanel, fall back to the map container
      const target =
        document.querySelector("[data-border-context-panel]") ??
        document.querySelector("[data-map-container]");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  const linkClasses =
    "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-warm-sand-dark bg-white text-deep-slate/70 transition-colors hover:border-sage-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-btn focus-visible:ring-offset-2";

  return (
    <nav
      aria-label="Map actions"
      className={`flex gap-2 md:flex-wrap overflow-x-auto flex-nowrap whitespace-nowrap md:overflow-x-visible md:whitespace-normal ${className ?? ""}`}
    >
      <Link to="/search" className={linkClasses}>
        Find my area
      </Link>
      <Link to="/policies" className={linkClasses}>
        View policy list
      </Link>
    </nav>
  );
}
