create extension if not exists pgcrypto;

-- Private Office matters table
create table if not exists public.private_office_matters (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  workflow_id text not null,
  document_id text not null,
  title text not null,
  status text not null check (status in ('draft','validated','review','approved','payment_pending','submitted','tracking','completed','failed','cancelled')),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  submitted_at timestamptz,
  provider_order_id text,
  tracking_number text,
  proof_hash text
);

create index if not exists private_office_matters_owner_idx on public.private_office_matters(owner_id, updated_at desc);
create index if not exists private_office_matters_workflow_idx on public.private_office_matters(owner_id, workflow_id, updated_at desc);
create unique index if not exists private_office_matters_provider_order_idx on public.private_office_matters(provider_order_id) where provider_order_id is not null;

-- Private Office evidence table
create table if not exists public.private_office_evidence (
  id text primary key,
  matter_id uuid not null references public.private_office_matters(id) on delete cascade,
  owner_id text not null,
  description text not null,
  status text not null check (status in ('missing','requested','provided','verified','rejected','not_applicable')),
  source_document_id text,
  supports_finding_ids jsonb not null default '[]'::jsonb,
  verified_at timestamptz,
  verified_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists private_office_evidence_matter_idx on public.private_office_evidence(matter_id, status);
create index if not exists private_office_evidence_owner_idx on public.private_office_evidence(owner_id, updated_at desc);

-- Private Office events table (audit trail)
create table if not exists public.private_office_events (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid not null references public.private_office_matters(id) on delete cascade,
  owner_id text not null,
  event_type text not null,
  actor_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists private_office_events_matter_idx on public.private_office_events(matter_id, created_at desc);
create index if not exists private_office_events_owner_idx on public.private_office_events(owner_id, created_at desc);

-- Private Office mailing intents table
create table if not exists public.private_office_mailing_intents (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  workflow_id text not null,
  matter_id uuid references public.private_office_matters(id) on delete set null,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  status text not null default 'pending',
  mailing_method text not null,
  draft_content text not null,
  recipient jsonb not null,
  matter_reference text,
  matter_type text not null default 'private-office',
  provider_order_id text,
  tracking_number text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists private_office_mailing_intents_owner_idx on public.private_office_mailing_intents(owner_id, updated_at desc);
create index if not exists private_office_mailing_intents_stripe_idx on public.private_office_mailing_intents(stripe_session_id);
create index if not exists private_office_mailing_intents_provider_idx on public.private_office_mailing_intents(provider_order_id);

-- Enable Row Level Security
alter table public.private_office_matters enable row level security;
alter table public.private_office_evidence enable row level security;
alter table public.private_office_events enable row level security;
alter table public.private_office_mailing_intents enable row level security;

-- RLS Policies: owner_id = auth.uid()
drop policy if exists private_office_matters_select_own on public.private_office_matters;
create policy private_office_matters_select_own on public.private_office_matters for select using (auth.uid()::text = owner_id);
drop policy if exists private_office_matters_insert_own on public.private_office_matters;
create policy private_office_matters_insert_own on public.private_office_matters for insert with check (auth.uid()::text = owner_id);
drop policy if exists private_office_matters_update_own on public.private_office_matters;
create policy private_office_matters_update_own on public.private_office_matters for update using (auth.uid()::text = owner_id) with check (auth.uid()::text = owner_id);
drop policy if exists private_office_matters_delete_own on public.private_office_matters;
create policy private_office_matters_delete_own on public.private_office_matters for delete using (auth.uid()::text = owner_id);

drop policy if exists private_office_evidence_select_own on public.private_office_evidence;
create policy private_office_evidence_select_own on public.private_office_evidence for select using (auth.uid()::text = owner_id);
drop policy if exists private_office_evidence_insert_own on public.private_office_evidence;
create policy private_office_evidence_insert_own on public.private_office_evidence for insert with check (auth.uid()::text = owner_id);
drop policy if exists private_office_evidence_update_own on public.private_office_evidence;
create policy private_office_evidence_update_own on public.private_office_evidence for update using (auth.uid()::text = owner_id) with check (auth.uid()::text = owner_id);
drop policy if exists private_office_evidence_delete_own on public.private_office_evidence;
create policy private_office_evidence_delete_own on public.private_office_evidence for delete using (auth.uid()::text = owner_id);

drop policy if exists private_office_events_select_own on public.private_office_events;
create policy private_office_events_select_own on public.private_office_events for select using (auth.uid()::text = owner_id);
drop policy if exists private_office_events_insert_own on public.private_office_events;
create policy private_office_events_insert_own on public.private_office_events for insert with check (auth.uid()::text = owner_id);

drop policy if exists private_office_mailing_intents_select_own on public.private_office_mailing_intents;
create policy private_office_mailing_intents_select_own on public.private_office_mailing_intents for select using (auth.uid()::text = owner_id);
drop policy if exists private_office_mailing_intents_insert_own on public.private_office_mailing_intents;
create policy private_office_mailing_intents_insert_own on public.private_office_mailing_intents for insert with check (auth.uid()::text = owner_id);
drop policy if exists private_office_mailing_intents_update_own on public.private_office_mailing_intents;
create policy private_office_mailing_intents_update_own on public.private_office_mailing_intents for update using (auth.uid()::text = owner_id) with check (auth.uid()::text = owner_id);

-- Updated_at triggers
create or replace function public.set_private_office_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists private_office_matters_updated_at on public.private_office_matters;
create trigger private_office_matters_updated_at before update on public.private_office_matters for each row execute function public.set_private_office_updated_at();

drop trigger if exists private_office_evidence_updated_at on public.private_office_evidence;
create trigger private_office_evidence_updated_at before update on public.private_office_evidence for each row execute function public.set_private_office_updated_at();

drop trigger if exists private_office_mailing_intents_updated_at on public.private_office_mailing_intents;
create trigger private_office_mailing_intents_updated_at before update on public.private_office_mailing_intents for each row execute function public.set_private_office_updated_at();

-- Owner immutability guard for mailing intents
create or replace function public.prevent_private_office_mailing_owner_change()
returns trigger language plpgsql as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'Cannot change mailing intent owner';
  end if;
  return new;
end;
$$;

drop trigger if exists private_office_mailing_intents_owner_guard on public.private_office_mailing_intents;
create trigger private_office_mailing_intents_owner_guard before update on public.private_office_mailing_intents for each row execute function public.prevent_private_office_mailing_owner_change();
