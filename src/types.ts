export interface ICBPolicy {
  icb_name: string;
  treatment_type_id: string;
  cycles_offered: number;
  max_age: number;
  bmi_min: number | null;
  bmi_max: number | null;
  iui_rounds_required: number;
  endometriosis_priority_access: boolean;
  smoking_restricted: boolean;
  living_children_rule: string | null;
  updated_at: string;
}

export interface ICBTreatmentPolicy {
  treatment_type_id: string;
  treatment_type_name: string;
  cycles_offered: number;
  min_age: number | null;
  max_age: number;
  bmi_min: number | null;
  bmi_max: number | null;
  amh_min_pmol: number | null;
  fsh_max_iu: number | null;
  iui_rounds_required: number;
  endometriosis_priority_access: boolean;
  smoking_restricted: boolean;
  living_children_rule: string | null;
  updated_at: string;
}

export interface ICBPoliciesResponse {
  icb_name: string;
  policies: ICBTreatmentPolicy[];
}

export interface GpPracticeSummary {
  odsCode: string;
  name: string;
  postcode?: string;
  orgLink?: string;
}

export type GrantType = 'Grant' | 'Financing' | 'Guarantee';

export interface Grant {
  id: string;
  name: string;
  provider: string;
  amount_min_gbp?: number | null;
  amount_max_gbp?: number | null;
  amount_notes?: string | null;
  description: string;
  eligibility_criteria: Record<string, unknown>;
  deadline?: string | null;
  link_url?: string | null;
  type: GrantType;
  region?: string | null;
  income_threshold_gbp?: number | null;
  has_partner_requirement?: boolean;
  is_sponsored?: boolean;
}
