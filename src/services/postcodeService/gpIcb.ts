import { DEFAULT_TIMEOUT_MS, getApiBaseUrl } from './config';
import { PostcodeLookupError, toPostcodeLookupError } from './errors';
import { fetchJsonWithTimeout, buildRequestUrl } from './http';
import { createClientRequestId } from './logging';
import { normalizePostcode, normalizeUpperTrim, redactPostcodeForLogs } from './normalize';

export async function getIcbFromGpPractice(gp: {
  odsCode: string;
  postcode?: string | null | undefined;
}): Promise<string | null> {
  const normalizedPostcode = gp.postcode ? normalizePostcode(gp.postcode) : '';
  const normalizedOds = normalizeUpperTrim(gp.odsCode);
  if (!normalizedPostcode && !normalizedOds) return null;

  const apiBaseUrl = getApiBaseUrl();
  const requestUrl = buildRequestUrl(
    apiBaseUrl,
    '/api/gp-icb',
    normalizedPostcode ? { postcode: normalizedPostcode } : { odsCode: normalizedOds }
  );
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
        odsCode: normalizedOds,
        postcode: normalizedPostcode ? redactPostcodeForLogs(normalizedPostcode) : undefined,
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
