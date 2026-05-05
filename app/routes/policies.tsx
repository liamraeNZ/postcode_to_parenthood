import type { Route } from "./+types/policies";
import { Link } from "react-router";
import { useState, useMemo } from "react";
import { toSlug } from "@/lib/slug";
import { FileText, Search } from "lucide-react";

interface IcbRow {
  id: string;
  name: string;
  document_folder_name: string;
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const { results: icbs } = await db
    .prepare(
      `SELECT id, name, document_folder_name
       FROM icbs
       WHERE document_folder_name IS NOT NULL AND status = 'active'
       ORDER BY document_folder_name ASC`
    )
    .bind()
    .all<IcbRow>();

  return { icbs };
}

export function meta({}: Route.MetaArgs) {
  const title = "ICB Policy Documents | FertilityFund UK";
  const description =
    "Browse NHS fertility funding policy documents by Integrated Care Board (ICB). Search by name or pick from the full list.";
  const canonicalUrl = "https://fertilityfund.uk/policies";

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
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export default function PoliciesPage({ loaderData }: Route.ComponentProps) {
  const { icbs } = loaderData;
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return icbs;
    const term = search.toLowerCase().trim();
    return icbs.filter((icb) => icb.document_folder_name.toLowerCase().includes(term));
  }, [icbs, search]);

  return (
    <section className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
          <ol className="flex items-center gap-2 text-sm text-deep-slate/60">
            <li>
              <Link to="/" className="hover:text-sage-btn transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-deep-slate font-medium">Policy Documents</li>
          </ol>
        </nav>

        {/* Page heading */}
        <header className="mb-6 md:mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-deep-slate mb-2">
            ICB Policy Documents
          </h1>
          <p className="text-sm md:text-base text-deep-slate/70 leading-relaxed">
            Browse the original fertility funding policy documents published by each Integrated Care Board.
            Search by name or pick from the list below.
          </p>
        </header>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-slate/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            aria-label="Search ICBs by name"
            className="w-full pl-10 pr-4 py-3 border-2 border-warm-sand-dark rounded-xl text-base bg-white focus:outline-none focus:border-sage-btn focus:ring-1 focus:ring-sage-btn transition-colors"
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-deep-slate/60 mb-4">
          {filtered.length === icbs.length
            ? `${icbs.length} ICBs with policy documents`
            : `${filtered.length} of ${icbs.length} ICBs`}
        </p>

        {/* ICB list */}
        {filtered.length > 0 ? (
          <ul className="space-y-2">
            {filtered.map((icb) => (
              <li key={icb.id}>
                <Link
                  to={`/policy/${toSlug(icb.document_folder_name)}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white border border-warm-sand-dark rounded-xl hover:border-sage-btn hover:shadow-sm transition-all group"
                >
                  <FileText className="w-5 h-5 text-sage-btn flex-shrink-0" />
                  <span className="text-deep-slate font-medium group-hover:text-sage-btn transition-colors">
                    {icb.document_folder_name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 bg-warm-sand rounded-xl text-center">
            <p className="text-deep-slate/70">
              No ICBs match your search. Try a different name.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
