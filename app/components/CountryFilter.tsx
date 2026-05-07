import { useCallback } from "react";

interface CountryFilterProps {
  countries: Array<{ code: string; label: string; count: number }>;
  selected: string[]; // country codes currently selected
  onChange: (selected: string[]) => void;
}

export function CountryFilter({ countries, selected, onChange }: CountryFilterProps) {
  const allSelected = selected.length === countries.length;

  const handleToggle = useCallback(
    (code: string) => {
      if (selected.includes(code)) {
        // Deselect this country
        const next = selected.filter((c) => c !== code);
        onChange(next);
      } else {
        // Select this country
        onChange([...selected, code]);
      }
    },
    [selected, onChange]
  );

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      // If all are selected, deselect all (will show empty state)
      onChange([]);
    } else {
      onChange(countries.map((c) => c.code));
    }
  }, [allSelected, countries, onChange]);

  return (
    <fieldset className="mb-6" aria-label="Filter by country">
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
              onClick={() => handleToggle(country.code)}
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
