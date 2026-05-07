import type { ReactNode } from 'react';

export function SectionCard({
  kicker,
  title,
  sub,
  children,
  tone,
}: {
  kicker: string;
  title: string;
  sub?: string;
  children: ReactNode;
  tone?: 'danger';
}) {
  const borderClass = tone === 'danger' ? 'border-rose-200/70' : 'border-zinc-200/70';
  return (
    <div
      className={`bg-white rounded-3xl border ${borderClass} p-6 md:p-7 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex flex-col gap-4`}
    >
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
          {kicker}
        </span>
        <h2 className="mt-2 text-lg font-semibold text-zinc-950 tracking-tight">{title}</h2>
        {sub && <p className="text-[13px] text-zinc-500 mt-0.5 leading-relaxed">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

export function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
        {label}
      </div>
      <div className="font-mono text-xl font-medium tabular-nums tracking-[-0.02em] text-zinc-950">
        {value}
      </div>
    </div>
  );
}
