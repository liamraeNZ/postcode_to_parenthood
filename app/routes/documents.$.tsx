import type { Route } from "./+types/documents.$";

export async function loader({ params, context }: Route.LoaderArgs) {
  const key = `policies/${params["*"]}`;
  const r2 = context.cloudflare.env.r2bucket;

  const object = await r2.get(key);
  if (!object) {
    throw new Response("Document not found", { status: 404 });
  }

  const filename = key.split("/").pop() || "document";

  // Determine content type: prefer R2 metadata, fall back to extension-based detection
  let contentType = object.httpMetadata?.contentType || "application/octet-stream";
  if (contentType === "application/octet-stream") {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") contentType = "application/pdf";
    else if (ext === "doc") contentType = "application/msword";
    else if (ext === "docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return new Response(object.body as ReadableStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Content-Length": String(object.size),
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
