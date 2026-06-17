/**
 * Security headers module.
 * Applied to all outgoing responses at the Worker edge.
 */

const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cloud.umami.is",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.tile.openstreetmap.org",
  "font-src 'self'",
  "connect-src 'self' https://api.postcodes.io https://cloud.umami.is https://gateway.umami.is",
  "frame-ancestors 'none'",
];

/**
 * Adds security headers to a response.
 * HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and
 * Permissions-Policy are added to all responses.
 * Content-Security-Policy is only added when the response is HTML.
 */
export function addSecurityHeaders(
  response: Response,
  isHtml: boolean
): Response {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  if (isHtml) {
    headers.set("Content-Security-Policy", CSP_DIRECTIVES.join("; "));
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
