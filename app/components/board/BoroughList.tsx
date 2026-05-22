import type { BoardMeta } from "@/types";

interface BoroughListProps {
  /** JSON string of borough/area names, or null if not populated */
  boroughs: string | null;
  /** Data confidence level — shows boundary change note when 'inherited' */
  dataConfidence: BoardMeta["data_confidence"];
  className?: string;
}

/**
 * Server-rendered list of areas/boroughs covered by a health board.
 * Renders as a visually subtle section with comma-separated area names.
 * Shows fallback text when data is empty/null.
 * For merged ICBs (inherited), notes that boundaries may have changed.
 *
 * Requirements: FR-4.2, FR-4.3, FR-4.4, FR-4.5
 */
export function BoroughList({ boroughs, dataConfidence, className }: BoroughListProps) {
  const areas = parseBoroughs(boroughs);

  return (
    <section
      className={`rounded-xl bg-tint/5 px-5 py-4${className ? ` ${className}` : ""}`}
      aria-labelledby="borough-list-heading"
    >
      <h4
        id="borough-list-heading"
        className="font-sans text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2"
      >
        Areas covered
      </h4>

      {areas.length > 0 ? (
        <p className="font-sans text-sm leading-relaxed text-ink/70">
          {areas.join(", ")}
        </p>
      ) : (
        <p className="font-sans text-sm leading-relaxed text-ink/50 italic">
          Area data being compiled. Check back soon
        </p>
      )}

      {dataConfidence === "inherited" && (
        <p className="mt-2 font-sans text-xs leading-relaxed text-ink/50 italic">
          Boundaries may have changed following the April 2026 merger.
        </p>
      )}
    </section>
  );
}

/** Safely parse a JSON array string of borough names. Returns empty array on failure. */
function parseBoroughs(boroughs: string | null): string[] {
  if (!boroughs) return [];

  try {
    const parsed = JSON.parse(boroughs);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is string => typeof item === "string" && item.length > 0
    );
  } catch {
    return [];
  }
}
