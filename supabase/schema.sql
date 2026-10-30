-- The shared photo wall on the homepage ("Find your people.").
--
-- Visitors sign in anonymously (behind a captcha) and send photos into a
-- private waiting bucket. Nothing is public until an officer listed in
-- wall_moderators approves it, which copies the photo into the public `wall`
-- bucket. Run this once in the SQL editor of a new Supabase project; the README
-- lists the dashboard settings that go with it.

-- ---------- Photos ----------

create table public.wall_photos (
  id uuid primary key default gen_random_uuid(),
  -- "<uploader id>/<photo id>.jpg", the same in both buckets.
  path text not null unique,
  shape text not null check (shape in ('portrait', 'landscape', 'wide')),
  status text not null default 'pending' check (status in ('pending', 'approved')),
  submitted_by uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index wall_photos_approved on public.wall_photos (approved_at desc) where status = 'approved';
create index wall_photos_submitted_by on public.wall_photos (submitted_by);

-- ---------- Moderators ----------

-- Officers who review photos, by the email they sign in with. Add one with:
--   insert into public.wall_moderators (email) values ('officer@syr.edu');
-- No policies: only the SQL editor and the dashboard can read or change it.
create table public.wall_moderators (
  email text primary key check (email = lower(email))
);
alter table public.wall_moderators enable row level security;

-- True for a signed-in officer whose email is confirmed and on the list.
-- Anonymous visitors have no email, so they never match.
create function public.is_wall_moderator() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.wall_moderators m on m.email = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;

-- How many of the current visitor's photos are still waiting.
create function public.wall_waiting_count() returns integer
language sql stable security definer set search_path = ''
as $$
  select count(*)::integer from public.wall_photos where submitted_by = auth.uid() and status = 'pending';
$$;

revoke all on function public.is_wall_moderator() from public;
revoke all on function public.wall_waiting_count() from public;
grant execute on function public.is_wall_moderator() to anon, authenticated;
grant execute on function public.wall_waiting_count() to authenticated;

-- ---------- Who can do what with the photo list ----------

alter table public.wall_photos enable row level security;

revoke all on public.wall_photos from anon, authenticated;
grant select on public.wall_photos to anon, authenticated;
grant insert (id, path, shape) on public.wall_photos to authenticated;
grant update (status, approved_at) on public.wall_photos to authenticated;
grant delete on public.wall_photos to authenticated;

-- Everyone sees approved photos; visitors also see their own; officers see all.
create policy "wall: read" on public.wall_photos for select
  using (status = 'approved' or submitted_by = auth.uid() or (select public.is_wall_moderator()));

-- A visitor sends a photo into their own folder, with at most 3 waiting at once.
create policy "wall: submit" on public.wall_photos for insert to authenticated
  with check (
    submitted_by = auth.uid()
    and status = 'pending'
    and path = auth.uid()::text || '/' || id::text || '.jpg'
    and (select public.wall_waiting_count()) < 3
  );

-- Only officers approve.
create policy "wall: approve" on public.wall_photos for update to authenticated
  using ((select public.is_wall_moderator()))
  with check ((select public.is_wall_moderator()));

-- Visitors can take back their own photos at any time; officers can remove any.
create policy "wall: remove" on public.wall_photos for delete to authenticated
  using (submitted_by = auth.uid() or (select public.is_wall_moderator()));

-- ---------- Storage ----------

-- Waiting photos are private; approved ones are served publicly. Both accept
-- only the small JPEGs the site makes (about 100 KB) and cap files at 1 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('wall-waiting', 'wall-waiting', false, 1048576, array['image/jpeg']),
  ('wall', 'wall', true, 1048576, array['image/jpeg']);

-- A visitor uploads only into their own folder of the waiting bucket.
create policy "wall: send to waiting" on storage.objects for insert to authenticated
  with check (bucket_id = 'wall-waiting' and (storage.foldername(name))[1] = auth.uid()::text);

-- Visitors see and remove their own files; officers see and remove everyone's.
create policy "wall: read files" on storage.objects for select to authenticated
  using (
    bucket_id in ('wall-waiting', 'wall')
    and ((storage.foldername(name))[1] = auth.uid()::text or (select public.is_wall_moderator()))
  );
create policy "wall: remove files" on storage.objects for delete to authenticated
  using (
    bucket_id in ('wall-waiting', 'wall')
    and ((storage.foldername(name))[1] = auth.uid()::text or (select public.is_wall_moderator()))
  );

-- Only officers put files into the public bucket, by approving them.
create policy "wall: publish" on storage.objects for insert to authenticated
  with check (bucket_id = 'wall' and (select public.is_wall_moderator()));
