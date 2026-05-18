export function TradeCard() {
  return (
    <div className="relative bg-white border border-zinc-200/60 rounded-2xl p-5 md:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-zinc-900 tracking-tight font-semibold tabular-nums">
            EUR/USD
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
            Standard FX
          </span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
          Long
        </span>
      </div>

      <div className="space-y-1.5 mb-5">
        <LevelRow label="Take Profit" value="1.08750" tone="profit" />
        <LevelRow label="Entry" value="1.08450" tone="neutral" />
        <LevelRow label="Stop Loss" value="1.08300" tone="loss" />
      </div>

      <div className="flex items-center justify-between text-xs pb-5 mb-5 border-b border-zinc-100">
        <span className="font-mono text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-medium">
          Risk
        </span>
        <span className="font-mono text-zinc-900 tabular-nums font-medium">$100.00</span>
      </div>

      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2 font-medium">
          Lot Size
        </div>
        <div className="flex items-end justify-between mb-4">
          <span className="font-mono text-5xl md:text-6xl font-medium tracking-[-0.04em] tabular-nums leading-none text-zinc-950">
            0.66
          </span>
          <div className="text-right pb-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1 font-medium">
              Profit at TP
            </div>
            <div className="font-mono text-sm text-emerald-600 tabular-nums font-semibold">
              +$200.00
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 pt-3 border-t border-zinc-100 font-medium">
          <span>
            R:R <span className="text-zinc-900 ml-1">1:2</span>
          </span>
          <span className="ml-auto normal-case">
            Pip Value <span className="text-zinc-900 ml-1">$10/lot</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function LevelRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'profit' | 'loss' | 'neutral';
}) {
  const styles =
    tone === 'profit'
      ? 'bg-emerald-50 border-emerald-100'
      : tone === 'loss'
        ? 'bg-rose-50 border-rose-100'
        : 'bg-zinc-50 border-zinc-100';

  const labelColor =
    tone === 'profit'
      ? 'text-emerald-700'
      : tone === 'loss'
        ? 'text-rose-700'
        : 'text-zinc-500';

  return (
    <div className={`flex items-center justify-between border ${styles} rounded-md py-2.5 px-3.5`}>
      <span className={`font-mono text-[10px] uppercase tracking-[0.2em] font-medium ${labelColor}`}>
        {label}
      </span>
      <span className="font-mono text-sm text-zinc-900 tabular-nums font-medium">{value}</span>
    </div>
  );
}
