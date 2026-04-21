export interface ICBPolicy {
  icb_name: string;
  cycles_offered: number;
  max_age: number;
  bmi_min: number | null;
  bmi_max: number | null;
  iui_rounds_required: number;
  wait_time_months: number | null;
  endometriosis_priority_access: boolean;
  smoking_restricted: boolean;
  living_children_rule: string | null;
  updated_at: string;
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
