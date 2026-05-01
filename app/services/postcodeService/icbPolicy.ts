import type { ICBPoliciesResponse } from '@/types';
import { DEFAULT_TIMEOUT_MS, getApiBaseUrl } from './config';
import { PostcodeLookupError, toPostcodeLookupError } from './errors';
import { fetchJsonWithTimeout, buildRequestUrl } from './http';
import { createClientRequestId } from './logging';
import { normalizeUpperTrim } from './normalize';

export async function lookupICBPoliciesByIcbCode(icbCode: string): Promise<ICBPoliciesResponse | null> {
  const normalized = normalizeUpperTrim(icbCode);
  if (!normalized) return null;

  const apiBaseUrl = getApiBaseUrl();
  const requestUrl = buildRequestUrl(apiBaseUrl, '/api/icb-policy', { icbCode: normalized });
  const clientRequestId = createClientRequestId();

  try {
    const response = await fetchJsonWithTimeout<ICBPoliciesResponse>(requestUrl, {
      clientRequestId,
      timeoutMs: DEFAULT_TIMEOUT_MS
    });

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
