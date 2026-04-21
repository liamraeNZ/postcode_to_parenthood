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
    };
  };
};

type ExportedHandler<E> = {
  fetch: (request: Request, env: E, ctx: ExecutionContext) => Response | Promise<Response>;
};

type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
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
  const byCode = await db
    .prepare('select id from icbs where nhs_code = ?1 limit 1')
    .bind(icbCode)
    .first<{ id: string }>();

  if (byCode?.id) return byCode.id;

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

async function lookupIcbPolicyByPostcode(db: D1Database, postcode: string, ctx: { requestId: string }) {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  const upstreamUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`;
  const upstreamStartedAt = Date.now();
  let postcodesIoResponse: Response;
  try {
    postcodesIoResponse = await fetchWithTimeout(upstreamUrl, {}, 8_000);
  } catch (err) {
    log('error', 'upstream fetch failed', {
      request_id: ctx.requestId,
      upstream: 'api.postcodes.io',
      url: upstreamUrl,
      duration_ms: Date.now() - upstreamStartedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
    throw err;
  }

  log('debug', 'upstream response', {
    request_id: ctx.requestId,
    upstream: 'api.postcodes.io',
    status: postcodesIoResponse.status,
    duration_ms: Date.now() - upstreamStartedAt,
  });

  if (postcodesIoResponse.status === 404) return null;
  if (postcodesIoResponse.status === 429) {
    throw new Error('Upstream rate limited');
  }
  if (!postcodesIoResponse.ok) {
    throw new Error(`Upstream error: ${postcodesIoResponse.status}`);
  }

  let json: { result?: { codes?: { icb?: string | null } | null } | null };
  try {
    json = (await postcodesIoResponse.json()) as {
      result?: { codes?: { icb?: string | null } | null } | null;
    };
  } catch (err) {
    log('error', 'upstream returned invalid JSON', {
      request_id: ctx.requestId,
      upstream: 'api.postcodes.io',
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
    throw new Error('Upstream invalid JSON');
  }

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
    updated_at: policy.updated_at,
  };
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

    if (url.pathname === '/api/icb-policy' && request.method === 'GET') {
      const postcode = url.searchParams.get('postcode');
      if (!postcode) {
        response = jsonResponse({ error: 'Missing postcode', request_id: reqId }, { status: 400 });
        return response;
      }
      if (!isReasonablePostcodeInput(postcode)) {
        response = jsonResponse({ error: 'Invalid postcode', request_id: reqId }, { status: 400 });
        return response;
      }

      const policy = await lookupIcbPolicyByPostcode(env.DB, postcode, { requestId: reqId });
      if (!policy) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      response = jsonResponse(policy);
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
} satisfies ExportedHandler<Env>;
