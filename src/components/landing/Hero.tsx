import Link from 'next/link';
import { Pill } from './LandingNav';

export function Hero() {
  return (
    <section className="relative pt-40 pb-20 md:pt-44 md:pb-24 px-6 z-10">
      <div className="landing-aurora animate-hero-glow absolute inset-x-0 top-0 h-[700px] pointer-events-none -z-10" />

      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />

      <div className="max-w-5xl mx-auto text-center">
        <Pill className="mb-7 mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
          Now in early access
        </Pill>

        <h1 className="text-[clamp(2.75rem,7.5vw,5.25rem)] font-bold leading-[0.98] tracking-[-0.04em] text-zinc-950 mb-7">
          The lot size,
          <br />
          sized for you.
        </h1>

        <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed max-w-xl mx-auto mb-10">
          Add your entry, stop, and target — set your risk. Edger calculates the
          exact lot size in under a second — across forex, metals, indices, and
          crypto.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
          >
            Try Edger free
            <span aria-hidden>→</span>
          </Link>
          <a
            href="#how"
            className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            See how it works
          </a>
        </div>

        <p className="text-xs text-zinc-500 font-mono tracking-tight">
          Free during early access · No signup needed
        </p>
      </div>
    </section>
  );
}
