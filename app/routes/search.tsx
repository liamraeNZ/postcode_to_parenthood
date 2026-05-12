import type { Route } from "./+types/search";
import { Form, redirect, useActionData } from "react-router";
import { PostcodeSearch } from "@/components/home/PostcodeSearch";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveBoardFromPostcode, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";
import { PageHeader } from "@/components/layout/PageHeader";

export function meta({}: Route.MetaArgs) {
  const title = "Check Postcode | Pathway to Parenthood";
  const description =
    "Enter your postcode to find local NHS fertility funding guidance, eligibility criteria, and the health board policy that may apply.";
  const canonicalUrl = "https://pathwaytoparenthood.uk/search";

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

export default function SearchPage() {
  const actionData = useActionData<typeof action>();

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Start with your postcode"
        description="We’ll trace the NHS fertility guidance that may apply where you live, including your health board and key eligibility signals."
        breadcrumbCurrent="Postcode check"
      />
      <div className="flex flex-1 justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md text-center">
          <ul className="mb-10 space-y-2.5 text-left">
            <li className="flex items-start gap-3 rounded-2xl border border-warm-sand-dark/55 bg-white/90 px-4 py-3 shadow-sm">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-light text-xs font-bold text-route-teal-dark"
                aria-hidden
              >
                ✓
              </span>
              <span className="text-sm font-medium leading-snug text-deep-slate">
                Which health board covers your GP
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-warm-sand-dark/55 bg-white/90 px-4 py-3 shadow-sm">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-light text-xs font-bold text-route-teal-dark"
                aria-hidden
              >
                ✓
              </span>
              <span className="text-sm font-medium leading-snug text-deep-slate">
                What NHS-funded IVF support may be available on paper
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-warm-sand-dark/55 bg-white/90 px-4 py-3 shadow-sm">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-light text-xs font-bold text-route-teal-dark"
                aria-hidden
              >
                ✓
              </span>
              <span className="text-sm font-medium leading-snug text-deep-slate">
                The criteria your clinic team will still need to confirm
              </span>
            </li>
          </ul>

          <PostcodeSearch />

          <noscript>
            <Form method="post" action="/search" className="mt-8 text-left">
              <label htmlFor="postcode-noscript" className="mb-2 block text-sm font-medium text-deep-slate">
                Enter your postcode to find your local pathway
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="postcode-noscript"
                  name="postcode"
                  placeholder="e.g. SW1A 1AA"
                  required
                  className="flex-1 rounded-xl border-2 border-warm-sand-dark px-4 py-3 text-base"
                />
                <button type="submit" className="rounded-xl bg-sage-dark px-6 py-3 font-bold text-white">
                  Check pathway
                </button>
              </div>
            </Form>
          </noscript>

          {actionData?.error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {actionData.error}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
