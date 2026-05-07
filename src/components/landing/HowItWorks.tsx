const STEPS = [
  {
    n: '01',
    h: 'Drop the chart',
    p: 'Screenshot your chart with the long or short tool drawn — the colored zones tell Edger entry, stop, and target.',
  },
  {
    n: '02',
    h: 'Set your risk',
    p: "Type the dollar amount you're willing to lose. That's it — no balance, no percentages, no math.",
  },
  {
    n: '03',
    h: 'Place the trade',
    p: 'Get exact lot size, pip value, profit at target, and R:R. Copy the summary into your trade journal in one click.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      data-reveal
      className="relative z-10 px-6 py-24 md:py-32 bg-white border-y border-zinc-100 overflow-hidden"
    >
      <div className="ghost-text absolute right-[-2rem] top-12 hidden md:block">flow</div>

      <div className="max-w-5xl mx-auto relative">
        <span className="section-num mb-6">04 · How it works</span>
        <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.02] mb-16 mt-3 text-zinc-950 max-w-2xl">
          Three steps. No friction.
        </h2>

        <ol className="space-y-0">
          {STEPS.map(({ n, h, p }) => (
            <li
              key={n}
              className="grid grid-cols-[60px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-12 items-baseline border-t border-zinc-100 py-10 first:border-t-0"
            >
              <span className="font-mono text-zinc-400 text-sm tabular-nums">{n}</span>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-zinc-950">
                  {h}
                </h3>
                <p className="text-zinc-600 leading-relaxed max-w-xl text-base">{p}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
