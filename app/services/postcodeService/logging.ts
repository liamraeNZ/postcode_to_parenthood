export type ClientLogLevel = 'debug' | 'info' | 'warn' | 'error';

export function createClientRequestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

export function redactRequestUrlForLogs(requestUrl: string, redactedPostcode: string) {
  return requestUrl.replace(/([?&]postcode=)[^&]*/i, `$1${encodeURIComponent(redactedPostcode)}`);
}

export async function sendClientLog(
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
