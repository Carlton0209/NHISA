-- The comments at the bottom of the homepage ("Say hello.").
--
-- Anyone can read them. Visitors post as the same anonymous, captcha-checked
-- session the photo wall uses, and a comment appears for everyone at once.
-- Visitors can delete their own; officers in wall_moderators can delete any.
-- Run this in the SQL editor after schema.sql (it uses is_wall_moderator()).

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  -- Empty shows as "Anonymous".
  name text not null default '' check (char_length(name) <= 40),
  -- Up to 500 characters, not all blank.
  body text not null check (char_length(body) <= 500 and body ~ '\S'),
  author uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

create index comments_newest on public.comments (created_at desc);
create index comments_author on public.comments (author, created_at desc);

-- How many comments the current visitor posted in the last ten minutes.
create function public.comments_recent_count() returns integer
language sql stable security definer set search_path = ''
as $$
  select count(*)::integer from public.comments where author = auth.uid() and created_at > now() - interval '10 minutes';
$$;

-- Supabase grants new functions to anon by default, so take that back too.
revoke all on function public.comments_recent_count() from public, anon;
grant execute on function public.comments_recent_count() to authenticated;

-- ---------- Who can do what ----------

alter table public.comments enable row level security;

-- Everything but who wrote it: anonymous ids would tie a visitor's comments together.
revoke all on public.comments from anon, authenticated;
grant select (id, name, body, created_at) on public.comments to anon, authenticated;
grant insert (name, body) on public.comments to authenticated;
grant delete on public.comments to authenticated;

create policy "comments: read" on public.comments for select using (true);

-- A visitor posts as themselves, at most 5 comments in any ten minutes.
create policy "comments: post" on public.comments for insert to authenticated
  with check (author = auth.uid() and (select public.comments_recent_count()) < 5);

create policy "comments: remove" on public.comments for delete to authenticated
  using (author = auth.uid() or (select public.is_wall_moderator()));
