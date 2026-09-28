alter table if exists public.birthday_invitations enable row level security;
do $$ begin
 if not exists(select 1 from pg_constraint where conname='birthday_invitations_honoree_check') then alter table public.birthday_invitations add constraint birthday_invitations_honoree_check check(honoree in ('candida','alberto'));end if;
 if not exists(select 1 from pg_constraint where conname='birthday_invitations_max_guests_check') then alter table public.birthday_invitations add constraint birthday_invitations_max_guests_check check(max_guests between 1 and 100);end if;
 if not exists(select 1 from pg_constraint where conname='birthday_invitations_party_size_check') then alter table public.birthday_invitations add constraint birthday_invitations_party_size_check check(party_size is null or party_size between 0 and max_guests);end if;
end $$;
create index if not exists birthday_invitations_token_idx on public.birthday_invitations(token);