import type { Route } from "./+types/updates._index";
import { Link } from "react-router";
import { standardMeta } from "@/lib/meta";
import { PageHeader } from "@/components/layout/PageHeader";
import type { UpdatePost } from "@/types";

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const { results: updates } = await db
    .prepare(
      `SELECT id, slug, title, published_date, summary, body, related_boards, tags
       FROM updates
       ORDER BY published_date DESC`
    )
    .bind()
    .all<UpdatePost>();

  return { updates };
}

export function meta({}: Route.MetaArgs) {
  const title = "Updates | Postcode to Parenthood";
  const description =
    "The latest news and updates about NHS fertility funding policy changes, ICB mergers, and Postcode to Parenthood developments.";
  const canonicalUrl = "https://postcodetoparenthood.org.uk/updates";

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

export default function UpdatesIndexPage({ loaderData }: Route.ComponentProps) {
  const { updates } = loaderData;

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title="Updates"
        description="News and changes affecting NHS fertility funding across the UK."
        breadcrumbCurrent="Updates"
      />
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        {updates.length > 0 ? (
          <ul className="space-y-6">
            {updates.map((update) => (
              <li key={update.id}>
                <article className="bg-white border border-tint/15 rounded-2xl px-5 py-5 transition-all hover:border-brand/30">
                  <time
                    dateTime={update.published_date}
                    className="font-mono text-xs text-ink/50 uppercase tracking-wide"
                  >
                    {formatDate(update.published_date)}
                  </time>
                  <h2 className="font-heading text-lg font-semibold text-ink mt-1.5 mb-2">
                    <Link
                      to={`/updates/${update.slug}`}
                      className="hover:text-brand transition-colors"
                    >
                      {update.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-ink/70 text-base leading-relaxed line-clamp-3">
                    {update.summary}
                  </p>
                  <Link
                    to={`/updates/${update.slug}`}
                    className="inline-block mt-3 font-sans text-sm font-medium text-brand hover:text-brand/80 transition-colors"
                  >
                    Read more →
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 bg-surface rounded-2xl text-center">
            <p className="font-sans text-ink/60 font-light">
              No updates yet. Check back soon for news about NHS fertility
              funding changes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
