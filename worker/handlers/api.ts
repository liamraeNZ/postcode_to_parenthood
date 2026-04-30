import type { Env } from '../types';
import {
  haversineDistanceMeters,
  isReasonableOrgNameInput,
  isReasonablePostcodeInput,
  isRecord,
  jsonResponse,
  log,
  normalizeOdsCode,
  normalizePostcode,
  readJsonBody,
  requestId,
  sanitizeSearchParams
} from '../lib';
import { checkBasicAuth } from '../auth';
import { lookupAllIcbPoliciesByIcbCode, resolveIcbIdFromPostcodesIo, resolveDocumentFolder } from '../services/icbPolicy';
import {
  fetchGpPracticesForOutcode,
  getFallbackOutcodeFromPostcode,
  getIcbFromGpOds,
  searchGpPracticesByName
} from '../services/ord';
import {
  bulkLookupPostcodeGeos,
  lookupNearestOutcodes,
  lookupPostcodeAdminLookup,
  lookupPostcodeGeo
} from '../services/postcodesIo';
import {
  listIcbs,
  createIcb,
  updateIcb,
  listPoliciesForIcb,
  createPolicy,
  type ConflictError
} from '../services/adminService';

const GP_SEARCH_NEAREST_OUTCODE_RADIUS_M = 7000;
const GP_SEARCH_NEAREST_OUTCODE_LIMIT = 10;
const GP_SEARCH_MAX_DISTANCE_M = 3500;
const GP_SEARCH_MAX_CANDIDATES = 250;
const GP_SEARCH_MAX_RESULTS = 10;
const GP_NAME_SEARCH_LIMIT = 40;

export async function handleApiRequest(request: Request, env: Env) {
  const reqId = requestId();
  const startedAt = Date.now();
  const url = new URL(request.url);
  const clientRequestId = request.headers.get('x-client-request-id') || undefined;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  let response: Response | undefined;
  try {
    log('info', 'request start', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname
    });

    log('debug', 'request details', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname,
      query: sanitizeSearchParams(url.searchParams)
    });

    if (url.pathname === '/api/gp-practices' && request.method === 'GET') {
      const postcode = url.searchParams.get('postcode') || url.searchParams.get('Postcode');
      const name = url.searchParams.get('name');

      if (name != null) {
        if (!isReasonableOrgNameInput(name)) {
          response = jsonResponse(
            { error: 'Invalid name. Use at least 3 characters.', request_id: reqId },
            { status: 400 }
          );
          return response;
        }

        const out = await searchGpPracticesByName(name, { requestId: reqId, limit: GP_NAME_SEARCH_LIMIT });
        if (out.length === 0) {
          response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
          return response;
        }

        response = jsonResponse(out);
        return response;
      }

      if (!postcode) {
        response = jsonResponse({ error: 'Missing postcode', request_id: reqId }, { status: 400 });
        return response;
      }
      if (!isReasonablePostcodeInput(postcode)) {
        response = jsonResponse({ error: 'Invalid postcode', request_id: reqId }, { status: 400 });
        return response;
      }

      const fallbackOutcode = getFallbackOutcodeFromPostcode(postcode);
      const geo = await lookupPostcodeGeo(postcode, { requestId: reqId });
      const seedOutcode = normalizeOdsCode(geo?.outcode ?? fallbackOutcode);

      const nearestOutcodes = await lookupNearestOutcodes(seedOutcode, {
        requestId: reqId,
        radiusMeters: GP_SEARCH_NEAREST_OUTCODE_RADIUS_M,
        limit: GP_SEARCH_NEAREST_OUTCODE_LIMIT
      });
      const outcodesToQuery = Array.from(new Set([seedOutcode, ...nearestOutcodes]))
        .filter(Boolean)
        .slice(0, GP_SEARCH_NEAREST_OUTCODE_LIMIT);

      const settled = await Promise.allSettled(
        outcodesToQuery.map((outcode) => fetchGpPracticesForOutcode(outcode, { requestId: reqId }))
      );

      const byOds = new Map<string, { odsCode: string; name: string; postcode?: string; orgLink?: string }>();
      for (const result of settled) {
        if (result.status !== 'fulfilled') continue;
        for (const practice of result.value) {
          if (!byOds.has(practice.odsCode)) byOds.set(practice.odsCode, practice);
        }
      }

      const merged = Array.from(byOds.values());
      if (merged.length === 0) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      let candidates = merged;
      if (candidates.length > GP_SEARCH_MAX_CANDIDATES) {
        const seedFirst = candidates.filter((p) => normalizePostcode(p.postcode ?? '').startsWith(seedOutcode));
        const others = candidates.filter((p) => !normalizePostcode(p.postcode ?? '').startsWith(seedOutcode));
        candidates = [...seedFirst, ...others].slice(0, GP_SEARCH_MAX_CANDIDATES);
      }

      let ranked = candidates;
      if (geo) {
        const geos = await bulkLookupPostcodeGeos(
          candidates.map((p) => p.postcode).filter((p): p is string => Boolean(p)),
          { requestId: reqId }
        );

        const scored = candidates.map((practice) => {
          const geoKey = normalizePostcode(practice.postcode ?? '');
          const practiceGeo = geos.get(geoKey);
          const distanceMeters = practiceGeo ? haversineDistanceMeters(geo, practiceGeo) : null;
          return { practice, distanceMeters };
        });

        const within = scored.filter(
          (entry) => entry.distanceMeters == null || entry.distanceMeters <= GP_SEARCH_MAX_DISTANCE_M
        );

        within.sort((a, b) => {
          const aDist = a.distanceMeters ?? Number.POSITIVE_INFINITY;
          const bDist = b.distanceMeters ?? Number.POSITIVE_INFINITY;
          if (aDist !== bDist) return aDist - bDist;
          return a.practice.name.localeCompare(b.practice.name);
        });

        ranked = within.map((entry) => entry.practice);
      } else {
        ranked = candidates.slice().sort((a, b) => a.name.localeCompare(b.name));
      }

      response = jsonResponse(ranked.slice(0, GP_SEARCH_MAX_RESULTS));
      return response;
    }

    if (url.pathname === '/api/gp-icb' && request.method === 'GET') {
      const postcode = url.searchParams.get('postcode');
      const odsCode = url.searchParams.get('odsCode');
      if (postcode) {
        if (!isReasonablePostcodeInput(postcode)) {
          response = jsonResponse({ error: 'Invalid postcode', request_id: reqId }, { status: 400 });
          return response;
        }

        const admin = await lookupPostcodeAdminLookup(postcode, { requestId: reqId });
        if (!admin) {
          response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
          return response;
        }

        const resolved = await resolveIcbIdFromPostcodesIo(env.DB, {
          icb: admin.icb,
          ccg_id: admin.ccg_id,
          ccg: admin.ccg
        });

        if (!resolved) {
          response = jsonResponse(
            {
              error: 'Not found',
              request_id: reqId,
              upstream: { icb: admin.icb, ccg_id: admin.ccg_id, ccg: admin.ccg }
            },
            { status: 404 }
          );
          return response;
        }

        response = jsonResponse({
          icbCode: resolved.icbId,
          matched_on: resolved.matched_on,
          upstream: { icb: admin.icb, ccg_id: admin.ccg_id, ccg: admin.ccg }
        });
        return response;
      }

      if (!odsCode) {
        response = jsonResponse({ error: 'Missing odsCode', request_id: reqId }, { status: 400 });
        return response;
      }

      const resolved = await getIcbFromGpOds(odsCode, { requestId: reqId });
      if (!resolved) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      let preferredIcbCode = resolved.icbCode;
      if (resolved.subIcbCode) {
        const exists = await env.DB.prepare('select 1 as ok from icbs where id = ?1 limit 1')
          .bind(resolved.subIcbCode)
          .first<{ ok: number }>();
        if (exists?.ok) preferredIcbCode = resolved.subIcbCode;
      }

      response = jsonResponse({ ...resolved, icbCode: preferredIcbCode });
      return response;
    }

    if (url.pathname === '/api/icb-policy' && request.method === 'GET') {
      const postcode = url.searchParams.get('postcode');
      if (postcode) {
        response = jsonResponse(
          { error: 'Use /api/gp-practices then /api/gp-icb then /api/icb-policy?icbCode=...', request_id: reqId },
          { status: 400 }
        );
        return response;
      }

      const icbCode = url.searchParams.get('icbCode');
      if (!icbCode) {
        response = jsonResponse({ error: 'Missing icbCode', request_id: reqId }, { status: 400 });
        return response;
      }

      const result = await lookupAllIcbPoliciesByIcbCode(env.DB, icbCode);
      if (!result) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      response = jsonResponse(result);
      return response;
    }

    if (url.pathname === '/api/icb-documents' && request.method === 'GET') {
      const icbCode = url.searchParams.get('icbCode');
      if (!icbCode) {
        response = jsonResponse({ error: 'Missing icbCode', request_id: reqId }, { status: 400 });
        return response;
      }

      const folder = await resolveDocumentFolder(env.DB, icbCode);
      if (!folder) {
        response = jsonResponse({ documents: [], request_id: reqId });
        return response;
      }

      const prefix = `policies/${folder}/`;

      // List all objects under this ICB's folder (no delimiter — flat list)
      const allObjects: { key: string; size: number }[] = [];
      let cursor: string | undefined;
      let truncated = true;
      while (truncated) {
        const listed = await env.r2bucket.list({ prefix, cursor });
        for (const obj of listed.objects) {
          allObjects.push({ key: obj.key, size: obj.size });
        }
        truncated = listed.truncated;
        cursor = listed.cursor;
      }

      // Group by year extracted from the key path: policies/{folder}/{year}/{filename}
      const byYear = new Map<string, { name: string; key: string; size: number }[]>();
      for (const obj of allObjects) {
        const parts = obj.key.slice(prefix.length).split('/');
        if (parts.length < 2) continue; // skip if not in a year subfolder
        const year = parts[0];
        if (!/^\d{4}$/.test(year)) continue;
        const name = parts.slice(1).join('/');
        if (!byYear.has(year)) byYear.set(year, []);
        byYear.get(year)!.push({ name, key: obj.key, size: obj.size });
      }

      // Sort years descending (most recent first)
      const documentsByYear = [...byYear.entries()]
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([year, files]) => ({ year, files }));

      response = jsonResponse({ icbCode, folder, documents: documentsByYear, request_id: reqId });
      return response;
    }

    if (url.pathname === '/api/icb-documents/download' && request.method === 'GET') {
      const key = url.searchParams.get('key');
      if (!key || !key.startsWith('policies/')) {
        response = jsonResponse({ error: 'Missing or invalid key', request_id: reqId }, { status: 400 });
        return response;
      }

      const object = await env.r2bucket.get(key);
      if (!object) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }

      const filename = key.split('/').pop() || 'document';
      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
      headers.set('Content-Disposition', `inline; filename="${filename}"`);
      headers.set('Content-Length', String(object.size));
      headers.set('Cache-Control', 'public, max-age=86400');

      response = new Response(object.body, { headers });
      return response;
    }

    if (url.pathname === '/api/admin/icbs' && request.method === 'GET') {
      const authErr = checkBasicAuth(request, env);
      if (authErr) { response = authErr; return response; }

      const icbs = await listIcbs(env.DB);
      response = jsonResponse({ icbs, request_id: reqId });
      return response;
    }

    if (url.pathname === '/api/admin/icbs' && request.method === 'POST') {
      const authErr = checkBasicAuth(request, env);
      if (authErr) { response = authErr; return response; }

      const body = await readJsonBody(request, { maxBytes: 100_000 });
      if (!body.ok) {
        response = jsonResponse({ error: body.error, request_id: reqId }, { status: 400 });
        return response;
      }
      if (!isRecord(body.value)) {
        response = jsonResponse({ error: 'Invalid payload', request_id: reqId }, { status: 400 });
        return response;
      }

      const { id, name } = body.value;
      if (typeof id !== 'string' || id.trim() === '') {
        response = jsonResponse({ error: 'Missing required field: id', request_id: reqId }, { status: 400 });
        return response;
      }
      if (typeof name !== 'string' || name.trim() === '') {
        response = jsonResponse({ error: 'Missing required field: name', request_id: reqId }, { status: 400 });
        return response;
      }

      try {
        const icb = await createIcb(env.DB, {
          id: id.trim(),
          name: name.trim(),
          sub_icb_code: typeof body.value.sub_icb_code === 'string' ? body.value.sub_icb_code : null,
          parent_icb_code: typeof body.value.parent_icb_code === 'string' ? body.value.parent_icb_code : null,
          region: typeof body.value.region === 'string' ? body.value.region : null,
          country: typeof body.value.country === 'string' ? body.value.country : null,
        });
        response = jsonResponse({ icb, request_id: reqId }, { status: 201 });
        return response;
      } catch (err) {
        if (isRecord(err) && (err as unknown as ConflictError).type === 'conflict') {
          const conflict = err as unknown as ConflictError;
          response = jsonResponse({ error: conflict.message, request_id: reqId }, { status: 409 });
          return response;
        }
        throw err;
      }
    }

    if (url.pathname.startsWith('/api/admin/icbs/') && !url.pathname.includes('/policies') && request.method === 'PATCH') {
      const authErr = checkBasicAuth(request, env);
      if (authErr) { response = authErr; return response; }

      const id = url.pathname.slice('/api/admin/icbs/'.length);

      const body = await readJsonBody(request, { maxBytes: 100_000 });
      if (!body.ok) {
        response = jsonResponse({ error: body.error, request_id: reqId }, { status: 400 });
        return response;
      }
      if (!isRecord(body.value)) {
        response = jsonResponse({ error: 'Invalid payload', request_id: reqId }, { status: 400 });
        return response;
      }

      const data: Record<string, unknown> = {};
      if (typeof body.value.name === 'string') data.name = body.value.name;
      if ('region' in body.value) data.region = typeof body.value.region === 'string' ? body.value.region : null;
      if ('country' in body.value) data.country = typeof body.value.country === 'string' ? body.value.country : null;
      if ('sub_icb_code' in body.value) data.sub_icb_code = typeof body.value.sub_icb_code === 'string' ? body.value.sub_icb_code : null;
      if ('parent_icb_code' in body.value) data.parent_icb_code = typeof body.value.parent_icb_code === 'string' ? body.value.parent_icb_code : null;
      if (body.value.status === 'active' || body.value.status === 'inactive') data.status = body.value.status;

      const icb = await updateIcb(env.DB, id, data);
      if (!icb) {
        response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
        return response;
      }
      response = jsonResponse({ icb, request_id: reqId });
      return response;
    }

    {
      const policiesMatch = url.pathname.match(/^\/api\/admin\/icbs\/([^/]+)\/policies$/);
      if (policiesMatch && request.method === 'GET') {
        const authErr = checkBasicAuth(request, env);
        if (authErr) { response = authErr; return response; }

        const icbId = policiesMatch[1];
        const policies = await listPoliciesForIcb(env.DB, icbId);
        response = jsonResponse({ policies, request_id: reqId });
        return response;
      }

      if (policiesMatch && request.method === 'POST') {
        const authErr = checkBasicAuth(request, env);
        if (authErr) { response = authErr; return response; }

        const icbId = policiesMatch[1];

        const body = await readJsonBody(request, { maxBytes: 100_000 });
        if (!body.ok) {
          response = jsonResponse({ error: body.error, request_id: reqId }, { status: 400 });
          return response;
        }
        if (!isRecord(body.value)) {
          response = jsonResponse({ error: 'Invalid payload', request_id: reqId }, { status: 400 });
          return response;
        }

        const { cycles_offered, max_age, iui_rounds_required, living_children_rule } = body.value;
        if (typeof cycles_offered !== 'number') {
          response = jsonResponse({ error: 'Missing required field: cycles_offered', request_id: reqId }, { status: 400 });
          return response;
        }
        if (typeof max_age !== 'number') {
          response = jsonResponse({ error: 'Missing required field: max_age', request_id: reqId }, { status: 400 });
          return response;
        }
        if (typeof iui_rounds_required !== 'number') {
          response = jsonResponse({ error: 'Missing required field: iui_rounds_required', request_id: reqId }, { status: 400 });
          return response;
        }
        if (typeof living_children_rule !== 'string' || living_children_rule.trim() === '') {
          response = jsonResponse({ error: 'Missing required field: living_children_rule', request_id: reqId }, { status: 400 });
          return response;
        }

        try {
          const policy = await createPolicy(env.DB, icbId, {
            cycles_offered,
            max_age,
            iui_rounds_required,
            living_children_rule,
            effective_from: typeof body.value.effective_from === 'string' ? body.value.effective_from : null,
            effective_to: typeof body.value.effective_to === 'string' ? body.value.effective_to : null,
            bmi_min: typeof body.value.bmi_min === 'number' ? body.value.bmi_min : null,
            bmi_max: typeof body.value.bmi_max === 'number' ? body.value.bmi_max : null,
            endometriosis_priority_access: body.value.endometriosis_priority_access === true,
            smoking_restricted: body.value.smoking_restricted !== false,
            source_url: typeof body.value.source_url === 'string' ? body.value.source_url : null,
          });
          response = jsonResponse({ policy, request_id: reqId }, { status: 201 });
          return response;
        } catch (err) {
          if (isRecord(err) && (err as unknown as ConflictError).type === 'conflict') {
            const conflict = err as unknown as ConflictError;
            response = jsonResponse({ error: conflict.message, request_id: reqId }, { status: 409 });
            return response;
          }
          throw err;
        }
      }
    }

    if (url.pathname === '/api/map-data' && request.method === 'GET') {
      const { results } = await env.DB.prepare(`
        select
          i.id as icb_id,
          i.name as icb_name,
          p.treatment_type_id,
          p.cycles_offered
        from icb_policies p
        join icbs i on i.id = p.icb_id
        join treatment_types t on t.id = p.treatment_type_id
        where i.status = 'active'
          and p.effective_from <= date('now')
          and (p.effective_to is null or p.effective_to >= date('now'))
      `).bind().all<{
        icb_id: string;
        icb_name: string;
        treatment_type_id: string;
        cycles_offered: number;
      }>();

      response = jsonResponse({ data: results, request_id: reqId });
      return response;
    }

    if (url.pathname === '/api/client-log' && request.method === 'POST') {
      const body = await readJsonBody(request, { maxBytes: 10_000 });
      if (!body.ok) {
        response = jsonResponse(
          { error: body.error, request_id: reqId },
          { status: body.error === 'Body too large' ? 413 : 400 }
        );
        return response;
      }
      if (!isRecord(body.value)) {
        response = jsonResponse({ error: 'Invalid payload', request_id: reqId }, { status: 400 });
        return response;
      }

      const rawLevel = body.value.level;
      const level =
        rawLevel === 'debug' || rawLevel === 'info' || rawLevel === 'warn' || rawLevel === 'error'
          ? rawLevel
          : 'info';
      const message = typeof body.value.message === 'string' ? body.value.message : 'client log';
      const meta = isRecord(body.value.meta) ? body.value.meta : undefined;

      log(level, 'client log', {
        request_id: reqId,
        client_request_id: clientRequestId,
        client_message: message.slice(0, 400),
        client_meta: meta
      });

      response = jsonResponse({ ok: true, request_id: reqId });
      return response;
    }

    response = jsonResponse({ error: 'Not found', request_id: reqId }, { status: 404 });
    return response;
  } catch (err) {
    log('error', 'request failed', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname,
      duration_ms: Date.now() - startedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
    });
    response = jsonResponse({ error: 'Internal server error', request_id: reqId }, { status: 500 });
    return response;
  } finally {
    log('info', 'request end', {
      request_id: reqId,
      client_request_id: clientRequestId,
      method: request.method,
      path: url.pathname,
      status: response?.status,
      duration_ms: Date.now() - startedAt
    });
  }
}
