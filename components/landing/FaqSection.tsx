'use client';

import { useState } from 'react';
import { FAQS } from '@/constants/landing';

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      data-reveal
      className="relative z-10 px-6 py-24 md:py-32 bg-white border-y border-zinc-100 overflow-hidden"
    >
      <div className="ghost-text absolute right-[-2rem] top-12 hidden md:block">questions</div>

      <div className="max-w-3xl mx-auto relative">
        <span className="section-num mb-6">06 · FAQ</span>
        <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.02] mt-3 mb-12 text-zinc-950">
          Things people ask.
        </h2>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {FAQS.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left py-6 group focus:outline-none"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="text-base md:text-lg font-medium tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
                  {f.q}
                </span>
                <span
                  className={`mt-1 w-6 h-6 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 text-sm leading-none transition-all duration-200 shrink-0 ${
                    openFaq === i ? 'rotate-45 bg-zinc-900 text-white border-zinc-900' : ''
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </div>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="mt-4 text-zinc-600 leading-relaxed text-[15px] max-w-xl">{f.a}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
