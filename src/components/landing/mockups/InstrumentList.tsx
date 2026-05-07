export function InstrumentList() {
  const rows: { sym: string; cat: string; pip: string }[] = [
    { sym: 'EUR/USD', cat: 'Standard FX', pip: '$10.00 / pip' },
    { sym: 'USD/JPY', cat: 'JPY Pair', pip: '$6.70 / pip' },
    { sym: 'XAU/USD', cat: 'Metal', pip: '$1.00 / pip' },
    { sym: 'NAS100', cat: 'Index', pip: '$1.00 / pt' },
    { sym: 'BTC/USD', cat: 'Crypto', pip: '$1.00 / $1' },
  ];

  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 md:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100">
        <span className="text-sm font-semibold text-zinc-950 tracking-tight">
          Pip values · USD account
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
          per 1 lot
        </span>
      </div>

      <ul className="space-y-1">
        {rows.map((r) => (
          <li
            key={r.sym}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums w-20">
                {r.sym}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium">
                {r.cat}
              </span>
            </div>
            <span className="font-mono text-sm text-zinc-700 tabular-nums">{r.pip}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 pt-4 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
        + 25 more instruments across forex, metals, indices &amp; crypto.
      </div>
    </div>
  );
}
