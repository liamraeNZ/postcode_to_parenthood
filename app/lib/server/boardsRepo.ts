/**
 * Server-only repository for health board queries.
 *
 * Consolidates the repeated D1 queries used across multiple route loaders
 * into reusable functions. Only import from loaders/actions — never from
 * client components.
 */
import type { D1Database } from "../../../worker/types";

export interface ActiveBoardRow {
  id: string;
  name: string;
  document_folder_name: string;
  country: string;
}

/**
 * Fetches all active health boards with a document_folder_name.
 * Used by: map loader, board.$slug loader, policy.$slug loader, boards loader.
 */
export async function listActiveBoards(db: D1Database): Promise<ActiveBoardRow[]> {
  const { results } = await db
    .prepare(
      `SELECT id, name, document_folder_name, country
       FROM health_boards
       WHERE document_folder_name IS NOT NULL AND status = 'active'`
    )
    .bind()
    .all<ActiveBoardRow>();
  return results;
}

export interface SitemapBoardRow {
  document_folder_name: string;
  updated_at: string;
}

/**
 * Fetches distinct boards for sitemap generation with their latest updated_at.
 */
export async function listActiveBoardsForSitemap(db: D1Database): Promise<SitemapBoardRow[]> {
  const { results } = await db
    .prepare(
      `SELECT DISTINCT document_folder_name, MAX(updated_at) as updated_at
       FROM health_boards
       WHERE document_folder_name IS NOT NULL AND status = 'active'
       GROUP BY document_folder_name`
    )
    .bind()
    .all<SitemapBoardRow>();
  return results;
}
