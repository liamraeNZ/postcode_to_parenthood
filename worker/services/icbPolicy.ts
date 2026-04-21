import type { D1Database } from '../types';
import { normalizeOdsCode } from '../lib';

async function resolveIcbId(db: D1Database, icbCode: string, icbName: string | null) {
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

  const byAliasName = await db
    .prepare("select icb_id as id from icb_aliases where alias_kind = 'name' and alias = ?1 limit 1")
    .bind(icbName)
    .first<{ id: string }>();

  return byAliasName?.id ?? null;
}

export async function lookupIcbPolicyByIcbCode(db: D1Database, icbCode: string) {
  const normalized = normalizeOdsCode(icbCode);
  if (!normalized) return null;

  const icbId = await resolveIcbId(db, normalized, null);
  if (!icbId) return null;

  async function fetchPolicyForIcbId(targetIcbId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const policy = await db
      .prepare(
        `
        select
          i.name as icb_name,
          p.cycles_offered,
          p.max_age,
          p.bmi_min,
          p.bmi_max,
          p.iui_rounds_required,
          p.wait_time_months,
          p.endometriosis_priority_access,
          p.smoking_restricted,
          p.living_children_rule,
          p.updated_at
        from icb_policies p
        join icbs i on i.id = p.icb_id
        where p.icb_id = ?1 and (p.effective_to is null or p.effective_to >= ?2)
        order by p.effective_from desc
        limit 1
      `
      )
      .bind(targetIcbId, today)
      .first<{
        icb_name: string;
        cycles_offered: number;
        max_age: number;
        bmi_min: number | null;
        bmi_max: number | null;
        iui_rounds_required: number;
        wait_time_months: number | null;
        endometriosis_priority_access: number;
        smoking_restricted: number;
        living_children_rule: string | null;
        updated_at: string;
      }>();

    if (!policy) return null;

    return {
      icb_name: policy.icb_name,
      cycles_offered: policy.cycles_offered,
      max_age: policy.max_age,
      bmi_min: policy.bmi_min,
      bmi_max: policy.bmi_max,
      iui_rounds_required: policy.iui_rounds_required,
      wait_time_months: policy.wait_time_months,
      endometriosis_priority_access: Boolean(policy.endometriosis_priority_access),
      smoking_restricted: Boolean(policy.smoking_restricted),
      living_children_rule: policy.living_children_rule,
      updated_at: policy.updated_at
    };
  }

  const direct = await fetchPolicyForIcbId(icbId);
  if (direct) return direct;

  const parent = await db
    .prepare('select parent_icb_code from icbs where id = ?1 limit 1')
    .bind(icbId)
    .first<{ parent_icb_code: string | null }>();

  const parentIcbCode = parent?.parent_icb_code ?? null;
  if (!parentIcbCode) return null;

  const parentIcbId = await resolveIcbId(db, parentIcbCode, null);
  if (!parentIcbId || parentIcbId === icbId) return null;

  return await fetchPolicyForIcbId(parentIcbId);
}
