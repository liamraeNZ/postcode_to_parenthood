import {
  fetchWithTimeout,
  getNumberPath,
  getPath,
  getStringPath,
  log,
  normalizeOdsCode,
  normalizePostcode
} from '../lib';

const POSTCODES_IO_BASE_URL = 'https://api.postcodes.io';

async function fetchPostcodesIoJson(url: string, ctx: { requestId: string; timeoutMs: number }) {
  const startedAt = Date.now();
  let response: Response;
  try {
    response = await fetchWithTimeout(
      url,
      {
        headers: {
          accept: 'application/json'
        }
      },
      ctx.timeoutMs
    );
  } catch (err) {
    log('error', 'upstream fetch failed', {
      request_id: ctx.requestId,
      upstream: 'postcodes.io',
      url,
      duration_ms: Date.now() - startedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
    });
    throw err;
  }

  log('debug', 'upstream response', {
    request_id: ctx.requestId,
    upstream: 'postcodes.io',
    status: response.status,
    duration_ms: Date.now() - startedAt
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`postcodes.io error: ${response.status} ${text ? `(${text.slice(0, 200)})` : ''}`.trim());
  }

  try {
    return (await response.json()) as unknown;
  } catch (err) {
    log('error', 'upstream returned invalid JSON', {
      request_id: ctx.requestId,
      upstream: 'postcodes.io',
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
    });
    throw new Error('postcodes.io invalid JSON');
  }
}

export type PostcodesIoAdminLookup = {
  postcode: string;
  country: string | null;
  icb: string | null;
  ccg: string | null;
  ccg_id: string | null;
  nhs_ha: string | null;
  primary_care_trust: string | null;
};

export async function lookupPostcodeGeo(
  postcode: string,
  ctx: { requestId: string }
): Promise<{ outcode: string; latitude: number; longitude: number } | null> {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  try {
    const url = `${POSTCODES_IO_BASE_URL}/postcodes/${encodeURIComponent(normalized)}`;
    const json = await fetchPostcodesIoJson(url, { requestId: ctx.requestId, timeoutMs: 4_000 });
    const status = getNumberPath(json, ['status']);
    if (status !== 200) return null;
    const outcode = getStringPath(json, ['result', 'outcode']);
    const latitude = getNumberPath(json, ['result', 'latitude']);
    const longitude = getNumberPath(json, ['result', 'longitude']);
    if (!outcode || latitude == null || longitude == null) return null;
    return { outcode, latitude, longitude };
  } catch {
    return null;
  }
}

export async function lookupPostcodeAdminLookup(
  postcode: string,
  ctx: { requestId: string }
): Promise<PostcodesIoAdminLookup | null> {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  try {
    const url = `${POSTCODES_IO_BASE_URL}/postcodes/${encodeURIComponent(normalized)}`;
    const json = await fetchPostcodesIoJson(url, { requestId: ctx.requestId, timeoutMs: 4_000 });
    const status = getNumberPath(json, ['status']);
    if (status !== 200) return null;

    const resolvedPostcode = getStringPath(json, ['result', 'postcode']) ?? normalized;
    const country = getStringPath(json, ['result', 'country']);
    const icb = getStringPath(json, ['result', 'icb']);
    const ccg = getStringPath(json, ['result', 'ccg']);
    const ccg_id =
      getStringPath(json, ['result', 'codes', 'ccg_id']) ?? getStringPath(json, ['result', 'codes', 'ccg']);
    const nhs_ha = getStringPath(json, ['result', 'nhs_ha']);
    const primary_care_trust = getStringPath(json, ['result', 'primary_care_trust']);

    return {
      postcode: resolvedPostcode,
      country: country?.trim() ? country : null,
      icb: icb?.trim() ? icb : null,
      ccg: ccg?.trim() ? ccg : null,
      ccg_id: ccg_id?.trim() ? ccg_id : null,
      nhs_ha: nhs_ha?.trim() ? nhs_ha : null,
      primary_care_trust: primary_care_trust?.trim() ? primary_care_trust : null
    };
  } catch {
    return null;
  }
}

export async function lookupNearestOutcodes(
  outcode: string,
  ctx: { requestId: string; radiusMeters: number; limit: number }
) {
  const normalized = normalizeOdsCode(outcode);
  if (!normalized) return [];

  try {
    const url = `${POSTCODES_IO_BASE_URL}/outcodes/${encodeURIComponent(
      normalized
    )}/nearest?radius=${encodeURIComponent(String(ctx.radiusMeters))}&limit=${encodeURIComponent(
      String(ctx.limit)
    )}`;
    const json = await fetchPostcodesIoJson(url, { requestId: ctx.requestId, timeoutMs: 4_000 });
    const status = getNumberPath(json, ['status']);
    if (status !== 200) return [];
    const result = getPath(json, ['result']);
    if (!Array.isArray(result)) return [];
    return result
      .map((entry) => getStringPath(entry, ['outcode']))
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeOdsCode(value))
      .filter((value) => Boolean(value) && value !== normalized);
  } catch {
    return [];
  }
}

export async function bulkLookupPostcodeGeos(postcodes: string[], ctx: { requestId: string }) {
  const unique = Array.from(new Set(postcodes.map((p) => normalizePostcode(p)).filter(Boolean)));
  const geos = new Map<string, { latitude: number; longitude: number }>();
  if (unique.length === 0) return geos;

  for (let offset = 0; offset < unique.length; offset += 100) {
    const batch = unique.slice(offset, offset + 100);
    const startedAt = Date.now();
    let response: Response;
    try {
      response = await fetchWithTimeout(
        `${POSTCODES_IO_BASE_URL}/postcodes`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({ postcodes: batch })
        },
        4_000
      );
    } catch (err) {
      log('error', 'upstream fetch failed', {
        request_id: ctx.requestId,
        upstream: 'postcodes.io',
        url: `${POSTCODES_IO_BASE_URL}/postcodes`,
        duration_ms: Date.now() - startedAt,
        err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
      });
      continue;
    }

    log('debug', 'upstream response', {
      request_id: ctx.requestId,
      upstream: 'postcodes.io',
      status: response.status,
      duration_ms: Date.now() - startedAt
    });

    if (!response.ok) continue;

    let json: unknown;
    try {
      json = (await response.json()) as unknown;
    } catch {
      continue;
    }

    const status = getNumberPath(json, ['status']);
    if (status !== 200) continue;
    const result = getPath(json, ['result']);
    if (!Array.isArray(result)) continue;

    for (const entry of result) {
      const query = getStringPath(entry, ['query']);
      const postcode = getStringPath(entry, ['result', 'postcode']) ?? query;
      const latitude = getNumberPath(entry, ['result', 'latitude']);
      const longitude = getNumberPath(entry, ['result', 'longitude']);
      if (!postcode || latitude == null || longitude == null) continue;
      geos.set(normalizePostcode(postcode), { latitude, longitude });
    }
  }

  return geos;
}
