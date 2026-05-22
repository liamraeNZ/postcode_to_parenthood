import type { Route } from "./+types/about";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";

export function meta({}: Route.MetaArgs) {
  const title =
    "About Postcode to Parenthood | P2P | NHS Fertility Funding";
  const description =
    "Learn how Postcode to Parenthood collects and verifies NHS fertility funding data, our methodology, limitations, and the peer-to-peer principle behind the project.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/about";

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

export default function AboutPage() {
  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="About Postcode to Parenthood"
        description="Making NHS fertility funding information accessible, transparent, and human."
        breadcrumbCurrent="About"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="space-y-12 font-sans text-ink/85 leading-relaxed">
          {/* P2P Story */}
          {/* <!-- CONTENT OWNER: Replace placeholder with the founding story --> */}
          <section aria-labelledby="our-story">
            <h2
              id="our-story"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Our story
            </h2>
            <p className="text-base leading-relaxed max-w-prose">
              Postcode to Parenthood started with a simple frustration: finding
              out what NHS fertility funding you're entitled to shouldn't require
              hours of searching through policy documents. We're building
              something better. A single place where anyone can understand their
              options clearly and quickly.
            </p>
          </section>

          {/* Peer-to-peer principle */}
          <section aria-labelledby="peer-to-peer">
            <h2
              id="peer-to-peer"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              The peer-to-peer principle
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                P2P stands for peer-to-peer. This project exists because people
                going through fertility treatment deserve honest, accessible
                information, shared by people who understand what it's like to
                navigate this system.
              </p>
              <p className="text-base leading-relaxed">
                We're not a clinic, not a charity, and not affiliated with the
                NHS. We're patients and partners who've been through this process
                and want to make it less opaque for those who come after us. Every
                piece of information on this site is something we wished we'd had
                when we started.
              </p>
              <p className="text-base leading-relaxed">
                That means we prioritise clarity over completeness, honesty over
                reassurance, and being upfront about what we don't know.
              </p>
            </div>
          </section>

          {/* How we build our data — real content */}
          <section aria-labelledby="methodology">
            <h2
              id="methodology"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              How we build our data
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                Every piece of funding data on this site is sourced directly from
                official ICB (Integrated Care Board) policy documents. These are
                the PDFs that each health board publishes outlining their
                fertility treatment commissioning criteria: age limits, BMI
                requirements, number of funded cycles, and waiting time
                expectations.
              </p>
              <p className="text-base leading-relaxed">
                Our process works like this:
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-base leading-relaxed">
                <li>
                  <strong>Source identification</strong> – We locate the current
                  fertility commissioning policy for each ICB, typically published
                  on their website or available through FOI requests.
                </li>
                <li>
                  <strong>Manual extraction</strong> – A human reads the policy
                  document and extracts the structured criteria (age ranges, BMI
                  limits, cycle counts, residency requirements, and other
                  eligibility factors).
                </li>
                <li>
                  <strong>Data entry and verification</strong> – The extracted
                  data is entered into our database and cross-checked against the
                  source document for accuracy.
                </li>
                <li>
                  <strong>Confidence flagging</strong> – Each entry is tagged with
                  a confidence level: confirmed (recently verified against a
                  current policy), inherited (carried over from a predecessor ICB
                  after a merger), under review, or unconfirmed.
                </li>
                <li>
                  <strong>Ongoing monitoring</strong> – We periodically check for
                  policy updates, particularly around the NHS financial year
                  (April) when commissioning decisions are often revised.
                </li>
              </ol>
              <p className="text-base leading-relaxed">
                We store the original policy PDFs alongside our structured data so
                we can always trace a data point back to its source. Where
                policies are ambiguous or contradictory, we flag this rather than
                guessing.
              </p>
            </div>
          </section>

          {/* Patient panel */}
          {/* <!-- CONTENT OWNER: Replace placeholder with patient panel details once established --> */}
          {/* <!-- PATIENT PANEL REVIEW REQUIRED --> */}
          <section aria-labelledby="patient-panel">
            <h2
              id="patient-panel"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Patient panel
            </h2>
            <p className="text-base leading-relaxed max-w-prose">
              We're establishing a patient panel to help guide the direction of
              this project, ensuring the information we present is genuinely
              useful and sensitive to the emotional reality of fertility
              treatment. More details coming soon.
            </p>
          </section>

          {/* Our limitations — real content */}
          <section aria-labelledby="limitations">
            <h2
              id="limitations"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Our limitations
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                We believe in being upfront about what this site can and can't
                do. Please keep the following in mind:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
                <li>
                  <strong>This is not medical advice.</strong> Nothing on this
                  site constitutes medical guidance. We present policy
                  information (what your health board says it will fund) but we
                  can't tell you whether you personally qualify. Only your GP and
                  fertility clinic can assess your individual circumstances.
                </li>
                <li>
                  <strong>Data may be outdated.</strong> ICB policies can change
                  at any time, and there's often a delay between a policy being
                  updated and us reflecting that change. We show the date of the
                  source document wherever possible so you can judge how current
                  the information is.
                </li>
                <li>
                  <strong>Always verify with your GP.</strong> Before making any
                  decisions about fertility treatment based on information you
                  find here, please speak to your GP or fertility clinic. They
                  have access to the most current commissioning criteria and can
                  assess your specific situation.
                </li>
                <li>
                  <strong>Coverage isn't complete.</strong> We aim to cover all
                  ICBs in England, but some boards have policies that are
                  difficult to locate or interpret. Where we're uncertain, we say
                  so rather than guessing.
                </li>
                <li>
                  <strong>We're a small team.</strong> This is a volunteer-led
                  project. We do our best to keep data current, but we don't have
                  the resources of a large organisation. If you spot something
                  that looks wrong, please let us know.
                </li>
              </ul>
            </div>
          </section>

          {/* Get in touch */}
          {/* <!-- CONTENT OWNER: Replace with actual contact details/form when ready --> */}
          <section aria-labelledby="contact">
            <h2
              id="contact"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Get in touch
            </h2>
            <p className="text-base leading-relaxed max-w-prose">
              Spotted an error? Have a suggestion? Want to get involved? We'd
              love to hear from you. Contact details and a feedback form are
              coming soon.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
