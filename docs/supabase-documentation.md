# Supabase Documentation (VimPad)

This document records what has been implemented in this project for Supabase.

## 1) What was integrated

- Supabase project connected to the frontend app (`apps/web`).
- Real authentication enabled (email/password + OAuth providers).
- Per-user cloud data persistence for tasks, notes, history, and config.
- Row Level Security (RLS) enabled so each user can access only their own records.
- Supabase CLI workflow configured for schema sync.

## 2) Environment variables used

Frontend uses only these public variables in `apps/web/.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Reference template: `apps/web/.env.example`

## 3) App files added/updated for Supabase

### Client + Auth

- `apps/web/src/lib/supabaseClient.ts` → Supabase client instance.
- `apps/web/src/context/AuthContext.tsx` → session + auth state.
- `apps/web/src/components/ProtectedRoute.tsx` → protects private routes.
- `apps/web/src/App.tsx` → private route wiring.

### Auth pages

- `apps/web/src/pages/LoginPage.tsx` → email/password login + OAuth buttons.
- `apps/web/src/pages/RegisterPage.tsx` → signup + OAuth buttons.
- `apps/web/src/pages/ConfigPage.tsx` → sign out integration.

### Data layer

- `apps/web/src/lib/store.ts` migrated from demo/in-memory behavior to Supabase CRUD:
  - tasks
  - notes
  - history_entries
  - app_configs

## 4) Database schema and security

Schema file:

- `apps/web/supabase/schema.postgres.sql`

Config file:

- `apps/web/supabase/config.toml`

### Tables created

- `public.tasks`
- `public.notes`
- `public.history_entries`
- `public.app_configs`

### Security model implemented

- `enable row level security` on all above tables.
- Policies for `select`, `insert`, `update`, `delete` scoped by:
  - `auth.uid() = user_id`

This ensures strict per-user data isolation.

## 5) OAuth setup status

Implemented in app UI with `signInWithOAuth`.

Supported providers in app:

- GitHub
- Google
- GitLab

Supabase dashboard area used:

- `Authentication -> Sign In / Providers`

Important note:

- `OAuth Server` section is not the place for provider client credentials.

## 6) Deployment behavior

- Hosting target: Vercel.
- SPA refresh routing handled by:
  - `apps/web/vercel.json`

Required production env vars on host:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 7) Supabase CLI workflow configured

Run from repo root:

```bash
npm run db:login
npm run db:link
npm run db:push
npm run db:pull
npm run db:status
```

What these are used for:

- `db:link` → one-time link to remote project.
- `db:push` → apply local schema to remote.
- `db:pull` → pull remote schema locally.
- `db:status` → check schema/migration status.

## 8) Security notes followed

- Service-role/secret keys are **not** used in frontend code.
- Only anon/publishable key is used in `VITE_*` variables.
- If any secret key was exposed earlier, rotate it in Supabase dashboard.

## 9) Current result

VimPad is no longer demo-only. It is running with real Supabase backend integration:

- Real auth
- Real cloud persistence
- User-isolated data via RLS
- OAuth sign-in options
