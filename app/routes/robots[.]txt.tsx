export async function loader() {
  const body = `User-agent: *
Allow: /
Allow: /map
Allow: /board/
Disallow: /admin
Disallow: /api/

Sitemap: https://pathwaytoparenthood.uk/sitemap.xml`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
