-- 0002_user.sql — per-user data tables.
--
-- Every row is owned by exactly one auth user. RLS policies (0003) restrict all
-- access to `user_id = auth.uid()`. PII is minimized: only display_name is
-- stored here; email lives in Supabase-managed auth.users.

create table if not exists public.profiles (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  display_name     text,
  units            text not null default 'imperial' check (units in ('imperial','metric')),
  dark_mode        text not null default 'system' check (dark_mode in ('light','dark','system')),
  tier_entitlement text not null default 'free' check (tier_entitlement in ('free','pro')),
  created_at       timestamptz not null default now()
);

create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  program_slug text not null references public.programs(slug),
  path         text not null check (path in ('A','B')),
  started_at   date not null default current_date,
  current_week int  not null default 1,
  current_day  int  not null default 1,
  status       text not null default 'active' check (status in ('active','paused','complete')),
  created_at   timestamptz not null default now()
);
create index if not exists enrollments_user_idx on public.enrollments(user_id);

create table if not exists public.workout_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  enrollment_id   uuid references public.enrollments(id) on delete set null,
  program_day_id  text references public.program_days(id),
  performed_at    timestamptz not null default now(),
  rpe             int,
  sleep_prior     numeric,
  body_weight     numeric,
  notes           text,
  created_at      timestamptz not null default now()
);
create index if not exists workout_sessions_user_idx on public.workout_sessions(user_id, performed_at desc);

create table if not exists public.set_logs (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references public.workout_sessions(id) on delete cascade,
  user_id             uuid not null references auth.users(id) on delete cascade,
  prescribed_item_id  text references public.prescribed_items(id),
  movement_id         text references public.movements(id),
  set_index           int not null,
  reps                int,
  weight              numeric,
  weight_unit         text check (weight_unit in ('lb','kg')),
  duration_sec        int,
  distance_m          int,
  completed           boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists set_logs_session_idx on public.set_logs(session_id);
create index if not exists set_logs_user_idx on public.set_logs(user_id);

create table if not exists public.audit_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null,
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_user_idx on public.audit_events(user_id, created_at desc);
