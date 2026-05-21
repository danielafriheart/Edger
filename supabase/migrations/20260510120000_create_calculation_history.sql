-- Per-user lot-sizing runs (Clerk user id === JWT claim `sub`).
create table if not exists public.calculation_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  created_at timestamptz not null default now(),
  pair_category text not null,
  instrument_symbol text not null,
  direction text not null
    constraint calculation_history_direction_chk
      check (direction in ('long', 'short')),
  entry double precision not null,
  stop_loss double precision not null,
  take_profit double precision not null,
  risk_usd double precision not null,
  calculation_ok boolean not null default false,
  lot_size double precision,
  pip_distance_sl double precision,
  pip_distance_tp double precision,
  pip_value_per_lot_usd double precision,
  potential_profit_usd double precision,
  risk_reward_ratio double precision,
  errors jsonb not null default '[]'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  ai_feedback jsonb,
  constraint calculation_history_errors_array_chk check (jsonb_typeof(errors) = 'array'),
  constraint calculation_history_warnings_array_chk check (jsonb_typeof(warnings) = 'array'),
  constraint calculation_history_ai_object_or_null_chk
    check (ai_feedback is null or jsonb_typeof(ai_feedback) = 'object'),
  constraint calculation_history_user_nonempty check (char_length(trim(user_id)) > 0)
);

comment on table public.calculation_history is 'Lot-size calculation audit trail; RLS restricts rows to JWT sub.';
comment on column public.calculation_history.user_id is 'Clerk user id (matches auth.jwt() ->> ''sub'')';
comment on column public.calculation_history.ai_feedback is 'Structured Gemini notes (never source of truth for lot size).';

create index if not exists calculation_history_user_created_idx
  on public.calculation_history (user_id, created_at desc);

alter table public.calculation_history enable row level security;

drop policy if exists "calculation_history_select_own" on public.calculation_history;
create policy "calculation_history_select_own" on public.calculation_history
  for select
  to authenticated
  using ((auth.jwt() ->> 'sub') = user_id);

drop policy if exists "calculation_history_insert_own" on public.calculation_history;
create policy "calculation_history_insert_own" on public.calculation_history
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'sub') = user_id);

drop policy if exists "calculation_history_delete_own" on public.calculation_history;
create policy "calculation_history_delete_own" on public.calculation_history
  for delete
  to authenticated
  using ((auth.jwt() ->> 'sub') = user_id);

grant select, insert, delete on table public.calculation_history to authenticated;
