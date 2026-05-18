import { INSTRUMENT_ROWS } from '@/constants/landing';

export function InstrumentsGrid() {
  return (
    <section
      id="instruments"
      data-reveal
      className="relative z-10 px-6 py-24 md:py-32 overflow-hidden"
    >
      <div className="ghost-text absolute -left-8 top-12 hidden md:block">markets</div>

      <div className="max-w-6xl mx-auto relative">
        <span className="section-num mb-6">05 · What it sizes</span>
        <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.02] mt-3 mb-12 text-zinc-950 max-w-2xl">
          Every major instrument.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200/70 border border-zinc-200/70 rounded-2xl overflow-hidden">
          {INSTRUMENT_ROWS.map(([cat, items]) => (
            <div key={cat} className="bg-white p-7 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-medium mb-5">
                {cat}
              </p>
              <ul className="space-y-2 text-[13px] font-mono text-zinc-800 tabular-nums">
                {items.map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
