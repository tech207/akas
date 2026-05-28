create extension if not exists pgcrypto;

create table if not exists public.categories (
  name text primary key,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.insights (
  slug text primary key,
  title text not null,
  excerpt text not null default '',
  category text not null references public.categories(name) on update cascade,
  date date not null,
  reading_time text not null default '',
  featured boolean not null default false,
  cover_tone text not null default 'navy'
    check (cover_tone in ('navy', 'red', 'gold', 'charcoal', 'cream')),
  cover_image_url text,
  tags text[],
  content_html text,
  content jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_links (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  href text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_docs (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  type text not null default 'PDF',
  file_url text not null default '',
  uploaded_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_insights_updated_at on public.insights;
create trigger set_insights_updated_at
before update on public.insights
for each row execute function public.set_updated_at();

drop trigger if exists set_legal_links_updated_at on public.legal_links;
create trigger set_legal_links_updated_at
before update on public.legal_links
for each row execute function public.set_updated_at();

drop trigger if exists set_company_docs_updated_at on public.company_docs;
create trigger set_company_docs_updated_at
before update on public.company_docs
for each row execute function public.set_updated_at();

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name_zh text not null,
  name_en text,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.insights enable row level security;
alter table public.legal_links enable row level security;
alter table public.company_docs enable row level security;
alter table public.contact_submissions enable row level security;

insert into storage.buckets (id, name, public)
values ('akas-assets', 'akas-assets', true)
on conflict (id) do update set public = excluded.public;
