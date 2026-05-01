-- Replace permissive INSERT policy (WITH CHECK true) flagged by Supabase advisors.
-- Safe for envs that already ran 20260201180000_create_wishlist.sql.

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
