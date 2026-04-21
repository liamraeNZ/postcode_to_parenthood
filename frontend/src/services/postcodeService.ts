import { ICBPolicy } from '../types';

function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

function redactPostcodeForLogs(normalizedPostcode: string) {
  if (!normalizedPostcode) return '';
  const visible = normalizedPostcode.slice(0, Math.min(3, normalizedPostcode.length));
  return `${visible}${'*'.repeat(Math.max(0, normalizedPostcode.length - visible.length))}`;
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
    console.warn(
      '[postcodeService] VITE_API_BASE_URL is empty; using relative /api/... requests'
    );
  }

  const requestUrl = `${apiBaseUrl}/api/icb-policy?postcode=${encodeURIComponent(normalized)}`;
  const startedAt = performance.now();
  const logPostcode = redactPostcodeForLogs(normalized);
  console.debug('[postcodeService] lookup start', { postcode: logPostcode, url: requestUrl });

  const controller = new AbortController();
  const timeoutMs = 10_000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(requestUrl, { signal: controller.signal });
    const durationMs = Math.round(performance.now() - startedAt);
    console.debug('[postcodeService] lookup response', {
      postcode: logPostcode,
      status: response.status,
      duration_ms: durationMs
    });

    if (response.status === 404) return null;

    if (!response.ok) {
      let responseBodyText: string | null = null;
      try {
        responseBodyText = await response.text();
      } catch (err) {
        console.debug('[postcodeService] failed to read error body', { postcode: logPostcode, err });
      }

      console.error('[postcodeService] lookup failed', {
        postcode: logPostcode,
        status: response.status,
        body: responseBodyText
      });

      throw new PostcodeLookupError(
        response.status >= 500 ? 'server' : 'bad_response',
        `Postcode lookup failed with status ${response.status}`,
        { status: response.status }
      );
    }

    try {
      return (await response.json()) as ICBPolicy;
    } catch (err) {
      console.error('[postcodeService] invalid JSON response', { postcode: logPostcode, err });
      throw new PostcodeLookupError(
        'bad_response',
        'Postcode lookup returned invalid JSON',
        { cause: err }
      );
    }
  } catch (err) {
    const durationMs = Math.round(performance.now() - startedAt);

    if (err instanceof DOMException && err.name === 'AbortError') {
      console.error('[postcodeService] lookup timeout', {
        postcode: logPostcode,
        timeout_ms: timeoutMs,
        duration_ms: durationMs
      });
      throw new PostcodeLookupError('timeout', 'Postcode lookup timed out');
    }

    const message = err instanceof Error ? err.message : String(err);
    console.error('[postcodeService] lookup error', {
      postcode: logPostcode,
      duration_ms: durationMs,
      message,
      err
    });

    if (message.toLowerCase().includes('failed to fetch')) {
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
