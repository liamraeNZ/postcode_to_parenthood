/**
 * Template-based plain English summary generator for board policy data.
 *
 * Builds a warm, natural-language summary from structured policy fields.
 * Omits clauses for missing fields rather than showing "Not specified" —
 * this is what makes the output read naturally.
 */

export interface SummaryPolicy {
  cycles_offered: number;
  min_age: number | null;
  max_age: number;
  bmi_min: number | null;
  bmi_max: number | null;
  living_children_rule: string | null;
  smoking_restricted: boolean;
}

export function generatePlainEnglishSummary(icbName: string, policy: SummaryPolicy): string {
  if (policy.cycles_offered === 0) {
    return `${icbName} does not currently fund IVF cycles through the NHS.`;
  }

  const parts: string[] = [];
  parts.push(
    `${icbName} currently funds ${policy.cycles_offered} cycle${policy.cycles_offered !== 1 ? "s" : ""} of IVF for eligible patients.`
  );

  const criteria: string[] = [];

  if (policy.min_age != null && policy.max_age > 0) {
    criteria.push(`be aged ${policy.min_age}–${policy.max_age}`);
  } else if (policy.max_age > 0) {
    criteria.push(`be under ${policy.max_age}`);
  }

  if (policy.bmi_min != null && policy.bmi_max != null) {
    criteria.push(`have a BMI between ${policy.bmi_min} and ${policy.bmi_max}`);
  } else if (policy.bmi_max != null) {
    criteria.push(`have a BMI of ${policy.bmi_max} or below`);
  }

  if (policy.living_children_rule) {
    criteria.push("have no living children from any relationship");
  }

  if (criteria.length > 0) {
    parts.push(`To qualify, you generally need to ${criteria.join(", ")}.`);
  }

  if (policy.smoking_restricted) {
    parts.push("Both partners must be non-smokers.");
  }

  return parts.join(" ");
}
