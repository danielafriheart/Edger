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
        kicker="AI Chart Vision"
        ghost="vision"
        headline={
          <>
            Read entries, stops,
            <br />
            and targets straight from a screenshot.
          </>
        }
        bullets={[
          'Drop a chart with the long or short tool drawn — Edger reads the colored zones.',
          'Vision AI extracts entry, stop loss, and take profit automatically.',
          'Every field is editable if the AI gets it wrong — Edger never blocks you.',
        ]}
        ctaLabel="Try the AI"
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
