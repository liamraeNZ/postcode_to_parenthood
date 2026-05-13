import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface CountryFilterProps {
  countries: Array<{ code: string; label: string; count: number }>;
  selected: string[]; // country codes currently selected
  onChange: (selected: string[]) => void;
  /** Extra classes for the fieldset (e.g. margin overrides) */
  className?: string;
}

export function CountryFilter({ countries, selected, onChange, className }: CountryFilterProps) {
  const allCodes = useMemo(() => countries.map((c) => c.code), [countries]);
  const allSelected =
    selected.length === countries.length && allCodes.every((c) => selected.includes(c));

  /** One country only: filter to that nation. Same country again: back to all UK. */
  const handleCountryClick = useCallback(
    (code: string) => {
      const onlyThisCountry = selected.length === 1 && selected[0] === code;
      if (onlyThisCountry) {
        onChange(allCodes);
      } else {
        onChange([code]);
      }
    },
    [selected, onChange, allCodes]
  );

  const handleSelectAll = useCallback(() => {
    onChange(allCodes);
  }, [allCodes, onChange]);

  return (
    <fieldset className={cn("mb-6", className)} aria-label="Filter by country">
      <legend className="font-mono text-xs font-medium text-ink/60 uppercase tracking-wide mb-2">
        Filter by country
      </legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          aria-pressed={allSelected}
          className={`btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            allSelected
              ? "bg-brand text-white border-brand"
              : "bg-white text-ink/70 border-tint/25 hover:border-brand/50"
          }`}
        >
          All UK
        </button>
        {countries.map((country) => {
          const isSelected = selected.includes(country.code);
          return (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCountryClick(country.code)}
              aria-pressed={isSelected}
              className={`btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isSelected
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-ink/70 border-tint/25 hover:border-brand/50"
              }`}
            >
              {country.label}
              <span
                className={`text-xs ${
                  isSelected ? "text-white/80" : "text-ink/50"
                }`}
              >
                ({country.count})
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
