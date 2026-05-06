import Link from 'next/link';
import { EdgerMark } from '@/components/ui/Logo';

export function FinalCta() {
  return (
    <section data-reveal className="relative z-10 bg-zinc-950 text-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(167,243,208,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 70%, rgba(233,213,255,0.12) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 py-32 md:py-44 text-center">
        <div className="mb-8 mx-auto w-14 h-14 rounded-2xl bg-white/[0.07] border border-white/15 flex items-center justify-center backdrop-blur text-zinc-100">
          <EdgerMark size={22} />
        </div>
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.035em] mb-6">
          Stop guessing
          <br />
          your size.
        </h2>
        <p className="text-zinc-400 text-base md:text-lg max-w-md mx-auto mb-10">
          Try Edger free. Five seconds, no signup, no card.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          Open Edger
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
