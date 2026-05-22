import type { Route } from "./+types/sitemap[.]xml";
import { toSlug } from "../lib/slug";

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const baseUrl = "https://postcodetoparenthood.org.uk";

  const { results: boards } = await db
    .prepare(
      `SELECT document_folder_name, updated_at FROM health_boards WHERE document_folder_name IS NOT NULL AND status = 'active'`
    )
    .bind()
    .all<{ document_folder_name: string; updated_at: string }>();

  const { results: updates } = await db
    .prepare(
      `SELECT slug, published_date FROM updates ORDER BY published_date DESC`
    )
    .bind()
    .all<{ slug: string; published_date: string }>();

  const staticLastmod = __SITE_LAST_UPDATED__;

  const urls = [
    { loc: baseUrl, lastmod: staticLastmod, changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/map`, lastmod: staticLastmod, changefreq: "weekly", priority: "0.8" },
    { loc: `${baseUrl}/search`, lastmod: staticLastmod, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/boards`, lastmod: staticLastmod, changefreq: "weekly", priority: "0.8" },
    { loc: `${baseUrl}/policies`, lastmod: staticLastmod, changefreq: "weekly", priority: "0.8" },
    { loc: `${baseUrl}/about`, lastmod: staticLastmod, changefreq: "monthly", priority: "0.6" },
    { loc: `${baseUrl}/what-next/eligible`, lastmod: staticLastmod, changefreq: "monthly", priority: "0.6" },
    { loc: `${baseUrl}/what-next/exploring-options`, lastmod: staticLastmod, changefreq: "monthly", priority: "0.6" },
    { loc: `${baseUrl}/updates`, lastmod: updates.length > 0 && updates[0].published_date ? updates[0].published_date.slice(0, 10) : staticLastmod, changefreq: "weekly", priority: "0.6" },
    { loc: `${baseUrl}/privacy`, lastmod: staticLastmod, changefreq: "monthly", priority: "0.3" },
    { loc: `${baseUrl}/terms`, lastmod: staticLastmod, changefreq: "monthly", priority: "0.3" },
    ...boards.map((board) => ({
      loc: `${baseUrl}/board/${toSlug(board.document_folder_name)}`,
      lastmod: (board.updated_at ?? staticLastmod).slice(0, 10),
      changefreq: "monthly",
      priority: "0.7",
    })),
    ...boards.map((board) => ({
      loc: `${baseUrl}/policy/${toSlug(board.document_folder_name)}`,
      lastmod: (board.updated_at ?? staticLastmod).slice(0, 10),
      changefreq: "monthly",
      priority: "0.5",
    })),
    ...updates.map((update) => ({
      loc: `${baseUrl}/updates/${update.slug}`,
      lastmod: (update.published_date ?? staticLastmod).slice(0, 10),
      changefreq: "monthly",
      priority: "0.5",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
