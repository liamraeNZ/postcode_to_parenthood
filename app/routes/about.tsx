import type { Route } from "./+types/about";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
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

export function headers({ }: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  };
}

export default function AboutPage() {
  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="About Postcode to Parenthood"
        description="Two people, no agenda, one goal: make NHS fertility funding rules actually understandable."
        breadcrumbCurrent="About"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="space-y-12 font-sans text-ink/85 leading-relaxed">
          {/* Our Team */}
          <section aria-labelledby="our-team">
            <h2
              id="our-team"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Our team
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                We're a small team of two.
              </p>
              <p className="text-base leading-relaxed">
                One of us has over a decade of hands-on experience in London's
                leading fertility clinics. She's lived the full patient journey,
                the clinical calls, the operational snags, the admin that
                ultimately shapes the patient experience. From preparation and
                treatment through to aftercare, across both medical and
                administrative sides.
              </p>
              <p className="text-base leading-relaxed">
                The other one? He made the coffees and the website. (Hi!)
              </p>
              <p className="text-base leading-relaxed mt-6">
                That's it. No board of directors, no investors, no advisory panel
                of people who've never sat in a waiting room.
              </p>
            </div>
          </section>

          {/* Our Story */}
          <section aria-labelledby="our-story">
            <h2
              id="our-story"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Our story
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                We kept seeing the same thing: patients crying, frustrated,
                confused and exhausted. Not because of bad news from a doctor,
                but because they'd just discovered that the rules about who gets
                funded, and how much, make no sense.
              </p>
              <p className="text-base leading-relaxed italic text-ink/70">
                Move ten miles down the road and your entitlement changes
                completely. Turn 35 a week before your referral goes through and
                the door slams shut.
              </p>
              <p className="text-base leading-relaxed">
                The system isn't broken in some abstract policy way. It's broken
                in a way that fundamentally affects people's lives, and their
                chance for parenthood.
              </p>
            </div>
          </section>

          {/* Our Goal */}
          <section aria-labelledby="our-goal">
            <h2
              id="our-goal"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Our goal
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                We built this site to <strong>fix</strong> that. Not the policy (we can't), but
                the information gap.
              </p>
              <p className="text-base leading-relaxed">
                Right now, understanding what you're entitled to means wading
                through dozens of PDF documents written in commissioning language
                that no normal person should have to decode.
              </p>
              <p className="text-base leading-relaxed">
                We thought: what if someone just laid it all out clearly, in one
                place, for free?
              </p>
              <p className="text-base leading-relaxed font-medium text-ink">
                So that's what we did.
              </p>
            </div>
          </section>

          {/* Radically Transparent */}
          <section aria-labelledby="radically-transparent">
            <h2
              id="radically-transparent"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Radically transparent
            </h2>
            <div className="space-y-4 max-w-prose">
              <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
                <li>
                  <strong>Your data stays with you.</strong> We don't sell
                  personal information to clinics, pharma companies, or anyone
                  else. There's no analytics tracking beyond what we need to keep
                  the site running.
                </li>
                <li>
                  <strong>We show our working.</strong> Every data point links
                  back to the source document. If we're unsure about something,
                  we say so. If something is out of date, we flag it.
                </li>
                <li>
                  <strong>Nobody funds us but us.</strong> This is a volunteer
                  project built in evenings and weekends because we think it
                  matters. If that ever changes, you'll be the first to know.
                </li>
              </ul>
            </div>
          </section>

          {/* Beyond the NHS */}
          <section aria-labelledby="beyond-the-nhs">
            <h2
              id="beyond-the-nhs"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Beyond the NHS
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                We do not have any commercial relationships with fertility
                providers. Our focus is currently on NHS-funded treatment and
                supporting patients through that journey.
              </p>
              <p className="text-base leading-relaxed">
                At the same time, we understand that for many people, getting a
                second opinion or exploring private fertility options can make a
                very meaningful difference; whether because of long waiting
                lists, unsuccessful NHS cycles, access to different treatments,
                or simply wanting to explore every possible route forward.
              </p>
              <p className="text-base leading-relaxed">
                As the platform grows, we would like to include private fertility
                options as part of our features in the future. If and when we do,
                it will be guided by genuine clinical experience and quality of
                care. From our own experience, we know that personalised care,
                understanding, transparency, and feeling truly supported can make
                a real difference throughout the fertility journey. We will also
                always be fully transparent about how the site is funded.
              </p>
              <p className="text-base leading-relaxed font-medium text-ink">
                For now, however, we remain entirely NHS-focused and self-funded.
              </p>
            </div>
          </section>

          {/* P2P — Peer to Peer */}
          <section aria-labelledby="peer-to-peer">
            <h2
              id="peer-to-peer"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Why "P2P"?
            </h2>
            <p className="text-base leading-relaxed max-w-prose">
              P2P stands for peer-to-peer. We're not experts handing down
              information from above. We're people who've been close to this
              system, who know how confusing and emotionally draining it is,
              and who want to make it a little less awful for the next person
              sitting in that waiting room.
            </p>
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
              <p className="text-base leading-relaxed">
                For a full list of our data sources and references, see our{" "}
                <Link
                  to="/sources"
                  className="text-primary underline font-medium"
                >
                  sources page
                </Link>
                . If any of the terminology is unfamiliar, our{" "}
                <Link
                  to="/glossary"
                  className="text-primary underline font-medium"
                >
                  glossary
                </Link>
                {" "}explains everything in plain English.
              </p>
            </div>
          </section>

          {/* Patient panel */}
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
          <section aria-labelledby="contact">
            <h2
              id="contact"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Get in touch
            </h2>
            <p className="text-base leading-relaxed max-w-prose">
              Spotted an error? Have a suggestion? Want to get involved? Drop us
              a line at{" "}
              <a
                href="mailto:hello@postcodetoparenthood.org.uk"
                className="text-primary underline font-medium"
              >
                hello@postcodetoparenthood.org.uk
              </a>
              . We'd love to hear from you.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
