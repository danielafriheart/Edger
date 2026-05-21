'use client';

import { useState } from 'react';
import { BillingToggleGroup, type Billing } from '@/components/pricing/BillingToggle';
import { PlanCard } from '@/components/pricing/PlanCard';
import { PricingComparisonRow, PricingFaqSection } from '@/components/pricing/PricingExtras';
import { PricingFooter, PricingPillNav } from '@/components/pricing/PricingNav';
import { FREE_FEATURES, PAYG_FEATURES, PRO_FEATURES } from '@/constants/pricing';
import {
  loadEdgerBilling,
  saveEdgerBilling,
  type EdgerBillingSlice,
} from '@/lib/edger-billing-local';

function persistBilling(patch: Partial<EdgerBillingSlice>) {
  saveEdgerBilling({ ...loadEdgerBilling(), ...patch });
}

export function PricingScreen() {
  const [billing, setBilling] = useState<Billing>('monthly');

  const freePreset = () => persistBilling({ plan: 'free', credits: 0 });
  const paygPreset = () =>
    persistBilling({ plan: 'payg', credits: Math.max(loadEdgerBilling().credits, 50) });
  const proMonthlyPreset = () =>
    persistBilling({ plan: 'pro_monthly', credits: loadEdgerBilling().credits });
  const proAnnualPreset = () =>
    persistBilling({ plan: 'pro_annual', credits: loadEdgerBilling().credits });

  return (
    <div className="landing-root min-h-screen relative overflow-x-hidden">
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-50 z-0" />
      <div className="landing-aurora absolute inset-x-0 top-0 h-[500px] pointer-events-none z-0 opacity-60" />

      <PricingPillNav />

      <section className="relative z-10 pt-36 md:pt-40 pb-12 px-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-[12px] font-medium text-zinc-700 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
          Pricing
        </span>
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-zinc-950 mb-5">
          Sized for any pace.
        </h1>
        <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Free for casual sizers. Pay-as-you-go for occasional traders. Pro for everyone trading
          every day.
        </p>

        <BillingToggleGroup value={billing} onChange={setBilling} />
      </section>

      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          <PlanCard
            tier="Free"
            price="$0"
            cadence="forever"
            description="For anyone curious about the tool."
            features={FREE_FEATURES}
            cta={{ label: 'Get started', href: '/signup', beforeNavigate: freePreset }}
          />
          <PlanCard
            tier="Pay as you go"
            price="From $10"
            cadence="credit packs"
            description="Hold a prepaid balance toward future metered features."
            features={PAYG_FEATURES}
            cta={{ label: 'Buy credits', href: '/signup', beforeNavigate: paygPreset }}
            footnote="Credits never expire - apply when metering ships"
          />
          <PlanCard
            tier="Pro"
            highlighted
            price={billing === 'monthly' ? '$19' : '$15.83'}
            cadence={billing === 'monthly' ? '/ month' : '/ month, billed annually'}
            description="For traders sizing every day."
            features={PRO_FEATURES}
            cta={{
              label: billing === 'monthly' ? 'Start Pro Monthly' : 'Start Pro Annual',
              href: '/signup',
              beforeNavigate: billing === 'monthly' ? proMonthlyPreset : proAnnualPreset,
            }}
            footnote={billing === 'annual' ? '$190 billed yearly - 2 months free' : 'Cancel any time'}
          />
        </div>

        <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 mt-12">
          All plans - Same accurate math - Unlimited manual sizing
        </p>
      </section>

      <PricingComparisonRow />
      <PricingFaqSection />
      <PricingFooter />
    </div>
  );
}
