import type { ReactNode } from 'react';

export function PricingComparisonRow() {
  return (
    <section className="relative z-10 px-6 pb-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-zinc-200/70 p-6 md:p-8 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12.5l5 5L20 6.5" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-950 tracking-tight mb-1.5">
              Same calculator on every plan
            </h3>
            <p className="text-zinc-600 text-[14px] leading-relaxed">
              The lot-size math, the validation checks, the instruments
              covered — these are identical across Free, PAYG, and Pro. The
              difference is volume and convenience: how much AI extraction
              you get, and the workflow features around it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingFaqSection() {
  return (
    <section className="relative z-10 px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-10 text-center">
          Pricing questions.
        </h2>
        <div className="space-y-3">
          <FaqRow q="Is the AI included?">
            Yes — every plan gets AI chart extraction. Free includes 5 per
            month, PAYG bills $0.20 each, Pro is unlimited (fair-use 500/mo).
          </FaqRow>
          <FaqRow q="Does PAYG ever expire?">
            No. Credits you buy stay on your account until used. There&apos;s
            no monthly minimum.
          </FaqRow>
          <FaqRow q="What does Annual save vs Monthly?">
            Annual is $190/year, equivalent to $15.83/month — that&apos;s two
            months free vs paying $19/month. Roughly 17% cheaper.
          </FaqRow>
          <FaqRow q="Can I switch plans?">
            Yes — upgrade, downgrade, or move between PAYG and Pro any time
            from your profile. Pro time is prorated.
          </FaqRow>
          <FaqRow q="Refunds?">
            Pro Monthly: cancel any time, no refund on the current month.
            Pro Annual: 14-day refund window from purchase. PAYG credits are
            non-refundable but never expire.
          </FaqRow>
        </div>
      </div>
    </section>
  );
}

function FaqRow({ q, children }: { q: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/70 p-5 md:p-6 shadow-[0_4px_30px_-16px_rgba(0,0,0,0.05)]">
      <h3 className="text-base font-semibold text-zinc-950 tracking-tight mb-1.5">{q}</h3>
      <p className="text-zinc-600 text-[14px] leading-relaxed">{children}</p>
    </div>
  );
}
