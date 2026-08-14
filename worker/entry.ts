import { createRequestHandler } from "react-router";
import type { Env } from "./types";
import { handleApiRequest } from "./handlers/api";
import { addSecurityHeaders } from "./security";
import { addLinkHeaders } from "./links";

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module resolved via wrangler alias
  () => import("virtual:react-router/server-build"),
  "production"
);

/**
 * Paths that should be served directly from the ASSETS binding
 * rather than going through React Router SSR.
 */
function isStaticAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith("/data/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/og-image.png" ||
    pathname === "/og-image.svg" ||
    pathname === "/icon-192.png" ||
    pathname === "/icon-512.png" ||
    pathname === "/site.webmanifest"
  );
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const response = await handleRequest(request, env, ctx);
    const isHtml =
      response.headers.get("content-type")?.includes("text/html") ?? false;
    const withSecurity = addSecurityHeaders(response, isHtml);
    return addLinkHeaders(withSecurity, url.pathname);
  },
};

async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);

  // Redirect www to bare domain (prevents duplicate content and hreflang mismatch)
  if (url.hostname === "www.postcodetoparenthood.org.uk") {
    url.hostname = "postcodetoparenthood.org.uk";
    return new Response(null, {
      status: 301,
      headers: { Location: url.toString() },
    });
  }

  // API routes bypass React Router entirely
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    return handleApiRequest(request, env);
  }

  // Document routes served directly from R2 (bypass React Router so browser renders PDFs inline)
  if (url.pathname.startsWith("/documents/")) {
    const path = url.pathname.slice("/documents/".length);
    const key = `policies/${decodeURIComponent(path)}`;
    const object = await env.r2bucket.get(key);
    if (!object) {
      return new Response("Document not found", { status: 404 });
    }
    const filename = key.split("/").pop() || "document";
    const ext = filename.split(".").pop()?.toLowerCase();
    let contentType =
      object.httpMetadata?.contentType || "application/octet-stream";
    if (contentType === "application/octet-stream" && ext === "pdf") {
      contentType = "application/pdf";
    }
    return new Response(object.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(object.size),
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  }

  // Static assets served directly from the ASSETS binding
  if (isStaticAssetPath(url.pathname)) {
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }
  }

  // Everything else goes through React Router SSR
  return requestHandler(request, {
    cloudflare: { env, ctx },
  });
}
