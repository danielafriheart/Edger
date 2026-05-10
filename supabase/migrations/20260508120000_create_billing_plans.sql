-- Edger — public billing plan catalog for marketing / UI display.
-- Polar owns checkout, webhooks, and entitlements; this table holds copy, benefits,
-- and empty-string placeholders for Polar IDs until you wire products in Polar.

create table if not exists public.billing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  tier text not null,
  billing_interval text not null
    constraint billing_plans_billing_interval_chk
      check (billing_interval in ('none', 'month', 'year', 'pack')),
  display_name text not null,
  short_description text not null,
  price_label text not null,
  cadence_label text not null,
  footnote text not null default '',
  features jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  is_highlighted boolean not null default false,
  is_active boolean not null default true,
  polar_product_id text not null default '',
  polar_price_id text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_plans_slug_nonempty check (char_length(trim(slug)) > 0),
  constraint billing_plans_features_array_chk check (jsonb_typeof(features) = 'array')
);

comment on table public.billing_plans is 'Plan catalog for display; Polar is source of truth for billing. polar_* default empty until linked.';

comment on column public.billing_plans.slug is 'Stable id: free | payg | pro_monthly | pro_annual — align with app enums / webhooks.';
comment on column public.billing_plans.tier is 'UI grouping: free | payg | pro';
comment on column public.billing_plans.billing_interval is 'none=no charge, pack=PAYG credits, month/year for subscriptions';
comment on column public.billing_plans.features is 'JSON array of benefit strings for pricing cards';
comment on column public.billing_plans.polar_product_id is 'Polar Product id (empty until configured)';
comment on column public.billing_plans.polar_price_id is 'Polar Price id for this interval (empty until configured)';

create unique index if not exists billing_plans_slug_key on public.billing_plans (slug);
create index if not exists billing_plans_active_sort_idx on public.billing_plans (is_active, sort_order);

alter table public.billing_plans enable row level security;

-- Public read of active rows only (catalog). No client writes — use Dashboard or service role.
drop policy if exists "billing_plans_select_active_public" on public.billing_plans;
create policy "billing_plans_select_active_public" on public.billing_plans
  for select
  to anon, authenticated
  using (is_active = true);

grant select on table public.billing_plans to anon, authenticated;

-- Seed: matches src/constants/pricing.ts + Pricing page display (Polar IDs left blank).
insert into public.billing_plans (
  slug,
  tier,
  billing_interval,
  display_name,
  short_description,
  price_label,
  cadence_label,
  footnote,
  features,
  sort_order,
  is_highlighted,
  polar_product_id,
  polar_price_id
)
values
  (
    'free',
    'free',
    'none',
    'Free',
    'For anyone curious about the tool.',
    '$0',
    'forever',
    '',
    '[
      "Unlimited manual lot sizing",
      "All instruments (FX, metals, indices, crypto)",
      "Direction-aware validation",
      "Optional chart screenshot as a workspace reference",
      "Forever free, no card needed"
    ]'::jsonb,
    0,
    false,
    '',
    ''
  ),
  (
    'payg',
    'payg',
    'pack',
    'Pay as you go',
    'Hold a prepaid balance toward future metered features.',
    'From $10',
    'credit packs',
    'Credits never expire · apply when metering ships',
    '[
      "Everything in Free",
      "Credit balance rolls forward indefinitely",
      "Apply credits first when metered tools ship",
      "Upgrade path to Pro any time"
    ]'::jsonb,
    10,
    false,
    '',
    ''
  ),
  (
    'pro_monthly',
    'pro',
    'month',
    'Pro',
    'For traders sizing every day.',
    '$19',
    '/ month',
    'Cancel any time',
    '[
      "Everything in Free",
      "History of past calculations",
      "Broker-specific contract presets",
      "Trade-journal export",
      "Account-currency conversion (EUR, GBP, etc.)"
    ]'::jsonb,
    20,
    true,
    '',
    ''
  ),
  (
    'pro_annual',
    'pro',
    'year',
    'Pro',
    'For traders sizing every day.',
    '$15.83',
    '/ month, billed annually',
    '$190 billed yearly · 2 months free',
    '[
      "Everything in Free",
      "History of past calculations",
      "Broker-specific contract presets",
      "Trade-journal export",
      "Account-currency conversion (EUR, GBP, etc.)"
    ]'::jsonb,
    30,
    true,
    '',
    ''
  )
on conflict (slug) do nothing;
