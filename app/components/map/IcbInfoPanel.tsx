import type { MapPolicyEntry } from './IcbBoundaryLayer';

export interface IcbInfoPanelProps {
  icbId: string;
  icbName: string;
  policy: MapPolicyEntry | null;
  onViewFullPolicy: (icbId: string) => void;
  onClose: () => void;
}

/**
 * IcbInfoPanel displays expanded policy details for a selected ICB region.
 * Shows ICB name, cycles offered, age range, and BMI range.
 * Includes a "View full policy" link to navigate to the full policy view.
 */
export function IcbInfoPanel({
  icbId,
  icbName,
  policy,
  onViewFullPolicy,
  onClose,
}: IcbInfoPanelProps) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[1000] w-full rounded-t-xl sm:inset-x-auto sm:bottom-auto sm:top-4 sm:right-4 sm:w-72 sm:rounded-xl bg-white shadow-lg ring-1 ring-warm-sand-dark"
      role="region"
      aria-label={`Policy details for ${icbName}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-2">
        <h3 className="font-heading text-sm font-semibold text-deep-slate leading-snug">
          {icbName}
        </h3>
        <button
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-deep-slate/50 hover:bg-warm-sand hover:text-deep-slate transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green"
          aria-label="Close panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {policy === null ? (
          <p className="text-sm text-deep-slate/60">No policy data available</p>
        ) : (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-deep-slate/60">Cycles offered</dt>
              <dd className="font-medium text-deep-slate">{policy.cycles_offered}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-deep-slate/60">Age range</dt>
              <dd className="font-medium text-deep-slate">
                {formatRange((policy as PolicyWithExtras).age_min, (policy as PolicyWithExtras).age_max, 'Not specified')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-deep-slate/60">BMI range</dt>
              <dd className="font-medium text-deep-slate">
                {formatRange((policy as PolicyWithExtras).bmi_min, (policy as PolicyWithExtras).bmi_max, 'Not specified')}
              </dd>
            </div>
          </dl>
        )}

        {/* View full policy link */}
        {policy !== null && (
          <button
            onClick={() => onViewFullPolicy(icbId)}
            className="mt-3 w-full rounded-lg bg-sage-dark px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-sage-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green focus-visible:ring-offset-1"
          >
            View full policy
          </button>
        )}
      </div>
    </div>
  );
}

/** Extended policy type that may include age/BMI fields from the API */
interface PolicyWithExtras extends MapPolicyEntry {
  age_min?: number | null;
  age_max?: number | null;
  bmi_min?: number | null;
  bmi_max?: number | null;
}

/** Formats a min/max range into a readable string */
function formatRange(
  min: number | null | undefined,
  max: number | null | undefined,
  fallback: string
): string {
  if (min != null && max != null) return `${min}–${max}`;
  if (min != null) return `${min}+`;
  if (max != null) return `Up to ${max}`;
  return fallback;
}
