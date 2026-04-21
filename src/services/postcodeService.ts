import { GpPracticeSummary, ICBPolicy } from '../types';

const DEFAULT_TIMEOUT_MS = 10_000;

function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

function normalizeUpperTrim(input: string) {
  return input.trim().toUpperCase();
}

function redactPostcodeForLogs(normalizedPostcode: string) {
  if (!normalizedPostcode) return '';
  const visible = normalizedPostcode.slice(0, Math.min(3, normalizedPostcode.length));
  return `${visible}${'*'.repeat(Math.max(0, normalizedPostcode.length - visible.length))}`;
}

type ClientLogLevel = 'debug' | 'info' | 'warn' | 'error';

function redactRequestUrlForLogs(requestUrl: string, redactedPostcode: string) {
  return requestUrl.replace(
    /([?&]postcode=)[^&]*/i,
    `$1${encodeURIComponent(redactedPostcode)}`
  );
}

function buildRequestUrl(apiBaseUrl: string, path: string, query: Record<string, string>) {
  const qs = new URLSearchParams(query).toString();
  return qs ? `${apiBaseUrl}${path}?${qs}` : `${apiBaseUrl}${path}`;
}

function createClientRequestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

async function sendClientLog(
  apiBaseUrl: string,
  clientRequestId: string,
  payload: { level: ClientLogLevel; message: string; meta?: Record<string, unknown> }
) {
  try {
    await fetch(`${apiBaseUrl}/api/client-log`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-request-id': clientRequestId
      },
      body: JSON.stringify(payload)
    });
  } catch {
    return;
  }
}

export type PostcodeLookupErrorKind =
  | 'timeout'
  | 'network'
  | 'server'
  | 'bad_response'
  | 'misconfigured';

export class PostcodeLookupError extends Error {
  readonly kind: PostcodeLookupErrorKind;
  readonly status?: number;

  constructor(
    kind: PostcodeLookupErrorKind,
    message: string,
    options?: { status?: number; cause?: unknown }
  ) {
    super(message);
    this.name = 'PostcodeLookupError';
    this.kind = kind;
    this.status = options?.status;
    if (options?.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}

function toPostcodeLookupError(
  err: unknown,
  messages: { timeout: string; network: string; unexpected: string }
): PostcodeLookupError {
  if (err instanceof DOMException && err.name === 'AbortError') {
    return new PostcodeLookupError('timeout', messages.timeout, { cause: err });
  }

  const message = err instanceof Error ? err.message : String(err);
  if (message.toLowerCase().includes('failed to fetch')) {
    return new PostcodeLookupError('network', messages.network, { cause: err });
  }

  if (err instanceof PostcodeLookupError) return err;
  return new PostcodeLookupError('bad_response', messages.unexpected, { cause: err });
}

let didWarnMissingApiBaseUrl = false;

function getApiBaseUrl() {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  if (!apiBaseUrl && !didWarnMissingApiBaseUrl) {
    didWarnMissingApiBaseUrl = true;
    if (import.meta.env.DEV) {
      console.warn('[postcodeService] VITE_API_BASE_URL is empty; using relative /api/... requests');
    }
  }
  return apiBaseUrl;
}

async function fetchJsonWithTimeout<T>(
  requestUrl: string,
  options: { clientRequestId: string; timeoutMs: number }
): Promise<{ status: number; ok: boolean; json?: T; text?: string }> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const response = await fetch(requestUrl, {
      signal: controller.signal,
      headers: { 'x-client-request-id': options.clientRequestId }
    });
    if (!response.ok) {
      const text = await response.text().catch(() => null);
      return { status: response.status, ok: false, text: text ?? undefined };
    }
    try {
      const json = (await response.json()) as T;
      return { status: response.status, ok: true, json };
    } catch {
      return { status: response.status, ok: false, text: 'invalid json' };
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function searchGpPracticesByPostcode(postcode: string): Promise<GpPracticeSummary[]> {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return [];

  const apiBaseUrl = getApiBaseUrl();
  const requestUrl = buildRequestUrl(apiBaseUrl, '/api/gp-practices', { postcode: normalized });
  const startedAt = performance.now();
  const clientRequestId = createClientRequestId();
  const logPostcode = redactPostcodeForLogs(normalized);
  const logRequestUrl = redactRequestUrlForLogs(requestUrl, logPostcode);
  if (import.meta.env.DEV) {
    console.debug('[postcodeService] gp search start', { postcode: logPostcode, url: requestUrl });
  }
  if (import.meta.env.DEV) {
    void sendClientLog(apiBaseUrl, clientRequestId, {
      level: 'debug',
      message: 'frontend -> backend request',
      meta: {
        client_request_id: clientRequestId,
        method: 'GET',
        url: logRequestUrl,
        timeout_ms: DEFAULT_TIMEOUT_MS,
        api_base_url_present: Boolean(apiBaseUrl)
      }
    });
  }

  const timeoutMs = DEFAULT_TIMEOUT_MS;
  try {
    const response = await fetchJsonWithTimeout<GpPracticeSummary[]>(requestUrl, {
      clientRequestId,
      timeoutMs
    });
    const durationMs = Math.round(performance.now() - startedAt);
    if (import.meta.env.DEV) {
      console.debug('[postcodeService] gp search response', {
        postcode: logPostcode,
        status: response.status,
        duration_ms: durationMs
      });
    }

    if (response.status === 404) return [];

    if (!response.ok) {
      if (import.meta.env.DEV) {
        console.error('[postcodeService] gp search failed', {
          postcode: logPostcode,
          status: response.status,
          body: response.text
        });
      }

      throw new PostcodeLookupError(
        response.status >= 500 ? 'server' : 'bad_response',
        `GP search failed with status ${response.status}`,
        { status: response.status }
      );
    }

    return response.json ?? [];
  } catch (err) {
    const durationMs = Math.round(performance.now() - startedAt);

    if (err instanceof DOMException && err.name === 'AbortError') {
      if (import.meta.env.DEV) {
        console.error('[postcodeService] gp search timeout', {
          postcode: logPostcode,
          timeout_ms: timeoutMs,
          duration_ms: durationMs
        });
      }
      void sendClientLog(apiBaseUrl, clientRequestId, {
        level: 'warn',
        message: 'gp search timeout',
        meta: {
          client_request_id: clientRequestId,
          postcode: logPostcode,
          timeout_ms: timeoutMs,
          duration_ms: durationMs,
          api_base_url_present: Boolean(apiBaseUrl)
        }
      });
      throw new PostcodeLookupError('timeout', 'Postcode lookup timed out');
    }

    const message = err instanceof Error ? err.message : String(err);
    if (import.meta.env.DEV) {
      console.error('[postcodeService] gp search error', {
        postcode: logPostcode,
        duration_ms: durationMs,
        message,
        err
      });
    }

    if (message.toLowerCase().includes('failed to fetch')) {
      void sendClientLog(apiBaseUrl, clientRequestId, {
        level: 'warn',
        message: 'gp search network error',
        meta: {
          client_request_id: clientRequestId,
          postcode: logPostcode,
          duration_ms: durationMs,
          api_base_url_present: Boolean(apiBaseUrl)
        }
      });
      throw new PostcodeLookupError('network', 'Network error while looking up postcode', {
        cause: err
      });
    }

    if (err instanceof PostcodeLookupError) throw err;
    throw new PostcodeLookupError('bad_response', 'Unexpected error while looking up postcode', {
      cause: err
    });
  }
}

export async function searchGpPracticesByName(name: string): Promise<GpPracticeSummary[]> {
  const trimmed = name.trim();
  if (!trimmed) return [];

  const apiBaseUrl = getApiBaseUrl();
  const requestUrl = buildRequestUrl(apiBaseUrl, '/api/gp-practices', { name: trimmed });
  const startedAt = performance.now();
  const clientRequestId = createClientRequestId();

  if (import.meta.env.DEV) {
    console.debug('[postcodeService] gp name search start', { q: trimmed, url: requestUrl });
    void sendClientLog(apiBaseUrl, clientRequestId, {
      level: 'debug',
      message: 'frontend -> backend request',
      meta: {
        client_request_id: clientRequestId,
        method: 'GET',
        url: requestUrl,
        timeout_ms: DEFAULT_TIMEOUT_MS,
        api_base_url_present: Boolean(apiBaseUrl)
      }
    });
  }

  const timeoutMs = DEFAULT_TIMEOUT_MS;
  try {
    const response = await fetchJsonWithTimeout<GpPracticeSummary[]>(requestUrl, {
      clientRequestId,
      timeoutMs
    });
    const durationMs = Math.round(performance.now() - startedAt);
    if (import.meta.env.DEV) {
      console.debug('[postcodeService] gp name search response', {
        q: trimmed,
        status: response.status,
        duration_ms: durationMs
      });
    }

    if (response.status === 404) return [];

    if (!response.ok) {
      if (import.meta.env.DEV) {
        console.error('[postcodeService] gp name search failed', {
          q: trimmed,
          status: response.status,
          body: response.text
        });
      }

      throw new PostcodeLookupError(
        response.status >= 500 ? 'server' : 'bad_response',
        `GP name search failed with status ${response.status}`,
        { status: response.status }
      );
    }

    return response.json ?? [];
  } catch (err) {
    throw toPostcodeLookupError(err, {
      timeout: 'GP search timed out',
      network: 'Network error while searching for GP practices',
      unexpected: 'Unexpected error while searching for GP practices'
    });
  }
}

export async function getIcbFromGpOds(odsCode: string): Promise<string | null> {
  const normalized = normalizeUpperTrim(odsCode);
  if (!normalized) return null;

  const apiBaseUrl = getApiBaseUrl();
  const requestUrl = buildRequestUrl(apiBaseUrl, '/api/gp-icb', { odsCode: normalized });
  const startedAt = performance.now();
  const clientRequestId = createClientRequestId();
  const timeoutMs = DEFAULT_TIMEOUT_MS;

  try {
    const response = await fetchJsonWithTimeout<{ icbCode: string }>(requestUrl, {
      clientRequestId,
      timeoutMs
    });
    const durationMs = Math.round(performance.now() - startedAt);
    if (import.meta.env.DEV) {
      console.debug('[postcodeService] gp icb response', {
        odsCode: normalized,
        status: response.status,
        duration_ms: durationMs
      });
    }
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new PostcodeLookupError(
        response.status >= 500 ? 'server' : 'bad_response',
        `GP -> ICB lookup failed with status ${response.status}`,
        { status: response.status }
      );
    }
    return response.json?.icbCode ?? null;
  } catch (err) {
    throw toPostcodeLookupError(err, {
      timeout: 'GP -> ICB lookup timed out',
      network: 'Network error while looking up GP ICB mapping',
      unexpected: 'Unexpected error while resolving GP ICB mapping'
    });
  }
}

export async function lookupICBPolicyByIcbCode(icbCode: string): Promise<ICBPolicy | null> {
  const normalized = normalizeUpperTrim(icbCode);
  if (!normalized) return null;

  const apiBaseUrl = getApiBaseUrl();
  const requestUrl = buildRequestUrl(apiBaseUrl, '/api/icb-policy', { icbCode: normalized });
  const startedAt = performance.now();
  const clientRequestId = createClientRequestId();
  const timeoutMs = DEFAULT_TIMEOUT_MS;

  try {
    const response = await fetchJsonWithTimeout<ICBPolicy>(requestUrl, {
      clientRequestId,
      timeoutMs
    });
    const durationMs = Math.round(performance.now() - startedAt);
    if (import.meta.env.DEV) {
      console.debug('[postcodeService] icb policy response', {
        icbCode: normalized,
        status: response.status,
        duration_ms: durationMs
      });
    }

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new PostcodeLookupError(
        response.status >= 500 ? 'server' : 'bad_response',
        `ICB policy lookup failed with status ${response.status}`,
        { status: response.status }
      );
    }
    return response.json ?? null;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new PostcodeLookupError('timeout', 'ICB policy lookup timed out');
    }
    throw toPostcodeLookupError(err, {
      timeout: 'ICB policy lookup timed out',
      network: 'Network error while looking up ICB policy',
      unexpected: 'Unexpected error while looking up ICB policy'
    });
  }
}
