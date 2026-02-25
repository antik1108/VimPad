<hr />

<div align="center">

# VimPad

[![Monorepo](https://img.shields.io/badge/monorepo-npm%20workspaces-0f172a?style=flat-square)](https://docs.npmjs.com/cli/v11/using-npm/workspaces)
[![Frontend](https://img.shields.io/badge/frontend-react%20%2B%20vite-2563eb?style=flat-square)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/backend-supabase-16a34a?style=flat-square)](https://supabase.com/)
[![Language](https://img.shields.io/badge/language-typescript-1d4ed8?style=flat-square)](https://www.typescriptlang.org/)

VimPad is a Vim-inspired productivity app with **real authentication** and **per-user cloud data**.

Every user gets an isolated workspace (tasks, notes, history, config) powered by Supabase Auth + Postgres + RLS.

[Getting Started](#getting-started) •
[Supabase Setup](#supabase-setup-required) •
[OAuth Setup](#oauth-setup-googlegithubgitlab) •
[Deploy](#deploy-production) •
[Troubleshooting](#troubleshooting)

</div>

## Features

- Vim-style UI flows for login, notes, stats, config
- Real user auth (email/password + OAuth)
- Per-user data isolation with Row Level Security
- Monorepo structure with workspace scripts
- Vercel SPA refresh support via rewrite config

## Workspace Structure

```text
.
├─ apps/
│  └─ web/
│     ├─ src/
│     ├─ supabase/
│     │  ├─ schema.sql
│     │  └─ config.toml
│     ├─ .env.example
│     └─ vercel.json
├─ package.json
└─ README.md
```

## Tech Stack

- React + Vite + TypeScript
- Tailwind + shadcn/ui components
- Supabase Auth + Postgres
- Hosted on Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Run

From repo root:

```sh
npm install
npm run dev
```

## Environment Variables

Copy [apps/web/.env.example](apps/web/.env.example) to `apps/web/.env`:

```sh
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Use the same values in your hosting provider environment settings.

## Supabase Setup (Required)

1. Create a Supabase project.
2. Open SQL Editor and run [apps/web/supabase/schema.sql](apps/web/supabase/schema.sql).
3. In Supabase Auth:
	 - Enable Email/Password provider.
	 - Configure email confirmation policy if needed.

## OAuth Setup (Google/GitHub/GitLab)

Use `Authentication -> Sign In / Providers` (**not** `OAuth Server`).

1. Enable the provider(s) you want.
2. In `Authentication -> URL Configuration`, set:
	 - Site URL: `https://vimpad-cloud.vercel.app` (or your own domain)
	 - Additional Redirect URLs:
		 - `http://localhost:8080/editor`
		 - `https://vimpad-cloud.vercel.app/editor`
3. In Google/GitHub/GitLab developer consoles, set callback URL:
	 - `https://iohesxutnjgsieetuece.supabase.co/auth/v1/callback`

Quick auth buttons are wired in:

- [apps/web/src/pages/LoginPage.tsx](apps/web/src/pages/LoginPage.tsx)
- [apps/web/src/pages/RegisterPage.tsx](apps/web/src/pages/RegisterPage.tsx)

## Scripts

Run from repo root:

```sh
npm run dev
npm run build
npm run test
npm run lint
npm run preview
```

## Supabase CLI Sync

One-time project link:

```sh
npm run db:login
npm run db:link
```

Push local schema changes:

```sh
npm run db:push
```

Pull remote schema:

```sh
npm run db:pull
```

Check migration status:

```sh
npm run db:status
```

## Deploy (Production)

### Vercel (recommended)

Build settings:

- Root Directory: `apps/web`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

SPA refresh routing is handled by [apps/web/vercel.json](apps/web/vercel.json).

## Data Model

Core tables (all RLS-protected):

- `tasks`
- `notes`
- `history_entries`
- `app_configs`

All reads/writes are scoped by `user_id = auth.uid()`.

## Troubleshooting

- **Vercel refresh shows 404**
	- Ensure [apps/web/vercel.json](apps/web/vercel.json) is committed and redeployed.
- **OAuth fields show invalid value**
	- Use provider-issued OAuth Client ID + Client Secret, not project name/password.
- **SQL shows syntax errors in editor**
	- Ensure SQL file is treated as PostgreSQL/Supabase dialect.
- **`db:status` fails before link**
	- Run `npm run db:login` and `npm run db:link` once first.

## Security Notes

- Never expose Supabase service-role/secret keys in frontend code.
- Only publishable (`anon`) key belongs in `VITE_*` variables.
- If any secret key was shared publicly, rotate it in Supabase dashboard.

## Project Files

- Auth context: [apps/web/src/context/AuthContext.tsx](apps/web/src/context/AuthContext.tsx)
- Supabase client: [apps/web/src/lib/supabaseClient.ts](apps/web/src/lib/supabaseClient.ts)
- Store/data layer: [apps/web/src/lib/store.ts](apps/web/src/lib/store.ts)
- DB schema: [apps/web/supabase/schema.sql](apps/web/supabase/schema.sql)

---

Built for focused, terminal-inspired productivity with real cloud sync.
