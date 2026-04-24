/**
 * Queries the ODS API for each sub-ICB to find their new parent ODS codes.
 * Outputs alias mappings that should be added to 0002_icbs.sql.
 *
 * Run with: npx tsx scripts/findOdsAliases.ts
 */

// Sub-ICBs from our migration that might have new ODS parent codes
const SUB_ICBS = [
  { id: 'M1J4Y', name: 'NHS BEDFORDSHIRE, LUTON AND MILTON KEYNES INTEGRATED CARE BOARD' },
  { id: '06H', name: 'NHS CAMBRIDGESHIRE AND PETERBOROUGH INTEGRATED CARE BOARD' },
  { id: '06K', name: 'NHS CENTRAL EAST ICB - 06K' },
  { id: '99E', name: 'NHS MID AND SOUTH ESSEX INTEGRATED CARE BOARD' },
  { id: '10Q', name: 'NHS BUCKINGHAMSHIRE, OXFORDSHIRE AND BERKSHIRE WEST INTEGRATED CARE BOARD' },
  { id: 'D4U1Y', name: 'NHS FRIMLEY INTEGRATED CARE BOARD' },
  { id: '07P', name: 'NHS NORTH CENTRAL LONDON INTEGRATED CARE BOARD' },
  { id: '08Y', name: 'NHS NORTH WEST LONDON INTEGRATED CARE BOARD' },
  { id: '92A', name: 'NHS SURREY HEARTLANDS INTEGRATED CARE BOARD' },
  { id: '09D', name: 'NHS SUSSEX INTEGRATED CARE BOARD' },
  { id: '06L', name: 'NHS NORFOLK AND WAVENEY INTEGRATED CARE BOARD' },
  { id: '07K', name: 'NHS SUFFOLK AND NORTH EAST ESSEX INTEGRATED CARE BOARD' },
];

// Known aliases we already have
const KNOWN_ALIASES: Record<string, string> = {
  'M1J4Y': 'QHG',
  '99E': 'QH8',
  '06L': 'QMM',
  '07P': 'QMJ',
  '07K': 'QJG',
};

interface OdsOrg {
  Name: string;
  OrgId: string;
  Status: string;
  PrimaryRoleId: string;
  PrimaryRoleDescription: string;
}

async function searchOds(name: string): Promise<OdsOrg[]> {
  const url = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Name=${encodeURIComponent(name)}&Status=Active&PrimaryRoleId=RO261`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ODS API error ${res.status} for "${name}"`);
    return [];
  }
  const json = await res.json() as { Organisations?: OdsOrg[] };
  return json.Organisations ?? [];
}

async function main() {
  const newAliases: { subIcbId: string; odsCode: string; odsName: string }[] = [];

  for (const sub of SUB_ICBS) {
    // Extract a clean search name (strip " - 06K" suffixes etc)
    const searchName = sub.name.replace(/ - \w+$/, '').replace(/ICB$/, 'INTEGRATED CARE BOARD');
    console.log(`\nChecking: ${sub.id} (${sub.name})`);
    console.log(`  Searching ODS for: "${searchName}"`);

    // Small delay to be nice to the API
    await new Promise(r => setTimeout(r, 300));

    const results = await searchOds(searchName);

    if (results.length === 0) {
      console.log('  No active RO261 results found');
      continue;
    }

    for (const org of results) {
      if (org.OrgId === sub.id) {
        console.log(`  Found self: ${org.OrgId} (same as sub-ICB id, skipping)`);
        continue;
      }

      const isKnown = KNOWN_ALIASES[sub.id] === org.OrgId;
      if (isKnown) {
        console.log(`  Found known alias: ${org.OrgId} -> ${sub.id} (already mapped)`);
      } else {
        console.log(`  ** NEW ALIAS: ${org.OrgId} "${org.Name}" -> ${sub.id}`);
        newAliases.push({ subIcbId: sub.id, odsCode: org.OrgId, odsName: org.Name });
      }
    }
  }

  console.log('\n\n=== SUMMARY ===');
  if (newAliases.length === 0) {
    console.log('No new aliases found. All sub-ICBs are covered.');
  } else {
    console.log(`Found ${newAliases.length} new alias(es):\n`);
    console.log('-- Add these to 0002_icbs.sql icb_aliases INSERT:');
    for (const a of newAliases) {
      const aliasId = `alias-${a.odsCode.toLowerCase()}`;
      console.log(`('${aliasId}', '${a.subIcbId}', 'code', '${a.odsCode}', '2026-04-21T17:24:14.512Z', '2026-04-21T17:24:14.512Z'),`);
    }
  }
}

main().catch(console.error);
