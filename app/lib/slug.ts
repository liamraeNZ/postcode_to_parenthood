/**
 * Convert a document_folder_name to a URL slug.
 * "Bath and North East Somerset, Swindon and Wiltshire"
 * → "bath-and-north-east-somerset-swindon-and-wiltshire"
 */
export function toSlug(documentFolderName: string): string {
  return documentFolderName
    .toLowerCase()
    .replace(/[,]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Find an ICB by its URL slug from a list of ICBs.
 * Since the slug transformation is lossy (commas are removed),
 * we generate the slug for each row's document_folder_name and compare.
 */
export function findIcbBySlug(
  icbs: Array<{ id: string; document_folder_name: string }>,
  slug: string
): { id: string; document_folder_name: string } | undefined {
  return icbs.find((icb) => toSlug(icb.document_folder_name) === slug);
}
