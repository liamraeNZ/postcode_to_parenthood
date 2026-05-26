interface TransparencyNoteProps {
  icbName: string;
  policyDate: string | null;
  sourceUrl: string | null;
  lastVerified: string | null;
}

/**
 * Transparency note shown below policy data on board pages.
 * Attributes the source policy document and shows when data was last verified.
 * Only renders when at least policyDate or lastVerified is available.
 */
export function TransparencyNote({
  icbName,
  policyDate,
  sourceUrl,
  lastVerified,
}: TransparencyNoteProps) {
  if (!policyDate && !lastVerified) return null;

  return (
    <aside
      className="rounded-xl bg-tint/5 px-5 py-4 text-deep-slate/70"
      role="note"
      aria-label="Data transparency information"
    >
      {policyDate && (
        <p className="font-sans text-sm leading-relaxed">
          This information is based on the{" "}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline underline-offset-2 hover:text-brand/80"
            >
              policy document
            </a>
          ) : (
            <span className="font-medium">policy document</span>
          )}{" "}
          {icbName} published on {policyDate}. We show the most recent document available and flag
          when policies change. Always confirm your eligibility with your GP.
        </p>
      )}

      {lastVerified && (
        <p className="mt-2 font-sans text-xs leading-relaxed text-deep-slate/60">
          Policy data last verified {lastVerified}
        </p>
      )}
    </aside>
  );
}
