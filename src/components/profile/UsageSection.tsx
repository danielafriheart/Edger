'use client';

import Link from 'next/link';
import type { EdgerBillingSlice } from '../../lib/edger-billing-local';
import { SectionCard, UsageStat } from './ProfilePrimitives';

export function UsageSection({ billing }: { billing: EdgerBillingSlice }) {
  const isPayg = billing.plan === 'payg';
  const isFree = billing.plan === 'free';

  return (
    <div className="space-y-5">
      <SectionCard
        kicker="This month"
        title="Activity"
        sub="AI extractions and lot-size calculations performed this billing period."
      >
        <div className="grid grid-cols-3 gap-3">
          <UsageStat label="AI analyses" value="0" />
          <UsageStat label="Calculations" value="0" />
          <UsageStat label={isPayg ? 'Credits used' : 'Spent'} value={isPayg ? '0' : '$0.00'} />
        </div>

        {isFree && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4 flex items-start gap-3">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <p className="text-[13px] text-amber-900 leading-relaxed">
              Free plan resets to 5 AI analyses on the 1st of every month. Need more?{' '}
              <Link href="/pricing" className="underline underline-offset-2 hover:text-amber-700">
                Compare plans
              </Link>
              .
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard kicker="History" title="Recent calculations" sub="The last lot-size calculations you ran.">
        <p className="font-mono text-[12px] text-zinc-500 italic">
          No calculations yet. Head over to the{' '}
          <Link href="/app" className="underline underline-offset-2 hover:text-zinc-900">
            Analyzer
          </Link>{' '}
          to size your first trade.
        </p>
      </SectionCard>
    </div>
  );
}
