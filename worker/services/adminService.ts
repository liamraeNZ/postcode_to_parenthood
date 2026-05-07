import type { AdminIcb, AdminPolicy, CreateIcbInput, UpdateIcbInput, CreatePolicyInput } from '../../app/types/admin';
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

type BoardRow = Omit<AdminIcb, 'has_active_policy'> & { has_active_policy: number | boolean };
type PolicyRow = Omit<AdminPolicy, 'endometriosis_priority_access' | 'smoking_restricted'> & {
  endometriosis_priority_access: number | boolean;
  smoking_restricted: number | boolean;
};

export async function listBoards(db: D1Database): Promise<AdminIcb[]> {
  const { results } = await db
    .prepare(
      `SELECT
        i.*,
        EXISTS (
          SELECT 1 FROM board_policies p
          WHERE p.board_id = i.id
            AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
        ) AS has_active_policy
      FROM health_boards i
      ORDER BY i.name ASC`
    )
    .bind()
    .all<BoardRow>();

  return results.map((row) => ({
    ...row,
    has_active_policy: Boolean(row.has_active_policy),
  }));
}

export async function createBoard(db: D1Database, data: CreateIcbInput): Promise<AdminIcb> {
  try {
    await db
      .prepare(
        `INSERT INTO health_boards (id, name, sub_board_code, parent_board_code, region, country)
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
      const field = msg.includes('health_boards.name') ? 'name' : 'id';
      throw { type: 'conflict', field, message: `Health board with this ${field} already exists` } satisfies ConflictError;
    }
    throw err;
  }

  const row = await db
    .prepare(
      `SELECT
        i.*,
        EXISTS (
          SELECT 1 FROM board_policies p
          WHERE p.board_id = i.id
            AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
        ) AS has_active_policy
      FROM health_boards i
      WHERE i.id = ?`
    )
    .bind(data.id)
    .first<BoardRow>();

  if (!row) throw new Error('Failed to retrieve created health board');

  return { ...row, has_active_policy: Boolean(row.has_active_policy) };
}

export async function updateBoard(
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
            SELECT 1 FROM board_policies p
            WHERE p.board_id = i.id
              AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
          ) AS has_active_policy
        FROM health_boards i
        WHERE i.id = ?`
      )
      .bind(id)
      .first<BoardRow>();
    if (!existing) return null;
    return { ...existing, has_active_policy: Boolean(existing.has_active_policy) };
  }

  // Map input field names to DB column names
  const columnMap: Record<string, string> = {
    sub_icb_code: 'sub_board_code',
    parent_icb_code: 'parent_board_code',
  };

  const setClauses = fields.map(([k]) => `${columnMap[k] ?? k} = ?`).join(', ');
  const values = fields.map(([, v]) => v ?? null);

  const result = await db
    .prepare(`UPDATE health_boards SET ${setClauses}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`)
    .bind(...values, id)
    .run();

  if (!result.success) return null;

  const row = await db
    .prepare(
      `SELECT
        i.*,
        EXISTS (
          SELECT 1 FROM board_policies p
          WHERE p.board_id = i.id
            AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
        ) AS has_active_policy
      FROM health_boards i
      WHERE i.id = ?`
    )
    .bind(id)
    .first<BoardRow>();

  if (!row) return null;

  return { ...row, has_active_policy: Boolean(row.has_active_policy) };
}

export async function listPoliciesForBoard(db: D1Database, boardId: string): Promise<AdminPolicy[]> {
  const { results } = await db
    .prepare(`SELECT * FROM board_policies WHERE board_id = ? ORDER BY effective_from DESC`)
    .bind(boardId)
    .all<PolicyRow>();

  return results.map((row) => ({
    ...row,
    endometriosis_priority_access: Boolean(row.endometriosis_priority_access),
    smoking_restricted: Boolean(row.smoking_restricted),
  }));
}

export async function createPolicy(
  db: D1Database,
  boardId: string,
  data: CreatePolicyInput
): Promise<AdminPolicy> {
  const policyId = crypto.randomUUID();
  const effectiveFrom = data.effective_from ?? new Date().toISOString().slice(0, 10);

  try {
    await db
      .prepare(
        `INSERT INTO board_policies (
          id, board_id, treatment_type_id, effective_from, effective_to,
          cycles_offered, max_age, bmi_min, bmi_max,
          iui_rounds_required,
          endometriosis_priority_access, smoking_restricted,
          living_children_rule, source_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        policyId,
        boardId,
        data.treatment_type_id ?? 'ivf',
        effectiveFrom,
        data.effective_to ?? null,
        data.cycles_offered,
        data.max_age,
        data.bmi_min ?? null,
        data.bmi_max ?? null,
        data.iui_rounds_required,
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
        message: 'A policy with this effective_from date already exists for this health board',
      } satisfies ConflictError;
    }
    throw err;
  }

  const row = await db
    .prepare(`SELECT * FROM board_policies WHERE id = ?`)
    .bind(policyId)
    .first<PolicyRow>();

  if (!row) throw new Error('Failed to retrieve created policy');

  return {
    ...row,
    endometriosis_priority_access: Boolean(row.endometriosis_priority_access),
    smoking_restricted: Boolean(row.smoking_restricted),
  };
}
