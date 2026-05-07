pragma foreign_keys = on; --> statement-breakpoint

create table if not exists health_boards (
  id text primary key,
  name text not null collate nocase unique,
  sub_board_code text,
  parent_board_code text,
  region text,
  country text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  document_folder_name text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
); --> statement-breakpoint

create unique index if not exists health_boards_sub_board_code_unique_idx on health_boards (sub_board_code) where sub_board_code is not null; --> statement-breakpoint
create unique index if not exists health_boards_parent_board_code_unique_idx on health_boards (parent_board_code) where sub_board_code is null and parent_board_code is not null; --> statement-breakpoint
create index if not exists health_boards_parent_board_code_idx on health_boards (parent_board_code); --> statement-breakpoint

create table if not exists board_aliases (
  id text primary key,
  board_id text not null references health_boards(id) on delete cascade,
  alias_kind text not null default 'name',
  alias text not null collate nocase unique,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  constraint board_aliases_kind check (alias_kind in ('name', 'code'))
); --> statement-breakpoint

create index if not exists board_aliases_board_id_idx on board_aliases (board_id); --> statement-breakpoint

create table if not exists treatment_types (
  id text primary key,
  name text not null unique,
  description text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
); --> statement-breakpoint

insert or ignore into treatment_types (id, name, description) values
  ('ivf', 'IVF', 'In vitro fertilisation'),
  ('icsi', 'ICSI', 'Intracytoplasmic sperm injection'),
  ('iui', 'IUI', 'Intrauterine insemination'),
  ('di', 'DI', 'Donor insemination'),
  ('fet', 'FET', 'Frozen embryo transfer'); --> statement-breakpoint

create table if not exists board_policies (
  id text primary key,
  board_id text not null references health_boards(id) on delete cascade,
  treatment_type_id text not null default 'ivf' references treatment_types(id),
  effective_from text not null default (date('now')),
  effective_to text,
  cycles_offered integer not null,
  min_age integer,
  max_age integer not null check (max_age >= 1),
  bmi_min real,
  bmi_max real,
  amh_min_pmol real,
  fsh_max_iu real,
  iui_rounds_required integer not null,
  endometriosis_priority_access integer not null default 0,
  smoking_restricted integer not null default 1,
  living_children_rule text,
  additional_notes text,
  source_url text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  constraint board_policies_effective_range check (effective_to is null or effective_to >= effective_from),
  constraint board_policies_unique_treatment unique (board_id, treatment_type_id, effective_from)
); --> statement-breakpoint

create index if not exists board_policies_board_id_idx on board_policies (board_id); --> statement-breakpoint

create index if not exists board_policies_effective_from_idx on board_policies (effective_from); --> statement-breakpoint

create index if not exists board_policies_treatment_type_idx on board_policies (treatment_type_id); --> statement-breakpoint

create table if not exists postcode_area_to_board (
  id text primary key,
  lookup_value text not null,
  lookup_field text not null,
  board_id text not null references health_boards(id) on delete cascade,
  country text not null
); --> statement-breakpoint

create unique index if not exists postcode_area_to_board_lookup_unique_idx on postcode_area_to_board (lookup_value, lookup_field); --> statement-breakpoint

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

create index if not exists saved_searches_postcode_normalized_idx on saved_searches (postcode_normalized);
