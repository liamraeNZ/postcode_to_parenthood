import type { AdminPolicy, CreateIcbInput, CreatePolicyInput } from '@/types/admin';

export function validateIcbForm(input: Partial<CreateIcbInput>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.id || typeof input.id !== 'string' || input.id.trim() === '') {
    errors.id = 'ID is required';
  }

  if (!input.name || typeof input.name !== 'string' || input.name.trim() === '') {
    errors.name = 'Name is required';
  }

  return errors;
}

export function validatePolicyForm(input: Partial<CreatePolicyInput>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (typeof input.cycles_offered !== 'number') {
    errors.cycles_offered = 'Cycles offered is required';
  }

  if (typeof input.max_age !== 'number') {
    errors.max_age = 'Max age is required';
  } else if (input.max_age < 0) {
    errors.max_age = 'Max age must be 0 or greater';
  }

  if (typeof input.iui_rounds_required !== 'number') {
    errors.iui_rounds_required = 'IUI rounds required is required';
  }

  if (!input.living_children_rule || typeof input.living_children_rule !== 'string' || input.living_children_rule.trim() === '') {
    errors.living_children_rule = 'Living children rule is required';
  }

  if (
    typeof input.bmi_min === 'number' &&
    typeof input.bmi_max === 'number' &&
    input.bmi_min > input.bmi_max
  ) {
    errors.bmi_min = 'BMI min must not exceed BMI max';
  }

  return errors;
}

export function isActivePolicy(policy: Pick<AdminPolicy, 'effective_to'>): boolean {
  if (policy.effective_to == null) {
    return true;
  }
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return policy.effective_to >= today;
}
