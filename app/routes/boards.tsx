import type { Route } from "./+types/boards";
import { Link, useSearchParams } from "react-router";
import { useState, useMemo, useCallback } from "react";
import { toSlug } from "@/lib/slug";
import { formatIcbName } from "@/lib/utils";
import { standardMeta } from "@/lib/meta";
import { Building2, Search } from "lucide-react";
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
  const title = "NHS Health Boards | Postcode to Parenthood";
  const description =
    "Browse NHS health boards and their summarised fertility funding policies across England, Scotland, Wales, and Northern Ireland.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/boards";

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
    <section className="flex flex-1 flex-col">
      <PageHeader
        compact
        title="NHS health boards"
        description="Browse summarised fertility funding policies by board. Each page breaks down eligibility, age limits, and cycle availability in plain English."
        breadcrumbCurrent="Health boards"
      />
      <div className="container mx-auto max-w-3xl px-4 pt-6 pb-8 md:pt-8 md:pb-12">
        {/* Country filter */}
        <CountryFilter
          className="mb-5"
          countries={countryCounts}
          selected={selectedCountries}
          onChange={handleCountryChange}
        />

        {/* Search input */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by health board name..."
            aria-label="Search health boards by name"
            className="w-full pl-10 pr-4 py-3 border border-tint/20 rounded-xl text-base font-sans bg-white focus:outline-none focus:border-tint focus:ring-2 focus:ring-tint/30 transition-colors"
          />
        </div>

        {/* Results count */}
        <p className="font-mono text-xs text-ink/50 uppercase tracking-wide mb-4">
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
                  className="card-hover flex items-start gap-3 px-4 py-3.5 bg-white border border-tint/15 rounded-2xl hover:border-brand/40 transition-all group"
                >
                  <Building2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-ink font-medium group-hover:text-brand transition-colors">
                      {formatIcbName(board.name)}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-xs text-ink/55 mt-0.5">
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
          <div className="p-6 bg-surface rounded-2xl text-center">
            <p className="font-sans text-ink/60 font-light">
              No health boards match your filter. Try a different name or adjust the country filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
