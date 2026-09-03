create policy "deny_public_guest_expeditions"
  on public.wild_one_guest_expeditions
  for all
  to anon, authenticated
  using (false)
  with check (false);

create index if not exists wild_one_rsvps_guest_expedition_idx
  on public.wild_one_rsvps (guest_expedition_id)
  where guest_expedition_id is not null;

