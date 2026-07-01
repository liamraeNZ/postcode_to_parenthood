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

          {/* Acknowledgement */}
          <section aria-labelledby="acknowledgement-heading">
            <h2
              id="acknowledgement-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              This bit is hard
            </h2>
            <div className="space-y-3">
              <p className="font-sans text-base leading-relaxed text-ink/75">
                If you're reading this page, you're probably somewhere between
                hoping things might still work out and accepting that they
                might not. That's an exhausting place to be.
              </p>
              <p className="font-sans text-base leading-relaxed text-ink/75">
                We can't fix the system. But we can lay out what comes next, as
                clearly as we can, so you're not left guessing.
              </p>
            </div>
          </section>

          {/* Postcode awareness note */}
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
          <section aria-labelledby="alternative-funding-heading">
            <h2
              id="alternative-funding-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              Alternative funding options
            </h2>
            <div className="space-y-3">
              <p className="font-sans text-base leading-relaxed text-ink/75">
                Private IVF in the UK typically costs between £5,000 and £8,000
                per cycle. Medication adds another £1,000 to £1,500 on top.
                It's a lot. But there are ways to manage it.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-ink/75">
                <li>
                  <strong>Payment plans.</strong> Many clinics offer interest-free
                  instalments or monthly payment options. Always check what's
                  included in the headline price (consultations, scans,
                  medication, embryo storage often cost extra).
                </li>
                <li>
                  <strong>Multi-cycle or shared risk packages.</strong> Some
                  clinics offer refund guarantees if treatment doesn't result in
                  a baby after a set number of cycles. These require larger
                  upfront payment but reduce overall financial risk.
                </li>
                <li>
                  <strong>Grants and charitable funding.</strong>{" "}
                  <a
                    href="https://fertilityfoundation.org/ivf-grants-uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline"
                  >
                    The Fertility Foundation
                  </a>{" "}
                  offers IVF grants for people on low incomes in the UK.
                  Eligibility criteria apply and demand is high, but it's worth
                  checking.
                </li>
              </ul>
              <p className="font-sans text-base leading-relaxed text-ink/75">
                The{" "}
                <a
                  href="https://www.hfea.gov.uk/treatments/explore-all-treatments/costs-and-funding/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline"
                >
                  HFEA's costs and funding page
                </a>{" "}
                has impartial guidance on what to expect financially. If you're
                comparing clinics, their{" "}
                <a
                  href="https://www.hfea.gov.uk/choose-a-clinic/clinic-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline"
                >
                  clinic search tool
                </a>{" "}
                lets you compare success rates and services side by side.
              </p>
            </div>
          </section>

          {/* How to challenge */}
          <section aria-labelledby="how-to-challenge-heading">
            <h2
              id="how-to-challenge-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              How to challenge a decision
            </h2>
            <div className="space-y-3">
              <p className="font-sans text-base leading-relaxed text-ink/75">
                If you've been refused NHS funding, you can challenge it. The
                process isn't quick or easy, but it exists.
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-ink/75">
                <li>
                  <strong>Ask for written reasons.</strong> The clinic or ICB
                  should explain exactly why you were refused. Get this in
                  writing. It's your starting point.
                </li>
                <li>
                  <strong>Check the policy was applied correctly.</strong> Small
                  details matter: your age on the date of referral (not today),
                  which version of the policy was used, whether your
                  circumstances were fully considered. Mistakes do happen.
                </li>
                <li>
                  <strong>Use the ICB's internal appeals process.</strong> Most
                  ICBs have one, though the details vary. You'll typically need
                  to submit additional evidence (medical reports, GP letters)
                  and wait for a panel review.
                </li>
                <li>
                  <strong>Escalate to the Ombudsman if needed.</strong> If
                  you've exhausted local processes and believe there was
                  maladministration (an error, unreasonable delay, or
                  unfairness), you can complain to the{" "}
                  <a
                    href="https://www.ombudsman.org.uk/complaints-about-nhs-getting-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline"
                  >
                    Parliamentary and Health Service Ombudsman
                  </a>
                  . Their service is free.
                </li>
              </ol>
              <p className="font-sans text-base leading-relaxed text-ink/75">
                A word of honesty: appeals don't often succeed unless there's a
                clear error in how the policy was applied. That said, if you
                believe the decision was wrong, it's worth pursuing. Just don't
                put the rest of your life on hold waiting for it.
              </p>
            </div>
          </section>

          {/* Support & community */}
          <section aria-labelledby="support-community-heading">
            <h2
              id="support-community-heading"
              className="font-heading text-xl font-semibold text-ink mb-3"
            >
              Support and community
            </h2>
            <div className="space-y-3">
              <p className="font-sans text-base leading-relaxed text-ink/75">
                When NHS funding isn't on the table, the weight of it sits
                differently. It can feel like the door has closed. It hasn't,
                but you might need some time and some people around you before
                you can see what's next.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-ink/75">
                <li>
                  <strong>
                    <a
                      href="https://fertilityfoundation.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline"
                    >
                      The Fertility Foundation
                    </a>
                  </strong>{" "}
                  provides grants, emotional support, and information for people
                  facing infertility in the UK.
                </li>
                <li>
                  <strong>
                    <a
                      href="https://www.bica.net/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline"
                    >
                      BICA
                    </a>
                  </strong>{" "}
                  (British Infertility Counselling Association) has a directory
                  of fertility-trained counsellors. You can search by postcode
                  and contact them directly.
                </li>
                <li>
                  <strong>
                    <a
                      href="https://www.theivfnetwork.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline"
                    >
                      The IVF Network
                    </a>
                  </strong>{" "}
                  runs online communities and expert Q&amp;A sessions covering
                  all stages of the fertility journey.
                </li>
                <li>
                  <strong>Your GP</strong> can refer you to NHS-funded
                  counselling if you're struggling with anxiety or low mood
                  related to fertility. You don't need to be in crisis to ask.
                </li>
              </ul>
              <p className="font-sans text-base leading-relaxed text-ink/75">
                If you're in distress right now, the Samaritans are available
                24/7 on{" "}
                <a
                  href="tel:116123"
                  className="font-semibold text-ink"
                >
                  116 123
                </a>{" "}
                (free to call, won't show on your phone bill).
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
