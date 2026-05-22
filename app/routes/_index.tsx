import type { Route } from "./+types/_index";
import { Form, redirect, useActionData } from "react-router";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveBoardFromPostcode, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";
import { standardMeta } from "@/lib/meta";
import { HeroSection } from "@/components/home/HeroSection";
import StatsTicker from "@/components/home/StatsTicker";
import HowItWorks from "@/components/home/HowItWorks";
import TrustBar from "@/components/home/TrustBar";
import WhyItMatters from "@/components/home/WhyItMatters";
import MapCTA from "@/components/home/MapCTA";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

export function meta({}: Route.MetaArgs) {
  const title = "Postcode to Parenthood | Unlock Your IVF Funding";
  const description =
    "Don't let your postcode dictate your future. Get an instant breakdown of NHS fertility funding eligibility, cycle availability, and local health board policy.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk";

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
    "Cache-Control": "public, max-age=60, s-maxage=600",
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const postcode = (formData.get("postcode") as string | null)?.trim() ?? "";

  if (!postcode) {
    return { error: "Please enter a postcode" };
  }

  const db = context.cloudflare.env.DB;

  const admin = await lookupPostcodeAdminLookup(postcode, {
    requestId: crypto.randomUUID(),
  });

  if (!admin) {
    return {
      error:
        "We couldn't find a health board for that postcode. Please check and try again.",
    };
  }

  const resolved = await resolveBoardFromPostcode(db, {
    country: admin.country,
    icb: admin.icb,
    ccg_id: admin.ccg_id,
    ccg: admin.ccg,
    nhs_ha: admin.nhs_ha,
    primary_care_trust: admin.primary_care_trust,
  });

  if (!resolved) {
    return {
      error:
        "We couldn't find a health board for that postcode. Please check and try again.",
    };
  }

  const documentFolder = await resolveDocumentFolder(db, resolved.boardId);

  if (!documentFolder) {
    return {
      error:
        "We couldn't find a health board for that postcode. Please check and try again.",
    };
  }

  const slug = toSlug(documentFolder);
  return redirect(`/board/${slug}?gpPostcode=${encodeURIComponent(postcode)}`);
}

export default function LandingPage() {
  const actionData = useActionData<typeof action>();

  return (
    <section className="flex flex-1 flex-col">
      <HeroSection />
      <StatsTicker />
      <HowItWorks />
      <TrustBar />
      <WhyItMatters />
      <MapCTA />
      <FAQSection />
      <CTASection />

      {/* No-JS fallback */}
      <noscript>
        <div className="container mx-auto max-w-md px-4 py-8">
          <Form method="post" action="/">
            <label htmlFor="postcode-noscript" className="mb-2 block text-sm font-medium text-ink">
              Enter your postcode to find your health board&apos;s fertility policy
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="postcode-noscript"
                name="postcode"
                placeholder="e.g. SW1A 1AA"
                required
                className="flex-1 rounded-full border border-tint/30 px-4 py-3 text-base font-mono"
              />
              <button
                type="submit"
                className="rounded-full bg-brand px-6 py-3 font-semibold text-white"
              >
                Find My Funding
              </button>
            </div>
          </Form>
        </div>
      </noscript>

      {actionData?.error ? (
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionData.error}
          </div>
        </div>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Postcode to Parenthood",
            url: "https://postcodetoparenthood.org.uk",
            description:
              "A clearer route through NHS IVF funding. Check local eligibility guidance and health board policies by postcode.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://postcodetoparenthood.org.uk/search?postcode={postcode}",
              },
              "query-input": "required name=postcode",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Postcode to Parenthood",
            url: "https://postcodetoparenthood.org.uk",
            logo: "https://postcodetoparenthood.org.uk/og-image.png",
            description:
              "Helping UK residents navigate the IVF postcode lottery by mapping local NHS fertility funding guidance to health board policies.",
            sameAs: [],
          }),
        }}
      />
    </section>
  );
}
