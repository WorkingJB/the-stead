-- 0001_content.sql — canonical program content.
--
-- These tables are written only by the seed script (service role at build time)
-- and read by any visitor. They hold no user data, so they are world-readable;
-- RLS is enabled with a permissive SELECT policy so the same client that reads
-- user rows can read content without a separate anon path.
--
-- Natural text keys (slug-derived) keep supabase/seed.sql idempotent and let
-- offline-created references stay stable across rebuilds.

create table if not exists public.programs (
  slug          text primary key,
  tier          text not null,
  title         text not null,
  length_weeks  int  not null,
  paths         text[] not null,
  optional_days text
);

create table if not exists public.blocks (
  id           text primary key,
  program_slug text not null references public.programs(slug) on delete cascade,
  number       int  not null,
  name         text not null,
  weeks        int[] not null
);

create table if not exists public.movements (
  id           text primary key,
  program_slug text not null references public.programs(slug) on delete cascade,
  pattern      text not null check (pattern in ('push','pull','squat','hinge','core','locomotion')),
  slug         text not null,
  name         text not null,
  tag          text not null default '',
  body_md      text not null default ''
);
create index if not exists movements_program_idx on public.movements(program_slug);

create table if not exists public.program_days (
  id             text primary key,
  program_slug   text not null references public.programs(slug) on delete cascade,
  week           int  not null,
  day            int  not null,
  path           text not null check (path in ('A','B')),
  title          text not null,
  kind           text not null check (kind in ('strength','cardio','tempo','intervals','long')),
  duration_label text not null default '',
  note           text not null default ''
);
create index if not exists program_days_lookup_idx
  on public.program_days(program_slug, week, day, path);

create table if not exists public.prescribed_items (
  id              text primary key,
  program_day_id  text not null references public.program_days(id) on delete cascade,
  order_idx       int  not null,
  movement_id     text references public.movements(id) on delete set null,
  raw_text        text not null,
  kind            text not null check (kind in ('exercise','note')),
  sets            int,
  rep_low         int,
  rep_high        int,
  duration_sec    int,
  distance_m      int,
  per_side        boolean,
  load_hint       text,
  note            text
);
create index if not exists prescribed_items_day_idx
  on public.prescribed_items(program_day_id, order_idx);

-- Content is public read-only. Enable RLS and allow SELECT to everyone; no
-- INSERT/UPDATE/DELETE policy exists, so writes are denied except service role.
do $$
declare t text;
begin
  foreach t in array array['programs','blocks','movements','program_days','prescribed_items']
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "content readable by all" on public.%I;', t);
    execute format(
      'create policy "content readable by all" on public.%I for select using (true);', t);
  end loop;
end $$;
