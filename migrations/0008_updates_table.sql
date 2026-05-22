create table if not exists updates (
  id integer primary key autoincrement,
  slug text unique not null,
  title text not null,
  published_date text not null,
  summary text not null,
  body text not null,
  related_boards text,
  tags text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
); --> statement-breakpoint

create index if not exists updates_published_date_idx on updates (published_date desc); --> statement-breakpoint

create unique index if not exists updates_slug_idx on updates (slug);
