import type { GpPracticeSummary } from '@/types';
import { DEFAULT_TIMEOUT_MS, getApiBaseUrl } from './config';
import { PostcodeLookupError, toPostcodeLookupError } from './errors';
import { fetchJsonWithTimeout, buildRequestUrl } from './http';
import { createClientRequestId, redactRequestUrlForLogs, sendClientLog } from './logging';
import { normalizePostcode, redactPostcodeForLogs } from './normalize';

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
