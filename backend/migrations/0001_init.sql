pragma foreign_keys = on; --> statement-breakpoint

create table if not exists icbs (
  id text primary key,
  name text not null collate nocase unique,
  nhs_code text unique,
  region text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  constraint icbs_nhs_code_format check (nhs_code is null or nhs_code glob 'E[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
); --> statement-breakpoint

create table if not exists icb_aliases (
  id text primary key,
  icb_id text not null references icbs(id) on delete cascade,
  alias_kind text not null default 'name',
  alias text not null collate nocase unique,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  constraint icb_aliases_kind check (alias_kind in ('name', 'code'))
); --> statement-breakpoint

create index if not exists icb_aliases_icb_id_idx on icb_aliases (icb_id); --> statement-breakpoint

create table if not exists icb_policies (
  id text primary key,
  icb_id text not null references icbs(id) on delete cascade,
  effective_from text not null default (date('now')),
  effective_to text,
  cycles_offered integer not null default 1 check (cycles_offered >= 0),
  max_age integer not null default 40 check (max_age >= 0),
  bmi_min real,
  bmi_max real,
  amh_min_pmol real,
  fsh_max_iu real,
  iui_rounds_required integer not null default 6 check (iui_rounds_required >= 0),
  wait_time_months integer check (wait_time_months is null or wait_time_months >= 0),
  endometriosis_priority_access integer not null default 0,
  smoking_restricted integer not null default 1,
  living_children_rule text,
  source_url text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  constraint icb_policies_effective_range check (effective_to is null or effective_to >= effective_from),
  constraint icb_policies_unique_effective_from unique (icb_id, effective_from)
); --> statement-breakpoint

create index if not exists icb_policies_icb_id_idx on icb_policies (icb_id); --> statement-breakpoint

create index if not exists icb_policies_effective_from_idx on icb_policies (effective_from); --> statement-breakpoint

create table if not exists grants (
  id text primary key,
  name text not null,
  provider text not null,
  amount_min_gbp integer,
  amount_max_gbp integer,
  amount_notes text,
  description text,
  eligibility_criteria text not null default '{}',
  deadline text,
  link_url text,
  type text not null default 'Grant',
  region text,
  income_threshold_gbp integer check (income_threshold_gbp is null or income_threshold_gbp >= 0),
  has_partner_requirement integer not null default 0,
  is_sponsored integer not null default 0,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  constraint grants_type check (type in ('Grant', 'Financing', 'Guarantee')),
  constraint grants_amount_range check (
    (amount_min_gbp is null or amount_min_gbp >= 0)
    and (amount_max_gbp is null or amount_max_gbp >= 0)
    and (amount_min_gbp is null or amount_max_gbp is null or amount_max_gbp >= amount_min_gbp)
  )
); --> statement-breakpoint

create index if not exists grants_type_idx on grants (type); --> statement-breakpoint

create index if not exists grants_region_idx on grants (region); --> statement-breakpoint

create index if not exists grants_is_sponsored_idx on grants (is_sponsored); --> statement-breakpoint

create table if not exists subscribers (
  id text primary key,
  email text not null collate nocase unique,
  interests text not null default '{}',
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
); --> statement-breakpoint

create table if not exists saved_searches (
  id text primary key,
  user_id text not null,
  postcode text,
  postcode_normalized text generated always as (upper(replace(trim(postcode), ' ', ''))) stored,
  user_age integer check (user_age is null or user_age >= 0),
  user_bmi real check (user_bmi is null or user_bmi >= 0),
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
); --> statement-breakpoint

create index if not exists saved_searches_user_id_idx on saved_searches (user_id); --> statement-breakpoint

create index if not exists saved_searches_postcode_normalized_idx on saved_searches (postcode_normalized); --> statement-breakpoint

insert or ignore into icbs (id, name, region, nhs_code)
values
  ('9b66e0f1-eab0-4f2a-ae59-6a1bb96edac5', 'NHS North East London', 'London', 'E54000029'),
  ('c692b4c7-2d08-4f93-9130-28e369c1d529', 'NHS West and North London', 'London', 'E54000027'),
  ('6e501a80-fac9-4b1d-8f74-2df7c79a5eb8', 'NHS South East London', 'London', 'E54000030'),
  ('8543a058-d51d-4f45-abf6-5e421389b404', 'NHS Kent and Medway', 'South East', 'E54000032'); --> statement-breakpoint

insert or ignore into icb_aliases (id, icb_id, alias_kind, alias)
values
  ('f27d989b-03c8-4068-8f1b-274a5f7c19fe', 'c692b4c7-2d08-4f93-9130-28e369c1d529', 'name', 'NHS North West London'),
  ('65353832-604d-4fd3-b326-a8c835db2f60', 'c692b4c7-2d08-4f93-9130-28e369c1d529', 'name', 'NHS North Central London'),
  ('c315df41-004c-491f-8929-2a4aa85f0223', 'c692b4c7-2d08-4f93-9130-28e369c1d529', 'code', 'E54000028'),
  ('fc20f4eb-f788-4de8-a316-7756acacbc24', '8543a058-d51d-4f45-abf6-5e421389b404', 'name', 'NHS Kent and Medway Integrated Care Board'); --> statement-breakpoint

insert or ignore into icb_policies (
  id,
  icb_id,
  effective_from,
  cycles_offered,
  max_age,
  bmi_min,
  bmi_max,
  iui_rounds_required,
  wait_time_months,
  endometriosis_priority_access,
  smoking_restricted,
  living_children_rule
)
values
  (
    '2abcb99b-9ba9-4a7d-96c9-b7ea3aa1b07a',
    '9b66e0f1-eab0-4f2a-ae59-6a1bb96edac5',
    date('now'),
    3,
    40,
    19,
    30,
    6,
    null,
    0,
    1,
    'No existing children'
  ),
  (
    '364e4377-ae6f-42af-a280-8c91f7b09310',
    'c692b4c7-2d08-4f93-9130-28e369c1d529',
    date('now'),
    1,
    42,
    19,
    29.9,
    6,
    null,
    0,
    1,
    'Neither partner has children'
  ),
  (
    '7a12f18a-7cff-4782-b924-53fe8c8114dd',
    '6e501a80-fac9-4b1d-8f74-2df7c79a5eb8',
    date('now'),
    2,
    39,
    19,
    30,
    6,
    null,
    0,
    1,
    'No existing children from current or previous relationships'
  ),
  (
    'f97c4d6a-65c8-42ba-b041-484d77f351d1',
    '8543a058-d51d-4f45-abf6-5e421389b404',
    date('now'),
    1,
    40,
    null,
    null,
    6,
    null,
    0,
    1,
    'Policy details not yet loaded'
  );
