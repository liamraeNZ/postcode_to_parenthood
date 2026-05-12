import { cn } from "@/lib/utils";

interface TrustDisclaimerProps {
  className?: string;
}

export function TrustDisclaimer({ className }: TrustDisclaimerProps) {
  return (
    <p className={cn("text-xs leading-relaxed text-deep-slate/60", className)}>
      NHS fertility funding follows your health board’s rules. Which board applies is usually based on
      where your GP practice is registered, not your home postcode. This guide summarises published
      policies; your GP, clinic, or health board should confirm eligibility.
    </p>
  );
}
