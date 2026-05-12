import { lazy, Suspense, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Route } from "./+types/map";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { toSlug } from "../lib/slug";
import { MapControlStrip } from "../components/map/MapControlStrip";
import { PageHeader } from "@/components/layout/PageHeader";

const LazyMapContent = lazy(() => import("../components/map/MapContent"));

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const { results: boards } = await db
    .prepare(
      "SELECT id, name, document_folder_name FROM health_boards WHERE document_folder_name IS NOT NULL AND status = 'active'"
    )
    .bind()
    .all<{ id: string; name: string; document_folder_name: string }>();

  return {
    icbs: boards.map((board) => ({
      name: board.name,
      slug: toSlug(board.document_folder_name),
    })),
  };
}

export function meta({}: Route.MetaArgs) {
  const title = "NHS IVF Funding Map | Pathway to Parenthood";
  const description =
    "Explore the UK IVF postcode lottery with an interactive NHS fertility funding map. Compare health board boundaries and local eligibility rules.";
  const canonicalUrl = "https://pathwaytoparenthood.uk/map";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: "https://pathwaytoparenthood.uk/og-image.png" },
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
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-sage-light/35">
      <p className="text-sm text-deep-slate/50">Loading map…</p>
    </div>
  );
}

export default function MapPage({ loaderData }: Route.ComponentProps) {
  const { icbs } = loaderData;

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="NHS IVF funding map"
        description="Click a health board area to open its local IVF funding guidance: cycles offered, age limits, and eligibility requirements."
        breadcrumbCurrent="Funding map"
        actions={
          <Link
            to="/search"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-route-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-route-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-route-teal focus-visible:ring-offset-2"
          >
            <Search className="size-4" aria-hidden />
            Check my pathway
          </Link>
        }
      />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <MapControlStrip className="mb-5" />

        <div className="relative h-[calc(100vh-280px)] min-h-[500px] overflow-hidden rounded-2xl border border-warm-sand-dark/70 shadow-sm ring-1 ring-black/[0.03]">
          <ClientOnly fallback={<MapPlaceholder />}>
            {() => (
              <Suspense fallback={<MapPlaceholder />}>
                <LazyMapContent />
              </Suspense>
            )}
          </ClientOnly>
        </div>
      </div>

      <nav aria-label="Health Board Policy Pages" className="sr-only">
        <h2>All Health Board Fertility Policy Pages</h2>
        <ul>
          {icbs.map((icb) => (
            <li key={icb.slug}>
              <a href={`/board/${icb.slug}`}>{icb.name} IVF Funding Policy</a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
