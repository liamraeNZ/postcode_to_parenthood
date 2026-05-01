import type { Route } from "./+types/_index";
import { Form, redirect, useActionData } from "react-router";
import { Hero } from "@/components/home/Hero";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveIcbIdFromPostcodesIo, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";

export function meta({}: Route.MetaArgs) {
  const title = "NHS IVF Funding Eligibility | FertilityFund UK";
  const description =
    "Check your NHS-funded IVF eligibility by postcode. Find your ICB's fertility policy, cycles offered, age limits, and criteria across England.";
  const canonicalUrl = "https://fertilityfund.co.uk";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    {
      property: "og:image",
      content: "https://fertilityfund.co.uk/og-image.png",
    },
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

  // Resolve postcode → ICB via postcodes.io admin lookup
  const admin = await lookupPostcodeAdminLookup(postcode, {
    requestId: crypto.randomUUID(),
  });

  if (!admin) {
    return {
      error:
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

  // Resolve postcodes.io identifiers to an ICB ID in our database
  const resolved = await resolveIcbIdFromPostcodesIo(db, {
    icb: admin.icb,
    ccg_id: admin.ccg_id,
    ccg: admin.ccg,
  });

  if (!resolved) {
    return {
      error:
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

  // Get the document_folder_name for this ICB to generate the slug
  const documentFolder = await resolveDocumentFolder(db, resolved.icbId);

  if (!documentFolder) {
    return {
      error:
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

  const slug = toSlug(documentFolder);
  return redirect(`/icb/${slug}`);
}

export default function IndexPage() {
  const actionData = useActionData<typeof action>();

  return (
    <section className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-6 md:py-10 flex-1">
        <div className="grid grid-cols-12 gap-6">
          <Hero />
        </div>

        {/* No-JS fallback form for postcode search */}
        <noscript>
          <div className="mt-6 max-w-md">
            <Form method="post" action="/">
              <label
                htmlFor="postcode-noscript"
                className="block text-sm font-medium text-deep-slate mb-2"
              >
                Enter your postcode to find your ICB fertility policy
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="postcode-noscript"
                  name="postcode"
                  placeholder="e.g. SE26 5EN"
                  required
                  className="flex-1 px-4 py-3 border-2 border-warm-sand-dark rounded-xl text-base"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-sage-dark text-white font-bold rounded-xl"
                >
                  Find your policy
                </button>
              </div>
            </Form>
          </div>
        </noscript>

        {/* Display action error (visible when form submission fails) */}
        {actionData?.error && (
          <div className="mt-4 max-w-md p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {actionData.error}
          </div>
        )}
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FertilityFund UK",
            url: "https://fertilityfund.co.uk",
            description:
              "Check your NHS-funded IVF eligibility by postcode. Find your ICB's fertility policy across England.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://fertilityfund.co.uk/?postcode={postcode}",
              },
              "query-input": "required name=postcode",
            },
          }),
        }}
      />
    </section>
  );
}
