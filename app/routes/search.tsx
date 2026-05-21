import type { Route } from "./+types/search";
import { Form, redirect, useActionData } from "react-router";
import { PostcodeSearch } from "@/components/home/PostcodeSearch";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveBoardFromPostcode, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";
import { TrustDisclaimer } from "@/components/shared/TrustDisclaimer";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  const title = "Check Postcode | Postcode to Parenthood";
  const description =
    "Enter your postcode to find local NHS fertility funding guidance, eligibility criteria, and the health board policy that may apply.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/search";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: "https://postcodetoparenthood.org.uk/og-image.png" },
    { property: "og:site_name", content: "Postcode to Parenthood" },
    { property: "og:locale", content: "en_GB" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "https://postcodetoparenthood.org.uk/og-image.png" },
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
      <div className="relative mesh-hero flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
        {/* Decorative blurs matching landing page */}
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-warm-deep/35 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-tint-light/70 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-lg">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-center">
            <ol className="inline-flex items-center gap-2 text-sm text-ink/55">
              <li>
                <Link
                  to="/"
                  className="font-medium transition-colors hover:text-brand"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink/35">/</li>
              <li className="font-medium text-ink">Postcode check</li>
            </ol>
          </nav>

          {/* Heading */}
          <h1 className="text-center font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Find your local funding policy
          </h1>
          <p className="mx-auto mt-3 max-w-md text-center font-sans text-base leading-relaxed text-ink/70 font-light md:text-lg">
            Enter your postcode and we'll match you to the health board whose guidance applies.
          </p>

          {/* Search input — the focal point */}
          <div className="mt-8">
            <PostcodeSearch />
          </div>

          {actionData?.error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
              {actionData.error}
            </div>
          ) : null}

          {/* What you'll get */}
          <div className="mt-10">
            <p className="mb-3 text-center font-mono text-xs font-semibold uppercase tracking-widest text-ink/50">
              We'll show you
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 rounded-2xl border border-tint/20 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tint-light text-[0.65rem] font-bold text-brand"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="font-sans text-sm text-ink/80">
                  Which health board covers your GP
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-tint/20 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tint-light text-[0.65rem] font-bold text-brand"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="font-sans text-sm text-ink/80">
                  What NHS-funded IVF support may be available
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-tint/20 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tint-light text-[0.65rem] font-bold text-brand"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="font-sans text-sm text-ink/80">
                  The eligibility criteria your clinic will assess
                </span>
              </li>
            </ul>
          </div>

          {/* Trust disclaimer */}
          <div className="mt-8 text-center">
            <TrustDisclaimer className="mx-auto max-w-sm" />
          </div>

          <noscript>
            <Form method="post" action="/search" className="mt-8">
              <label htmlFor="postcode-noscript" className="mb-2 block text-sm font-medium text-ink">
                Enter your postcode to find your local pathway
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
                <button type="submit" className="rounded-full bg-brand px-6 py-3 font-semibold text-white">
                  Check pathway
                </button>
              </div>
            </Form>
          </noscript>
        </div>
      </div>
    </section>
  );
}
