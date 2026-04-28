import type { D1Database } from '../types';
import { normalizeOdsCode } from '../lib';
import { fetchOrdJson } from './ord';

export async function resolveDocumentFolder(db: D1Database, icbCode: string): Promise<string | null> {
  const normalized = normalizeOdsCode(icbCode);
  if (!normalized) return null;

  // Try direct match first
  const direct = await db
    .prepare('select document_folder_name from icbs where id = ?1 and document_folder_name is not null limit 1')
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (direct?.document_folder_name) return direct.document_folder_name;

  // Try sub_icb_code match
  const bySub = await db
    .prepare('select document_folder_name from icbs where sub_icb_code = ?1 and document_folder_name is not null limit 1')
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (bySub?.document_folder_name) return bySub.document_folder_name;

  // Try parent ICB code match
  const byParent = await db
    .prepare('select document_folder_name from icbs where sub_icb_code is null and parent_icb_code = ?1 and document_folder_name is not null limit 1')
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (byParent?.document_folder_name) return byParent.document_folder_name;

  // Try alias code match
  const byAlias = await db
    .prepare("select i.document_folder_name from icb_aliases a join icbs i on i.id = a.icb_id where a.alias_kind = 'code' and a.alias = ?1 and i.document_folder_name is not null limit 1")
    .bind(normalized)
    .first<{ document_folder_name: string }>();
  if (byAlias?.document_folder_name) return byAlias.document_folder_name;

  // If this is a sub-ICB without its own folder, try the parent
  const parentCode = await db
    .prepare('select parent_icb_code from icbs where (id = ?1 or sub_icb_code = ?1) and parent_icb_code is not null limit 1')
    .bind(normalized)
    .first<{ parent_icb_code: string }>();
  if (parentCode?.parent_icb_code) {
    const parentFolder = await db
      .prepare('select document_folder_name from icbs where (id = ?1 or parent_icb_code = ?1) and sub_icb_code is null and document_folder_name is not null limit 1')
      .bind(parentCode.parent_icb_code)
      .first<{ document_folder_name: string }>();
    if (parentFolder?.document_folder_name) return parentFolder.document_folder_name;
  }

  return null;
}

function normalizeIcbNameForMatch(value: string) {
  return value
    .toUpperCase()
    .replace(/INTEGRATED CARE BOARD/g, 'ICB')
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeIcbNameForLooseMatch(value: string) {
  const normalized = normalizeIcbNameForMatch(value);
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

async function resolveIcbIdByCode(db: D1Database, code: string) {
  const normalized = normalizeOdsCode(code);
  if (!normalized) return null;

  const directId = await db
    .prepare('select id from icbs where id = ?1 limit 1')
    .bind(normalized)
    .first<{ id: string }>();
  if (directId?.id) return directId.id;

  const bySubIcbCode = await db
    .prepare('select id from icbs where sub_icb_code = ?1 limit 1')
    .bind(normalized)
    .first<{ id: string }>();
  if (bySubIcbCode?.id) return bySubIcbCode.id;

  const byParentIcbCode = await db
    .prepare('select id from icbs where sub_icb_code is null and parent_icb_code = ?1 limit 1')
    .bind(normalized)
    .first<{ id: string }>();
  if (byParentIcbCode?.id) return byParentIcbCode.id;

  const byAliasCode = await db
    .prepare("select icb_id as id from icb_aliases where alias_kind = 'code' and alias = ?1 limit 1")
    .bind(normalized)
    .first<{ id: string }>();
  if (byAliasCode?.id) return byAliasCode.id;

  return null;
}

async function resolveIcbIdByName(db: D1Database, name: string, mode: 'exact' | 'compatible') {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const byNameExact = await db
    .prepare('select id from icbs where name = ?1 limit 1')
    .bind(trimmed)
    .first<{ id: string }>();
  if (byNameExact?.id) return byNameExact.id;

  const byAliasName = await db
    .prepare("select icb_id as id from icb_aliases where alias_kind = 'name' and alias = ?1 limit 1")
    .bind(trimmed)
    .first<{ id: string }>();
  if (byAliasName?.id) return byAliasName.id;

  const normalizedStrict = normalizeIcbNameForMatch(trimmed);
  const normalizedLoose = normalizeIcbNameForLooseMatch(trimmed);
  if (!normalizedStrict) return null;

  const rows = await db.prepare('select id, name from icbs').bind().all<{ id: string; name: string }>();
  for (const row of rows.results) {
    const rowStrict = normalizeIcbNameForMatch(row.name);
    if (!rowStrict) continue;
    if (rowStrict === normalizedStrict) return row.id;

    if (mode === 'compatible') {
      const rowLoose = normalizeIcbNameForLooseMatch(row.name);
      if (rowLoose && normalizedLoose && rowLoose === normalizedLoose) return row.id;
      if (rowStrict.startsWith(normalizedStrict) && rowStrict.slice(normalizedStrict.length).trim() === 'ICB') return row.id;
      if (normalizedStrict.startsWith(rowStrict) && normalizedStrict.slice(rowStrict.length).trim() === 'ICB') return row.id;
    }
  }

  return null;
}

async function resolveIcbId(db: D1Database, icbCode: string, icbName: string | null) {
  const byDirectId = await db
    .prepare('select id from icbs where id = ?1 limit 1')
    .bind(icbCode)
    .first<{ id: string }>();

  if (byDirectId?.id) return byDirectId.id;

  const bySubIcbCode = await db
    .prepare('select id from icbs where sub_icb_code = ?1 limit 1')
    .bind(icbCode)
    .first<{ id: string }>();

  if (bySubIcbCode?.id) return bySubIcbCode.id;

  const byParentIcbCode = await db
    .prepare('select id from icbs where sub_icb_code is null and parent_icb_code = ?1 limit 1')
    .bind(icbCode)
    .first<{ id: string }>();

  if (byParentIcbCode?.id) return byParentIcbCode.id;

  const byAliasCode = await db
    .prepare("select icb_id as id from icb_aliases where alias_kind = 'code' and alias = ?1 limit 1")
    .bind(icbCode)
    .first<{ id: string }>();

  if (byAliasCode?.id) return byAliasCode.id;

  if (!icbName) return null;

  const byNameExact = await db
    .prepare('select id from icbs where name = ?1 limit 1')
    .bind(icbName)
    .first<{ id: string }>();

  if (byNameExact?.id) return byNameExact.id;

  const byAliasName = await db
    .prepare("select icb_id as id from icb_aliases where alias_kind = 'name' and alias = ?1 limit 1")
    .bind(icbName)
    .first<{ id: string }>();

  if (byAliasName?.id) return byAliasName.id;

  const normalizedName = normalizeIcbNameForMatch(icbName);
  if (!normalizedName) return null;

  const parents = await db
    .prepare('select id, name from icbs where sub_icb_code is null')
    .bind()
    .all<{ id: string; name: string }>();

  for (const row of parents.results) {
    if (normalizeIcbNameForMatch(row.name) === normalizedName) return row.id;
  }

  const subs = await db
    .prepare('select id, name from icbs where sub_icb_code is not null')
    .bind()
    .all<{ id: string; name: string }>();

  for (const row of subs.results) {
    if (normalizeIcbNameForMatch(row.name) === normalizedName) return row.id;
  }

  return null;
}

export async function resolveIcbIdFromPostcodesIo(
  db: D1Database,
  identifiers: { icb: string | null; ccg_id: string | null; ccg: string | null }
) {
  if (identifiers.icb) {
    const byIcbName = await resolveIcbIdByName(db, identifiers.icb, 'exact');
    if (byIcbName) return { icbId: byIcbName, matched_on: 'icb' as const };
  }

  if (identifiers.ccg_id) {
    const byCcgId = await resolveIcbIdByCode(db, identifiers.ccg_id);
    if (byCcgId) return { icbId: byCcgId, matched_on: 'ccg_id' as const };
  }

  if (identifiers.ccg) {
    const byCcgName = await resolveIcbIdByName(db, identifiers.ccg, 'compatible');
    if (byCcgName) return { icbId: byCcgName, matched_on: 'ccg' as const };
  }

  return null;
}


export async function lookupAllIcbPoliciesByIcbCode(db: D1Database, icbCode: string) {
  const normalized = normalizeOdsCode(icbCode);
  if (!normalized) return null;

  let icbId = await resolveIcbId(db, normalized, null);
  if (!icbId) {
    try {
      const ordUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${encodeURIComponent(normalized)}`;
      const ordJson = await fetchOrdJson(ordUrl, { requestId: crypto.randomUUID(), timeoutMs: 8_000 });
      const ordName = extractOrdOrgName(ordJson);
      icbId = await resolveIcbId(db, normalized, ordName);
    } catch {
      return null;
    }
  }

  if (!icbId) return null;

  async function fetchAllPoliciesForIcbId(targetIcbId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const { results } = await db
      .prepare(
        `
        select
          i.name as icb_name,
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
        from icb_policies p
        join icbs i on i.id = p.icb_id
        join treatment_types t on t.id = p.treatment_type_id
        where p.icb_id = ?1
          and (p.effective_to is null or p.effective_to >= ?2)
        order by
          case p.treatment_type_id
            when 'ivf' then 1
            when 'icsi' then 2
            when 'iui' then 3
            when 'di' then 4
            when 'fet' then 5
            else 6
          end,
          p.effective_from desc
      `
      )
      .bind(targetIcbId, today)
      .all<{
        icb_name: string;
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
      icb_name: results[0].icb_name,
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

  const direct = await fetchAllPoliciesForIcbId(icbId);
  if (direct) return direct;

  // Fallback UP: if this is a sub-ICB, try the parent ICB's policies
  const parent = await db
    .prepare('select parent_icb_code from icbs where id = ?1 limit 1')
    .bind(icbId)
    .first<{ parent_icb_code: string | null }>();

  const parentIcbCode = parent?.parent_icb_code ?? null;
  if (!parentIcbCode) return null;

  const parentIcbId = await resolveIcbId(db, parentIcbCode, null);
  if (!parentIcbId || parentIcbId === icbId) return null;

  return await fetchAllPoliciesForIcbId(parentIcbId);
}
