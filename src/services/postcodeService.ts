import { ICBPolicy } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

type PostcodesIoResponse = {
  status: number;
  result?: {
    codes?: {
      icb?: string | null;
    } | null;
  } | null;
};

export async function lookupICBByPostcode(postcode: string): Promise<ICBPolicy | null> {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }

  const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`);
  if (!response.ok) return null;

  const json = (await response.json()) as PostcodesIoResponse;
  const icbCode = json.result?.codes?.icb ?? null;

  if (!icbCode) return null;

  const { data: icbId, error: resolveError } = await supabase.rpc('resolve_icb_id', {
    icb_code: icbCode,
    icb_name: null
  });

  if (resolveError) throw resolveError;
  if (!icbId) return null;

  const today = new Date().toISOString().slice(0, 10);
  const { data: policy, error: policyError } = await supabase
    .from('icb_policies')
    .select(
      `
      cycles_offered,
      max_age,
      bmi_min,
      bmi_max,
      iui_rounds_required,
      wait_time_months,
      endometriosis_priority_access,
      smoking_restricted,
      living_children_rule,
      updated_at,
      effective_from,
      effective_to,
      icbs ( name )
    `
    )
    .eq('icb_id', icbId)
    .or(`effective_to.is.null,effective_to.gte.${today}`)
    .order('effective_from', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (policyError) throw policyError;
  if (!policy) return null;

  const icbNameFromDb = (policy as any).icbs?.name as string | undefined;

  return {
    icb_name: icbNameFromDb || `ICB ${icbCode}`,
    cycles_offered: policy.cycles_offered,
    max_age: policy.max_age,
    bmi_min: policy.bmi_min,
    bmi_max: policy.bmi_max,
    iui_rounds_required: policy.iui_rounds_required,
    wait_time_months: policy.wait_time_months,
    endometriosis_priority_access: policy.endometriosis_priority_access,
    smoking_restricted: policy.smoking_restricted,
    living_children_rule: policy.living_children_rule,
    updated_at: policy.updated_at
  };
}
