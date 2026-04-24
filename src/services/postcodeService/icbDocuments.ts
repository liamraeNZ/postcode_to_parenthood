import { DEFAULT_TIMEOUT_MS, getApiBaseUrl } from './config';
import { PostcodeLookupError, toPostcodeLookupError } from './errors';
import { fetchJsonWithTimeout, buildRequestUrl } from './http';
import { createClientRequestId } from './logging';
import { normalizeUpperTrim } from './normalize';

export interface IcbDocumentFile {
  name: string;
  key: string;
  size: number;
}

export interface IcbDocumentYear {
  year: string;
  files: IcbDocumentFile[];
}

export interface IcbDocumentsResponse {
  icbCode: string;
  folder: string;
  documents: IcbDocumentYear[];
}

export async function fetchIcbDocuments(icbCode: string): Promise<IcbDocumentsResponse | null> {
  const normalized = normalizeUpperTrim(icbCode);
  if (!normalized) return null;

  const apiBaseUrl = getApiBaseUrl();
  const requestUrl = buildRequestUrl(apiBaseUrl, '/api/icb-documents', { icbCode: normalized });
  const clientRequestId = createClientRequestId();

  try {
    const response = await fetchJsonWithTimeout<IcbDocumentsResponse>(requestUrl, {
      clientRequestId,
      timeoutMs: DEFAULT_TIMEOUT_MS,
    });

    if (!response.ok) {
      throw new PostcodeLookupError(
        response.status >= 500 ? 'server' : 'bad_response',
        `ICB documents lookup failed with status ${response.status}`,
        { status: response.status }
      );
    }

    return response.json ?? null;
  } catch (err) {
    if (err instanceof PostcodeLookupError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new PostcodeLookupError('timeout', 'ICB documents lookup timed out');
    }
    throw toPostcodeLookupError(err, {
      timeout: 'ICB documents lookup timed out',
      network: 'Network error while looking up ICB documents',
      unexpected: 'Unexpected error while looking up ICB documents',
    });
  }
}

export function getDocumentDownloadUrl(key: string): string {
  const apiBaseUrl = getApiBaseUrl();
  return `${apiBaseUrl}/api/icb-documents/download?key=${encodeURIComponent(key)}`;
}
