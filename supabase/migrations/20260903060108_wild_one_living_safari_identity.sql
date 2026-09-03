create table if not exists public.wild_one_guest_expeditions (
  id uuid primary key default gen_random_uuid(),
  guest_token_hash text not null unique check (guest_token_hash ~ '^[a-f0-9]{64}$'),
  explorer_code text not null unique check (explorer_code ~ '^WILD-[A-F0-9]{8}$'),
  animal_key text not null check (animal_key in ('lion','elephant','giraffe','monkey','parrot','zebra','leopard')),
  role_key text not null check (role_key in ('lion','elephant','giraffe','monkey','parrot','zebra','leopard')),
  route_key text not null check (route_key in ('lion','elephant','giraffe','monkey','parrot','zebra','leopard')),
  locale text not null default 'en' check (locale in ('en','es')),
  guest_name text null check (guest_name is null or char_length(btrim(guest_name)) between 2 and 80),
  rsvp_status text null check (rsvp_status is null or rsvp_status in ('yes','no')),
  golden_leaves smallint[] not null default '{}'::smallint[] check (golden_leaves <@ array[1,2,3]::smallint[]),
  rank text not null default 'EXPLORER' check (rank in ('EXPLORER','GOLDEN EXPLORER')),
  calendar_saved boolean not null default false,
  journey_version text not null default 'living-safari-v5',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists wild_one_guest_expeditions_last_seen_idx on public.wild_one_guest_expeditions (last_seen_at desc);
create index if not exists wild_one_guest_expeditions_rsvp_idx on public.wild_one_guest_expeditions (rsvp_status) where rsvp_status is not null;

alter table public.wild_one_guest_expeditions enable row level security;
alter table public.wild_one_guest_expeditions force row level security;
revoke all on table public.wild_one_guest_expeditions from anon, authenticated;
grant select, insert, update, delete on table public.wild_one_guest_expeditions to service_role;

alter table public.wild_one_rsvps add column if not exists guest_expedition_id uuid null references public.wild_one_guest_expeditions(id) on delete set null;

comment on table public.wild_one_guest_expeditions is 'Private persistent guest identities for Alexis Alessandro Wild One. Access is server-only.';
comment on column public.wild_one_guest_expeditions.guest_token_hash is 'SHA-256 digest of the opaque cookie token; the raw token is never stored.';
comment on column public.wild_one_guest_expeditions.explorer_code is 'Private recovery code. It contains no personal data.';

