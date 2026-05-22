import type { BoardMeta } from "@/types";

type DataConfidence = BoardMeta["data_confidence"];

export interface StatusBadgeProps {
  dataConfidence: DataConfidence;
  className?: string;
}

const badgeConfig: Record<DataConfidence, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-[#6B8F71] text-white",
  },
  inherited: {
    label: "Inherited",
    className: "bg-[#C4785A] text-white",
  },
  under_review: {
    label: "Under Review",
    className: "bg-[#C4785A] text-white",
  },
  unconfirmed: {
    label: "Unconfirmed",
    className: "bg-gray-200 text-gray-700",
  },
};

/**
 * Colour-coded pill showing the data confidence level for a health board.
 * The board page integration decides when to show/hide this component.
 */
export function StatusBadge({ dataConfidence, className }: StatusBadgeProps) {
  const config = badgeConfig[dataConfidence];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}${className ? ` ${className}` : ""}`}
      aria-label={`Data confidence: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
