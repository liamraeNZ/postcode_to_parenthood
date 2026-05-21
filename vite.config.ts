import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import { getPlatformProxy } from "wrangler";

/**
 * Vite plugin that intercepts /api/* requests in dev mode and routes them
 * to the Worker API handler, mirroring what worker/entry.ts does in production.
 */
function apiDevProxy(): Plugin {
  let platformProxy: Awaited<ReturnType<typeof getPlatformProxy>> | null = null;

  return {
    name: "api-dev-proxy",
    configureServer(server) {
      // Must run before Vite's internal middleware (including React Router)
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/") && url !== "/api") {
          return next();
        }

        // Lazily initialise the platform proxy (provides D1, R2 bindings)
        if (!platformProxy) {
          platformProxy = await getPlatformProxy();
        }

        try {
          // Dynamically import the API handler
          const { handleApiRequest } = await server.ssrLoadModule(
            path.resolve(__dirname, "worker/handlers/api.ts")
          );

          // Build a proper Request from the Node IncomingMessage
          const protocol = "http";
          const host = req.headers.host || "localhost";
          const fullUrl = `${protocol}://${host}${req.url}`;

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
          }

          let body: ReadableStream | null = null;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(chunk as Buffer);
            }
            body = new Blob([Buffer.concat(chunks)]).stream();
          }

          const request = new Request(fullUrl, {
            method: req.method,
            headers,
            body,
          });

          const env = platformProxy.env;
          const response: Response = await handleApiRequest(request, env);

          // Write the response back to the Node response
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          if (response.body) {
            const reader = response.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (err) {
          console.error("[api-dev-proxy] Error handling API request:", err);
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      });
    },
    async buildEnd() {
      if (platformProxy) {
        await platformProxy.dispose();
        platformProxy = null;
      }
    },
  };
}

export default defineConfig({
  define: {
    __SITE_LAST_UPDATED__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  plugins: [
    apiDevProxy(),
    cloudflareDevProxy(),
    reactRouter(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "app") },
  },
});
