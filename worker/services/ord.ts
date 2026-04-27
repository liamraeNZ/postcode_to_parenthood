import { fetchWithTimeout, getPath, getStringPath, log, normalizeOdsCode, normalizePostcode } from '../lib';

export async function fetchOrdJson(url: string, ctx: { requestId: string; timeoutMs: number }) {
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
      upstream: 'spineservices.ord',
      url,
      duration_ms: Date.now() - startedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
    });
    throw err;
  }

  log('debug', 'upstream response', {
    request_id: ctx.requestId,
    upstream: 'spineservices.ord',
    status: response.status,
    duration_ms: Date.now() - startedAt
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`ORD error: ${response.status} ${text ? `(${text.slice(0, 200)})` : ''}`.trim());
  }

  try {
    return (await response.json()) as unknown;
  } catch (err) {
    log('error', 'upstream returned invalid JSON', {
      request_id: ctx.requestId,
      upstream: 'spineservices.ord',
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
    });
    throw new Error('ORD invalid JSON');
  }
}

function extractRelArray(json: unknown): unknown[] {
  const direct = getPath(json, ['Rels']);
  if (Array.isArray(direct)) return direct;
  const directRel = getPath(json, ['Rels', 'Rel']);
  if (Array.isArray(directRel)) return directRel;
  const orgRel = getPath(json, ['Organisation', 'Rels']);
  if (Array.isArray(orgRel)) return orgRel;
  const orgRelRel = getPath(json, ['Organisation', 'Rels', 'Rel']);
  if (Array.isArray(orgRelRel)) return orgRelRel;
  return [];
}

function extractTargetPrimaryRoleId(rel: unknown): string | null {
  return (
    getStringPath(rel, ['Target', 'PrimaryRoleId', 'id']) ??
    getStringPath(rel, ['Target', 'PrimaryRoleId']) ??
    getStringPath(rel, ['Target', 'Roles', 'Role', 'id'])
  );
}

function extractRelStatus(rel: unknown): string | null {
  return getStringPath(rel, ['Status']) ?? getStringPath(rel, ['Rel', 'Status']);
}

function extractRelTypeId(rel: unknown): string | null {
  return getStringPath(rel, ['id']) ?? getStringPath(rel, ['Rel', 'id']);
}

function extractTargetOrgCode(rel: unknown): string | null {
  return (
    getStringPath(rel, ['Target', 'OrgId', 'extension']) ??
    getStringPath(rel, ['Target', 'OrgId']) ??
    getStringPath(rel, ['Target', 'Organisation', 'OrgId', 'extension'])
  );
}

function findActiveRelationshipTarget(
  rels: unknown[],
  preferredRoleIds: string[]
): { icbCode: string; relationshipRoleId: string } | null {
  for (const roleId of preferredRoleIds) {
    for (const rel of rels) {
      const status = extractRelStatus(rel);
      if (status !== 'Active') continue;
      const targetRoleId = extractTargetPrimaryRoleId(rel);
      if (targetRoleId !== roleId) continue;
      const targetCode = extractTargetOrgCode(rel);
      if (!targetCode) continue;
      return { icbCode: targetCode, relationshipRoleId: roleId };
    }
  }
  return null;
}

function findActiveRelationshipTargetPreferredRelType(
  rels: unknown[],
  targetRoleId: string,
  preferredRelTypeIds: string[]
): { icbCode: string; relationshipRoleId: string } | null {
  const activeMatching = rels
    .map((rel) => {
      const status = extractRelStatus(rel);
      if (status !== 'Active') return null;
      const roleId = extractTargetPrimaryRoleId(rel);
      if (roleId !== targetRoleId) return null;
      const code = extractTargetOrgCode(rel);
      if (!code) return null;
      const relTypeId = extractRelTypeId(rel) ?? '';
      return { icbCode: code, relationshipRoleId: roleId, relTypeId };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  for (const pref of preferredRelTypeIds) {
    const found = activeMatching.find((x) => x.relTypeId === pref);
    if (found) return { icbCode: found.icbCode, relationshipRoleId: found.relationshipRoleId };
  }
  const first = activeMatching[0] ?? null;
  if (!first) return null;
  return { icbCode: first.icbCode, relationshipRoleId: first.relationshipRoleId };
}

export async function getIcbFromGpOds(odsCode: string, ctx: { requestId: string }) {
  const normalizedOds = normalizeOdsCode(odsCode);
  if (!normalizedOds) return null;

  const url = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${encodeURIComponent(
    normalizedOds
  )}`;
  const json = await fetchOrdJson(url, { requestId: ctx.requestId, timeoutMs: 8_000 });
  const rels = extractRelArray(json);

  const subIcb = findActiveRelationshipTargetPreferredRelType(rels, 'RO98', ['RE6', 'RE4']);

  const directToIcb = findActiveRelationshipTargetPreferredRelType(rels, 'RO261', ['RE5']);
  const direct = findActiveRelationshipTarget(rels, ['RO318', 'RO210']);

  let parentIcbCode: string | null = directToIcb?.icbCode ?? direct?.icbCode ?? null;

  if (!parentIcbCode && subIcb) {
    try {
      const intermediateUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${encodeURIComponent(
        subIcb.icbCode
      )}`;
      const intermediateJson = await fetchOrdJson(intermediateUrl, { requestId: ctx.requestId, timeoutMs: 8_000 });
      const intermediateRels = extractRelArray(intermediateJson);
      const mappedToIcb = findActiveRelationshipTargetPreferredRelType(intermediateRels, 'RO261', ['RE5']);
      parentIcbCode = mappedToIcb?.icbCode ?? null;
    } catch {
      parentIcbCode = null;
    }
  }

  if (!subIcb && !parentIcbCode) return null;

  return {
    icbCode: subIcb?.icbCode ?? parentIcbCode ?? '',
    relationshipRoleId: subIcb?.relationshipRoleId ?? directToIcb?.relationshipRoleId ?? direct?.relationshipRoleId ?? '',
    subIcbCode: subIcb?.icbCode ?? null,
    parentIcbCode
  };
}

export async function fetchGpPracticesForOutcode(outcode: string, ctx: { requestId: string }) {
  const normalized = normalizeOdsCode(outcode);
  if (!normalized) return [];

  const ordUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PostCode=${encodeURIComponent(
    normalized
  )}&PrimaryRoleId=RO177&Status=Active`;

  const json = await fetchOrdJson(ordUrl, { requestId: ctx.requestId, timeoutMs: 8_000 });
  const organisations = getPath(json, ['Organisations']);
  if (!Array.isArray(organisations) || organisations.length === 0) return [];

  return organisations
    .map((org) => {
      const odsCode = getStringPath(org, ['OrgId']) ?? getStringPath(org, ['OrgId', 'extension']);
      const name = getStringPath(org, ['Name']);
      if (!odsCode || !name) return null;
      const postCode = getStringPath(org, ['PostCode']) ?? undefined;
      const orgLink = getStringPath(org, ['OrgLink']) ?? undefined;
      return { odsCode, name, postcode: postCode, orgLink };
    })
    .filter((org): org is NonNullable<typeof org> => org !== null)
    .filter((org) => isLikelyGpPractice(org.name));
}

/**
 * Returns true if the organisation name looks like a GP practice or medical centre,
 * filtering out non-GP entities (e.g. substance abuse services, pharmacies, dental,
 * opticians, hospices, etc.) that share the RO177 prescribing role.
 */
function isLikelyGpPractice(name: string): boolean {
  const upper = name.toUpperCase();

  // Exclude known non-GP organisation types
  const excludePatterns = [
    'ALCOHOL',
    'SUBSTANCE',
    'DRUG SERVICE',
    'DRUG & ALCOHOL',
    'PHARMACY',
    'DENTAL',
    'OPTICIAN',
    'OPTIC',
    'HOSPICE',
    'HOSPITAL',
    'WALK-IN',
    'WALK IN',
    'URGENT CARE',
    'OUT OF HOURS',
    'OUT-OF-HOURS',
    'MINOR INJURIES',
    'PRISON',
    'HMP ',
    'CUSTODY',
    'IMMIGRATION',
    'HOMELESS',
    'REFUGEE',
    'ASYLUM',
    'SEXUAL HEALTH',
    'CONTRACEPTI',
    'FAMILY PLANNING',
    'DERMATOLOGY',
    'PHYSIOTHERAPY',
    'CHIROPOD',
    'PODIATRY',
    'COUNSELLING',
    'MENTAL HEALTH',
    'PSYCHIATR',
    'PSYCHOLOG',
    'COMMUNITY INTEREST',
    'NURSING HOME',
    'CARE HOME',
    'RESIDENTIAL',
  ];

  if (excludePatterns.some((pattern) => upper.includes(pattern))) {
    return false;
  }

  // Include if name contains common GP/medical centre indicators
  const includePatterns = [
    'SURGERY',
    'PRACTICE',
    'MEDICAL CENT',
    'HEALTH CENT',
    'GP ',
    'DOCTOR',
    'GROUP PRACTICE',
    'FAMILY HEALTH',
    'PRIMARY CARE',
    'MEDICAL GROUP',
    'CLINIC',
    'PARTNERS',
  ];

  return includePatterns.some((pattern) => upper.includes(pattern));
}

export async function searchGpPracticesByName(name: string, ctx: { requestId: string; limit: number }) {
  const trimmed = name.trim();
  if (!trimmed) return [];

  const ordUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Name=${encodeURIComponent(
    trimmed
  )}&PrimaryRoleId=RO177&Status=Active&Limit=${encodeURIComponent(String(ctx.limit))}`;

  const json = await fetchOrdJson(ordUrl, { requestId: ctx.requestId, timeoutMs: 8_000 });
  const organisations = getPath(json, ['Organisations']);
  if (!Array.isArray(organisations) || organisations.length === 0) return [];

  return organisations
    .map((org) => {
      const odsCode = getStringPath(org, ['OrgId']) ?? getStringPath(org, ['OrgId', 'extension']);
      const orgName = getStringPath(org, ['Name']);
      if (!odsCode || !orgName) return null;
      const postCode = getStringPath(org, ['PostCode']) ?? undefined;
      const orgLink = getStringPath(org, ['OrgLink']) ?? undefined;
      return { odsCode, name: orgName, postcode: postCode, orgLink };
    })
    .filter((org): org is NonNullable<typeof org> => org !== null)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    .slice(0, ctx.limit);
}

export function getFallbackOutcodeFromPostcode(postcode: string) {
  const normalized = normalizePostcode(postcode);
  return normalized.length > 4 ? normalized.slice(0, -3) : normalized;
}
