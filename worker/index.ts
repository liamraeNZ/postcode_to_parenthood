type Env = {
  DB: D1Database;
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET,POST,OPTIONS');
  headers.set('access-control-allow-headers', 'content-type');

  return new Response(JSON.stringify(body), {
    ...init,
    headers
  });
}

function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

async function resolveIcbId(db: D1Database, icbCode: string, icbName: string | null) {
  const byCode = await db
    .prepare('select id from icbs where nhs_code = ?1 limit 1')
    .bind(icbCode)
    .first<{ id: string }>();

  if (byCode?.id) return byCode.id;

  const byAliasCode = await db
    .prepare(
      "select icb_id as id from icb_aliases where alias_kind = 'code' and alias = ?1 limit 1"
    )
    .bind(icbCode)
    .first<{ id: string }>();

  if (byAliasCode?.id) return byAliasCode.id;

  if (!icbName) return null;

  const byAliasName = await db
    .prepare(
      "select icb_id as id from icb_aliases where alias_kind = 'name' and alias = ?1 limit 1"
    )
    .bind(icbName)
    .first<{ id: string }>();

  return byAliasName?.id ?? null;
}

async function lookupIcbPolicyByPostcode(db: D1Database, postcode: string) {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  const postcodesIoResponse = await fetch(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`
  );
  if (!postcodesIoResponse.ok) return null;

  const json = (await postcodesIoResponse.json()) as {
    result?: { codes?: { icb?: string | null } | null } | null;
  };

  const icbCode = json.result?.codes?.icb ?? null;
  if (!icbCode) return null;

  const icbId = await resolveIcbId(db, icbCode, null);
  if (!icbId) return null;

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
    .bind(icbId, today)
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

export default {
  async fetch(request, env: Env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return jsonResponse({ ok: true });
    }

    if (url.pathname === '/api/icb-policy' && request.method === 'GET') {
      const postcode = url.searchParams.get('postcode');
      if (!postcode) return jsonResponse({ error: 'Missing postcode' }, { status: 400 });

      const policy = await lookupIcbPolicyByPostcode(env.DB, postcode);
      if (!policy) return jsonResponse({ error: 'Not found' }, { status: 404 });

      return jsonResponse(policy);
    }

    return jsonResponse({ error: 'Not found' }, { status: 404 });
  }
} satisfies ExportedHandler<Env>;
