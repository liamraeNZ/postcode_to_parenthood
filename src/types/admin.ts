export interface AdminIcb {
  id: string;
  name: string;
  sub_icb_code: string | null;
  parent_icb_code: string | null;
  region: string | null;
  country: string | null;
  status: 'active' | 'inactive';
  has_active_policy: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminPolicy {
  id: string;
  icb_id: string;
  effective_from: string;
  effective_to: string | null;
  cycles_offered: number;
  max_age: number;
  bmi_min: number | null;
  bmi_max: number | null;
  iui_rounds_required: number;
  wait_time_months: number | null;
  endometriosis_priority_access: boolean;
  smoking_restricted: boolean;
  living_children_rule: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateIcbInput {
  id: string;
  name: string;
  sub_icb_code?: string | null;
  parent_icb_code?: string | null;
  region?: string | null;
  country?: string | null;
}

export interface UpdateIcbInput {
  name?: string;
  region?: string | null;
  country?: string | null;
  sub_icb_code?: string | null;
  parent_icb_code?: string | null;
  status?: 'active' | 'inactive';
}

export interface CreatePolicyInput {
  cycles_offered: number;
  max_age: number;
  iui_rounds_required: number;
  living_children_rule: string;
  effective_from?: string | null;
  effective_to?: string | null;
  bmi_min?: number | null;
  bmi_max?: number | null;
  wait_time_months?: number | null;
  endometriosis_priority_access?: boolean;
  smoking_restricted?: boolean;
  source_url?: string | null;
}
