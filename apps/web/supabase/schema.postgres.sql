-- Supabase projects already have pgcrypto available for gen_random_uuid().

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  priority text not null check (priority in ('H', 'M', 'L')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  images jsonb not null default CAST('[]' AS jsonb),
  created_at timestamptz not null default now()
);

create table if not exists public.history_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hash text not null,
  message text not null,
  date timestamptz not null default now()
);

create table if not exists public.app_configs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'dark' check (theme in ('dark', 'light', 'system')),
  show_line_numbers boolean not null default true,
  sort_order text not null default 'priority' check (sort_order in ('priority', 'date', 'alpha')),
  confirm_delete boolean not null default true,
  reminder_time text not null default '0800',
  high_priority_color text not null default '#ff5555',
  default_priority text not null default 'M' check (default_priority in ('H', 'M', 'L')),
  auto_save boolean not null default true
);

alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.history_entries enable row level security;
alter table public.app_configs enable row level security;

drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own" on public.tasks
for select using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own" on public.tasks
for insert with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own" on public.tasks
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own" on public.tasks
for delete using (auth.uid() = user_id);

drop policy if exists "notes_select_own" on public.notes;
create policy "notes_select_own" on public.notes
for select using (auth.uid() = user_id);

drop policy if exists "notes_insert_own" on public.notes;
create policy "notes_insert_own" on public.notes
for insert with check (auth.uid() = user_id);

drop policy if exists "notes_update_own" on public.notes;
create policy "notes_update_own" on public.notes
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notes_delete_own" on public.notes;
create policy "notes_delete_own" on public.notes
for delete using (auth.uid() = user_id);

drop policy if exists "history_select_own" on public.history_entries;
create policy "history_select_own" on public.history_entries
for select using (auth.uid() = user_id);

drop policy if exists "history_insert_own" on public.history_entries;
create policy "history_insert_own" on public.history_entries
for insert with check (auth.uid() = user_id);

drop policy if exists "history_update_own" on public.history_entries;
create policy "history_update_own" on public.history_entries
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "history_delete_own" on public.history_entries;
create policy "history_delete_own" on public.history_entries
for delete using (auth.uid() = user_id);

drop policy if exists "config_select_own" on public.app_configs;
create policy "config_select_own" on public.app_configs
for select using (auth.uid() = user_id);

drop policy if exists "config_insert_own" on public.app_configs;
create policy "config_insert_own" on public.app_configs
for insert with check (auth.uid() = user_id);

drop policy if exists "config_update_own" on public.app_configs;
create policy "config_update_own" on public.app_configs
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "config_delete_own" on public.app_configs;
create policy "config_delete_own" on public.app_configs
for delete using (auth.uid() = user_id);
