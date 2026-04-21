import type { ICBPolicy } from '../../types';
import { DEFAULT_TIMEOUT_MS, getApiBaseUrl } from './config';
import { PostcodeLookupError, toPostcodeLookupError } from './errors';
import { fetchJsonWithTimeout, buildRequestUrl } from './http';
import { createClientRequestId } from './logging';
import { normalizeUpperTrim } from './normalize';

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
