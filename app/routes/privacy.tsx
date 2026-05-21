import type { Route } from "./+types/privacy";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";

export function meta({}: Route.MetaArgs) {
  const title = "Privacy Policy | Postcode to Parenthood";
  const description =
    "How Postcode to Parenthood handles your data, cookies, and third-party services.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/privacy";

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

export default function PrivacyPolicyPage() {
  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Privacy policy"
        description="How we handle your data when you use Postcode to Parenthood."
        breadcrumbCurrent="Privacy policy"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        <div className="prose prose-neutral max-w-none font-sans text-ink/85 leading-relaxed">
          <p className="text-sm text-ink/55">Last updated: January 2025</p>

          <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-3">
            Data we collect
          </h2>
          <p>
            When you use Postcode to Parenthood, you may enter a UK postcode to
            look up NHS fertility funding eligibility in your area. This postcode
            is sent to a third-party API for lookup purposes only and is{" "}
            <strong>not stored</strong> by us in any database, log, or file.
          </p>
          <p>
            We do not collect, store, or process any personal data. No accounts
            are required, no email addresses are gathered, and no user profiles
            are created.
          </p>

          <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-3">
            Cookies
          </h2>
          <p>
            We use cookies only when you have given explicit consent via our
            cookie consent banner. You can accept or decline non-essential
            cookies at any time.
          </p>

          <h3 className="font-heading text-lg font-medium text-ink mt-6 mb-2">
            Essential cookies
          </h3>
          <table className="w-full text-sm border-collapse mt-2 mb-4">
            <thead>
              <tr className="border-b border-tint/20">
                <th className="text-left py-2 pr-4 font-medium">Cookie</th>
                <th className="text-left py-2 pr-4 font-medium">Purpose</th>
                <th className="text-left py-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-tint/10">
                <td className="py-2 pr-4 font-mono text-xs">p2p-consent</td>
                <td className="py-2 pr-4">
                  Stores your cookie consent preference
                </td>
                <td className="py-2">365 days</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-heading text-lg font-medium text-ink mt-6 mb-2">
            Analytics cookies (consent-gated)
          </h3>
          <p>
            These cookies are only set if you accept non-essential cookies via
            the consent banner. They are used by Google Analytics 4 to help us
            understand how visitors use the site.
          </p>
          <table className="w-full text-sm border-collapse mt-2 mb-4">
            <thead>
              <tr className="border-b border-tint/20">
                <th className="text-left py-2 pr-4 font-medium">Cookie</th>
                <th className="text-left py-2 pr-4 font-medium">Purpose</th>
                <th className="text-left py-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-tint/10">
                <td className="py-2 pr-4 font-mono text-xs">_ga</td>
                <td className="py-2 pr-4">
                  Distinguishes unique visitors for Google Analytics
                </td>
                <td className="py-2">2 years</td>
              </tr>
              <tr className="border-b border-tint/10">
                <td className="py-2 pr-4 font-mono text-xs">
                  _ga_WLXJK78YSL
                </td>
                <td className="py-2 pr-4">
                  Maintains session state for Google Analytics 4
                </td>
                <td className="py-2">2 years</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-heading text-lg font-medium text-ink mt-6 mb-2">
            Infrastructure cookies
          </h3>
          <table className="w-full text-sm border-collapse mt-2 mb-4">
            <thead>
              <tr className="border-b border-tint/20">
                <th className="text-left py-2 pr-4 font-medium">Cookie</th>
                <th className="text-left py-2 pr-4 font-medium">Purpose</th>
                <th className="text-left py-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-tint/10">
                <td className="py-2 pr-4 font-mono text-xs">__cf_bm</td>
                <td className="py-2 pr-4">
                  Cloudflare bot management — helps distinguish legitimate
                  visitors from automated traffic
                </td>
                <td className="py-2">30 minutes</td>
              </tr>
            </tbody>
          </table>

          <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-3">
            Cookie consent
          </h2>
          <p>
            When you first visit the site, a cookie consent banner will appear.
            You can choose to accept or decline non-essential cookies. Your
            preference is stored in the <code>p2p-consent</code> cookie for 365
            days. You can change your preference at any time using the "Cookie
            preferences" link in the site footer.
          </p>

          <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-3">
            Cloudflare infrastructure
          </h2>
          <p>
            This site is hosted on Cloudflare Workers and served via
            Cloudflare's global network. Cloudflare may process request metadata
            (IP addresses, request headers) as part of its standard CDN and
            security operations. Cloudflare may set the{" "}
            <code>__cf_bm</code> cookie for bot management purposes. For more
            information, see{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline hover:text-brand/80"
            >
              Cloudflare's privacy policy
            </a>
            .
          </p>

          <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-3">
            Third-party services
          </h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>postcodes.io</strong> — An open-source postcode lookup API
              operated by Ideal Postcodes. When you enter a postcode, it is sent
              to this service to determine your local health board. Postcodes.io
              does not receive any other information about you.
            </li>
            <li>
              <strong>Google Analytics 4</strong> (consent-gated) — Used to
              understand how visitors interact with the site. Only activated if
              you accept non-essential cookies. Google may process data in
              accordance with their{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline hover:text-brand/80"
              >
                privacy policy
              </a>
              .
            </li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-3">
            No personal data persistence
          </h2>
          <p>
            To be clear: we do not store postcodes, IP addresses, or any
            personally identifiable information. There are no user accounts, no
            databases of personal data, and no tracking beyond the
            consent-gated analytics cookies described above.
          </p>

          <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-3">
            Contact
          </h2>
          <p>
            If you have questions about this privacy policy, please reach out
            via the contact details on the site.
          </p>
        </div>
      </div>
    </section>
  );
}
