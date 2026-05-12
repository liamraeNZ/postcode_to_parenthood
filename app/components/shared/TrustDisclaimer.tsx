interface TrustDisclaimerProps {
  className?: string;
}

export function TrustDisclaimer({ className }: TrustDisclaimerProps) {
  return (
    <p className={`text-xs text-deep-slate/60${className ? ` ${className}` : ""}`}>
      This guide explains published NHS policies. Your GP, clinic, or health
      board should confirm eligibility.
    </p>
  );
}
