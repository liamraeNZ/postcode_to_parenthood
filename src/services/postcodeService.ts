import { ICBPolicy } from '../types';

function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
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

let didWarnMissingApiBaseUrl = false;

export async function lookupICBByPostcode(postcode: string): Promise<ICBPolicy | null> {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  if (!apiBaseUrl && !didWarnMissingApiBaseUrl) {
    didWarnMissingApiBaseUrl = true;
    if (import.meta.env.DEV) {
      console.warn(
        '[postcodeService] VITE_API_BASE_URL is empty; using relative /api/... requests'
      );
    }
  }

  const requestUrl = `${apiBaseUrl}/api/icb-policy?postcode=${encodeURIComponent(normalized)}`;
  const startedAt = performance.now();
  const clientRequestId = createClientRequestId();
  const logPostcode = redactPostcodeForLogs(normalized);
  const logRequestUrl = redactRequestUrlForLogs(requestUrl, logPostcode);
  if (import.meta.env.DEV) {
    console.debug('[postcodeService] lookup start', { postcode: logPostcode, url: requestUrl });
  }
  if (import.meta.env.DEV) {
    void sendClientLog(apiBaseUrl, clientRequestId, {
      level: 'debug',
      message: 'frontend -> backend request',
      meta: {
        client_request_id: clientRequestId,
        method: 'GET',
        url: logRequestUrl,
        timeout_ms: 10_000,
        api_base_url_present: Boolean(apiBaseUrl)
      }
    });
  }

  const controller = new AbortController();
  const timeoutMs = 10_000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(requestUrl, {
      signal: controller.signal,
      headers: { 'x-client-request-id': clientRequestId }
    });
    const durationMs = Math.round(performance.now() - startedAt);
    if (import.meta.env.DEV) {
      console.debug('[postcodeService] lookup response', {
        postcode: logPostcode,
        status: response.status,
        duration_ms: durationMs
      });
    }

    if (response.status === 404) return null;

    if (!response.ok) {
      let responseBodyText: string | null = null;
      try {
        responseBodyText = await response.text();
      } catch (err) {
        if (import.meta.env.DEV) {
          console.debug('[postcodeService] failed to read error body', {
            postcode: logPostcode,
            err
          });
        }
      }

      if (import.meta.env.DEV) {
        console.error('[postcodeService] lookup failed', {
          postcode: logPostcode,
          status: response.status,
          body: responseBodyText
        });
      }

      throw new PostcodeLookupError(
        response.status >= 500 ? 'server' : 'bad_response',
        `Postcode lookup failed with status ${response.status}`,
        { status: response.status }
      );
    }

    try {
      return (await response.json()) as ICBPolicy;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[postcodeService] invalid JSON response', { postcode: logPostcode, err });
      }
      throw new PostcodeLookupError(
        'bad_response',
        'Postcode lookup returned invalid JSON',
        { cause: err }
      );
    }
  } catch (err) {
    const durationMs = Math.round(performance.now() - startedAt);

    if (err instanceof DOMException && err.name === 'AbortError') {
      if (import.meta.env.DEV) {
        console.error('[postcodeService] lookup timeout', {
          postcode: logPostcode,
          timeout_ms: timeoutMs,
          duration_ms: durationMs
        });
      }
      void sendClientLog(apiBaseUrl, clientRequestId, {
        level: 'warn',
        message: 'postcode lookup timeout',
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
      console.error('[postcodeService] lookup error', {
        postcode: logPostcode,
        duration_ms: durationMs,
        message,
        err
      });
    }

    if (message.toLowerCase().includes('failed to fetch')) {
      void sendClientLog(apiBaseUrl, clientRequestId, {
        level: 'warn',
        message: 'postcode lookup network error',
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
  } finally {
    window.clearTimeout(timeoutId);
  }
}
