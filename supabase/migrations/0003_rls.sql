-- 0003_rls.sql — row-level security for user data, default-deny.
--
-- Every user table gets RLS enabled with policies scoped to auth.uid(). Tables
-- carrying a user_id are filtered directly; set_logs is additionally guarded so
-- a row's user_id must match its parent session's owner (defense in depth).
--
-- No service-role bypass is needed from the browser: the anon/auth client only
-- ever sees its own rows. Seed + Edge Functions use the service role.

-- Helper: owns-row policy on a table with a user_id column.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','enrollments','workout_sessions','set_logs','audit_events'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('alter table public.%I force row level security;', t);
  end loop;
end $$;

-- profiles: keyed by user_id as the primary key.
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own enrollments" on public.enrollments;
create policy "own enrollments" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own sessions" on public.workout_sessions;
create policy "own sessions" on public.workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- set_logs: own the row AND own the parent session.
drop policy if exists "own set logs" on public.set_logs;
create policy "own set logs" on public.set_logs
  for all
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.workout_sessions s
      where s.id = set_logs.session_id and s.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.workout_sessions s
      where s.id = set_logs.session_id and s.user_id = auth.uid()
    )
  );

-- audit_events: users may read their own; inserts come from Edge Functions
-- (service role) only, so no INSERT policy is granted to authenticated users.
drop policy if exists "read own audit" on public.audit_events;
create policy "read own audit" on public.audit_events
  for select using (auth.uid() = user_id);
