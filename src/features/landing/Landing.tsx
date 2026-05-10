'use client';

import { LandingPillNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { FeatureRow } from '@/components/landing/FeatureRow';
import { ProductSection } from '@/components/landing/ProductSection';
import { TradeCard } from '@/components/landing/mockups/TradeCard';
import { InstrumentList } from '@/components/landing/mockups/InstrumentList';
import { ValidationCard } from '@/components/landing/mockups/ValidationCard';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { InstrumentsGrid } from '@/components/landing/InstrumentsGrid';
import { FaqSection } from '@/components/landing/FaqSection';
import { FinalCta } from '@/components/landing/FinalCta';
import { MarqueeTicker } from '@/components/landing/MarqueeTicker';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useScrollReveal } from './useScrollReveal';

export function Landing() {
  useScrollReveal();

  return (
    <div className="landing-root min-h-screen relative overflow-x-hidden">
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-50 z-0" />

      <LandingPillNav />
      <Hero />
      <FeatureRow />

      <ProductSection
        sectionNum="01"
        kicker="Chart alongside setup"
        ghost="workflow"
        headline={
          <>
            Keep the screenshot beside
            <br />
            entry, stop, and target inputs.
          </>
        }
        bullets={[
          'Drop a chart for context while you type or paste levels from your platform.',
          'Switch category and instrument in one place — lot math stays accurate.',
          'Every field is editable before you size — Edger never blocks you on your numbers.',
        ]}
        ctaLabel="Open the analyzer"
        mockup={<TradeCard />}
        frame="mint"
      />

      <ProductSection
        reverse
        sectionNum="02"
        kicker="Universal Sizing"
        ghost="every market"
        headline={
          <>
            Sized correctly,
            <br />
            whatever you trade.
          </>
        }
        bullets={[
          'Forex majors and minors with proper pip-value math (USD-quoted exact, others approximated within 2%).',
          'JPY pairs with the correct 0.01 pip increment — no silent /10000 errors.',
          'Metals (XAU/XAG), indices (NAS100/US30/SPX500), and crypto all sized natively.',
        ]}
        ctaLabel="See instruments"
        ctaHref="#instruments"
        mockup={<InstrumentList />}
        frame="peach"
      />

      <ProductSection
        sectionNum="03"
        kicker="Sanity Checks"
        ghost="safe sizes"
        headline={
          <>
            Catches the trade you
            <br />
            didn&apos;t mean to take.
          </>
        }
        bullets={[
          'Direction-aware validation: stop on the wrong side of entry? Edger flags it before sizing.',
          'Warns when calculated lot is below typical broker minimums or absurdly large.',
          'Pip distance, R:R ratio, profit at TP, and pip value shown clearly with every result.',
        ]}
        ctaLabel="Open the analyzer"
        mockup={<ValidationCard />}
        frame="lavender"
      />

      <HowItWorks />
      <InstrumentsGrid />
      <FaqSection />
      <FinalCta />
      <MarqueeTicker />
      <LandingFooter />
    </div>
  );
}
