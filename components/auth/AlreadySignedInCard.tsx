'use client';

import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { EdgerLogo } from '../ui/Logo';

/**
 * Shown on /login and /signup when the user already has an active Clerk session.
 * Proxy no longer redirects these routes so we can display this instead of a blank redirect.
 */
export function AlreadySignedInCard({ context }: { context: 'login' | 'signup' }) {
  const { signOut } = useClerk();
  const afterSignOutUrl = context === 'signup' ? '/signup' : '/login';

  const subtitle =
    context === 'signup'
      ? 'You’re signed in. After email verification, Clerk signs you in automatically — you can open the app or sign out to create another account with a different email.'
      : 'You’re already signed in. Continue to the app or sign out to use a different account.';

  return (
    <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
      <div className="bg-white rounded-[20px] p-7 md:p-9">
        <div className="flex justify-center mb-6">
          <EdgerLogo size="lg" variant="dark" />
        </div>
        <div className="text-center mb-6">
          <h1 className="text-[28px] md:text-[34px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
            Already signed in
          </h1>
          <p className="text-zinc-600 text-[14px] md:text-[15px] leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors text-center"
          >
            Open Edger
          </Link>
          <button
            type="button"
            onClick={() => {
              void signOut().then(() => {
                window.location.href = afterSignOutUrl;
              });
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
