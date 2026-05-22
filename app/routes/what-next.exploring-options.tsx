import type { Route } from "./+types/what-next.exploring-options";
import { Link, useSearchParams } from "react-router";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";

export function meta({}: Route.MetaArgs) {
  const title =
    "Exploring Your Options | What Next | Postcode to Parenthood";
  const description =
    "Not sure you're eligible for NHS-funded fertility treatment, or know you're not? Here's what you can do next: alternative funding, how to challenge, and community support.";
  const canonicalUrl =
    "https://postcodetoparenthood.org.uk/what-next/exploring-options";

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

export default function WhatNextExploringOptionsPage() {
  const [searchParams] = useSearchParams();
  const fromBoard = searchParams.get("from");

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Exploring your options"
        description="If you're not sure whether you qualify for NHS-funded treatment, or you know you don't, you still have options. Here's where to start."
        breadcrumbCurrent="Exploring options"
        breadcrumbParents={[{ label: "What next", to: "/what-next/eligible" }]}
      />

      <div className="container mx-auto max-w-prose px-4 py-8 md:py-12">
        <div className="space-y-10 md:space-y-14">
          {fromBoard && (
            <Link
              to={`/board/${fromBoard}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-tint transition-colors hover:text-brand"
            >
              <span aria-hidden="true">←</span>
              Back to funding information
            </Link>
          )}

          {/* <!-- PATIENT PANEL REVIEW REQUIRED --> */}
          {/* Acknowledgement */}
          <section aria-labelledby="acknowledgement-heading">
            <h2
              id="acknowledgement-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              We hear you
            </h2>
            {/* <!-- PATIENT PANEL REVIEW REQUIRED --> */}
            <p className="font-sans text-base leading-relaxed text-ink/75">
              Detailed guidance coming soon. Check back shortly.
            </p>
          </section>

          {/* Postcode awareness note — prominent styling for this page */}
          <section
            aria-labelledby="postcode-awareness-heading"
            className="rounded-xl border-2 border-brand/30 bg-brand/5 px-5 py-6 md:px-7 md:py-8"
          >
            <h2
              id="postcode-awareness-heading"
              className="font-heading text-xl font-semibold text-brand mb-3"
            >
              Your postcode matters
            </h2>
            <p className="font-sans text-base leading-relaxed text-ink/80 mb-4">
              NHS fertility funding varies hugely depending on where your
              GP is registered. Some areas fund three full IVF cycles while
              others fund none. Before ruling anything out, it's worth checking
              what your specific area offers.
            </p>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2"
            >
              See the funding map
              <span aria-hidden="true">→</span>
            </Link>
          </section>

          {/* Alternative funding */}
          {/* <!-- CONTENT PLACEHOLDER: Alternative funding options --> */}
          <section aria-labelledby="alternative-funding-heading">
            <h2
              id="alternative-funding-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              Alternative funding options
            </h2>
            <p className="font-sans text-base leading-relaxed text-ink/75">
              Detailed guidance coming soon. Check back shortly.
            </p>
          </section>

          {/* How to challenge */}
          {/* <!-- CONTENT PLACEHOLDER: How to challenge a decision --> */}
          <section aria-labelledby="how-to-challenge-heading">
            <h2
              id="how-to-challenge-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              How to challenge a decision
            </h2>
            <p className="font-sans text-base leading-relaxed text-ink/75">
              Detailed guidance coming soon. Check back shortly.
            </p>
          </section>

          {/* Support & community */}
          {/* <!-- CONTENT PLACEHOLDER: Support and community resources --> */}
          <section aria-labelledby="support-community-heading">
            <h2
              id="support-community-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              Support &amp; community
            </h2>
            <p className="font-sans text-base leading-relaxed text-ink/75">
              Detailed guidance coming soon. Check back shortly.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
