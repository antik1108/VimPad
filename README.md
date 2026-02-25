# VimPad Monorepo

VimPad is now organized as a monorepo using npm workspaces.

This project now supports real Supabase authentication and per-user database data (tasks, notes, history, config).

## Workspace Layout

- `apps/web` – the VimPad web app (Vite + React + TypeScript)

## Prerequisites

- Node.js 18+
- npm

## Getting Started (from repo root)

```sh
npm install
npm run dev
```

## Supabase Setup (Required)

1. Create a Supabase project.
2. Open SQL Editor in Supabase and run:
	- [apps/web/supabase/schema.sql](apps/web/supabase/schema.sql)
3. In Supabase Auth settings:
	- Enable Email/Password provider.
	- Configure email confirmation policy (optional, based on your product needs).

## OAuth Setup (Google/GitHub/GitLab)

Use `Authentication -> Sign In / Providers` (not `OAuth Server`).

1. Enable the provider(s) you want: Google, GitHub, GitLab.
2. Add your app URL in `Authentication -> URL Configuration`:
	- Site URL: your production URL (example `https://vimpad-cloud.vercel.app`)
	- Additional Redirect URLs:
	  - `http://localhost:8080/editor`
	  - `https://vimpad-cloud.vercel.app/editor`
3. In each provider console, set callback URL to your Supabase callback endpoint:
	- `https://iohesxutnjgsieetuece.supabase.co/auth/v1/callback`

Quick auth buttons in [apps/web/src/pages/LoginPage.tsx](apps/web/src/pages/LoginPage.tsx) and [apps/web/src/pages/RegisterPage.tsx](apps/web/src/pages/RegisterPage.tsx) are wired to `signInWithOAuth`.

## Environment Variables

Copy [apps/web/.env.example](apps/web/.env.example) to `apps/web/.env` and fill values:

```sh
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

For production hosting, set the same variables in your hosting provider dashboard.

## Common Commands (from repo root)

```sh
npm run build
npm run test
npm run lint
npm run preview
```

## Supabase CLI Sync (Optional but Recommended)

Once, connect local repo to your Supabase project:

```sh
npm run db:login
npm run db:link
```

Push local [apps/web/supabase/schema.sql](apps/web/supabase/schema.sql) changes to remote DB:

```sh
npm run db:push
```

Pull remote database schema back into local project:

```sh
npm run db:pull
```

## Notes

- Root scripts proxy to the `@vimpad/web` workspace.
- App source code is in `apps/web/src`.
- Authentication/session logic is in [apps/web/src/context/AuthContext.tsx](apps/web/src/context/AuthContext.tsx).
- Supabase client is in [apps/web/src/lib/supabaseClient.ts](apps/web/src/lib/supabaseClient.ts).
- Data store is in [apps/web/src/lib/store.ts](apps/web/src/lib/store.ts).

## Deploy (Production)

You can deploy the frontend to Vercel/Netlify/Cloudflare Pages.

### Build settings

- Root directory: repo root
- Build command: `npm run build`
- Output directory: `apps/web/dist`

### Required environment variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Multi-user behavior

- Each user signs up/signs in via Supabase Auth.
- All app tables are protected by Row Level Security (RLS).
- Every query only reads/writes rows where `user_id = auth.uid()`.
- This ensures each user sees only their own data in real-world usage.
