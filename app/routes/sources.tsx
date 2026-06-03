import type { Route } from "./+types/sources";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  const title = "Our Sources | Postcode to Parenthood";
  const description =
    "Where our NHS fertility funding data comes from. Every data point is sourced from official ICB policy documents, government publications, and health board websites.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/sources";

  return [
    { title },
    { name: "description", content: description },
    ...standardMeta(canonicalUrl),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  };
}

export default function SourcesPage() {
  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Our Sources"
        description="Every piece of data on this site is traceable back to an official source. Here's where it all comes from."
        breadcrumbCurrent="Sources"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="space-y-12 font-sans text-ink/85 leading-relaxed">
          {/* Primary data source */}
          <section aria-labelledby="primary-source">
            <h2
              id="primary-source"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Primary data source
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                Our baseline dataset for England comes from the UK Government's
                published overview of NHS-funded IVF provision:
              </p>
              <div className="rounded-lg border border-tint/15 bg-surface p-4">
                <p className="text-sm font-medium text-ink">
                  Department of Health and Social Care
                </p>
                <a
                  href="https://www.gov.uk/government/publications/nhs-funded-ivf-in-england/nhs-funded-in-vitro-fertilisation-ivf-in-england"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline text-base font-medium"
                >
                  NHS-funded in vitro fertilisation (IVF) in England
                </a>
                <p className="text-sm text-ink/60 mt-1">
                  gov.uk — Published overview of IVF funding by ICB area
                </p>
              </div>
              <p className="text-base leading-relaxed">
                This publication provides a summary of funded IVF cycles by ICB.
                We use it as a cross-reference and starting point, but our
                detailed criteria (age limits, BMI requirements, waiting times,
                residency rules) come from reading each ICB's full policy
                document directly.
              </p>
            </div>
          </section>

          {/* ICB policy documents */}
          <section aria-labelledby="icb-policies">
            <h2
              id="icb-policies"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              ICB policy documents
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                For each Integrated Care Board in England, we source the full
                fertility commissioning policy document. These are typically
                published as PDFs on the ICB's website, often under their
                clinical policies, individual funding request, or commissioning
                pages.
              </p>
              <p className="text-base leading-relaxed">
                We store a copy of each document and extract structured data from
                it: cycle entitlements, age ranges, BMI limits, waiting time
                expectations, and other eligibility criteria. Where a policy is
                ambiguous, we flag the uncertainty rather than guessing.
              </p>
              <p className="text-base leading-relaxed">
                On each{" "}
                <Link to="/boards" className="text-primary underline font-medium">
                  board page
                </Link>
                , you can view the source document for that ICB's data.
              </p>
            </div>
          </section>

          {/* Devolved nations */}
          <section aria-labelledby="devolved-nations">
            <h2
              id="devolved-nations"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Devolved nations
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                Scotland, Wales, and Northern Ireland each have national-level
                fertility policies rather than the area-by-area variation seen in
                England.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
                <li>
                  <strong>Scotland</strong> — National policy set by the Scottish
                  Government, applied uniformly across all NHS health boards.
                </li>
                <li>
                  <strong>Wales</strong> — Policy published by the Welsh Health
                  Specialised Services Committee (WHSSC), applicable across all
                  Welsh health boards.
                </li>
                <li>
                  <strong>Northern Ireland</strong> — Regional fertility service
                  criteria published by Health and Social Care Northern Ireland.
                </li>
              </ul>
            </div>
          </section>

          {/* NICE guidelines */}
          <section aria-labelledby="nice-guidelines">
            <h2
              id="nice-guidelines"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              NICE guidelines
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                The National Institute for Health and Care Excellence (NICE)
                recommends that women under 43 should be offered 3 full cycles of
                IVF. This is a recommendation, not a mandate. Individual ICBs
                decide whether to follow it, and most don't fully.
              </p>
              <div className="rounded-lg border border-tint/15 bg-surface p-4">
                <p className="text-sm font-medium text-ink">NICE</p>
                <a
                  href="https://www.nice.org.uk/guidance/cg156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline text-base font-medium"
                >
                  CG156: Fertility problems: assessment and treatment
                </a>
                <p className="text-sm text-ink/60 mt-1">
                  nice.org.uk — Clinical guideline covering assessment and
                  treatment of fertility problems
                </p>
              </div>
            </div>
          </section>

          {/* How we verify */}
          <section aria-labelledby="verification">
            <h2
              id="verification"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              How we verify data
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                Each entry in our database is tagged with a confidence level:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
                <li>
                  <strong>Confirmed</strong> — Verified against a policy document
                  dated within the last 3 years.
                </li>
                <li>
                  <strong>Under review</strong> — The source document is older or
                  we're aware of potential changes that haven't been confirmed
                  yet.
                </li>
                <li>
                  <strong>Inherited</strong> — Policy carried over from a
                  predecessor organisation (e.g. after an ICB merger) and not yet
                  independently verified under the new body.
                </li>
                <li>
                  <strong>Unconfirmed</strong> — We haven't yet been able to
                  locate or verify the source document.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                We check for policy updates periodically, particularly around the
                NHS financial year in April when commissioning decisions are often
                revised.
              </p>
            </div>
          </section>

          {/* Spot something wrong */}
          <section aria-labelledby="corrections">
            <h2
              id="corrections"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Spot something wrong?
            </h2>
            <p className="text-base leading-relaxed max-w-prose">
              If you notice an error, an outdated policy, or a missing source,
              please{" "}
              <Link
                to="/contact"
                className="text-primary underline font-medium"
              >
                get in touch
              </Link>
              . We take accuracy seriously and will investigate any reported
              discrepancy.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
