# Security — The Stead

Security is a go-to-market differentiator for The Stead, so it is designed in from
day one. This document is the living threat model and control inventory. The full
RLS migrations landed in Phase 2 (`supabase/migrations/0001_content.sql`,
`0002_user.sql`, `0003_rls.sql`); see [docs/ROADMAP.md](docs/ROADMAP.md) for status.

## Data we collect (PII minimization)

- **Email** — held only in Supabase-managed `auth.users`, never copied into app tables.
- **`display_name`** — optional, user-chosen.
- We do **not** store real names, addresses, phone numbers, or health conditions.

## Controls

| Control | Status |
|---|---|
| Passwordless auth (email magic link; passkey/WebAuthn planned) | ✅ Phase 1 |
| `HttpOnly` / `Secure` / `SameSite` session cookies via `@supabase/ssr` | ✅ Phase 1 |
| Session refresh in middleware; protected route guards | ✅ Phase 1 |
| Public env validated at load; only `NEXT_PUBLIC_*` client keys shipped | ✅ Phase 1 |
| Baseline transport headers (nosniff, frame-deny, referrer, permissions, HSTS in prod) | ✅ Phase 1 |
| Accessibility/contrast enforced in CI (axe-core, WCAG AA) | ✅ Phase 1 |
| RLS default-deny on every user table (`auth.uid() = user_id`) | ✅ Phase 2 (migrations written; apply to cloud — issue #4) |
| Strict nonce-based CSP (no inline scripts) | ⏳ Phase 3 (issue #7) |
| `pgsodium` per-user column encryption of free-form notes | ⏳ Phase 3 (issue #7) |
| Append-only `audit_events` for sensitive actions | ⏳ Phase 5 |
| Right-to-delete Edge Function (cascade + revoke user) | ⏳ Phase 5 |

## Key handling

- The **anon** key is a public client key and lives in `apps/web/.env.local`
  (gitignored) and in deployment env. Safe to ship to the browser.
- The **service_role** / `sb_secret` keys are never committed, never prefixed
  `NEXT_PUBLIC_`, and are used only server-side (seed script, Stripe webhook,
  delete/export Edge Functions) — never from the browser.

## Connection isolation (operator note)

This repo is pinned to its own backends and must not be cross-wired to another
project's resources:

- **Supabase:** linked project is **"TheStead"**, ref `iaveyizkpqbmkhlsdlte`
  (`supabase/.temp/linked-project.json`). Verify this ref before any remote DB
  command. Do not run a global `supabase login`/`link` that repoints other repos.
- **Vercel:** project `the-stead` (`.vercel/project.json`).

## Operator setup checklist (cloud + multi-device testing)

1. In the Supabase dashboard → **Authentication → URL Configuration**, set the
   **Site URL** and add deploy/preview origins to **Redirect URLs**
   (e.g. `https://the-stead*.vercel.app/**` and any custom domain). Magic-link
   redirects are derived from the live request origin, so every host you test
   from must be allow-listed here.
2. Configure the same `NEXT_PUBLIC_*` vars in Vercel project env (anon key + URL).
3. Keep service-role / Stripe secrets in Vercel/Supabase secret env only.

## Reporting

Report suspected vulnerabilities privately to the maintainer; do not open a public
issue with exploit details.
