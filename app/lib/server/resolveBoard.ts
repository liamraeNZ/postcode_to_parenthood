/**
 * Server-only postcode → board resolution.
 *
 * Consolidates the lookup chain used by route actions (home, search)
 * into a single reusable function. This module should NEVER be imported
 * from a client component — only from route loaders/actions.
 */
import { lookupPostcodeAdminLookup } from "../../../worker/services/postcodesIo";
import { resolveBoardFromPostcode, resolveDocumentFolder } from "../../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";
import type { D1Database } from "../../../worker/types";

export type ResolvedBoard = {
  slug: string;
  boardId: string;
  matchedOn: string;
};

/**
 * Resolves a raw postcode string to a board slug suitable for redirecting
 * to `/board/{slug}`.
 *
 * Returns `null` if any step in the chain fails (invalid postcode, no admin
 * data, no board match, no document folder).
 */
export async function resolvePostcodeToBoardSlug(
  db: D1Database,
  postcode: string
): Promise<ResolvedBoard | null> {
  const admin = await lookupPostcodeAdminLookup(postcode, {
    requestId: crypto.randomUUID(),
  });

  if (!admin) return null;

  const resolved = await resolveBoardFromPostcode(db, {
    country: admin.country,
    icb: admin.icb,
    ccg_id: admin.ccg_id,
    ccg: admin.ccg,
    nhs_ha: admin.nhs_ha,
    primary_care_trust: admin.primary_care_trust,
  });

  if (!resolved) return null;

  const documentFolder = await resolveDocumentFolder(db, resolved.boardId);
  if (!documentFolder) return null;

  return {
    slug: toSlug(documentFolder),
    boardId: resolved.boardId,
    matchedOn: resolved.matched_on,
  };
}
