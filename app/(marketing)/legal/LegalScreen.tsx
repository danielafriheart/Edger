'use client';

import { useEffect, useState } from 'react';
import { DisclaimerContent } from '@/components/legal/DisclaimerContent';
import { LegalFooter, LegalPillNav } from '@/components/legal/LegalNav';
import { PrivacyContent } from '@/components/legal/PrivacyContent';
import { TermsContent } from '@/components/legal/TermsContent';

type TabId = 'privacy' | 'terms' | 'disclaimer';

const TABS: { id: TabId; label: string }[] = [
  { id: 'privacy', label: 'Privacy' },
  { id: 'terms', label: 'Terms of Use' },
  { id: 'disclaimer', label: 'Disclaimer' },
];

const LAST_UPDATED = 'May 2026';

export function LegalScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('privacy');

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1) as TabId;
      if (TABS.some((tab) => tab.id === hash)) setActiveTab(hash);
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const handleTab = (id: TabId) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-root min-h-screen relative">
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-40 z-0" />
      <div className="landing-aurora absolute inset-x-0 top-0 h-[420px] pointer-events-none z-0 opacity-50" />

      <LegalPillNav />

      <main className="relative z-10 pt-32 md:pt-36 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 md:mb-16 max-w-2xl">
            <span className="section-num inline-flex mb-3">Legal</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mt-4 mb-4">
              The fine print.
            </h1>
            <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed">
              Everything that&apos;s normally buried at the bottom of a website, kept readable and
              short.
            </p>
          </header>

          <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-14">
            <aside className="md:sticky md:top-32 self-start z-10">
              <nav
                className="flex md:flex-col gap-1.5 overflow-x-auto -mx-4 px-4 pb-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0"
                aria-label="Legal sections"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTab(tab.id)}
                    className={`shrink-0 text-left px-3.5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="hidden md:block mt-6 pt-6 border-t border-zinc-200">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 mb-1.5">
                  Last updated
                </p>
                <p className="font-mono text-[12px] text-zinc-700">{LAST_UPDATED}</p>
              </div>
            </aside>

            <article className="min-w-0">
              {activeTab === 'privacy' && <PrivacyContent />}
              {activeTab === 'terms' && <TermsContent />}
              {activeTab === 'disclaimer' && <DisclaimerContent />}

              <p className="md:hidden mt-12 pt-6 border-t border-zinc-200 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Last updated - {LAST_UPDATED}
              </p>
            </article>
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
