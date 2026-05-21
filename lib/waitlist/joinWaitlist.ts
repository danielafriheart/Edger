"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type JoinWaitlistResult = { ok: true; email: string } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(emailRaw: string): Promise<JoinWaitlistResult> {
  const email = (emailRaw ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email." };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("wishlist").insert({ email });
  if (!error) return { ok: true, email };

  // Treat duplicates as success — users may double-submit, the page state is
  // identical either way and we don't want to leak who is on the list.
  const dup = error.code === "23505" || error.message.toLowerCase().includes("duplicate key");
  if (dup) return { ok: true, email };

  return { ok: false, error: error.message || "Couldn't save — try again in a minute." };
}
