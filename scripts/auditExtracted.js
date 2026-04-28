/**
 * Audits extracted-policies.json for missing cycles_offered or max_age values.
 *
 * Run with: node scripts/auditExtracted.js
 */
import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('./documents/extracted-policies.json', 'utf-8'));

const issues = [];

for (const icb of data) {
  for (const p of icb.policies) {
    if (p.cycles_offered === null || p.cycles_offered === undefined || p.cycles_offered === 0) {
      issues.push({ icb: icb.icb_folder_name, treatment: p.treatment_type, field: 'cycles_offered', value: p.cycles_offered ?? 'null' });
    }
    if (p.max_age === null || p.max_age === undefined) {
      issues.push({ icb: icb.icb_folder_name, treatment: p.treatment_type, field: 'max_age', value: 'null' });
    }
  }
}

const byIcb = {};
for (const i of issues) {
  if (!byIcb[i.icb]) byIcb[i.icb] = [];
  byIcb[i.icb].push(i);
}

console.log('=== Missing cycles_offered or max_age (needs manual review) ===');
console.log('');
for (const [icb, items] of Object.entries(byIcb)) {
  console.log(icb + ':');
  for (const item of items) {
    console.log('  ' + item.treatment + ' -> ' + item.field + ' = ' + item.value);
  }
}

console.log('');
console.log(issues.length + ' issues across ' + Object.keys(byIcb).length + ' ICBs');
