-- Wishlist sign-ups — run via Supabase SQL Editor or: supabase db push / migration apply
--
-- Duplicate emails: enforced by unique index on normalized email (trim + lower in app matches this index).

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint wishlist_email_len check (
    char_length(email) >= 3
    and char_length(email) <= 254
  )
);

comment on table public.wishlist is 'Public waitlist / wishlist sign-ups';

create unique index if not exists wishlist_email_normalized_unique on public.wishlist (lower(trim(email)));

alter table public.wishlist enable row level security;

drop policy if exists "wishlist_insert_public" on public.wishlist;
create policy "wishlist_insert_public" on public.wishlist
  for insert
  to anon, authenticated
  with check (
    email is not null
    and trim(email) = email
    and lower(email) = email
    and char_length(email) between 3 and 254
    and length(email) - length(replace(email, '@', '')) = 1
    and strpos(email, '@') > 1
    and strpos(email, '@') < char_length(email)
  );

-- No SELECT policy: anon/authenticated cannot read rows (only insert). Service role still bypasses RLS.
