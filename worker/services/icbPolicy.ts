import type { D1Database } from '../types';
import { normalizeOdsCode } from '../lib';
import { fetchOrdJson } from './ord';

export async function resolveDocumentFolder(db: D1Database, boardCode: string): Promise<string | null> {
  const normalized = normalizeOdsCode(boardCode);
  if (!normalized) return null;

  // Try direct match first
  const direct = await db
    .prepare('select document_folder_name from health_boards where id = ?1 and document_folder_name is not null limit 1')
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (direct?.document_folder_name) return direct.document_folder_name;

  // Try sub_board_code match
  const bySub = await db
    .prepare('select document_folder_name from health_boards where sub_board_code = ?1 and document_folder_name is not null limit 1')
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (bySub?.document_folder_name) return bySub.document_folder_name;

  // Try parent board code match
  const byParent = await db
    .prepare('select document_folder_name from health_boards where sub_board_code is null and parent_board_code = ?1 and document_folder_name is not null limit 1')
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (byParent?.document_folder_name) return byParent.document_folder_name;

  // Try alias code match
  const byAlias = await db
    .prepare("select i.document_folder_name from board_aliases a join health_boards i on i.id = a.board_id where a.alias_kind = 'code' and a.alias = ?1 and i.document_folder_name is not null limit 1")
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (byAlias?.document_folder_name) return byAlias.document_folder_name;

  // If this is a sub-board without its own folder, try the parent
  const parentCode = await db
    .prepare('select parent_board_code from health_boards where (id = ?1 or sub_board_code = ?1) and parent_board_code is not null limit 1')
    .bind(normalized)
    .first<{ parent_board_code: string }>();
  if (parentCode?.parent_board_code) {
    const parentFolder = await db
      .prepare('select document_folder_name from health_boards where (id = ?1 or parent_board_code = ?1) and sub_board_code is null and document_folder_name is not null limit 1')
      .bind(parentCode.parent_board_code)
      .first<{ document_folder_name: string }>();
    if (parentFolder?.document_folder_name) return parentFolder.document_folder_name;
  }

  return null;
}

function normalizeBoardNameForMatch(value: string) {
  return value
    .toUpperCase()
    .replace(/INTEGRATED CARE BOARD/g, 'ICB')
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeBoardNameForLooseMatch(value: string) {
  const normalized = normalizeBoardNameForMatch(value);
  if (!normalized) return '';
  return normalized.replace(/\s+ICB$/g, '').trim();
}

function extractOrdOrgName(json: unknown): string | null {
  if (!json || typeof json !== 'object') return null;
  const top = json as { Name?: unknown; Organisation?: { Name?: unknown } };
  if (typeof top.Organisation?.Name === 'string' && top.Organisation.Name.trim()) return top.Organisation.Name;
  if (typeof top.Name === 'string' && top.Name.trim()) return top.Name;
  return null;
}

async function resolveBoardIdByCode(db: D1Database, code: string) {
  const normalized = normalizeOdsCode(code);
  if (!normalized) return null;

  const directId = await db
    .prepare('select id from health_boards where id = ?1 limit 1')
    .bind(normalized)
    .first<{ id: string }>();
  if (directId?.id) return directId.id;

  const bySubBoardCode = await db
    .prepare('select id from health_boards where sub_board_code = ?1 limit 1')
    .bind(normalized)
    .first<{ id: string }>();
  if (bySubBoardCode?.id) return bySubBoardCode.id;

  const byParentBoardCode = await db
    .prepare('select id from health_boards where sub_board_code is null and parent_board_code = ?1 limit 1')
    .bind(normalized)
    .first<{ id: string }>();
  if (byParentBoardCode?.id) return byParentBoardCode.id;

  const byAliasCode = await db
    .prepare("select board_id as id from board_aliases where alias_kind = 'code' and alias = ?1 limit 1")
    .bind(normalized)
    .first<{ id: string }>();
  if (byAliasCode?.id) return byAliasCode.id;

  return null;
}

async function resolveBoardIdByName(db: D1Database, name: string, mode: 'exact' | 'compatible') {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const byNameExact = await db
    .prepare('select id from health_boards where name = ?1 limit 1')
    .bind(trimmed)
    .first<{ id: string }>();
  if (byNameExact?.id) return byNameExact.id;

  const byAliasName = await db
    .prepare("select board_id as id from board_aliases where alias_kind = 'name' and alias = ?1 limit 1")
    .bind(trimmed)
    .first<{ id: string }>();
  if (byAliasName?.id) return byAliasName.id;

  const normalizedStrict = normalizeBoardNameForMatch(trimmed);
  const normalizedLoose = normalizeBoardNameForLooseMatch(trimmed);
  if (!normalizedStrict) return null;

  const rows = await db.prepare('select id, name from health_boards').bind().all<{ id: string; name: string }>();
  for (const row of rows.results) {
    const rowStrict = normalizeBoardNameForMatch(row.name);
    if (!rowStrict) continue;
    if (rowStrict === normalizedStrict) return row.id;

    if (mode === 'compatible') {
      const rowLoose = normalizeBoardNameForLooseMatch(row.name);
      if (rowLoose && normalizedLoose && rowLoose === normalizedLoose) return row.id;
      if (rowStrict.startsWith(normalizedStrict) && rowStrict.slice(normalizedStrict.length).trim() === 'ICB') return row.id;
      if (normalizedStrict.startsWith(rowStrict) && normalizedStrict.slice(rowStrict.length).trim() === 'ICB') return row.id;
    }
  }

  return null;
}

async function resolveBoardId(db: D1Database, boardCode: string, boardName: string | null) {
  const byDirectId = await db
    .prepare('select id from health_boards where id = ?1 limit 1')
    .bind(boardCode)
    .first<{ id: string }>();

  if (byDirectId?.id) return byDirectId.id;

  const bySubBoardCode = await db
    .prepare('select id from health_boards where sub_board_code = ?1 limit 1')
    .bind(boardCode)
    .first<{ id: string }>();

  if (bySubBoardCode?.id) return bySubBoardCode.id;

  const byParentBoardCode = await db
    .prepare('select id from health_boards where sub_board_code is null and parent_board_code = ?1 limit 1')
    .bind(boardCode)
    .first<{ id: string }>();

  if (byParentBoardCode?.id) return byParentBoardCode.id;

  const byAliasCode = await db
    .prepare("select board_id as id from board_aliases where alias_kind = 'code' and alias = ?1 limit 1")
    .bind(boardCode)
    .first<{ id: string }>();

  if (byAliasCode?.id) return byAliasCode.id;

  if (!boardName) return null;

  const byNameExact = await db
    .prepare('select id from health_boards where name = ?1 limit 1')
    .bind(boardName)
    .first<{ id: string }>();

  if (byNameExact?.id) return byNameExact.id;

  const byAliasName = await db
    .prepare("select board_id as id from board_aliases where alias_kind = 'name' and alias = ?1 limit 1")
    .bind(boardName)
    .first<{ id: string }>();

  if (byAliasName?.id) return byAliasName.id;

  const normalizedName = normalizeBoardNameForMatch(boardName);
  if (!normalizedName) return null;

  const parents = await db
    .prepare('select id, name from health_boards where sub_board_code is null')
    .bind()
    .all<{ id: string; name: string }>();

  for (const row of parents.results) {
    if (normalizeBoardNameForMatch(row.name) === normalizedName) return row.id;
  }

  const subs = await db
    .prepare('select id, name from health_boards where sub_board_code is not null')
    .bind()
    .all<{ id: string; name: string }>();

  for (const row of subs.results) {
    if (normalizeBoardNameForMatch(row.name) === normalizedName) return row.id;
  }

  return null;
}

export async function resolveBoardIdFromPostcodesIo(
  db: D1Database,
  identifiers: { icb: string | null; ccg_id: string | null; ccg: string | null }
) {
  if (identifiers.icb) {
    const byIcbName = await resolveBoardIdByName(db, identifiers.icb, 'exact');
    if (byIcbName) return { boardId: byIcbName, matched_on: 'icb' as const };
  }

  if (identifiers.ccg_id) {
    const byCcgId = await resolveBoardIdByCode(db, identifiers.ccg_id);
    if (byCcgId) return { boardId: byCcgId, matched_on: 'ccg_id' as const };
  }

  if (identifiers.ccg) {
    const byCcgName = await resolveBoardIdByName(db, identifiers.ccg, 'compatible');
    if (byCcgName) return { boardId: byCcgName, matched_on: 'ccg' as const };
  }

  return null;
}

/**
 * Resolves a postcodes.io response to a care board ID, handling all four UK nations.
 *
 * - England: uses existing ICB/CCG resolution logic
 * - Scotland: uses `nhs_ha` field → lookup in `postcode_area_to_board` where `lookup_field = 'nhs_ha'`
 * - Wales: uses `nhs_ha` field → lookup in `postcode_area_to_board` where `lookup_field = 'nhs_ha'`
 * - Northern Ireland: uses `primary_care_trust` field → lookup in `postcode_area_to_board` where `lookup_field = 'primary_care_trust'`
 */
export async function resolveBoardFromPostcode(
  db: D1Database,
  postcodeResult: {
    country: string | null;
    icb: string | null;
    ccg_id: string | null;
    ccg: string | null;
    nhs_ha: string | null;
    primary_care_trust: string | null;
  }
): Promise<{ boardId: string; matched_on: string } | null> {
  const country = postcodeResult.country?.trim() ?? '';

  // Scotland: resolve via nhs_ha → postcode_area_to_board
  if (country === 'Scotland') {
    const nhsHa = postcodeResult.nhs_ha?.trim();
    if (!nhsHa) return null;

    const result = await db
      .prepare(
        "SELECT board_id FROM postcode_area_to_board WHERE lookup_value = ?1 AND lookup_field = 'nhs_ha' LIMIT 1"
      )
      .bind(nhsHa)
      .first<{ board_id: string }>();

    if (result?.board_id) return { boardId: result.board_id, matched_on: 'nhs_ha' };
    return null;
  }

  // Wales: resolve via nhs_ha → postcode_area_to_board
  if (country === 'Wales') {
    const nhsHa = postcodeResult.nhs_ha?.trim();
    if (!nhsHa) return null;

    const result = await db
      .prepare(
        "SELECT board_id FROM postcode_area_to_board WHERE lookup_value = ?1 AND lookup_field = 'nhs_ha' LIMIT 1"
      )
      .bind(nhsHa)
      .first<{ board_id: string }>();

    if (result?.board_id) return { boardId: result.board_id, matched_on: 'nhs_ha' };
    return null;
  }

  // Northern Ireland: resolve via primary_care_trust → postcode_area_to_board
  if (country === 'Northern Ireland') {
    const pct = postcodeResult.primary_care_trust?.trim();
    if (!pct) return null;

    const result = await db
      .prepare(
        "SELECT board_id FROM postcode_area_to_board WHERE lookup_value = ?1 AND lookup_field = 'primary_care_trust' LIMIT 1"
      )
      .bind(pct)
      .first<{ board_id: string }>();

    if (result?.board_id) return { boardId: result.board_id, matched_on: 'primary_care_trust' };
    return null;
  }

  // England (or unknown): use existing ICB/CCG resolution logic
  return resolveBoardIdFromPostcodesIo(db, {
    icb: postcodeResult.icb,
    ccg_id: postcodeResult.ccg_id,
    ccg: postcodeResult.ccg
  });
}


export async function lookupAllBoardPoliciesByBoardCode(db: D1Database, boardCode: string) {
  const normalized = normalizeOdsCode(boardCode);
  if (!normalized) return null;

  let boardId = await resolveBoardId(db, normalized, null);
  if (!boardId) {
    try {
      const ordUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${encodeURIComponent(normalized)}`;
      const ordJson = await fetchOrdJson(ordUrl, { requestId: crypto.randomUUID(), timeoutMs: 8_000 });
      const ordName = extractOrdOrgName(ordJson);
      boardId = await resolveBoardId(db, normalized, ordName);
    } catch {
      return null;
    }
  }

  if (!boardId) return null;

  async function fetchAllPoliciesForBoardId(targetBoardId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const { results } = await db
      .prepare(
        `
        select
          i.name as board_name,
          p.treatment_type_id,
          t.name as treatment_type_name,
          p.cycles_offered,
          p.min_age,
          p.max_age,
          p.bmi_min,
          p.bmi_max,
          p.amh_min_pmol,
          p.fsh_max_iu,
          p.iui_rounds_required,
          p.endometriosis_priority_access,
          p.smoking_restricted,
          p.living_children_rule,
          p.additional_notes,
          p.updated_at
        from board_policies p
        join health_boards i on i.id = p.board_id
        join treatment_types t on t.id = p.treatment_type_id
        where p.board_id = ?1
          and (p.effective_to is null or p.effective_to >= ?2)
        order by
          case p.treatment_type_id
            when 'ivf' then 1
            when 'iui' then 2
            when 'di' then 3
            when 'fet' then 4
            else 5
          end,
          p.effective_from desc
      `
      )
      .bind(targetBoardId, today)
      .all<{
        board_name: string;
        treatment_type_id: string;
        treatment_type_name: string;
        cycles_offered: number;
        min_age: number | null;
        max_age: number;
        bmi_min: number | null;
        bmi_max: number | null;
        amh_min_pmol: number | null;
        fsh_max_iu: number | null;
        iui_rounds_required: number;
        endometriosis_priority_access: number;
        smoking_restricted: number;
        living_children_rule: string | null;
        additional_notes: string | null;
        updated_at: string;
      }>();

    if (!results.length) return null;

    return {
      board_name: results[0].board_name,
      policies: results.map((r) => ({
        treatment_type_id: r.treatment_type_id,
        treatment_type_name: r.treatment_type_name,
        cycles_offered: r.cycles_offered,
        min_age: r.min_age,
        max_age: r.max_age,
        bmi_min: r.bmi_min,
        bmi_max: r.bmi_max,
        amh_min_pmol: r.amh_min_pmol,
        fsh_max_iu: r.fsh_max_iu,
        iui_rounds_required: r.iui_rounds_required,
        endometriosis_priority_access: Boolean(r.endometriosis_priority_access),
        smoking_restricted: Boolean(r.smoking_restricted),
        living_children_rule: r.living_children_rule,
        additional_notes: r.additional_notes,
        updated_at: r.updated_at,
      })),
    };
  }

  const direct = await fetchAllPoliciesForBoardId(boardId);
  if (direct) return direct;

  // Fallback UP: if this is a sub-board, try the parent board's policies
  const parent = await db
    .prepare('select parent_board_code from health_boards where id = ?1 limit 1')
    .bind(boardId)
    .first<{ parent_board_code: string | null }>();

  const parentBoardCode = parent?.parent_board_code ?? null;
  if (!parentBoardCode) return null;

  const parentBoardId = await resolveBoardId(db, parentBoardCode, null);
  if (!parentBoardId || parentBoardId === boardId) return null;

  return await fetchAllPoliciesForBoardId(parentBoardId);
}
