import { Link } from "react-router";

interface WhatNextSectionProps {
  /** Current board slug, used to pass back-link context to What Next pages */
  boardSlug?: string;
}

/**
 * "What next?" section for board pages with two large, tap-friendly buttons
 * linking to the what-next guidance pages. Warm, generous styling — not small links.
 *
 * Requirements: FR-3.5
 */
export function WhatNextSection({ boardSlug }: WhatNextSectionProps) {
  const fromParam = boardSlug ? `?from=${boardSlug}` : "";

  return (
    <section
      className="rounded-2xl bg-surface px-6 py-8 md:px-8 md:py-10"
      aria-labelledby="what-next-heading"
    >
      <h2
        id="what-next-heading"
        className="font-heading text-lg md:text-xl text-ink mb-6"
      >
        What next?
      </h2>

      <div className="flex flex-col gap-4">
        <Link
          to={`/what-next/eligible${fromParam}`}
          className="block rounded-xl bg-brand px-6 py-5 text-center font-sans text-base md:text-lg font-medium text-white shadow-sm transition-all hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          I think I may be eligible. What do I do now?
        </Link>

        <Link
          to={`/what-next/exploring-options${fromParam}`}
          className="block rounded-xl border-2 border-brand/30 bg-white px-6 py-5 text-center font-sans text-base md:text-lg font-medium text-brand-dark shadow-sm transition-all hover:border-brand/50 hover:bg-tint-light/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          I&apos;m not sure I&apos;m eligible, or I don&apos;t think I am
        </Link>
      </div>
    </section>
  );
}
