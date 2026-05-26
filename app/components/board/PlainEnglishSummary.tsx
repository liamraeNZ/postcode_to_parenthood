import { generatePlainEnglishSummary, type SummaryPolicy } from "@/lib/generateSummary";
import type { BoardMeta } from "@/types";
import { cn } from "@/lib/utils";

interface PlainEnglishSummaryProps {
  boardMeta: BoardMeta;
  icbName: string;
  policy: SummaryPolicy | null;
  className?: string;
}

/**
 * Renders a warm, natural-language summary of the board's IVF funding policy.
 *
 * Priority: boardMeta.summary_override (hand-crafted copy) takes precedence
 * over the template-generated summary. If neither is available (no override
 * and no policy data), renders nothing.
 */
export function PlainEnglishSummary({ boardMeta, icbName, policy, className }: PlainEnglishSummaryProps) {
  let summary: string | null = null;

  if (boardMeta.summary_override) {
    summary = boardMeta.summary_override;
  } else if (policy) {
    summary = generatePlainEnglishSummary(icbName, policy);
  }

  if (!summary) return null;

  return (
    <div className={cn("rounded-2xl bg-surface/60 border border-tint/15 px-5 py-4", className)}>
      <h4 className="font-sans text-xs font-semibold uppercase tracking-wide text-ink/70 mb-2">
        Summary
      </h4>
      <p className="font-sans text-sm leading-relaxed text-ink">
        {summary}
      </p>
    </div>
  );
}
