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

        {/* How to approach your GP */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-ink">
            How to approach your GP
          </h2>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            You don't need to have all the answers before booking an
            appointment. GPs deal with fertility referrals regularly. But a
            little preparation helps the conversation go more smoothly.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-ink/75">
            <li>
              <strong>Note how long you've been trying.</strong> Count in
              months, not cycles. This is usually the single biggest factor in
              whether you'll be referred.
            </li>
            <li>
              <strong>Check your local criteria.</strong> Look at the age
              limits, BMI range, and other requirements for your ICB. You can
              find these on our{" "}
              <Link to="/boards" className="text-brand underline">
                board pages
              </Link>
              .
            </li>
            <li>
              <strong>Be ready to discuss lifestyle factors.</strong> Smoking
              status, alcohol intake, and weight can all affect eligibility.
              Your GP will ask about these openly.
            </li>
            <li>
              <strong>Write down your questions.</strong> It's easy to forget
              things in the moment. Common ones: what tests will happen first?
              How long until a referral? What if I don't meet the criteria?
            </li>
          </ul>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            One thing to know: your GP can't refer you directly for IVF. They
            will arrange initial investigations first (blood tests, scans,
            semen analysis if relevant) and then refer you to a fertility
            clinic. That clinic handles the funding application.
          </p>
        </div>

        {/* What to expect */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-ink">
            What to expect from the process
          </h2>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The exact pathway varies by area, but the general shape is the same
            across most of England.
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-ink/75">
            <li>
              <strong>GP appointment.</strong> History, basic tests, lifestyle
              discussion. This might take one or two visits.
            </li>
            <li>
              <strong>Referral to a fertility clinic.</strong> If tests suggest
              a problem (or you've been trying long enough), your GP refers you
              to a specialist. The clinic then checks your eligibility against
              your ICB's policy.
            </li>
            <li>
              <strong>Funding application.</strong> Most clinics handle this on
              your behalf. It can take several weeks. You may need to provide
              extra paperwork.
            </li>
            <li>
              <strong>Treatment begins.</strong> If approved, you'll typically
              start with less invasive options (ovulation support or IUI) before
              moving to IVF. If funding is refused, you'll be told why and what
              your options are.
            </li>
          </ol>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Wait times vary a lot. Some areas have 6 to 12 month waits just for
            an initial fertility clinic appointment. Ask your GP for an honest
            estimate.
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

        {/* Support & community */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-ink">
            Support along the way
          </h2>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Fertility treatment is draining, even when things are going well.
            Talking to people who get it can make a real difference.
          </p>
          <ul className="list-disc pl-6 space-y-3 text-ink/75">
            <li>
              <strong>The Fertility Foundation</strong> offers grants and
              support for people who can't afford private treatment.{" "}
              <a
                href="https://fertilityfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                fertilityfoundation.org
              </a>
            </li>
            <li>
              <strong>HFEA</strong> (Human Fertilisation and Embryology
              Authority) has impartial information on treatments, success rates,
              and how to choose a clinic.{" "}
              <a
                href="https://www.hfea.gov.uk/treatments/explore-all-treatments/costs-and-funding/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                hfea.gov.uk
              </a>
            </li>
            <li>
              <strong>BICA</strong> (British Infertility Counselling
              Association) maintains a directory of fertility-specialist
              counsellors you can contact directly.{" "}
              <a
                href="https://www.bica.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                bica.net
              </a>
            </li>
            <li>
              <strong>Online communities.</strong> Reddit has active forums
              like{" "}
              <a
                href="https://www.reddit.com/r/IVF/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                r/IVF
              </a>{" "}
              where people share experiences, and{" "}
              <a
                href="https://www.theivfnetwork.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                The IVF Network
              </a>{" "}
              runs moderated discussion spaces. Just keep in mind that
              individual stories may not reflect your own situation.
            </li>
          </ul>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            If you're struggling emotionally, ask your GP about counselling
            referrals. The emotional weight of this process is real, and there's
            no reason to carry it alone.
          </p>
        </div>
      </div>
    </section>
  );
}
