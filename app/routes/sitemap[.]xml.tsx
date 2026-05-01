import type { Route } from "./+types/sitemap[.]xml";
import { toSlug } from "../lib/slug";

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const baseUrl = "https://fertilityfund.uk";

  const { results: icbs } = await db
    .prepare(
      `SELECT document_folder_name, updated_at FROM icbs WHERE document_folder_name IS NOT NULL AND status = 'active'`
    )
    .bind()
    .all<{ document_folder_name: string; updated_at: string }>();

  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: baseUrl, lastmod: today, priority: "1.0" },
    { loc: `${baseUrl}/map`, lastmod: today, priority: "0.8" },
    ...icbs.map((icb) => ({
      loc: `${baseUrl}/icb/${toSlug(icb.document_folder_name)}`,
      lastmod: icb.updated_at.slice(0, 10),
      priority: "0.7",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
