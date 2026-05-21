export async function loader() {
  const body = `User-agent: *
Allow: /
Allow: /map
Allow: /board/
Allow: /boards
Allow: /search
Allow: /policies
Allow: /policy/
Allow: /privacy
Allow: /terms
Disallow: /admin
Disallow: /api/
Disallow: /documents/

Sitemap: https://postcodetoparenthood.org.uk/sitemap.xml`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
