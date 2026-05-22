import type { Route } from "./+types/terms";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";

export function meta({}: Route.MetaArgs) {
  const title = "Terms of Use | Postcode to Parenthood";
  const description =
    "Terms of use for the Postcode to Parenthood website.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/terms";

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

export default function TermsPage() {
  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Terms of use"
        description="Please read these terms carefully before using this website."
        breadcrumbCurrent="Terms of use"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        <div className="prose prose-ink max-w-none font-sans">
          <h2 className="font-heading text-xl font-semibold text-ink">
            Informational purpose
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            All content on Postcode to Parenthood is provided for general
            informational purposes only. The information about NHS IVF funding
            eligibility is provided as a guide only and may not reflect the most
            current policies of individual Integrated Care Boards (ICBs) or
            Health Boards.
          </p>

          <h2 className="mt-8 font-heading text-xl font-semibold text-ink">
            Disclaimer
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            This website does not provide medical, legal, or financial advice.
            Nothing on this site should be construed as professional advice of
            any kind. You should always consult a qualified professional for
            advice specific to your circumstances. Eligibility criteria and
            funding policies change frequently. Always verify information
            directly with your local ICB or Health Board.
          </p>

          <h2 className="mt-8 font-heading text-xl font-semibold text-ink">
            No warranty
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            This website is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranty of any kind, whether express or
            implied, including but not limited to the implied warranties of
            merchantability, fitness for a particular purpose, or
            non-infringement. We do not guarantee that the information on this
            site is accurate, complete, or up to date.
          </p>

          <h2 className="mt-8 font-heading text-xl font-semibold text-ink">
            Limitation of liability
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            To the fullest extent permitted by law, the site operators shall not
            be liable for any direct, indirect, incidental, consequential, or
            special damages arising out of or in connection with your use of, or
            inability to use, this website or its content. This includes, without
            limitation, any reliance placed on information provided on the site.
          </p>

          <h2 className="mt-8 font-heading text-xl font-semibold text-ink">
            External links
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            This site contains links to external websites, including NHS and ICB
            websites, which are not under our control. We are not responsible for
            the content, accuracy, or availability of any external sites. The
            inclusion of a link does not imply endorsement of the linked site or
            its content.
          </p>

          <h2 className="mt-8 font-heading text-xl font-semibold text-ink">
            Changes to these terms
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            We may update these terms from time to time. Any changes will be
            posted on this page. Your continued use of the site after changes are
            posted constitutes your acceptance of the revised terms.
          </p>
        </div>
      </div>
    </section>
  );
}
