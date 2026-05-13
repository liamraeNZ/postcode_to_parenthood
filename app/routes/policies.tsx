import type { Route } from "./+types/policies";
import { Link, useSearchParams } from "react-router";
import { useState, useMemo, useCallback } from "react";
import { toSlug } from "@/lib/slug";
import { formatIcbName } from "@/lib/utils";
import { FileText, Search } from "lucide-react";
import { CountryFilter } from "@/components/CountryFilter";
import { PageHeader } from "@/components/layout/PageHeader";

interface BoardRow {
  id: string;
  name: string;
  document_folder_name: string;
  country: string;
  is_national: number | null;
  last_updated: string | null;
}

interface CountryCount {
  code: string;
  label: string;
  count: number;
}

const COUNTRY_LABELS: Record<string, string> = {
  ENGLAND: "England",
  SCOTLAND: "Scotland",
  WALES: "Wales",
  NORTHERN_IRELAND: "Northern Ireland",
};

const COUNTRY_ORDER = ["ENGLAND", "SCOTLAND", "WALES", "NORTHERN_IRELAND"];

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const { results: boards } = await db
    .prepare(
      `SELECT id, name, document_folder_name, country, is_national, last_updated
       FROM health_boards
       WHERE document_folder_name IS NOT NULL AND status = 'active'
       ORDER BY name ASC`
    )
    .bind()
    .all<BoardRow>();

  // Compute per-country counts
  const countMap = new Map<string, number>();
  for (const board of boards) {
    countMap.set(board.country, (countMap.get(board.country) || 0) + 1);
  }

  const countryCounts: CountryCount[] = COUNTRY_ORDER
    .filter((code) => countMap.has(code))
    .map((code) => ({
      code,
      label: COUNTRY_LABELS[code] || code,
      count: countMap.get(code) || 0,
    }));

  return { boards, countryCounts };
}

export function meta({}: Route.MetaArgs) {
  const title = "Local NHS Fertility Policies | Pathway to Parenthood";
  const description =
    "Browse local NHS fertility funding rules by health board across England, Scotland, Wales, and Northern Ireland.";
  const canonicalUrl = "https://pathwaytoparenthood.uk/policies";

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
  const { boards, countryCounts } = loaderData;
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // Get selected countries from URL search params; default to all when none specified
  const selectedCountries = useMemo(() => {
    const param = searchParams.get("countries");
    if (!param) return countryCounts.map((c) => c.code);
    return param.split(",").filter(Boolean);
  }, [searchParams, countryCounts]);

  const handleCountryChange = useCallback(
    (selected: string[]) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        // If all countries are selected, remove the param (default state)
        if (selected.length === countryCounts.length || selected.length === 0) {
          next.delete("countries");
        } else {
          next.set("countries", selected.join(","));
        }
        return next;
      });
    },
    [setSearchParams, countryCounts.length]
  );

  const filtered = useMemo(() => {
    let result = boards;

    // Apply country filter
    if (selectedCountries.length < countryCounts.length) {
      result = result.filter((board) => selectedCountries.includes(board.country));
    }

    // Apply text search
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter((board) =>
        board.name.toLowerCase().includes(term) ||
        board.document_folder_name.toLowerCase().includes(term)
      );
    }

    return result;
  }, [boards, search, selectedCountries, countryCounts.length]);

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Local NHS fertility policies"
        description="Browse the local policies behind NHS fertility funding decisions. Search by health board or choose from the list below."
        breadcrumbCurrent="Local policies"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        {/* Country filter */}
        <CountryFilter
          countries={countryCounts}
          selected={selectedCountries}
          onChange={handleCountryChange}
        />

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by health board name..."
            aria-label="Search health boards by name"
            className="w-full pl-10 pr-4 py-3 border border-sage/20 rounded-xl text-base font-sans bg-white focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/30 transition-colors"
          />
        </div>

        {/* Results count */}
        <p className="font-mono text-xs text-charcoal/50 uppercase tracking-wide mb-4">
          {filtered.length === boards.length
            ? `${boards.length} health boards with local policies`
            : `${filtered.length} of ${boards.length} health boards`}
        </p>

        {/* Board list */}
        {filtered.length > 0 ? (
          <ul className="space-y-2">
            {filtered.map((board) => (
              <li key={board.id}>
                <Link
                  to={`/policy/${toSlug(board.document_folder_name)}`}
                  className="card-hover flex items-start gap-3 px-4 py-3.5 bg-white border border-sage/15 rounded-2xl hover:border-forest/40 transition-all group"
                >
                  <FileText className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-charcoal font-medium group-hover:text-forest transition-colors">
                      {formatIcbName(board.name)}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-xs text-charcoal/55 mt-0.5">
                      <span>{COUNTRY_LABELS[board.country] || board.country}</span>
                      {board.is_national === 1 && (
                        <span>· National policy</span>
                      )}
                      {board.last_updated && (
                        <span>· {formatDate(board.last_updated)}</span>
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 bg-cream rounded-2xl text-center">
            <p className="font-sans text-charcoal/60 font-light">
              No health boards match your filter. Try a different name or adjust the country filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
