import { TICKER_ITEMS } from '@/constants/landing';

export function MarqueeTicker() {
  return (
    <section className="relative z-10 py-6 bg-zinc-950 border-t border-white/5 overflow-hidden">
      <div className="edger-marquee-mask">
        <div className="edger-marquee flex gap-12 whitespace-nowrap w-max">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-[13px] text-zinc-200 font-medium tabular-nums">
                {t.sym}
              </span>
              <span className="font-mono text-[12px] text-zinc-500 tabular-nums">
                {t.pip}/pip
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
