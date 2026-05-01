import { createRequestHandler } from "@react-router/cloudflare";
import type { Env } from "./types";
import { handleApiRequest } from "./handlers/api";

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router Vite plugin
  () => import("virtual:react-router/server-build"),
  // @ts-expect-error - import.meta.env is provided by Vite at build time
  import.meta.env.MODE
);

/**
 * Paths that should be served directly from the ASSETS binding
 * rather than going through React Router SSR.
 */
function isStaticAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith("/data/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico"
  );
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API routes bypass React Router entirely
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleApiRequest(request, env);
    }

    // Static assets served directly from the ASSETS binding
    if (isStaticAssetPath(url.pathname)) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    // Everything else goes through React Router SSR
    // @ts-expect-error - loadContext typing mismatch between @react-router/cloudflare and workers-types
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
};
