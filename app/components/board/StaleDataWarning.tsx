interface StaleDataWarningProps {
  lastVerified: string;
  icbName: string;
}

/**
 * Calculates the number of full months between a date string and now.
 */
function monthsSince(dateStr: string): number {
  const then = new Date(dateStr);
  const now = new Date();
  return (
    (now.getFullYear() - then.getFullYear()) * 12 +
    (now.getMonth() - then.getMonth())
  );
}

/**
 * Subtle warning shown on board pages when last_verified is more than 6 months ago.
 * Uses muted styling — informative, not alarming.
 */
export function StaleDataWarning({ lastVerified, icbName }: StaleDataWarningProps) {
  const months = monthsSince(lastVerified);

  if (months <= 6) return null;

  return (
    <p className="text-xs leading-relaxed text-deep-slate/50 italic">
      This policy was last verified {months} months ago. We recommend checking
      directly with {icbName} or your GP for the most current information.
    </p>
  );
}
