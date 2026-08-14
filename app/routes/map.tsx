import { lazy, Suspense, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Route } from "./+types/map";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { toSlug } from "../lib/slug";
import { standardMeta } from "@/lib/meta";
import { listActiveBoards } from "@/lib/server/boardsRepo";
import { MapControlStrip } from "../components/map/MapControlStrip";
import { PageHeader } from "@/components/layout/PageHeader";

const LazyMapContent = lazy(() => import("../components/map/MapContent"));

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const boards = await listActiveBoards(db);

  return {
    icbs: boards.map((board) => ({
      id: board.id,
      name: board.name,
      slug: toSlug(board.document_folder_name),
    })),
  };
}

export function meta({}: Route.MetaArgs) {
  const title =
    "NHS IVF Criteria by Area | Interactive Funding Map | Postcode to Parenthood";
  const description =
    "View NHS IVF criteria by area on an interactive map. Compare fertility treatment eligibility rules, funded cycles, and age limits across every Integrated Care Board and health board in the UK.";
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
        title="NHS IVF criteria by area"
        description="See how fertility treatment funding varies across the UK. Click any area to view its eligibility rules, funded cycles, and age limits."
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

      {/* SEO content section — visible summary below the map */}
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h2 className="font-heading text-xl font-semibold text-ink mb-3">
          Understanding NHS IVF funding by area
        </h2>
        <div className="space-y-3 font-sans text-base text-ink/80 leading-relaxed">
          <p>
            Each Integrated Care Board (ICB) in England sets its own eligibility criteria for NHS-funded IVF treatment. These criteria typically include age limits, body mass index (BMI) requirements, whether intrauterine insemination (IUI) rounds are required first, and how many full cycles of IVF are offered.
          </p>
          <p>
            In Scotland, Wales, and Northern Ireland, health boards follow national policies, though access can still vary. The map above shows every board boundary so you can quickly compare what fertility treatment funding is available where you live.
          </p>
        </div>
      </div>

      <nav aria-label="Health Board Policy Pages" className="sr-only">
        <h2>All Health Board Fertility Policy Pages</h2>
        <ul>
          {icbs.map((icb) => (
            <li key={icb.id}>
              <a href={`/board/${icb.slug}`}>{icb.name} IVF Funding Policy</a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
