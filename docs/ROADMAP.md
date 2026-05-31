# The Stead — Implementation Roadmap

Durable, in-repo source of truth for build status. Read this first when picking
up work in a new session, alongside [`docs/pwa-architecture.md`](./pwa-architecture.md)
(the approved plan/contract) and [`SECURITY.md`](../SECURITY.md).

GitHub Issues mirror the open items for visibility; this file is canonical.
Update the checkboxes in the same PR that lands the work.

## Status at a glance

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Foundation: Next + Tailwind + Supabase auth, design tokens, About page, CI | ✅ Done |
| 2 | Content pipeline + public read path, RLS migrations | ✅ Done |
| 3 | Logging + PWA: onboarding, /today, /log, Dexie, service worker | ⬜ Next |
| 4 | History + analytics (Recharts), CSV/JSON export (Pro) | ⬜ |
| 5 | Paid customization: builder, schedule editor, Stripe + entitlements | ⬜ |
| 6 | Remaining tiers picked up by the pipeline (no app changes) | ◻ Ongoing |

## Phase 1 — Foundation ✅

- [x] Next.js 16 / React 19 monorepo (`apps/web`, npm workspaces)
- [x] `@supabase/ssr` triad + middleware; magic-link auth; protected `/today`
- [x] Design tokens (light/dark), fonts via `next/font`, gym-readability scale
- [x] About page renders authored Markdown
- [x] CI: typecheck, lint, build, Playwright + axe
- [x] Deployed to Vercel prod (`the-stead.vercel.app`)

## Phase 2 — Content pipeline + read path ✅

- [x] `packages/content-pipeline`: shared Zod schema, prescription grammar (15 unit tests)
- [x] Parses all 6 tiers (`tier-0/1/2/3`, `c1`, `c2`) + movement libraries + week prose
- [x] Emits `apps/web/lib/content/generated/{programs,movements,manifest}.json` (offline bundle)
- [x] Emits idempotent `supabase/seed.sql`
- [x] Public read path: `/program`, `/program/[tier]`, `/program/[tier]/[week]/[day]`, `/movements`, `/movements/[tier]/[slug]` (448 static pages)
- [x] Supabase migrations: `0001_content`, `0002_user`, `0003_rls` (default-deny, `user_id = auth.uid()`)
- [x] CI runs pipeline tests + a generated-content drift guard
- [x] **Applied migrations + seed to cloud Supabase** (`iaveyizkpqbmkhlsdlte`): 6 programs / 18 blocks / 72 movements / 720 program_days / 3152 prescribed_items; user-table RLS enabled + forced
- [ ] Deferred to Phase 3: nonce-based CSP, `pgsodium` note encryption (tracked in SECURITY.md)

### Phase 2 deviations from the plan (intentional)

- **Read path imports generated JSON**, not live DB queries — offline-first, no
  round-trip. Seed SQL is still emitted so Phase 3 logging can FK to content rows.
- **Tier-scoped routes** (`/program/[tier]/...`, `/movements/[tier]/...`). The plan
  wrote `/program/[week]/[day]` assuming one enrolled program; multi-tier public
  browse needs the tier segment. Phase 3 adds the enrolled-user shortcut from
  `/today` into the right tier.
- **Text natural keys** for content tables (slug-derived) instead of uuid/bigint —
  keeps the seed idempotent and offline references stable.
- Movement linking from prescriptions is **best-effort** (token-substring match).
  Unlinked exercises still render from `rawText`. c1/c2 link rates are low (gym
  equipment names); revisit if cross-links matter for those tiers.

## Phase 3 — Logging + PWA 🟡 (MVP ship point)

**Increment A — core online flow ✅ (this session)**
- [x] Typed Supabase `Database` bindings generated from the live schema; wired into both clients
- [x] `/onboarding`: Path A/B → equipment tier (6 cards) → start date → writes `profiles` + `enrollments`
- [x] `/today`: enrolled session derived from `enrollments.current_week/day`; start/resume `workout_sessions`
- [x] `/log/[sessionId]`: gym screen (per-set reps/weight/duration, RPE, notes); writes `set_logs`, advances enrollment pointer (or marks `complete`)
- [x] FK id construction verified against the seeded cloud rows; e2e guards on the new protected routes

**Increment B1 — installable PWA shell ✅ (this session)**
- [x] Serwist on Turbopack (`@serwist/turbopack`): SW built from `app/sw.ts` via `app/serwist/[path]/route.ts`, registered prod-only via `SerwistProvider`
- [x] Precache app shell + offline fallback; `defaultCache` SWR runtime caching (visited pages + content chunks work offline)
- [x] `app/manifest.ts` (Stead palette), maskable + standard SVG icons, `app/~offline` fallback
- [x] SW served at root scope (`Service-Worker-Allowed: /`); excluded from auth middleware; e2e covers manifest + SW registration

**Increment B2 — offline writes ⬜ (next)**
- [ ] Dexie offline store + ULID-keyed sync queue (last-write-wins); rework `/log` to write local-first
- [ ] Precache the *current* program (week ±1) + movement library specifically
- [ ] Install prompt on `/about` after first logged session
- [ ] Apply `pgsodium` note encryption + nonce-based CSP (carried from Phase 2)

> Note: the authenticated write path's live round-trip (sign in → onboard → log →
> rows in Supabase) is verified on a real device per the cloud-only constraint —
> rides along with issue #5.

## Phase 4 — History + analytics ⬜

- [ ] `/history` calendar + per-movement charts (Recharts); free = last 4 weeks
- [ ] CSV/JSON export via Edge Function, gated to Pro

## Phase 5 — Paid customization ⬜

- [ ] Custom program builder + schedule editor (`custom_*` tables)
- [ ] Stripe via Edge Functions; `profiles.tier_entitlement` enforced in RLS + route guards
- [ ] `audit_events` surfaced in `/settings`; right-to-delete Edge Function

## Phase 6 — Remaining tiers ◻ ongoing

- [ ] Author content for any not-yet-complete tiers; pipeline picks them up automatically

## Operational follow-ups (not code)

- [x] Apply `supabase/migrations/*` + `supabase/seed.sql` to cloud Supabase
      (`iaveyizkpqbmkhlsdlte`) — done via `supabase db push --linked` + `db query --file`.
- [ ] Confirm Supabase Redirect URLs cover the prod + preview origins, and verify a
      real magic-link sign-in from a phone end to end.
- [ ] Keep `.env.local` out of git (public anon key only; never service role).
