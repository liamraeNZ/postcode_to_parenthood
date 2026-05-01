import type { Route } from "./+types/documents.$";

export async function loader({ params, context }: Route.LoaderArgs) {
  const key = `policies/${params["*"]}`;
  const r2 = context.cloudflare.env.r2bucket;

  const object = await r2.get(key);
  if (!object) {
    throw new Response("Document not found", { status: 404 });
  }

  const filename = key.split("/").pop() || "document";
  return new Response(object.body as ReadableStream, {
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Content-Length": String(object.size),
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
