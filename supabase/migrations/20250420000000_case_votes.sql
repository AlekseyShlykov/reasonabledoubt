-- Aggregate votes per canonical case id (1–10) for community statistics.
-- Run in Supabase SQL editor if migrations are not applied automatically.

create table if not exists public.case_votes (
  id uuid default gen_random_uuid() primary key,
  case_id int not null check (case_id >= 1 and case_id <= 10),
  verdict boolean not null,
  session_id text,
  created_at timestamptz default now() not null
);

create index if not exists case_votes_case_id_idx on public.case_votes (case_id);

alter table public.case_votes enable row level security;

-- Allow anonymous clients (NEXT_PUBLIC_SUPABASE_ANON_KEY) to record and read votes.
create policy "case_votes_insert_anon"
  on public.case_votes for insert
  to anon
  with check (true);

create policy "case_votes_select_anon"
  on public.case_votes for select
  to anon
  using (true);
