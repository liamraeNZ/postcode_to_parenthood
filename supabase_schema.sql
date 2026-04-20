-- Tables for FertilityFund UK

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.normalize_postcode(input text)
returns text
language sql
immutable
as $$
  select upper(regexp_replace(btrim(input), '\s+', '', 'g'));
$$;

create or replace function public.postcode_outward(input text)
returns text
language sql
immutable
as $$
  select left(public.normalize_postcode(input), greatest(length(public.normalize_postcode(input)) - 3, 0));
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'grant_type') then
    create type grant_type as enum ('Grant', 'Financing', 'Guarantee');
  end if;
end $$;

create table if not exists icbs (
  id uuid primary key default gen_random_uuid(),
  name citext not null unique,
  nhs_code text unique,
  region text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint icbs_nhs_code_format check (nhs_code is null or nhs_code ~ '^E[0-9]{8}$')
);

create trigger set_icbs_updated_at
before update on icbs
for each row execute function public.set_updated_at();

create table if not exists icb_aliases (
  id uuid primary key default gen_random_uuid(),
  icb_id uuid not null references icbs(id) on delete cascade,
  alias_kind text not null default 'name',
  alias citext not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint icb_aliases_kind check (alias_kind in ('name', 'code'))
);

create index if not exists icb_aliases_icb_id_idx on icb_aliases (icb_id);

create trigger set_icb_aliases_updated_at
before update on icb_aliases
for each row execute function public.set_updated_at();

create or replace function public.resolve_icb_id(icb_code text, icb_name text)
returns uuid
language sql
stable
as $$
  select coalesce(
    (select id from icbs where nhs_code = icb_code limit 1),
    (select icb_id from icb_aliases where alias_kind = 'code' and alias = icb_code::citext limit 1),
    (select icb_id from icb_aliases where alias_kind = 'name' and alias = icb_name::citext limit 1)
  );
$$;

create table if not exists icb_policies (
  id uuid primary key default gen_random_uuid(),
  icb_id uuid not null references icbs(id) on delete cascade,
  effective_from date not null default current_date,
  effective_to date,
  cycles_offered integer not null default 1 check (cycles_offered >= 0),
  max_age integer not null default 40 check (max_age >= 0),
  bmi_min numeric(4,1),
  bmi_max numeric(4,1),
  amh_min_pmol numeric(4,1),
  fsh_max_iu numeric(4,1),
  iui_rounds_required integer not null default 6 check (iui_rounds_required >= 0),
  wait_time_months integer check (wait_time_months is null or wait_time_months >= 0),
  endometriosis_priority_access boolean not null default false,
  smoking_restricted boolean not null default true,
  living_children_rule text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint icb_policies_effective_range check (effective_to is null or effective_to >= effective_from),
  unique (icb_id, effective_from)
);

create index if not exists icb_policies_icb_id_idx on icb_policies (icb_id);
create index if not exists icb_policies_effective_from_idx on icb_policies (effective_from);

create trigger set_icb_policies_updated_at
before update on icb_policies
for each row execute function public.set_updated_at();

create table if not exists grants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text not null,
  amount_min_gbp integer,
  amount_max_gbp integer,
  amount_notes text,
  description text,
  eligibility_criteria jsonb not null default '{}'::jsonb,
  deadline date,
  link_url text,
  type grant_type not null default 'Grant',
  region text,
  income_threshold_gbp integer check (income_threshold_gbp is null or income_threshold_gbp >= 0),
  has_partner_requirement boolean not null default false,
  is_sponsored boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grants_amount_range check (
    (amount_min_gbp is null or amount_min_gbp >= 0)
    and (amount_max_gbp is null or amount_max_gbp >= 0)
    and (amount_min_gbp is null or amount_max_gbp is null or amount_max_gbp >= amount_min_gbp)
  )
);

create index if not exists grants_type_idx on grants (type);
create index if not exists grants_region_idx on grants (region);
create index if not exists grants_eligibility_criteria_gin on grants using gin (eligibility_criteria);
create index if not exists grants_is_sponsored_idx on grants (is_sponsored);

create trigger set_grants_updated_at
before update on grants
for each row execute function public.set_updated_at();

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  interests jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscribers_interests_gin on subscribers using gin (interests);

create trigger set_subscribers_updated_at
before update on subscribers
for each row execute function public.set_updated_at();

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  postcode text,
  postcode_normalized text generated always as (public.normalize_postcode(postcode)) stored,
  user_age integer check (user_age is null or user_age >= 0),
  user_bmi numeric(4,1) check (user_bmi is null or user_bmi >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_searches_postcode_trimmed check (postcode is null or postcode = btrim(postcode))
);

create index if not exists saved_searches_user_id_idx on saved_searches (user_id);
create index if not exists saved_searches_postcode_normalized_idx on saved_searches (postcode_normalized);

create trigger set_saved_searches_updated_at
before update on saved_searches
for each row execute function public.set_updated_at();

alter table icbs enable row level security;
alter table icb_aliases enable row level security;
alter table icb_policies enable row level security;
alter table grants enable row level security;
alter table subscribers enable row level security;
alter table saved_searches enable row level security;

drop policy if exists icbs_public_read on icbs;
create policy icbs_public_read on icbs for select to anon, authenticated using (true);

drop policy if exists icb_aliases_public_read on icb_aliases;
create policy icb_aliases_public_read on icb_aliases for select to anon, authenticated using (true);

drop policy if exists icb_policies_public_read on icb_policies;
create policy icb_policies_public_read on icb_policies for select to anon, authenticated using (true);

drop policy if exists grants_public_read on grants;
create policy grants_public_read on grants for select to anon, authenticated using (true);

drop policy if exists subscribers_public_insert on subscribers;
create policy subscribers_public_insert on subscribers for insert to anon, authenticated with check (true);

drop policy if exists saved_searches_owner_select on saved_searches;
create policy saved_searches_owner_select on saved_searches for select to authenticated using (auth.uid() = user_id);

drop policy if exists saved_searches_owner_insert on saved_searches;
create policy saved_searches_owner_insert on saved_searches for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists saved_searches_owner_update on saved_searches;
create policy saved_searches_owner_update on saved_searches for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists saved_searches_owner_delete on saved_searches;
create policy saved_searches_owner_delete on saved_searches for delete to authenticated using (auth.uid() = user_id);

insert into icbs (name, region, nhs_code)
values
  ('NHS North East London', 'London', 'E54000029'),
  ('NHS West and North London', 'London', 'E54000027'),
  ('NHS South East London', 'London', 'E54000030'),
  ('NHS Kent and Medway', 'South East', 'E54000032')
;

insert into icb_aliases (icb_id, alias_kind, alias)
select i.id, v.alias_kind, v.alias
from (
  values
    ('name', 'NHS North West London'::citext),
    ('name', 'NHS North Central London'::citext),
    ('code', 'E54000028'::citext)
) as v(alias_kind, alias)
join icbs i on i.name = 'NHS West and North London'
;

insert into icb_aliases (icb_id, alias_kind, alias)
select i.id, 'name', 'NHS Kent and Medway Integrated Care Board'::citext
from icbs i
where i.name = 'NHS Kent and Medway'
;

insert into icb_policies (
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
select
  id,
  current_date,
  3,
  40,
  19,
  30,
  6,
  null,
  false,
  true,
  'No existing children'
from icbs
where name = 'NHS North East London'
;

insert into icb_policies (
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
select
  id,
  current_date,
  1,
  42,
  19,
  29.9,
  6,
  null,
  false,
  true,
  'Neither partner has children'
from icbs
where name = 'NHS West and North London'
;

insert into icb_policies (
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
select
  id,
  current_date,
  2,
  39,
  19,
  30,
  6,
  null,
  false,
  true,
  'No existing children from current or previous relationships'
from icbs
where name = 'NHS South East London'
;

insert into icb_policies (
  icb_id,
  effective_from,
  cycles_offered,
  max_age,
  iui_rounds_required,
  wait_time_months,
  endometriosis_priority_access,
  smoking_restricted,
  living_children_rule
)
select
  id,
  current_date,
  1,
  40,
  6,
  null,
  false,
  true,
  'Policy details not yet loaded'
from icbs
where name = 'NHS Kent and Medway'
;
