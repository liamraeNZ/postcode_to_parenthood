import { cn } from "@/lib/utils";

interface InheritedBannerProps {
  predecessorIcb: string;
  className?: string;
}

/**
 * Amber caveat banner shown on board pages where data_confidence === 'inherited'.
 * Explains that funding information is inherited from predecessor ICBs following a merger.
 */
export function InheritedBanner({ predecessorIcb, className }: InheritedBannerProps) {
  return (
    <div
      className={cn(
        "bg-[#FDF3E3] border-l-4 border-[#C4785A] text-[#5C4A3A] rounded-xl px-5 py-4",
        className
      )}
      role="note"
      aria-label="Inherited policy information"
    >
      <p className="text-sm leading-relaxed">
        This health board was formed in April 2026 through an NHS merger. The funding
        information below is inherited from{" "}
        <span className="font-semibold">{predecessorIcb}</span> and may change as the
        new board establishes its own policy. We&apos;re actively monitoring for updates,
        so please verify with your GP before making any decisions based on this
        information.
      </p>
    </div>
  );
}
