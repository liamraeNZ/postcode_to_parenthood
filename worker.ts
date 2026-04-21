import { syncIcbsFromOrd } from './scripts/syncIcbsFromOrd';

type ExecutionContext = {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
};

type Fetcher = {
  fetch: (request: Request) => Promise<Response>;
};

type D1Database = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      first: <T>(typeHint?: string) => Promise<T | null>;
      run: () => Promise<{ success: boolean; error?: string }>;
      all: <T>() => Promise<{ results: T[] }>;
    };
  };
};

type ExportedHandler<E> = {
  fetch: (request: Request, env: E, ctx: ExecutionContext) => Response | Promise<Response>;
  scheduled?: (controller: ScheduledController, env: E, ctx: ExecutionContext) => void | Promise<void>;
};

type ScheduledController = {
  cron: string;
  scheduledTime: number;
};

type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_TOKEN?: string;
};

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    ...meta,
  };
  if (level === 'error') {
    console.error(JSON.stringify(payload));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(payload));
  } else if (level === 'info') {
    console.log(JSON.stringify(payload));
  } else {
    console.debug(JSON.stringify(payload));
  }
}

function requestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

const POSTCODES_IO_BASE_URL = 'https://api.postcodes.io';
const GP_SEARCH_NEAREST_OUTCODE_RADIUS_M = 7000;
const GP_SEARCH_NEAREST_OUTCODE_LIMIT = 10;
const GP_SEARCH_MAX_DISTANCE_M = 3500;
const GP_SEARCH_MAX_CANDIDATES = 250;
const GP_SEARCH_MAX_RESULTS = 40;
const GP_NAME_SEARCH_LIMIT = 40;

function isAuthorizedAdmin(request: Request, env: Env) {
  const configuredToken = env.ADMIN_TOKEN?.trim();
  if (!configuredToken) return true;
  return request.headers.get('x-admin-token') === configuredToken;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

async function readJsonBody(request: Request, options: { maxBytes: number }) {
  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > options.maxBytes) {
    return { ok: false as const, error: 'Body too large' as const };
  }
  let parsed: unknown;
  try {
    const text = new TextDecoder().decode(buffer);
    parsed = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    return { ok: false as const, error: 'Invalid JSON' as const };
  }
  return { ok: true as const, value: parsed };
}

function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

function normalizeOdsCode(input: string) {
  return input.trim().toUpperCase();
}

function redactPostcodeForLogs(normalizedPostcode: string) {
  if (!normalizedPostcode) return '';
  const visible = normalizedPostcode.slice(0, Math.min(3, normalizedPostcode.length));
  return `${visible}${'*'.repeat(Math.max(0, normalizedPostcode.length - visible.length))}`;
}

function truncateForLogs(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}…`;
}

function sanitizeSearchParams(params: URLSearchParams) {
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key === 'postcode') {
      out[key] = redactPostcodeForLogs(normalizePostcode(value));
      return;
    }
    out[key] = truncateForLogs(value, 80);
  });
  return Object.keys(out).length ? out : undefined;
}

function isReasonablePostcodeInput(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (trimmed.length > 16) return false;
  return /^[A-Za-z0-9 ]+$/.test(trimmed);
}

function isReasonableOrgNameInput(input: string) {
  const trimmed = input.trim();
  if (trimmed.length < 3) return false;
  if (trimmed.length > 80) return false;
  return /^[A-Za-z0-9 '&(),.\-]+$/.test(trimmed);
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

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

async function fetchOrdJson(url: string, ctx: { requestId: string; timeoutMs: number }) {
  const startedAt = Date.now();
  let response: Response;
  try {
    response = await fetchWithTimeout(
      url,
      {
        headers: {
          accept: 'application/json',
        },
      },
      ctx.timeoutMs
    );
  } catch (err) {
    log('error', 'upstream fetch failed', {
      request_id: ctx.requestId,
      upstream: 'spineservices.ord',
      url,
      duration_ms: Date.now() - startedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
    throw err;
  }

  log('debug', 'upstream response', {
    request_id: ctx.requestId,
    upstream: 'spineservices.ord',
    status: response.status,
    duration_ms: Date.now() - startedAt,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`ORD error: ${response.status} ${text ? `(${text.slice(0, 200)})` : ''}`.trim());
  }

  try {
    return (await response.json()) as unknown;
  } catch (err) {
    log('error', 'upstream returned invalid JSON', {
      request_id: ctx.requestId,
      upstream: 'spineservices.ord',
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
    throw new Error('ORD invalid JSON');
  }
}

function getStringField(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function getNumberField(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function getPath(obj: unknown, path: string[]): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

function getStringPath(obj: unknown, path: string[]): string | null {
  return getStringField(getPath(obj, path));
}

function getNumberPath(obj: unknown, path: string[]): number | null {
  return getNumberField(getPath(obj, path));
}

async function fetchPostcodesIoJson(url: string, ctx: { requestId: string; timeoutMs: number }) {
  const startedAt = Date.now();
  let response: Response;
  try {
    response = await fetchWithTimeout(
      url,
      {
        headers: {
          accept: 'application/json',
        },
      },
      ctx.timeoutMs
    );
  } catch (err) {
    log('error', 'upstream fetch failed', {
      request_id: ctx.requestId,
      upstream: 'postcodes.io',
      url,
      duration_ms: Date.now() - startedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
    throw err;
  }

  log('debug', 'upstream response', {
    request_id: ctx.requestId,
    upstream: 'postcodes.io',
    status: response.status,
    duration_ms: Date.now() - startedAt,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`postcodes.io error: ${response.status} ${text ? `(${text.slice(0, 200)})` : ''}`.trim());
  }

  try {
    return (await response.json()) as unknown;
  } catch (err) {
    log('error', 'upstream returned invalid JSON', {
      request_id: ctx.requestId,
      upstream: 'postcodes.io',
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
    throw new Error('postcodes.io invalid JSON');
  }
}

async function lookupPostcodeGeo(
  postcode: string,
  ctx: { requestId: string }
): Promise<{ outcode: string; latitude: number; longitude: number } | null> {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  try {
    const url = `${POSTCODES_IO_BASE_URL}/postcodes/${encodeURIComponent(normalized)}`;
    const json = await fetchPostcodesIoJson(url, { requestId: ctx.requestId, timeoutMs: 4_000 });
    const status = getNumberPath(json, ['status']);
    if (status !== 200) return null;
    const outcode = getStringPath(json, ['result', 'outcode']);
    const latitude = getNumberPath(json, ['result', 'latitude']);
    const longitude = getNumberPath(json, ['result', 'longitude']);
    if (!outcode || latitude == null || longitude == null) return null;
    return { outcode, latitude, longitude };
  } catch {
    return null;
  }
}

async function lookupNearestOutcodes(outcode: string, ctx: { requestId: string }) {
  const normalized = normalizeOdsCode(outcode);
  if (!normalized) return [];

  try {
    const url = `${POSTCODES_IO_BASE_URL}/outcodes/${encodeURIComponent(
      normalized
    )}/nearest?radius=${encodeURIComponent(String(GP_SEARCH_NEAREST_OUTCODE_RADIUS_M))}&limit=${encodeURIComponent(
      String(GP_SEARCH_NEAREST_OUTCODE_LIMIT)
    )}`;
    const json = await fetchPostcodesIoJson(url, { requestId: ctx.requestId, timeoutMs: 4_000 });
    const status = getNumberPath(json, ['status']);
    if (status !== 200) return [];
    const result = getPath(json, ['result']);
    if (!Array.isArray(result)) return [];
    return result
      .map((entry) => getStringPath(entry, ['outcode']))
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeOdsCode(value))
      .filter((value) => Boolean(value) && value !== normalized);
  } catch {
    return [];
  }
}

function haversineDistanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
) {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const r = 6371e3;
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * r * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function bulkLookupPostcodeGeos(postcodes: string[], ctx: { requestId: string }) {
  const unique = Array.from(new Set(postcodes.map((p) => normalizePostcode(p)).filter(Boolean)));
  const geos = new Map<string, { latitude: number; longitude: number }>();
  if (unique.length === 0) return geos;

  for (let offset = 0; offset < unique.length; offset += 100) {
    const batch = unique.slice(offset, offset + 100);
    const startedAt = Date.now();
    let response: Response;
    try {
      response = await fetchWithTimeout(
        `${POSTCODES_IO_BASE_URL}/postcodes`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ postcodes: batch }),
        },
        4_000
      );
    } catch (err) {
      log('error', 'upstream fetch failed', {
        request_id: ctx.requestId,
        upstream: 'postcodes.io',
        url: `${POSTCODES_IO_BASE_URL}/postcodes`,
        duration_ms: Date.now() - startedAt,
        err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
      });
      continue;
    }

    log('debug', 'upstream response', {
      request_id: ctx.requestId,
      upstream: 'postcodes.io',
      status: response.status,
      duration_ms: Date.now() - startedAt,
    });

    if (!response.ok) continue;

    let json: unknown;
    try {
      json = (await response.json()) as unknown;
    } catch {
      continue;
    }

    const status = getNumberPath(json, ['status']);
    if (status !== 200) continue;
    const result = getPath(json, ['result']);
    if (!Array.isArray(result)) continue;

    for (const entry of result) {
      const query = getStringPath(entry, ['query']);
      const postcode = getStringPath(entry, ['result', 'postcode']) ?? query;
      const latitude = getNumberPath(entry, ['result', 'latitude']);
      const longitude = getNumberPath(entry, ['result', 'longitude']);
      if (!postcode || latitude == null || longitude == null) continue;
      geos.set(normalizePostcode(postcode), { latitude, longitude });
    }
  }

  return geos;
}

function extractRelArray(json: unknown): unknown[] {
  const direct = getPath(json, ['Rels']);
  if (Array.isArray(direct)) return direct;
  const directRel = getPath(json, ['Rels', 'Rel']);
  if (Array.isArray(directRel)) return directRel;
  const orgRel = getPath(json, ['Organisation', 'Rels']);
  if (Array.isArray(orgRel)) return orgRel;
  const orgRelRel = getPath(json, ['Organisation', 'Rels', 'Rel']);
  if (Array.isArray(orgRelRel)) return orgRelRel;
  return [];
}

function extractTargetPrimaryRoleId(rel: unknown): string | null {
  return (
    getStringPath(rel, ['Target', 'PrimaryRoleId', 'id']) ??
    getStringPath(rel, ['Target', 'PrimaryRoleId']) ??
    getStringPath(rel, ['Target', 'Roles', 'Role', 'id'])
  );
}

function extractRelStatus(rel: unknown): string | null {
  return getStringPath(rel, ['Status']) ?? getStringPath(rel, ['Rel', 'Status']);
}

function extractTargetOrgCode(rel: unknown): string | null {
  return (
    getStringPath(rel, ['Target', 'OrgId', 'extension']) ??
    getStringPath(rel, ['Target', 'OrgId']) ??
    getStringPath(rel, ['Target', 'Organisation', 'OrgId', 'extension'])
  );
}

function findActiveRelationshipTarget(
  rels: unknown[],
  preferredRoleIds: string[]
): { icbCode: string; relationshipRoleId: string } | null {
  for (const roleId of preferredRoleIds) {
    for (const rel of rels) {
      const status = extractRelStatus(rel);
      if (status !== 'Active') continue;
      const targetRoleId = extractTargetPrimaryRoleId(rel);
      if (targetRoleId !== roleId) continue;
      const targetCode = extractTargetOrgCode(rel);
      if (!targetCode) continue;
      return { icbCode: targetCode, relationshipRoleId: roleId };
    }
  }
  return null;
}

async function getIcbFromGpOds(odsCode: string, ctx: { requestId: string }) {
  const normalizedOds = normalizeOdsCode(odsCode);
  if (!normalizedOds) return null;

  const url = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${encodeURIComponent(
    normalizedOds
  )}`;
  const json = await fetchOrdJson(url, { requestId: ctx.requestId, timeoutMs: 8_000 });
  const rels = extractRelArray(json);

  const direct = findActiveRelationshipTarget(rels, ['RO318', 'RO210']);
  if (direct) return direct;

  return findActiveRelationshipTarget(rels, ['RO98']);
}

async function lookupIcbPolicyByIcbCode(db: D1Database, icbCode: string) {
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
      updated_at: policy.updated_at,
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

async function fetchGpPracticesForOutcode(outcode: string, ctx: { requestId: string }) {
  const normalized = normalizeOdsCode(outcode);
  if (!normalized) return [];

  const ordUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PostCode=${encodeURIComponent(
    normalized
  )}&PrimaryRoleId=RO177&Status=Active`;

  const json = await fetchOrdJson(ordUrl, { requestId: ctx.requestId, timeoutMs: 8_000 });
  const organisations = getPath(json, ['Organisations']);
  if (!Array.isArray(organisations) || organisations.length === 0) return [];

  return organisations
    .map((org) => {
      const odsCode = getStringPath(org, ['OrgId']) ?? getStringPath(org, ['OrgId', 'extension']);
      const name = getStringPath(org, ['Name']);
      if (!odsCode || !name) return null;
      const postCode = getStringPath(org, ['PostCode']) ?? undefined;
      const orgLink = getStringPath(org, ['OrgLink']) ?? undefined;
      return { odsCode, name, postcode: postCode, orgLink };
    })
    .filter((org): org is NonNullable<typeof org> => org !== null);
}

async function handleApiRequest(request: Request, env: Env) {
  const reqId = requestId();
  const startedAt = Date.now();
  const url = new URL(request.url);
  const clientRequestId = request.headers.get('x-client-request-id') || undefined;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  let response: Response | undefined;
  try {
    log('info', 'request start', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname,
    });

    log('debug', 'request details', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname,
      query: sanitizeSearchParams(url.searchParams),
    });

    if (url.pathname === '/api/gp-practices' && request.method === 'GET') {
      const postcode = url.searchParams.get('postcode') || url.searchParams.get('Postcode');
      const name = url.searchParams.get('name');

      if (name != null) {
        if (!isReasonableOrgNameInput(name)) {
          response = jsonResponse(
            { error: 'Invalid name. Use at least 3 characters.', request_id: reqId },
            { status: 400 }
          );
          return response;
        }

        const ordUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Name=${encodeURIComponent(
          name.trim()
        )}&PrimaryRoleId=RO177&Status=Active&Limit=${encodeURIComponent(String(GP_NAME_SEARCH_LIMIT))}`;

        const json = await fetchOrdJson(ordUrl, { requestId: reqId, timeoutMs: 8_000 });
        const organisations = getPath(json, ['Organisations']);
        if (!Array.isArray(organisations) || organisations.length === 0) {
          response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
          return response;
        }

        const out = organisations
          .map((org) => {
            const odsCode = getStringPath(org, ['OrgId']) ?? getStringPath(org, ['OrgId', 'extension']);
            const orgName = getStringPath(org, ['Name']);
            if (!odsCode || !orgName) return null;
            const postCode = getStringPath(org, ['PostCode']) ?? undefined;
            const orgLink = getStringPath(org, ['OrgLink']) ?? undefined;
            return { odsCode, name: orgName, postcode: postCode, orgLink };
          })
          .filter((org): org is NonNullable<typeof org> => org !== null)
          .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
          .slice(0, GP_NAME_SEARCH_LIMIT);

        if (out.length === 0) {
          response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
          return response;
        }

        response = jsonResponse(out);
        return response;
      }

      if (!postcode) {
        response = jsonResponse({ error: 'Missing postcode', request_id: reqId }, { status: 400 });
        return response;
      }
      if (!isReasonablePostcodeInput(postcode)) {
        response = jsonResponse({ error: 'Invalid postcode', request_id: reqId }, { status: 400 });
        return response;
      }

      const normalized = normalizePostcode(postcode);
      const fallbackOutcode = normalized.length > 4 ? normalized.slice(0, -3) : normalized;
      const geo = await lookupPostcodeGeo(postcode, { requestId: reqId });
      const seedOutcode = normalizeOdsCode(geo?.outcode ?? fallbackOutcode);

      const nearestOutcodes = await lookupNearestOutcodes(seedOutcode, { requestId: reqId });
      const outcodesToQuery = Array.from(new Set([seedOutcode, ...nearestOutcodes]))
        .filter(Boolean)
        .slice(0, GP_SEARCH_NEAREST_OUTCODE_LIMIT);

      const settled = await Promise.allSettled(
        outcodesToQuery.map((outcode) => fetchGpPracticesForOutcode(outcode, { requestId: reqId }))
      );

      const byOds = new Map<string, { odsCode: string; name: string; postcode?: string; orgLink?: string }>();
      for (const result of settled) {
        if (result.status !== 'fulfilled') continue;
        for (const practice of result.value) {
          if (!byOds.has(practice.odsCode)) byOds.set(practice.odsCode, practice);
        }
      }

      const merged = Array.from(byOds.values());
      if (merged.length === 0) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      let candidates = merged;
      if (candidates.length > GP_SEARCH_MAX_CANDIDATES) {
        const seedFirst = candidates.filter((p) => normalizePostcode(p.postcode ?? '').startsWith(seedOutcode));
        const others = candidates.filter((p) => !normalizePostcode(p.postcode ?? '').startsWith(seedOutcode));
        candidates = [...seedFirst, ...others].slice(0, GP_SEARCH_MAX_CANDIDATES);
      }

      let ranked = candidates;
      if (geo) {
        const geos = await bulkLookupPostcodeGeos(
          candidates.map((p) => p.postcode).filter((p): p is string => Boolean(p)),
          { requestId: reqId }
        );

        const scored = candidates.map((practice) => {
          const geoKey = normalizePostcode(practice.postcode ?? '');
          const practiceGeo = geos.get(geoKey);
          const distanceMeters = practiceGeo ? haversineDistanceMeters(geo, practiceGeo) : null;
          return { practice, distanceMeters };
        });

        const within = scored.filter(
          (entry) => entry.distanceMeters == null || entry.distanceMeters <= GP_SEARCH_MAX_DISTANCE_M
        );

        within.sort((a, b) => {
          const aDist = a.distanceMeters ?? Number.POSITIVE_INFINITY;
          const bDist = b.distanceMeters ?? Number.POSITIVE_INFINITY;
          if (aDist !== bDist) return aDist - bDist;
          return a.practice.name.localeCompare(b.practice.name);
        });

        ranked = within.map((entry) => entry.practice);
      } else {
        ranked = candidates.slice().sort((a, b) => a.name.localeCompare(b.name));
      }

      response = jsonResponse(ranked.slice(0, GP_SEARCH_MAX_RESULTS));
      return response;
    }

    if (url.pathname === '/api/gp-icb' && request.method === 'GET') {
      const odsCode = url.searchParams.get('odsCode');
      if (!odsCode) {
        response = jsonResponse({ error: 'Missing odsCode', request_id: reqId }, { status: 400 });
        return response;
      }

      const resolved = await getIcbFromGpOds(odsCode, { requestId: reqId });
      if (!resolved) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      response = jsonResponse(resolved);
      return response;
    }

    if (url.pathname === '/api/icb-policy' && request.method === 'GET') {
      const postcode = url.searchParams.get('postcode');
      if (postcode) {
        response = jsonResponse(
          { error: 'Use /api/gp-practices then /api/gp-icb then /api/icb-policy?icbCode=...', request_id: reqId },
          { status: 400 }
        );
        return response;
      }

      const icbCode = url.searchParams.get('icbCode');
      if (!icbCode) {
        response = jsonResponse({ error: 'Missing icbCode', request_id: reqId }, { status: 400 });
        return response;
      }

      const policy = await lookupIcbPolicyByIcbCode(env.DB, icbCode);
      if (!policy) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      response = jsonResponse(policy);
      return response;
    }

    if (url.pathname === '/api/admin/icb-sync' && request.method === 'POST') {
      if (!isAuthorizedAdmin(request, env)) {
        response = jsonResponse({ error: 'Unauthorized', request_id: reqId }, { status: 401 });
        return response;
      }

      const startedSyncAt = Date.now();
      const sync = await syncIcbsFromOrd(env.DB, { requestId: reqId }, { fetchOrdJson, getPath, getStringPath });
      const icbs = await env.DB
        .prepare('select id, name, sub_icb_code, parent_icb_code, region, created_at, updated_at from icbs order by name asc')
        .bind()
        .all<{
          id: string;
          name: string;
          sub_icb_code: string | null;
          parent_icb_code: string | null;
          region: string | null;
          created_at: string;
          updated_at: string;
        }>();

      response = jsonResponse({
        ok: true,
        request_id: reqId,
        sync,
        sync_duration_ms: Date.now() - startedSyncAt,
        icbs: icbs.results,
      });
      return response;
    }

    if (url.pathname === '/api/admin/icbs' && request.method === 'GET') {
      if (!isAuthorizedAdmin(request, env)) {
        response = jsonResponse({ error: 'Unauthorized', request_id: reqId }, { status: 401 });
        return response;
      }

      const icbs = await env.DB
        .prepare('select id, name, sub_icb_code, parent_icb_code, region, created_at, updated_at from icbs order by name asc')
        .bind()
        .all<{
          id: string;
          name: string;
          sub_icb_code: string | null;
          parent_icb_code: string | null;
          region: string | null;
          created_at: string;
          updated_at: string;
        }>();

      response = jsonResponse({ ok: true, request_id: reqId, icbs: icbs.results });
      return response;
    }

    if (url.pathname === '/api/client-log' && request.method === 'POST') {
      const body = await readJsonBody(request, { maxBytes: 10_000 });
      if (!body.ok) {
        response = jsonResponse(
          { error: body.error, request_id: reqId },
          { status: body.error === 'Body too large' ? 413 : 400 }
        );
        return response;
      }
      if (!isRecord(body.value)) {
        response = jsonResponse({ error: 'Invalid payload', request_id: reqId }, { status: 400 });
        return response;
      }

      const rawLevel = body.value.level;
      const level: LogLevel =
        rawLevel === 'debug' || rawLevel === 'info' || rawLevel === 'warn' || rawLevel === 'error'
          ? rawLevel
          : 'info';
      const message = typeof body.value.message === 'string' ? body.value.message : 'client log';
      const meta = isRecord(body.value.meta) ? body.value.meta : undefined;

      log(level, 'client log', {
        request_id: reqId,
        client_request_id: clientRequestId,
        client_message: message.slice(0, 400),
        client_meta: meta,
      });

      response = jsonResponse({ ok: true, request_id: reqId });
      return response;
    }

    response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
    return response;
  } catch (err) {
    log('error', 'request failed', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname,
      duration_ms: Date.now() - startedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
    response = jsonResponse({ error: 'Internal server error', request_id: reqId }, { status: 500 });
    return response;
  } finally {
    log('info', 'request end', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname,
      status: response?.status,
      duration_ms: Date.now() - startedAt,
    });
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const reqId = requestId();
    const startedAt = Date.now();
    try {
      log('info', 'scheduled sync start', { request_id: reqId, cron: controller.cron });
      const result = await syncIcbsFromOrd(env.DB, { requestId: reqId }, { fetchOrdJson, getPath, getStringPath });
      log('info', 'scheduled sync end', { request_id: reqId, duration_ms: Date.now() - startedAt, ...result });
    } catch (err) {
      log('error', 'scheduled sync failed', {
        request_id: reqId,
        duration_ms: Date.now() - startedAt,
        err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
      });
    }
  },
} satisfies ExportedHandler<Env>;
