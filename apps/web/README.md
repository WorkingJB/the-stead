# @the-stead/web

The Stead PWA (Next.js 16 App Router + React 19, Tailwind v4, Supabase). Part of
the monorepo at the repo root; see `docs/pwa-architecture.md` for the full plan.

## Setup

```bash
# from repo root
npm install
cp apps/web/.env.local.example apps/web/.env.local   # fill in TheStead anon key + URL
```

`.env.local` points at the **cloud** Supabase project "TheStead"
(`https://iaveyizkpqbmkhlsdlte.supabase.co`). There is no local Supabase in this
setup — all testing happens against the cloud, on real devices. Only public
(`NEXT_PUBLIC_*`) keys go in this file. See `../../SECURITY.md`.

## Commands

```bash
npm run dev         # dev server  → http://localhost:3000
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test:e2e    # Playwright smoke + axe-core a11y (builds then serves locally)
```

(All are also runnable from the repo root, e.g. `npm run dev`.)

## Multi-device cloud testing

Magic-link redirects are derived from the live request origin, so the app works
from your laptop, phone, or a Vercel preview without code changes. The one
requirement: add each origin you test from to the Supabase
**Authentication → URL Configuration → Redirect URLs** allowlist
(see the operator checklist in `../../SECURITY.md`).

## What's here (Phase 1 — Foundation)

- Design tokens (`lib/design/tokens.css`) from `shared/design-tokens.md`, light +
  dark, WCAG AA; Cormorant / Lora / Inter via `next/font`.
- Supabase `@supabase/ssr` client triad (`lib/supabase/`) + session middleware.
- Passwordless magic-link auth (`/login`, `/auth/callback`) + protected `/today`.
- About page rendered from authored Markdown (`content/tier-0/front-matter/*.md`).
- CI: typecheck, lint, build, Playwright smoke + axe-core (`.github/workflows/ci.yml`).

Content pipeline, real program rendering, offline logging, and PWA service worker
come in Phases 2–3.
