import { useState } from "react";
import { WaitlistPageFooter } from "../components/waitlist/WaitlistPageFooter";
import { WaitlistPillNav } from "../components/waitlist/WaitlistPillNav";
import { WaitlistSignupView } from "../components/waitlist/WaitlistSignupView";
import { WaitlistSubmittedView } from "../components/waitlist/WaitlistSubmittedView";
import { useSupabase } from "../hooks/useSupabase";

const STORAGE_KEY = "edger.waitlist_email";

function readStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function Waitlist() {
  const supabase = useSupabase();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(() => !!readStoredEmail());
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(() => readStoredEmail());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function finishSuccess(normalizedEmail: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, normalizedEmail);
    } catch {
      /* ignore quota / privacy mode */
    }
    setSubmittedEmail(normalizedEmail);
    setSubmitted(true);
    setSubmitError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("wishlist").insert({ email: trimmed });

    setIsSubmitting(false);

    if (!error) {
      finishSuccess(trimmed);
      return;
    }

    const dup =
      error.code === "23505" ||
      error.message.toLowerCase().includes("duplicate key");
    if (dup) {
      finishSuccess(trimmed);
      return;
    }

    setSubmitError(error.message || "Couldn't save — try again in a minute.");
  }

  function handleReset() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSubmitted(false);
    setSubmittedEmail(null);
    setEmail("");
    setSubmitError(null);
  }

  return (
    <div className="landing-root h-svh relative overflow-hidden flex flex-col">
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />
      <div className="landing-aurora absolute inset-x-0 top-0 h-[600px] pointer-events-none z-0" />

      <WaitlistPillNav />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          {submitted && submittedEmail ? (
            <WaitlistSubmittedView email={submittedEmail} onReset={handleReset} />
          ) : (
            <WaitlistSignupView
              email={email}
              setEmail={setEmail}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
        </div>
      </main>

      <WaitlistPageFooter />
    </div>
  );
}
