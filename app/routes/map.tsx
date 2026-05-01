import { lazy, Suspense, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Route } from "./+types/map";
import { toSlug } from "../lib/slug";

const LazyMapContent = lazy(() => import("../components/map/MapContent"));

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const { results: icbs } = await db
    .prepare(
      "SELECT id, name, document_folder_name FROM icbs WHERE document_folder_name IS NOT NULL AND status = 'active'"
    )
    .bind()
    .all<{ id: string; name: string; document_folder_name: string }>();

  return {
    icbs: icbs.map((icb) => ({
      name: icb.name,
      slug: toSlug(icb.document_folder_name),
    })),
  };
}

export function meta({}: Route.MetaArgs) {
  const title = "NHS IVF Funding Map | FertilityFund UK";
  const description =
    "Interactive map of NHS-funded IVF policies across England. Explore ICB boundaries, compare fertility funding criteria, and find your local area's eligibility rules.";
  const canonicalUrl = "https://fertilityfund.co.uk/map";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: "https://fertilityfund.co.uk/og-image.png" },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  };
}

function ClientOnly({
  children,
  fallback,
}: {
  children: () => ReactNode;
  fallback: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children() : fallback}</>;
}

function MapPlaceholder() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-sage-light/30 rounded-xl">
      <p className="text-deep-slate/50 text-sm">Loading map…</p>
    </div>
  );
}

export default function MapPage({ loaderData }: Route.ComponentProps) {
  const { icbs } = loaderData;

  return (
    <section className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-deep-slate mb-1">
              NHS IVF Funding Map
            </h1>
            <p className="text-sm md:text-base text-deep-slate/70 max-w-2xl">
              Click on an ICB area to view its funding criteria, including cycles offered, age limits, and eligibility requirements.
            </p>
          </div>
          <a
            href="/search"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-sage-dark px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-sage-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green focus-visible:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            Search by Postcode
          </a>
        </header>

        <div className="h-[calc(100vh-280px)] min-h-[500px] relative rounded-xl overflow-hidden border border-warm-sand-dark">
          <ClientOnly fallback={<MapPlaceholder />}>
            {() => (
              <Suspense fallback={<MapPlaceholder />}>
                <LazyMapContent />
              </Suspense>
            )}
          </ClientOnly>
        </div>
      </div>

      {/* Hidden navigation for crawlers to discover all ICB policy pages */}
      <nav aria-label="ICB Policy Pages" className="sr-only">
        <h2>All ICB Fertility Policies</h2>
        <ul>
          {icbs.map((icb) => (
            <li key={icb.slug}>
              <a href={`/icb/${icb.slug}`}>{icb.name} IVF Funding Policy</a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
