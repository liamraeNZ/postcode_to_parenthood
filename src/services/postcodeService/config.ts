const DEFAULT_TIMEOUT_MS = 10_000;

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

export { DEFAULT_TIMEOUT_MS, getApiBaseUrl };
