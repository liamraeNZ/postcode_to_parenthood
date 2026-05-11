import type { Route } from "./+types/policy.$slug";
import { Link } from "react-router";
import { useState } from "react";
import { findIcbBySlug } from "@/lib/slug";
import { formatIcbName } from "@/lib/utils";
import { FileText, Eye, Download, ChevronDown, ChevronRight } from "lucide-react";

interface DocumentFile {
  name: string;
  key: string;
  size: number;
}

interface DocumentYear {
  year: string;
  files: DocumentFile[];
}

interface IcbData {
  id: string;
  name: string;
  document_folder_name: string;
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const r2 = context.cloudflare.env.r2bucket;
  const { slug } = params;

  // Resolve board from slug
  const { results: boards } = await db
    .prepare(
      "SELECT id, name, document_folder_name FROM health_boards WHERE document_folder_name IS NOT NULL AND status = 'active'"
    )
    .bind()
    .all<IcbData>();

  const matched = findIcbBySlug(boards, slug) as IcbData | undefined;
  if (!matched) {
    throw new Response("Health board not found", { status: 404 });
  }

  // List all documents from R2 for this ICB
  const prefix = `policies/${matched.document_folder_name}/`;
  const allObjects: { key: string; size: number }[] = [];
  let cursor: string | undefined;
  let truncated = true;

  while (truncated) {
    const listed = await r2.list({ prefix, cursor });
    for (const obj of listed.objects) {
      allObjects.push({ key: obj.key, size: obj.size });
    }
    truncated = listed.truncated;
    cursor = listed.truncated ? listed.cursor : undefined;
  }

  // Group by year
  const byYear = new Map<string, DocumentFile[]>();
  for (const obj of allObjects) {
    const parts = obj.key.slice(prefix.length).split("/");
    if (parts.length < 2) continue;
    const year = parts[0];
    if (!/^\d{4}$/.test(year)) continue;
    const name = parts.slice(1).join("/");
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push({ name, key: obj.key, size: obj.size });
  }

  // Sort years descending
  const documents: DocumentYear[] = [...byYear.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, files]) => ({ year, files }));

  return {
    icb: matched,
    documents,
    slug,
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "Health Board Not Found | Pathways to Parenthood" },
      { name: "description", content: "The requested health board could not be found." },
    ];
  }

  const { icb, slug } = data;
  const title = `${formatIcbName(icb.name)} Source Documents | Pathways to Parenthood`;
  const description = `View and download NHS fertility policy source documents published by ${formatIcbName(icb.name)}.`;
  const canonicalUrl = `https://fertilityfund.uk/policy/${slug}`;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: canonicalUrl },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdf(filename: string): boolean {
  return filename.toLowerCase().endsWith(".pdf");
}

export default function PolicySlugPage({ loaderData }: Route.ComponentProps) {
  const { icb, documents, slug } = loaderData;
  const [expandedYears, setExpandedYears] = useState<Set<string>>(() => {
    if (documents.length > 0) return new Set([documents[0].year]);
    return new Set();
  });

  function toggleYear(year: string) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  }

  return (
    <section className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
          <ol className="flex items-center gap-2 text-sm text-deep-slate/60">
            <li>
              <Link to="/" className="hover:text-sage-btn transition-colors">
                Start
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/policies" className="hover:text-sage-btn transition-colors">
                Local Policies
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-deep-slate font-medium truncate">{formatIcbName(icb.name)}</li>
          </ol>
        </nav>

        {/* Page heading */}
        <header className="mb-6 md:mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-deep-slate mb-2">
            {formatIcbName(icb.name)}
          </h1>
          <p className="text-sm md:text-base text-deep-slate/70 leading-relaxed">
            Source documents published by this health board, grouped by year.
          </p>
        </header>

        {/* Documents by year */}
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map(({ year, files }) => {
              const isExpanded = expandedYears.has(year);
              return (
                <div
                  key={year}
                  className="border border-warm-sand-dark rounded-xl bg-white overflow-hidden"
                >
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-warm-sand/50 transition-colors text-left"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-sage-btn flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-deep-slate/40 flex-shrink-0" />
                    )}
                    <span className="font-bold text-deep-slate text-lg">{year}</span>
                    <span className="text-sm text-deep-slate/50 ml-auto">
                      {files.length} {files.length === 1 ? "document" : "documents"}
                    </span>
                  </button>

                  {isExpanded && (
                    <ul className="border-t border-warm-sand-dark divide-y divide-warm-sand">
                      {files.map((file) => (
                        <li
                          key={file.key}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <FileText className="w-4 h-4 text-deep-slate/40 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-deep-slate truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-deep-slate/50">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isPdf(file.name) && (
                              <a
                                href={`/documents/${file.key.replace(/^policies\//, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sage-btn bg-sage-light rounded-lg hover:bg-sage-light/80 transition-colors"
                                title="View PDF in browser"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">View</span>
                              </a>
                            )}
                            <a
                              href={`/documents/${file.key.replace(/^policies\//, "")}`}
                              download
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-deep-slate bg-warm-sand rounded-lg hover:bg-warm-sand-dark transition-colors"
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Download</span>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-warm-sand rounded-xl text-center">
            <p className="text-deep-slate/70">
              No policy documents have been uploaded for this health board yet.
            </p>
          </div>
        )}

        {/* Navigation links */}
        <nav aria-label="Related pages" className="mt-8 md:mt-10 pt-6 border-t border-warm-sand-dark">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/policies"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-light text-deep-slate font-medium text-sm rounded-xl hover:bg-sage-light/80 transition-colors"
            >
              ← All health boards
            </Link>
            <Link
              to={`/board/${slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-light text-deep-slate font-medium text-sm rounded-xl hover:bg-sage-light/80 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View eligibility criteria
            </Link>
          </div>
        </nav>
      </div>
    </section>
  );
}
