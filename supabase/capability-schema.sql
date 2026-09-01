-- ─────────────────────────────────────────────────────────────────────────
-- Capability Graph State — User life state persistence
--
-- Stores the user's completed capabilities, in-progress capabilities,
-- and reached milestones. Derived from matter history — when a matter
-- is completed, the corresponding capability is marked complete.
-- ─────────────────────────────────────────────────────────────────────────

-- User capability state table (one row per user)
create table if not exists public.user_capability_state (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null unique,
  completed_capabilities text[] not null default '{}'::text[],
  in_progress_capabilities text[] not null default '{}'::text[],
  reached_milestones text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_capability_state_owner_idx on public.user_capability_state(owner_id);

-- RLS: users can only read their own state; writes go through server functions
alter table public.user_capability_state enable row level security;

drop policy if exists user_capability_state_select_own on public.user_capability_state;
create policy user_capability_state_select_own on public.user_capability_state
  for select using (auth.uid()::text = owner_id);

-- No client-facing insert/update/delete policies — state changes go through
-- server functions that use the service role key and enforce graph integrity.
drop policy if exists user_capability_state_insert_own on public.user_capability_state;
drop policy if exists user_capability_state_update_own on public.user_capability_state;

-- Updated_at trigger
drop trigger if exists user_capability_state_updated_at on public.user_capability_state;
create trigger user_capability_state_updated_at
  before update on public.user_capability_state
  for each row execute function public.set_private_office_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- Capability completion events — audit trail for capability state changes
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.user_capability_events (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  event_type text not null check (event_type in ('capability_started','capability_completed','milestone_reached','milestone_unlocked')),
  capability_id text,
  milestone_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_capability_events_owner_idx on public.user_capability_events(owner_id, created_at desc);

alter table public.user_capability_events enable row level security;

drop policy if exists user_capability_events_select_own on public.user_capability_events;
create policy user_capability_events_select_own on public.user_capability_events
  for select using (auth.uid()::text = owner_id);

drop policy if exists user_capability_events_insert_own on public.user_capability_events;
