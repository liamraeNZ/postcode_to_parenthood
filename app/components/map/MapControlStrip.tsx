import { Link } from "react-router";
import { useCallback, type MouseEvent } from "react";

interface MapControlStripProps {
  className?: string;
}

/**
 * Horizontal strip of pill-style action links displayed above the map.
 * Matches the CountryFilter pill pattern (rounded-full, border-tint/25, hover:border-brand/50).
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
    "btn-press inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border border-tint/25 bg-white text-ink/70 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2";

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
