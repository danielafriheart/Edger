'use client';

import Link from 'next/link';
import type { EdgerBillingSlice } from '../../lib/edger-billing-local';
import { CalculationHistoryList } from './CalculationHistoryList';
import { SectionCard, UsageStat } from './ProfilePrimitives';

export function UsageSection({ billing }: { billing: EdgerBillingSlice }) {
  const isPayg = billing.plan === 'payg';
  const isFree = billing.plan === 'free';

  return (
    <div className="space-y-5">
      <SectionCard
        kicker="This month"
        title="Activity"
        sub="Lot-size calculations you ran this billing period (activity sync ships with billing)."
      >
        <div className={`grid gap-3 ${isPayg ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
          <UsageStat label="Calculations" value="0" />
          {isPayg && <UsageStat label="Credits applied" value="0" />}
        </div>

        {isFree && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4 flex items-start gap-3">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <p className="text-[13px] text-amber-900 leading-relaxed">
              Paid tiers reserve credits or unlock workflow extras as we ship them.{' '}
              <Link href="/pricing" className="underline underline-offset-2 hover:text-amber-700">
                Compare plans
              </Link>
              .
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard
        kicker="History"
        title="Recent calculations"
        sub="Lot-size runs saved from the analyzer (requires Supabase + Clerk JWT template)."
      >
        <CalculationHistoryList />
      </SectionCard>
    </div>
  );
}
