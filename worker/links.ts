/**
 * Link headers module.
 * Advertises machine-readable resources on homepage responses per RFC 8288.
 */

export const LINK_HEADER_VALUES = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</llms-full.txt>; rel="describedby"; type="text/plain"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</robots.txt>; rel="robots"; type="text/plain"',
];

/**
 * Adds Link headers advertising machine-readable resources.
 * Only applied to homepage (root path) responses.
 */
export function addLinkHeaders(response: Response, pathname: string): Response {
  if (pathname !== "/") {
    return response;
  }

  const headers = new Headers(response.headers);
  for (const value of LINK_HEADER_VALUES) {
    headers.append("Link", value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
