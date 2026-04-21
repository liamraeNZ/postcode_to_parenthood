type D1Database = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      first: <T>(typeHint?: string) => Promise<T | null>;
      run: () => Promise<{ success: boolean; error?: string }>;
      all: <T>() => Promise<{ results: T[] }>;
    };
  };
};

export type SyncIcbsFromOrdDeps = {
  fetchOrdJson: (url: string, ctx: { requestId: string; timeoutMs: number }) => Promise<unknown>;
  getPath: (obj: unknown, path: string[]) => unknown;
  getStringPath: (obj: unknown, path: string[]) => string | null;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeForMatch(value: string) {
  return value
    .toUpperCase()
    .replace(/INTEGRATED CARE BOARD/g, 'ICB')
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shouldExcludeFromIcbSync(name: string) {
  const upper = name.toUpperCase();
  if (upper.includes('COMMISSIONING HUB')) return true;
  if (upper.includes('H&J')) return true;
  if (upper.includes('HEALTH & JUSTICE')) return true;
  if (upper.includes('HEALTH AND JUSTICE')) return true;
  if (upper.includes('SMHPC')) return true;
  return false;
}

export async function syncIcbsFromOrd(
  db: D1Database,
  ctx: { requestId: string },
  deps: SyncIcbsFromOrdDeps
) {
  const excludedOrgIds = new Set(['QHG', 'QUE', 'QM7', 'QH8', 'QJG', 'QMM', 'QRV', 'QMJ', 'QU9', 'QNQ', 'QXU', 'QNX']);

  const now = new Date().toISOString();
  let inserted = 0;
  let updated = 0;

  async function findParentByName(name: string) {
    return await db
      .prepare('select id, name from icbs where sub_icb_code is null and upper(name) = upper(?1) limit 1')
      .bind(name)
      .first<{ id: string; name: string }>();
  }

  async function findSubByName(name: string) {
    return await db
      .prepare('select id, name from icbs where sub_icb_code is not null and upper(name) = upper(?1) limit 1')
      .bind(name)
      .first<{ id: string; name: string }>();
  }

  function extractRelArray(json: unknown): unknown[] {
    const direct = deps.getPath(json, ['Rels']);
    if (Array.isArray(direct)) return direct;
    const directRel = deps.getPath(json, ['Rels', 'Rel']);
    if (Array.isArray(directRel)) return directRel;
    const orgRel = deps.getPath(json, ['Organisation', 'Rels']);
    if (Array.isArray(orgRel)) return orgRel;
    const orgRelRel = deps.getPath(json, ['Organisation', 'Rels', 'Rel']);
    if (Array.isArray(orgRelRel)) return orgRelRel;
    return [];
  }

  function extractRelTypeId(rel: unknown): string | null {
    return deps.getStringPath(rel, ['id']) ?? deps.getStringPath(rel, ['Rel', 'id']);
  }

  function extractRelStatus(rel: unknown): string | null {
    return deps.getStringPath(rel, ['Status']) ?? deps.getStringPath(rel, ['Rel', 'Status']);
  }

  function extractTargetPrimaryRoleId(rel: unknown): string | null {
    return (
      deps.getStringPath(rel, ['Target', 'PrimaryRoleId', 'id']) ??
      deps.getStringPath(rel, ['Target', 'PrimaryRoleId']) ??
      deps.getStringPath(rel, ['Target', 'Roles', 'Role', 'id'])
    );
  }

  function extractTargetOrgCode(rel: unknown): string | null {
    return (
      deps.getStringPath(rel, ['Target', 'OrgId', 'extension']) ??
      deps.getStringPath(rel, ['Target', 'OrgId']) ??
      deps.getStringPath(rel, ['Target', 'Organisation', 'OrgId', 'extension'])
    );
  }

  function findActiveParentIcbCode(rels: unknown[]) {
    const candidates: Array<{ relType: string; targetRole: string; targetCode: string }> = [];
    for (const rel of rels) {
      const statusRaw = extractRelStatus(rel);
      const status = statusRaw ? statusRaw.toUpperCase() : '';
      if (status && status !== 'ACTIVE') continue;
      const relType = extractRelTypeId(rel) ?? '';
      const targetRole = extractTargetPrimaryRoleId(rel) ?? '';
      const targetCode = extractTargetOrgCode(rel) ?? '';
      if (!targetCode) continue;
      if (targetRole !== 'RO261') continue;
      candidates.push({ relType, targetRole, targetCode });
    }
    const preferred = candidates.find((c) => c.relType === 'RE5');
    return (preferred ?? candidates[0] ?? null)?.targetCode ?? null;
  }

  function extractLocationValue(json: unknown, key: string): string | null {
    return (
      deps.getStringPath(json, ['Organisation', 'GeoLoc', 'Location', key]) ??
      deps.getStringPath(json, ['GeoLoc', 'Location', key]) ??
      deps.getStringPath(json, ['Organisation', 'GeoLoc', key]) ??
      deps.getStringPath(json, ['GeoLoc', key])
    );
  }

  function extractRegionCountry(json: unknown) {
    const country = extractLocationValue(json, 'Country');
    const region = extractLocationValue(json, 'Region') ?? extractLocationValue(json, 'County');
    return { region, country };
  }

  async function mapWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>) {
    const results: R[] = new Array(items.length);
    let nextIndex = 0;
    const workers = Array.from({ length: Math.max(1, concurrency) }).map(async () => {
      while (true) {
        const idx = nextIndex;
        nextIndex += 1;
        if (idx >= items.length) break;
        results[idx] = await fn(items[idx]);
      }
    });
    await Promise.all(workers);
    return results;
  }

  const parentUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Roles=RO261&Status=Active&Limit=1000`;
  const parentJson = await deps.fetchOrdJson(parentUrl, { requestId: ctx.requestId, timeoutMs: 15_000 });
  const parentOrgs = deps.getPath(parentJson, ['Organisations']);

  const parentAll: Array<{ parentIcbCode: string; ordName: string; lastChangeDate?: string }> = [];
  if (Array.isArray(parentOrgs)) {
    for (const org of parentOrgs) {
      const parentIcbCode = deps.getStringPath(org, ['OrgId']) ?? deps.getStringPath(org, ['OrgId', 'extension']);
      const ordName = deps.getStringPath(org, ['Name']);
      if (!parentIcbCode || !ordName) continue;
      if (shouldExcludeFromIcbSync(ordName)) continue;
      if (!/INTEGRATED CARE BOARD/i.test(ordName)) continue;
      if (excludedOrgIds.has(parentIcbCode)) continue;
      const lastChangeDate = deps.getStringPath(org, ['LastChangeDate']) ?? undefined;
      parentAll.push({ parentIcbCode, ordName, lastChangeDate });
    }
  }

  const parentsByCode = new Map<string, { parentIcbCode: string; ordName: string; lastChangeDate?: string }>();
  for (const entry of parentAll) {
    const existing = parentsByCode.get(entry.parentIcbCode);
    if (!existing || (entry.lastChangeDate ?? '') > (existing.lastChangeDate ?? '')) {
      parentsByCode.set(entry.parentIcbCode, entry);
    }
  }

  const parentNameToCode = new Map<string, string>();
  for (const p of parentsByCode.values()) {
    parentNameToCode.set(normalizeForMatch(p.ordName), p.parentIcbCode);
  }

  const parentsWithGeo = await mapWithConcurrency(Array.from(parentsByCode.values()), 8, async (parent) => {
    try {
      const detailUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${encodeURIComponent(
        parent.parentIcbCode
      )}`;
      const detailJson = await deps.fetchOrdJson(detailUrl, { requestId: ctx.requestId, timeoutMs: 12_000 });
      const { region, country } = extractRegionCountry(detailJson);
      return { ...parent, region, country };
    } catch {
      return { ...parent, region: null, country: null };
    }
  });

  for (const { parentIcbCode, ordName, region, country } of parentsWithGeo) {
    const existingByCode = await db
      .prepare('select id from icbs where sub_icb_code is null and parent_icb_code = ?1 limit 1')
      .bind(parentIcbCode)
      .first<{ id: string }>();

    if (existingByCode?.id) {
      await db
        .prepare(
          'update icbs set name = ?1, parent_icb_code = ?2, region = coalesce(?3, region), country = coalesce(?4, country), updated_at = ?5 where id = ?6'
        )
        .bind(ordName, parentIcbCode, region, country, now, existingByCode.id)
        .run();
      updated += 1;
      continue;
    }

    const existingByName = await findParentByName(ordName);
    if (existingByName?.id) {
      await db
        .prepare(
          'update icbs set parent_icb_code = ?1, region = coalesce(?2, region), country = coalesce(?3, country), updated_at = ?4 where id = ?5'
        )
        .bind(parentIcbCode, region, country, now, existingByName.id)
        .run();
      updated += 1;
      continue;
    }

    const id = crypto.randomUUID();
    await db
      .prepare(
        'insert into icbs (id, name, sub_icb_code, parent_icb_code, region, country, created_at, updated_at) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
      )
      .bind(id, ordName, null, parentIcbCode, region, country, now, now)
      .run();
    inserted += 1;
  }

  const subUrl = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO98&Status=Active&Limit=1000`;
  const subJson = await deps.fetchOrdJson(subUrl, { requestId: ctx.requestId, timeoutMs: 15_000 });
  const subOrgs = deps.getPath(subJson, ['Organisations']);

  const subAll: Array<{ subIcbCode: string; ordName: string; lastChangeDate?: string; orgLink?: string }> = [];
  if (Array.isArray(subOrgs)) {
    for (const org of subOrgs) {
      const subIcbCode = deps.getStringPath(org, ['OrgId']) ?? deps.getStringPath(org, ['OrgId', 'extension']);
      const ordName = deps.getStringPath(org, ['Name']);
      if (!subIcbCode || !ordName) continue;
      if (shouldExcludeFromIcbSync(ordName)) continue;
      const lastChangeDate = deps.getStringPath(org, ['LastChangeDate']) ?? undefined;
      const orgLink = deps.getStringPath(org, ['OrgLink']) ?? undefined;
      subAll.push({ subIcbCode, ordName, lastChangeDate, orgLink });
    }
  }

  const subsByCode = new Map<string, { subIcbCode: string; ordName: string; lastChangeDate?: string; orgLink?: string }>();
  for (const entry of subAll) {
    const existing = subsByCode.get(entry.subIcbCode);
    if (!existing || (entry.lastChangeDate ?? '') > (existing.lastChangeDate ?? '')) {
      subsByCode.set(entry.subIcbCode, entry);
    }
  }

  function guessParentFromName(subName: string, subCode: string) {
    const base = subName.replace(new RegExp(`\\s*-\\s*${escapeRegExp(subCode)}\\s*$`, 'i'), '').trim();
    const baseNorm = normalizeForMatch(base);
    let best: { code: string; score: number } | null = null;
    for (const [normParentName, parentCode] of parentNameToCode.entries()) {
      if (!normParentName) continue;
      const includes = normParentName.includes(baseNorm) || baseNorm.includes(normParentName);
      if (!includes) continue;
      const score = Math.min(normParentName.length, baseNorm.length);
      if (!best || score > best.score) best = { code: parentCode, score };
    }
    return best?.code ?? null;
  }

  const subsWithParent = await mapWithConcurrency(Array.from(subsByCode.values()), 8, async (sub) => {
    const detailUrl =
      sub.orgLink ??
      `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${encodeURIComponent(sub.subIcbCode)}`;
    let parentIcbCode: string | null = null;
    let region: string | null = null;
    let country: string | null = null;
    try {
      const detailJson = await deps.fetchOrdJson(detailUrl, { requestId: ctx.requestId, timeoutMs: 12_000 });
      const rels = extractRelArray(detailJson);
      parentIcbCode = findActiveParentIcbCode(rels);
      const geo = extractRegionCountry(detailJson);
      region = geo.region;
      country = geo.country;
    } catch {
      parentIcbCode = null;
    }

    if (parentIcbCode && parentsByCode.has(parentIcbCode)) {
      return { ...sub, parentIcbCode, region, country };
    }

    const guessed = guessParentFromName(sub.ordName, sub.subIcbCode);
    return { ...sub, parentIcbCode: guessed, region, country };
  });

  for (const { subIcbCode, ordName, parentIcbCode, region, country } of subsWithParent) {
    const existingByCode = await db
      .prepare('select id from icbs where sub_icb_code = ?1 limit 1')
      .bind(subIcbCode)
      .first<{ id: string }>();

    if (existingByCode?.id) {
      await db
        .prepare(
          'update icbs set name = ?1, parent_icb_code = ?2, region = coalesce(?3, region), country = coalesce(?4, country), updated_at = ?5 where id = ?6'
        )
        .bind(ordName, parentIcbCode, region, country, now, existingByCode.id)
        .run();
      updated += 1;
      continue;
    }

    const existingByName = await findSubByName(ordName);
    if (existingByName?.id) {
      await db
        .prepare(
          'update icbs set sub_icb_code = ?1, parent_icb_code = ?2, region = coalesce(?3, region), country = coalesce(?4, country), updated_at = ?5 where id = ?6'
        )
        .bind(subIcbCode, parentIcbCode, region, country, now, existingByName.id)
        .run();
      updated += 1;
      continue;
    }

    const id = crypto.randomUUID();
    await db
      .prepare(
        'insert into icbs (id, name, sub_icb_code, parent_icb_code, region, country, created_at, updated_at) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
      )
      .bind(id, ordName, subIcbCode, parentIcbCode, region, country, now, now)
      .run();
    inserted += 1;
  }

  return { total: parentsByCode.size + subsByCode.size, inserted, updated, aliased: 0 };
}
