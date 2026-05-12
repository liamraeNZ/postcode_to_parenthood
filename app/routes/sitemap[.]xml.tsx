import type { Route } from "./+types/sitemap[.]xml";
import { toSlug } from "../lib/slug";

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const baseUrl = "https://pathwaytoparenthood.uk";

  const { results: boards } = await db
    .prepare(
      `SELECT document_folder_name, updated_at FROM health_boards WHERE document_folder_name IS NOT NULL AND status = 'active'`
    )
    .bind()
    .all<{ document_folder_name: string; updated_at: string }>();

  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: baseUrl, lastmod: today, priority: "1.0" },
    { loc: `${baseUrl}/map`, lastmod: today, priority: "0.8" },
    ...boards.map((board) => ({
      loc: `${baseUrl}/board/${toSlug(board.document_folder_name)}`,
      lastmod: board.updated_at.slice(0, 10),
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
