import { lazy, Suspense, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Route } from "./+types/map";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { toSlug } from "../lib/slug";
import { standardMeta } from "@/lib/meta";
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
  const title = "NHS IVF Funding Map | Postcode to Parenthood";
  const description =
    "Explore the UK IVF postcode lottery with an interactive NHS fertility funding map. Compare health board boundaries and local eligibility rules.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/map";

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
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-surface">
      <p className="font-sans text-sm text-ink/50">Loading map…</p>
    </div>
  );
}

export default function MapPage({ loaderData }: Route.ComponentProps) {
  const { icbs } = loaderData;

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        compact
        title="NHS IVF funding map"
        description="Click a health board area to open its local IVF funding guidance: cycles offered, age limits, and eligibility requirements."
        breadcrumbCurrent="Funding map"
      />

      <div className="container mx-auto px-4 pt-4 pb-8 md:pt-6 md:pb-10">
        <MapControlStrip className="mb-4" />

        <div className="relative h-[calc(100vh-280px)] min-h-[500px] overflow-hidden rounded-2xl border border-tint/20 shadow-sm">
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
