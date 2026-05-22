import type { Route } from "./+types/updates.$slug";
import { Link } from "react-router";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";
import { RouteErrorBoundary } from "@/components/errors/RouteErrorBoundary";
import type { UpdatePost } from "@/types";

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const { slug } = params;

  const result = await db
    .prepare("SELECT id, slug, title, published_date, summary, body, related_boards, tags FROM updates WHERE slug = ?1")
    .bind(slug)
    .first<UpdatePost>();

  if (!result) {
    throw new Response("Update not found", { status: 404 });
  }

  return { post: result };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Update Not Found | Postcode to Parenthood" }];
  }

  const { post } = data;
  const title = `${post.title} | Postcode to Parenthood`;
  const description = post.summary;
  const canonicalUrl = `https://postcodetoparenthood.org.uk/updates/${post.slug}`;

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
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: post.title,
        datePublished: post.published_date,
        author: {
          "@type": "Organization",
          name: "Postcode to Parenthood",
        },
        publisher: {
          "@type": "Organization",
          name: "Postcode to Parenthood",
          url: "https://postcodetoparenthood.org.uk",
        },
        mainEntityOfPage: canonicalUrl,
      },
    },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function UpdateSlugPage({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const relatedBoards: string[] = post.related_boards
    ? JSON.parse(post.related_boards)
    : [];

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title={post.title}
        description={formatDate(post.published_date)}
        breadcrumbParents={[{ label: "Updates", to: "/updates" }]}
        breadcrumbCurrent={post.title}
      />

      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        {/* Article body */}
        <article className="prose prose-lg max-w-none font-sans text-ink/85 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </article>

        {/* Related boards */}
        {relatedBoards.length > 0 && (
          <aside className="mt-10 pt-6 border-t border-tint/20">
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">
              Related health boards
            </h2>
            <ul className="flex flex-wrap gap-2">
              {relatedBoards.map((boardSlug) => (
                <li key={boardSlug}>
                  <Link
                    to={`/board/${boardSlug}`}
                    className="inline-flex items-center px-4 py-2 bg-surface text-ink font-medium text-sm rounded-full hover:bg-surface-dark transition-colors"
                  >
                    {boardSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Back navigation */}
        <nav aria-label="Back to updates" className="mt-10 pt-6 border-t border-tint/20">
          <Link
            to="/updates"
            className="btn-press inline-flex items-center gap-2 px-5 py-2.5 bg-surface text-ink font-medium text-sm rounded-full hover:bg-surface-dark transition-colors"
          >
            ← All updates
          </Link>
        </nav>
      </div>
    </section>
  );
}

export function ErrorBoundary() {
  return (
    <RouteErrorBoundary
      resourceName="update"
      backTo="/updates"
      backLabel="Back to updates"
    />
  );
}
