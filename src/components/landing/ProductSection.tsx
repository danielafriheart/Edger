import Link from 'next/link';
import type { ReactNode } from 'react';

export function ProductSection({
  reverse = false,
  sectionNum,
  kicker,
  ghost,
  headline,
  bullets,
  ctaLabel,
  ctaHref,
  mockup,
  frame,
}: {
  reverse?: boolean;
  sectionNum: string;
  kicker: string;
  ghost: string;
  headline: ReactNode;
  bullets: string[];
  ctaLabel: string;
  ctaHref?: string;
  mockup: ReactNode;
  frame: 'mint' | 'peach' | 'lavender';
}) {
  const frameClass =
    frame === 'mint'
      ? 'gradient-frame-mint'
      : frame === 'peach'
        ? 'gradient-frame-peach'
        : 'gradient-frame-lavender';

  const copy = (
    <div className="max-w-md">
      <span className="section-num mb-5">
        {sectionNum} · {kicker}
      </span>
      <h2 className="text-[clamp(1.875rem,4vw,3.25rem)] font-bold tracking-[-0.035em] leading-[1.04] text-zinc-950 mb-7 mt-3">
        {headline}
      </h2>
      <ul className="space-y-3 mb-8">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-zinc-700 leading-relaxed text-[15px]">
            <span className="mt-2 w-1 h-1 rounded-full bg-zinc-400 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {ctaHref ? (
        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </a>
      ) : (
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );

  const visual = (
    <div
      className={`relative ${frameClass} frame-grain rounded-3xl p-8 md:p-12 overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] hover-lift`}
    >
      {mockup}
    </div>
  );

  return (
    <section data-reveal className="relative z-10 px-6 py-20 md:py-28 overflow-hidden">
      <div
        className={`ghost-text absolute hidden md:block ${
          reverse ? 'right-[-2rem]' : 'left-[-2rem]'
        } top-10`}
      >
        {ghost}
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center relative">
        {reverse ? (
          <>
            <div className="order-2 md:order-1">{visual}</div>
            <div className="order-1 md:order-2">{copy}</div>
          </>
        ) : (
          <>
            {copy}
            {visual}
          </>
        )}
      </div>
    </section>
  );
}
