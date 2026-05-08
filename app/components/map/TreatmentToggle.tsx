export type TreatmentTypeId = 'ivf' | 'iui' | 'di' | 'fet';

export interface TreatmentToggleProps {
  selected: TreatmentTypeId;
  onChange: (id: TreatmentTypeId) => void;
}

const TREATMENT_OPTIONS: { id: TreatmentTypeId; label: string }[] = [
  { id: 'ivf', label: 'IVF/ICSI' },
  { id: 'iui', label: 'IUI' },
  { id: 'di', label: 'DI' },
  { id: 'fet', label: 'FET' },
];

export function TreatmentToggle({ selected, onChange }: TreatmentToggleProps) {
  return (
    <div
      className="flex gap-1 overflow-x-auto"
      role="radiogroup"
      aria-label="Treatment type"
    >
      {TREATMENT_OPTIONS.map((option) => (
        <button
          key={option.id}
          role="radio"
          aria-checked={option.id === selected}
          onClick={() => onChange(option.id)}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green focus-visible:ring-offset-1 ${
            option.id === selected
              ? 'bg-sage-dark text-white'
              : 'bg-warm-sand text-deep-slate/70 hover:bg-warm-sand-dark'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
