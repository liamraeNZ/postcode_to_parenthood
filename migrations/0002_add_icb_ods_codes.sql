pragma foreign_keys = on; --> statement-breakpoint

alter table icbs add column ods_code text; --> statement-breakpoint

create unique index if not exists icbs_ods_code_unique on icbs (ods_code); --> statement-breakpoint

update icbs set ods_code = 'A3A8R' where name = 'NHS North East London'; --> statement-breakpoint
update icbs set ods_code = '93C' where name = 'NHS West and North London'; --> statement-breakpoint
update icbs set ods_code = '72Q' where name = 'NHS South East London'; --> statement-breakpoint
update icbs set ods_code = '91Q' where name = 'NHS Kent and Medway'; --> statement-breakpoint

insert or ignore into icb_aliases (id, icb_id, alias_kind, alias)
values
  ('bced6d50-fb7c-4e23-9491-3d12f91bfb12', 'c692b4c7-2d08-4f93-9130-28e369c1d529', 'code', 'W2U3Z'); --> statement-breakpoint

