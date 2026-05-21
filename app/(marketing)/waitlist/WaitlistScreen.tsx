'use client';

import { useState, useTransition } from 'react';
import { WaitlistPageFooter } from '@/components/waitlist/WaitlistPageFooter';
import { WaitlistPillNav } from '@/components/waitlist/WaitlistPillNav';
import { WaitlistSignupView } from '@/components/waitlist/WaitlistSignupView';
import { WaitlistSubmittedView } from '@/components/waitlist/WaitlistSubmittedView';
import { joinWaitlist } from '@/lib/waitlist/joinWaitlist';

const STORAGE_KEY = 'edger.waitlist_email';

function readStoredEmail(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function WaitlistScreen() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(() => readStoredEmail());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submitted = submittedEmail !== null;

  function recordSuccess(normalized: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // Ignore quota and privacy mode write failures.
    }

    setSubmittedEmail(normalized);
    setSubmitError(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || isPending) return;

    setSubmitError(null);
    startTransition(async () => {
      const result = await joinWaitlist(trimmed);
      if (result.ok) {
        recordSuccess(result.email);
        return;
      }

      setSubmitError(result.error);
    });
  }

  function handleReset() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore quota and privacy mode delete failures.
    }

    setSubmittedEmail(null);
    setEmail('');
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
              isSubmitting={isPending}
              submitError={submitError}
            />
          )}
        </div>
      </main>

      <WaitlistPageFooter />
    </div>
  );
}
