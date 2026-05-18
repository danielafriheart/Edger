export function ValidationCard() {
  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 md:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] space-y-3">
      <div className="flex items-center justify-between mb-3 pb-4 border-b border-zinc-100">
        <span className="text-sm font-semibold text-zinc-950 tracking-tight">Pre-trade validation</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
          GBP/JPY · short
        </span>
      </div>

      <CheckRow tone="ok" label="Direction matches level placement (SL above entry)" />
      <CheckRow tone="ok" label="Risk:reward 1:2.4 — above 1:1 minimum" />
      <CheckRow
        tone="warn"
        label="Lot size 0.008 below typical 0.01 broker minimum — consider widening SL"
      />
      <CheckRow tone="ok" label="Pip distance 38.0 — within reasonable range" />

      <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-3 text-center">
        <Stat label="Lot" value="0.01" />
        <Stat label="R:R" value="1:2.4" />
        <Stat label="Profit at TP" value="$48" tone="emerald" />
      </div>
    </div>
  );
}

function CheckRow({ tone, label }: { tone: 'ok' | 'warn'; label: string }) {
  const dot = tone === 'ok' ? 'bg-emerald-500' : 'bg-amber-500';
  return (
    <div className="flex items-start gap-3 text-sm text-zinc-700 leading-relaxed">
      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      <span>{label}</span>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'emerald' }) {
  return (
    <div className="bg-zinc-50 rounded-lg py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1 font-medium">
        {label}
      </div>
      <div
        className={`font-mono text-base font-semibold tabular-nums ${
          tone === 'emerald' ? 'text-emerald-600' : 'text-zinc-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
