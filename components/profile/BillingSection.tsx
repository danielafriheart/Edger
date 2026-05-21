'use client';

import Link from 'next/link';
import { PLAN_DESCRIPTION, PLAN_LABEL } from '../../constants/profile-plans';
import type { EdgerBillingSlice } from '../../lib/edger-billing-local';
import { SectionCard } from './ProfilePrimitives';

export function BillingSection({ billing }: { billing: EdgerBillingSlice }) {
  const isPro = billing.plan === 'pro_monthly' || billing.plan === 'pro_annual';
  const isPayg = billing.plan === 'payg';

  return (
    <div className="space-y-5">
      <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
        <div className="bg-white rounded-[20px] p-6 md:p-7">
          <PlanHeader />

          <div className="mb-5">
            <h3 className="text-3xl md:text-4xl font-bold tracking-[-0.035em] text-zinc-950 mb-2">
              {PLAN_LABEL[billing.plan]}
            </h3>
            <p className="text-zinc-600 text-[14px] leading-relaxed">
              {PLAN_DESCRIPTION[billing.plan]}
            </p>
          </div>

          {isPayg ? (
            <PaygUsage credits={billing.credits} />
          ) : billing.plan === 'free' ? (
            <FreeUsage />
          ) : (
            <ProUsage />
          )}

          <PlanActions isPro={isPro} isPayg={isPayg} />
        </div>
      </div>

      <SectionCard
        kicker="Billing"
        title="Payment method"
        sub="Used for Pro subscriptions and PAYG credit purchases."
      >
        <div className="bg-zinc-50 rounded-xl border border-dashed border-zinc-200 px-4 py-5 text-center">
          <p className="text-sm text-zinc-500 mb-3">No payment method on file.</p>
          <button
            type="button"
            onClick={() => alert('Backend not yet wired.')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Add payment method
          </button>
        </div>
      </SectionCard>

      <SectionCard kicker="History" title="Invoices" sub="Your billing history will appear here.">
        <p className="font-mono text-[12px] text-zinc-500 italic">No invoices yet.</p>
      </SectionCard>
    </div>
  );
}

function PlanHeader() {
  return (
    <div className="flex items-center justify-between mb-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
        Active plan
      </span>
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] uppercase tracking-[0.22em] font-semibold text-emerald-700 font-mono">
        <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
        Active
      </span>
    </div>
  );
}

function PaygUsage({ credits }: { credits: number }) {
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5 mb-5 flex items-center justify-between">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
          Credits on file
        </div>
        <div className="font-mono text-2xl font-medium tabular-nums tracking-[-0.02em] text-zinc-950">
          {credits}
        </div>
      </div>
      <div className="text-right max-w-[55%]">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Status</div>
        <div className="font-mono text-sm text-zinc-700 leading-snug">
          Held for future metered runs when billing goes live.
        </div>
      </div>
    </div>
  );
}

function FreeUsage() {
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5 mb-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Calculator</div>
      <p className="text-sm text-zinc-700 leading-relaxed mt-1">
        Unlimited manual lot sizing on every supported instrument — no usage cap on the math.
      </p>
    </div>
  );
}

function ProUsage() {
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5 mb-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
        Workflow plan
      </div>
      <p className="text-sm text-zinc-700 leading-relaxed mt-1">
        History, exports, presets, and multi-currency sizing ship on this tier — see pricing for detail.
      </p>
    </div>
  );
}

function PlanActions({ isPro, isPayg }: { isPro: boolean; isPayg: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {!isPro && (
        <Link
          href="/pricing"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Upgrade to Pro
        </Link>
      )}
      {isPayg && (
        <button
          type="button"
          onClick={() => alert('Backend not yet wired.')}
          className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          Buy more credits
        </button>
      )}
      {isPro && (
        <button
          type="button"
          onClick={() => alert('Backend not yet wired.')}
          className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          Manage subscription
        </button>
      )}
      <Link
        href="/pricing"
        className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
      >
        Compare plans
      </Link>
    </div>
  );
}
