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
      <legend className="text-sm font-medium text-deep-slate mb-2">
        Filter by country
      </legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          aria-pressed={allSelected}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            allSelected
              ? "bg-sage-btn text-white border-sage-btn"
              : "bg-white text-deep-slate/70 border-warm-sand-dark hover:border-sage-btn"
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                isSelected
                  ? "bg-sage-btn text-white border-sage-btn"
                  : "bg-white text-deep-slate/70 border-warm-sand-dark hover:border-sage-btn"
              }`}
            >
              {country.label}
              <span
                className={`text-xs ${
                  isSelected ? "text-white/80" : "text-deep-slate/50"
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
