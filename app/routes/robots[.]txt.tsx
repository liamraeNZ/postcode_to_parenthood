export async function loader() {
  const body = `User-agent: *
Allow: /
Allow: /map
Allow: /board/
Allow: /boards
Allow: /search
Allow: /policies
Allow: /policy/
Allow: /about
Allow: /what-next/
Allow: /updates
Allow: /privacy
Allow: /terms
Disallow: /admin
Disallow: /api/
Disallow: /documents/

Sitemap: https://postcodetoparenthood.org.uk/sitemap.xml

Content-Signal: ai-train=no
Content-Signal: search=yes
Content-Signal: ai-input=yes
Content-Signal: agent=yes`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
