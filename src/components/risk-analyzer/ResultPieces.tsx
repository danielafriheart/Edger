import type { Direction } from '../../lib/calc';

export function DirectionBadge({ direction }: { direction: Direction }) {
  if (direction === 'long') {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
        Long
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-rose-700">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 edger-dot-pulse" />
      Short
    </span>
  );
}

export function InlineStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'emerald' | 'neutral';
}) {
  return (
    <div className="text-center">
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 mb-1 font-medium">
        {label}
      </div>
      <div
        className={`font-mono text-[13px] md:text-sm font-semibold tabular-nums tracking-[-0.01em] ${
          tone === 'emerald' ? 'text-emerald-600' : 'text-zinc-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function ResultLevelRow({
  label,
  value,
  pips,
  tone,
}: {
  label: string;
  value: string;
  pips?: string;
  tone: 'profit' | 'loss' | 'neutral';
}) {
  const styles =
    tone === 'profit'
      ? 'bg-emerald-50/70 border-emerald-200/70'
      : tone === 'loss'
        ? 'bg-rose-50/70 border-rose-200/70'
        : 'bg-zinc-50 border-zinc-200/70';
  const labelColor =
    tone === 'profit'
      ? 'text-emerald-700'
      : tone === 'loss'
        ? 'text-rose-700'
        : 'text-zinc-600';

  return (
    <div className={`flex items-center justify-between border ${styles} rounded-lg py-2.5 px-3.5`}>
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.22em] font-semibold ${labelColor}`}
      >
        {label}
      </span>
      <div className="flex items-center gap-3">
        {pips && (
          <span className="font-mono text-[11px] text-zinc-500 tabular-nums">{pips}</span>
        )}
        <span className="font-mono text-sm text-zinc-900 tabular-nums font-medium">{value}</span>
      </div>
    </div>
  );
}
