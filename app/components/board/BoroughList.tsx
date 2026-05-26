import type { BoardMeta } from "@/types";

interface BoroughListProps {
  /** JSON string of borough/area data — either a flat array or { boroughs, neighbourhoods } object */
  boroughs: string | null;
  /** Data confidence level — shows boundary change note when 'inherited' */
  dataConfidence: BoardMeta["data_confidence"];
  className?: string;
}

/** Parsed result from the boroughs JSON column */
export interface ParsedAreas {
  boroughs: string[];
  neighbourhoods: string[];
}

/**
 * Server-rendered list of areas/boroughs covered by a health board.
 * Supports two JSON formats:
 *   - Flat array: ["Lewisham", "Bexley"] (legacy)
 *   - Object: { "boroughs": [...], "neighbourhoods": [...] }
 *
 * Renders as a collapsible accordion (closed by default) with boroughs prominently
 * and neighbourhoods in a secondary line for SEO.
 * Shows fallback text when data is empty/null.
 * For merged ICBs (inherited), notes that boundaries may have changed.
 *
 * Requirements: FR-4.2, FR-4.3, FR-4.4, FR-4.5
 */
export function BoroughList({ boroughs, dataConfidence, className }: BoroughListProps) {
  const { boroughs: areas, neighbourhoods } = parseBoroughs(boroughs);

  return (
    <details
      className={`rounded-xl bg-tint/5 px-5 py-4 group${className ? ` ${className}` : ""}`}
      aria-labelledby="borough-list-heading"
    >
      <summary
        id="borough-list-heading"
        className="font-sans text-xs font-semibold uppercase tracking-wide text-ink cursor-pointer select-none list-none flex items-center gap-1.5 [&::-webkit-details-marker]:hidden"
      >
        <svg
          className="w-3.5 h-3.5 text-ink/50 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Areas covered
      </summary>

      <div className="mt-2">
        {areas.length > 0 ? (
          <p className="font-sans text-sm leading-relaxed text-ink/85">
            {areas.join(", ")}
          </p>
        ) : (
          <p className="font-sans text-sm leading-relaxed text-ink/50 italic">
            Area data being compiled. Check back soon
          </p>
        )}

        {neighbourhoods.length > 0 && (
          <p className="mt-2 font-sans text-xs leading-relaxed text-ink/65">
            Including neighbourhoods: {neighbourhoods.join(", ")}
          </p>
        )}

        {dataConfidence === "inherited" && (
          <p className="mt-2 font-sans text-xs leading-relaxed text-ink/55 italic">
            Boundaries may have changed following the April 2026 merger.
          </p>
        )}
      </div>
    </details>
  );
}

/**
 * Safely parse the boroughs JSON column.
 * Handles both legacy flat arrays and the new { boroughs, neighbourhoods } object format.
 * Both arrays are returned sorted alphabetically for easy scanning.
 */
export function parseBoroughs(boroughs: string | null): ParsedAreas {
  if (!boroughs) return { boroughs: [], neighbourhoods: [] };

  try {
    const parsed = JSON.parse(boroughs);

    // New object format: { boroughs: [...], neighbourhoods: [...] }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return {
        boroughs: filterStrings(parsed.boroughs).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
        neighbourhoods: filterStrings(parsed.neighbourhoods).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
      };
    }

    // Legacy flat array format: ["Lewisham", "Bexley", ...]
    if (Array.isArray(parsed)) {
      return {
        boroughs: filterStrings(parsed).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
        neighbourhoods: [],
      };
    }

    return { boroughs: [], neighbourhoods: [] };
  } catch {
    return { boroughs: [], neighbourhoods: [] };
  }
}

/** Filter an array to only valid non-empty strings */
function filterStrings(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (item): item is string => typeof item === "string" && item.length > 0
  );
}
