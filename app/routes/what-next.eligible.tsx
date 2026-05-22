import type { Route } from "./+types/what-next.eligible";
import { Link, useSearchParams } from "react-router";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";

export function meta({}: Route.MetaArgs) {
  const title =
    "You May Be Eligible | What to Do Next | Postcode to Parenthood";
  const description =
    "Guidance on approaching your GP about NHS-funded fertility treatment, what to expect from the referral process, and where to find support.";
  const canonicalUrl =
    "https://postcodetoparenthood.org.uk/what-next/eligible";

  return [
    { title },
    { name: "description", content: description },
    ...standardMeta(canonicalUrl),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  };
}

/**
 * Convert a board slug back to a human-readable name for display.
 * e.g. "nhs-west-and-north-london-integrated-care-board" → "NHS West and North London Integrated Care Board"
 */
function formatSlugAsName(slug: string): string {
  return slug
    .split("-")
    .map((word) => {
      if (word === "nhs" || word === "icb") return word.toUpperCase();
      if (["and", "of", "the", "in"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function WhatNextEligiblePage() {
  const [searchParams] = useSearchParams();
  const fromBoard = searchParams.get("from");

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="You may be eligible for NHS-funded treatment"
        description="Here's what we'd suggest as a next step, and what to expect along the way."
        breadcrumbCurrent="What next"
      />

      <div className="container mx-auto max-w-prose px-4 py-8 md:py-12 space-y-10">
        {/* Back link to board page if user arrived from one */}
        {fromBoard && (
          <Link
            to={`/board/${fromBoard}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark transition-colors"
          >
            <span aria-hidden="true">←</span>
            Back to {formatSlugAsName(fromBoard)} funding information
          </Link>
        )}

        {/* Brief affirmation */}
        <div className="space-y-3">
          <p className="font-sans text-base md:text-lg leading-relaxed text-ink/85">
            If the information you've seen suggests you may meet your local
            health board's criteria, that's a positive first step. The next
            stage is a conversation with your GP, and we want to help you feel
            prepared for that.
          </p>
          <p className="font-sans text-sm leading-relaxed text-ink/65">
            Remember: only your GP and fertility clinic can confirm eligibility.
            What we show here is based on published policy documents, which may
            not reflect the very latest changes.
          </p>
        </div>

        {/* How to approach your GP — placeholder */}
        {/* CONTENT OWNER: This section needs detailed guidance on preparing for a GP appointment about fertility referrals */}
        <div className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-ink">
            How to approach your GP
          </h2>
          <p className="font-sans text-base leading-relaxed text-ink/70">
            Detailed guidance coming soon. Check back shortly.
          </p>
        </div>

        {/* What to expect — placeholder */}
        {/* CONTENT OWNER: This section needs information about the referral pathway, timelines, and what happens at each stage */}
        <div className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-ink">
            What to expect from the process
          </h2>
          <p className="font-sans text-base leading-relaxed text-ink/70">
            Detailed guidance coming soon. Check back shortly.
          </p>
        </div>

        {/* Postcode awareness note */}
        <div className="rounded-xl bg-surface px-5 py-5 md:px-6 md:py-6 space-y-3">
          <h2 className="font-heading text-lg font-semibold text-ink">
            Funding varies by area
          </h2>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            NHS fertility funding is based on where your GP is registered, not
            where you live. If you haven't already, it's worth checking the map
            to see how your area compares.
          </p>
          <Link
            to="/map"
            className="inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
          >
            See the funding map
          </Link>
        </div>

        {/* Support & community — placeholder */}
        {/* CONTENT OWNER: This section needs links to fertility support organisations, communities, and helplines */}
        {/* PATIENT PANEL REVIEW REQUIRED */}
        <div className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-ink">
            Support &amp; community
          </h2>
          <p className="font-sans text-base leading-relaxed text-ink/70">
            Detailed guidance coming soon. Check back shortly.
          </p>
        </div>
      </div>
    </section>
  );
}
