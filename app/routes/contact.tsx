import type { Route } from "./+types/contact";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";
import { trackContactEmail } from "@/lib/analytics";

export function meta({}: Route.MetaArgs) {
  const title = "Contact Us | Postcode to Parenthood";
  const description =
    "Get in touch with the Postcode to Parenthood team. Report errors, suggest improvements, or just say hello.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/contact";

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

export default function ContactPage() {
  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Contact Us"
        description="We're a small team but we read every message."
        breadcrumbCurrent="Contact"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="space-y-12 font-sans text-ink/85 leading-relaxed">
          <section aria-labelledby="get-in-touch">
            <h2
              id="get-in-touch"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              Drop us a line
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                Whether you've spotted an error in our data, have a suggestion
                for how we can improve, or just want to say hello — we'd love to
                hear from you.
              </p>
              <p className="text-base leading-relaxed">
                Email us at{" "}
                <a
                  href="mailto:hello@postcodetoparenthood.org.uk"
                  onClick={() => trackContactEmail()}
                  className="text-primary underline font-medium"
                >
                  hello@postcodetoparenthood.org.uk
                </a>
              </p>
            </div>
          </section>

          <section aria-labelledby="what-to-expect">
            <h2
              id="what-to-expect"
              className="font-heading text-2xl font-semibold text-ink mb-4"
            >
              What to expect
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="text-base leading-relaxed">
                We're two people with day jobs, so we might not reply instantly —
                but we do read everything and aim to get back to you within a few
                days.
              </p>
              <p className="text-base leading-relaxed">
                Things we'd especially love to hear about:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>Data errors or outdated policy information</li>
                <li>ICBs we haven't covered yet</li>
                <li>Suggestions for making the site more useful</li>
                <li>Your experience navigating the fertility funding system</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
