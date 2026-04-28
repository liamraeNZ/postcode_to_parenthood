import type { AdminIcb, AdminPolicy, CreateIcbInput, UpdateIcbInput, CreatePolicyInput } from '../../src/types/admin';
import type { D1Database } from '../types';

export type ConflictError = {
  type: 'conflict';
  field: string;
  message: string;
};

function isConflictError(err: unknown): boolean {
  return (
    err instanceof Error &&
    err.message.includes('UNIQUE constraint failed')
  );
}

type IcbRow = Omit<AdminIcb, 'has_active_policy'> & { has_active_policy: number | boolean };
type PolicyRow = Omit<AdminPolicy, 'endometriosis_priority_access' | 'smoking_restricted'> & {
  endometriosis_priority_access: number | boolean;
  smoking_restricted: number | boolean;
};

export async function listIcbs(db: D1Database): Promise<AdminIcb[]> {
  const { results } = await db
    .prepare(
      `SELECT
        i.*,
        EXISTS (
          SELECT 1 FROM icb_policies p
          WHERE p.icb_id = i.id
            AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
        ) AS has_active_policy
      FROM icbs i
      ORDER BY i.name ASC`
    )
    .bind()
    .all<IcbRow>();

  return results.map((row) => ({
    ...row,
    has_active_policy: Boolean(row.has_active_policy),
  }));
}

export async function createIcb(db: D1Database, data: CreateIcbInput): Promise<AdminIcb> {
  try {
    await db
      .prepare(
        `INSERT INTO icbs (id, name, sub_icb_code, parent_icb_code, region, country)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.id,
        data.name,
        data.sub_icb_code ?? null,
        data.parent_icb_code ?? null,
        data.region ?? null,
        data.country ?? null
      )
      .run();
  } catch (err) {
    if (isConflictError(err)) {
      const msg = (err as Error).message;
      const field = msg.includes('icbs.name') ? 'name' : 'id';
      throw { type: 'conflict', field, message: `ICB with this ${field} already exists` } satisfies ConflictError;
    }
    throw err;
  }

  const row = await db
    .prepare(
      `SELECT
        i.*,
        EXISTS (
          SELECT 1 FROM icb_policies p
          WHERE p.icb_id = i.id
            AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
        ) AS has_active_policy
      FROM icbs i
      WHERE i.id = ?`
    )
    .bind(data.id)
    .first<IcbRow>();

  if (!row) throw new Error('Failed to retrieve created ICB');

  return { ...row, has_active_policy: Boolean(row.has_active_policy) };
}

export async function updateIcb(
  db: D1Database,
  id: string,
  data: UpdateIcbInput
): Promise<AdminIcb | null> {
  const fields = Object.entries(data).filter(([, v]) => v !== undefined);
  if (fields.length === 0) {
    // Nothing to update — just fetch and return current row
    const existing = await db
      .prepare(
        `SELECT
          i.*,
          EXISTS (
            SELECT 1 FROM icb_policies p
            WHERE p.icb_id = i.id
              AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
          ) AS has_active_policy
        FROM icbs i
        WHERE i.id = ?`
      )
      .bind(id)
      .first<IcbRow>();
    if (!existing) return null;
    return { ...existing, has_active_policy: Boolean(existing.has_active_policy) };
  }

  const setClauses = fields.map(([k]) => `${k} = ?`).join(', ');
  const values = fields.map(([, v]) => v ?? null);

  const result = await db
    .prepare(`UPDATE icbs SET ${setClauses}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`)
    .bind(...values, id)
    .run();

  if (!result.success) return null;

  const row = await db
    .prepare(
      `SELECT
        i.*,
        EXISTS (
          SELECT 1 FROM icb_policies p
          WHERE p.icb_id = i.id
            AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
        ) AS has_active_policy
      FROM icbs i
      WHERE i.id = ?`
    )
    .bind(id)
    .first<IcbRow>();

  if (!row) return null;

  return { ...row, has_active_policy: Boolean(row.has_active_policy) };
}

export async function listPoliciesForIcb(db: D1Database, icbId: string): Promise<AdminPolicy[]> {
  const { results } = await db
    .prepare(`SELECT * FROM icb_policies WHERE icb_id = ? ORDER BY effective_from DESC`)
    .bind(icbId)
    .all<PolicyRow>();

  return results.map((row) => ({
    ...row,
    endometriosis_priority_access: Boolean(row.endometriosis_priority_access),
    smoking_restricted: Boolean(row.smoking_restricted),
  }));
}

export async function createPolicy(
  db: D1Database,
  icbId: string,
  data: CreatePolicyInput
): Promise<AdminPolicy> {
  const policyId = crypto.randomUUID();
  const effectiveFrom = data.effective_from ?? new Date().toISOString().slice(0, 10);

  try {
    await db
      .prepare(
        `INSERT INTO icb_policies (
          id, icb_id, treatment_type_id, effective_from, effective_to,
          cycles_offered, max_age, bmi_min, bmi_max,
          iui_rounds_required, wait_time_months,
          endometriosis_priority_access, smoking_restricted,
          living_children_rule, source_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        policyId,
        icbId,
        data.treatment_type_id ?? 'ivf',
        effectiveFrom,
        data.effective_to ?? null,
        data.cycles_offered,
        data.max_age,
        data.bmi_min ?? null,
        data.bmi_max ?? null,
        data.iui_rounds_required,
        data.wait_time_months ?? null,
        data.endometriosis_priority_access ? 1 : 0,
        data.smoking_restricted !== false ? 1 : 0,
        data.living_children_rule,
        data.source_url ?? null
      )
      .run();
  } catch (err) {
    if (isConflictError(err)) {
      throw {
        type: 'conflict',
        field: 'effective_from',
        message: 'A policy with this effective_from date already exists for this ICB',
      } satisfies ConflictError;
    }
    throw err;
  }

  const row = await db
    .prepare(`SELECT * FROM icb_policies WHERE id = ?`)
    .bind(policyId)
    .first<PolicyRow>();

  if (!row) throw new Error('Failed to retrieve created policy');

  return {
    ...row,
    endometriosis_priority_access: Boolean(row.endometriosis_priority_access),
    smoking_restricted: Boolean(row.smoking_restricted),
  };
}
