import type { Route } from "./+types/search";
import { Form, redirect, useActionData } from "react-router";
import { PostcodeSearch } from "@/components/home/PostcodeSearch";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveIcbIdFromPostcodesIo, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";

export function meta({}: Route.MetaArgs) {
  const title = "Search by Postcode | FertilityFund UK";
  const description =
    "Enter your postcode to find your ICB's NHS fertility funding policy, eligibility criteria, and cycles offered.";
  const canonicalUrl = "https://fertilityfund.co.uk/search";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
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
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

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

  const documentFolder = await resolveDocumentFolder(db, resolved.icbId);

  if (!documentFolder) {
    return {
      error:
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

  const slug = toSlug(documentFolder);
  return redirect(`/icb/${slug}?gpPostcode=${encodeURIComponent(postcode)}`);
}

export default function SearchPage() {
  const actionData = useActionData<typeof action>();

  return (
    <section className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2 text-deep-slate">
          Search by postcode
        </h1>
        <p className="text-sm md:text-base text-deep-slate/70 leading-relaxed mb-6">
          Enter your postcode and we'll show you:
        </p>

        <ul className="text-left space-y-1.5 mb-8">
          <li className="flex items-start gap-2 rounded-lg bg-sage-light/40 border border-sage-green/20 px-3 py-2">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-dark text-xs font-bold" aria-hidden="true">✓</span>
            <span className="text-deep-slate font-medium text-sm">Which ICB covers your GP</span>
          </li>
          <li className="flex items-start gap-2 rounded-lg bg-sage-light/40 border border-sage-green/20 px-3 py-2">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-dark text-xs font-bold" aria-hidden="true">✓</span>
            <span className="text-deep-slate font-medium text-sm">Whether NHS-funded care is available</span>
          </li>
          <li className="flex items-start gap-2 rounded-lg bg-sage-light/40 border border-sage-green/20 px-3 py-2">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-dark text-xs font-bold" aria-hidden="true">✓</span>
            <span className="text-deep-slate font-medium text-sm">The eligibility criteria you'll need to meet</span>
          </li>
        </ul>

        <PostcodeSearch />

        {/* No-JS fallback */}
        <noscript>
          <Form method="post" action="/search" className="mt-6">
            <label
              htmlFor="postcode-noscript"
              className="block text-sm font-medium text-deep-slate mb-2"
            >
              Enter your postcode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="postcode-noscript"
                name="postcode"
                placeholder="e.g. SW1A 1AA"
                required
                className="flex-1 px-4 py-3 border-2 border-warm-sand-dark rounded-xl text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-sage-dark text-white font-bold rounded-xl"
              >
                Search
              </button>
            </div>
          </Form>
        </noscript>

        {actionData?.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {actionData.error}
          </div>
        )}
      </div>
    </section>
  );
}
