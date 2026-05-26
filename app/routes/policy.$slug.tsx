import type { Route } from "./+types/policy.$slug";
import { Link } from "react-router";
import { useState } from "react";
import { findIcbBySlug } from "@/lib/slug";
import { formatIcbName } from "@/lib/utils";
import { FileText, Eye, Download, ChevronDown, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { standardMeta } from "@/lib/meta";
import { RouteErrorBoundary } from "@/components/errors/RouteErrorBoundary";

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
      { title: "Health Board Not Found | Postcode to Parenthood" },
    ];
  }

  const { icb, slug } = data;
  const title = `${formatIcbName(icb.name)} Source Documents | Postcode to Parenthood`;
  const description = `View and download NHS fertility policy source documents published by ${formatIcbName(icb.name)}.`;
  const canonicalUrl = `https://postcodetoparenthood.org.uk/policy/${slug}`;

  return [
    { title },
    { name: "description", content: description },
    ...standardMeta(canonicalUrl),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
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

  const boardTitle = formatIcbName(icb.name);

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title={boardTitle}
        description="Source documents published by this health board, grouped by year."
        breadcrumbParents={[{ label: "Local policies", to: "/policies" }]}
        breadcrumbCurrent={boardTitle}
      />
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-10">
        {/* Documents by year */}
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map(({ year, files }) => {
              const isExpanded = expandedYears.has(year);
              return (
                <div
                  key={year}
                  className="border border-tint/20 rounded-2xl bg-white overflow-hidden"
                >
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-surface/60 transition-colors text-left"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-brand flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-ink/40 flex-shrink-0" />
                    )}
                    <span className="font-heading text-ink text-lg font-semibold">{year}</span>
                    <span className="font-mono text-xs text-ink/50 ml-auto">
                      {files.length} {files.length === 1 ? "document" : "documents"}
                    </span>
                  </button>

                  {isExpanded && (
                    <ul className="border-t border-tint/15 divide-y divide-tint/10">
                      {files.map((file) => (
                        <li
                          key={file.key}
                          className="flex items-center gap-3 px-5 py-3.5"
                        >
                          <FileText className="w-4 h-4 text-ink/40 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm font-medium text-ink truncate">
                              {file.name}
                            </p>
                            <p className="font-mono text-xs text-ink/50">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isPdf(file.name) && (
                              <a
                                href={`/documents/${file.key.replace(/^policies\//, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-press inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand bg-surface rounded-full hover:bg-surface-dark transition-colors"
                                title="View PDF in browser"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">View</span>
                              </a>
                            )}
                            <a
                              href={`/documents/${file.key.replace(/^policies\//, "")}`}
                              download
                              className="btn-press inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-ink bg-surface rounded-full hover:bg-surface-dark transition-colors"
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
          <div className="p-6 bg-surface rounded-2xl text-center">
            <p className="font-sans text-ink/60 font-light">
              No policy documents have been uploaded for this health board yet.
            </p>
          </div>
        )}

        {/* Navigation links */}
        <nav aria-label="Related pages" className="mt-10 md:mt-12 pt-6 border-t border-tint/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/policies"
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 bg-surface text-ink font-medium text-sm rounded-full hover:bg-surface-dark transition-colors"
            >
              ← All health boards
            </Link>
            <Link
              to={`/board/${slug}`}
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-semibold text-sm rounded-full hover:bg-brand-light transition-colors"
            >
              <FileText className="w-4 h-4" />
              View eligibility criteria
            </Link>
          </div>
        </nav>
      </div>

      {/* JSON-LD Structured Data - Dataset schema (GEO-optimized for LLM extraction) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${boardTitle} NHS Fertility Policy Source Documents`,
            url: `https://postcodetoparenthood.org.uk/policy/${slug}`,
            description: `Collection of publicly available NHS fertility policy documents published by ${boardTitle}, grouped by year.`,
            isAccessibleForFree: true,
            creator: {
              "@type": "Organization",
              name: "Postcode to Parenthood",
              url: "https://postcodetoparenthood.org.uk",
            },
            keywords: [
              "NHS fertility policy documents",
              "IVF funding policy",
              boardTitle,
              "NHS commissioning policy",
            ],
            distribution: documents.map((yearGroup) => ({
              "@type": "DataDownload",
              name: `${yearGroup.year} policy documents`,
              description: `${yearGroup.files.length} document${yearGroup.files.length !== 1 ? "s" : ""} from ${yearGroup.year}.`,
              contentUrl: `https://postcodetoparenthood.org.uk/policy/${slug}`,
              encodingFormat: "application/pdf",
            })),
            variableMeasured: [
              {
                "@type": "PropertyValue",
                name: "Total Documents Available",
                value: documents.reduce((sum, y) => sum + y.files.length, 0),
                unitText: "documents",
              },
              {
                "@type": "PropertyValue",
                name: "Year Range",
                value: documents.length > 0
                  ? `${documents[documents.length - 1].year}–${documents[0].year}`
                  : "None",
              },
            ],
          }),
        }}
      />
    </section>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary resourceName="policy documents" backTo="/policies" backLabel="Browse all policies" />;
}
