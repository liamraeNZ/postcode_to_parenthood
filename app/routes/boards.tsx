import type { Route } from "./+types/boards";
import { Link, useSearchParams } from "react-router";
import { useState, useMemo, useCallback } from "react";
import { toSlug } from "@/lib/slug";
import { formatIcbName } from "@/lib/utils";
import { Building2, Search } from "lucide-react";
import { CountryFilter } from "@/components/CountryFilter";

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
  const title = "NHS Health Boards | Pathway to Parenthood";
  const description =
    "Browse NHS health boards and their summarised fertility funding policies across England, Scotland, Wales, and Northern Ireland.";
  const canonicalUrl = "https://pathwaytoparenthood.uk/boards";

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

export default function BoardsPage({ loaderData }: Route.ComponentProps) {
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

    if (selectedCountries.length < countryCounts.length) {
      result = result.filter((board) => selectedCountries.includes(board.country));
    }

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter((board) =>
        board.name.toLowerCase().includes(term) ||
        board.document_folder_name.toLowerCase().includes(term)
      );
    }

    return result.slice().sort((a, b) =>
      formatIcbName(a.name).localeCompare(formatIcbName(b.name), 'en', { sensitivity: 'base' })
    );
  }, [boards, search, selectedCountries, countryCounts.length]);

  return (
    <section className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
          <ol className="flex items-center gap-2 text-sm text-deep-slate/60">
            <li>
              <Link to="/" className="hover:text-sage-btn transition-colors">
                Start
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-deep-slate font-medium">Health Boards</li>
          </ol>
        </nav>

        {/* Page heading */}
        <header className="mb-6 md:mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-deep-slate mb-2">
            NHS Health Boards
          </h1>
          <p className="text-sm md:text-base text-deep-slate/70 leading-relaxed">
            Browse summarised fertility funding policies by health board. Each page breaks down eligibility, age limits, and cycle availability in plain English.
          </p>
        </header>

        {/* Country filter */}
        <CountryFilter
          countries={countryCounts}
          selected={selectedCountries}
          onChange={handleCountryChange}
        />

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-slate/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by health board name..."
            aria-label="Search health boards by name"
            className="w-full pl-10 pr-4 py-3 border-2 border-warm-sand-dark rounded-xl text-base bg-white focus:outline-none focus:border-sage-btn focus:ring-1 focus:ring-sage-btn transition-colors"
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-deep-slate/60 mb-4">
          {filtered.length === boards.length
            ? `${boards.length} health boards`
            : `${filtered.length} of ${boards.length} health boards`}
        </p>

        {/* Board list */}
        {filtered.length > 0 ? (
          <ul className="space-y-2">
            {filtered.map((board) => (
              <li key={board.id}>
                <Link
                  to={`/board/${toSlug(board.document_folder_name)}`}
                  className="flex items-start gap-3 px-4 py-3 bg-white border border-warm-sand-dark rounded-xl hover:border-sage-btn hover:shadow-sm transition-all group"
                >
                  <Building2 className="w-5 h-5 text-sage-btn flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-deep-slate font-medium group-hover:text-sage-btn transition-colors">
                      {formatIcbName(board.name)}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-deep-slate/70 mt-0.5">
                      <span>{COUNTRY_LABELS[board.country] || board.country}</span>
                      {board.is_national === 1 && (
                        <span>· National policy</span>
                      )}
                      {board.last_updated && (
                        <span>· Updated {formatDate(board.last_updated)}</span>
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 bg-warm-sand rounded-xl text-center">
            <p className="text-deep-slate/70">
              No health boards match your filter. Try a different name or adjust the country filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
