export function buildRequestUrl(apiBaseUrl: string, path: string, query: Record<string, string>) {
  const qs = new URLSearchParams(query).toString();
  return qs ? `${apiBaseUrl}${path}?${qs}` : `${apiBaseUrl}${path}`;
}

export async function fetchJsonWithTimeout<T>(
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
