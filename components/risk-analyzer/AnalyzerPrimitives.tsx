import type { ReactNode } from 'react';

export function CompactCard({
  children,
  scrollable,
}: {
  children: ReactNode;
  scrollable?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-zinc-200/70 p-4 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex flex-col gap-3 min-h-0 ${
        scrollable ? 'overflow-y-auto' : ''
      }`}
    >
      {children}
    </div>
  );
}

export function CompactCardHeader({
  step,
  kicker,
  title,
}: {
  step: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="shrink-0">
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
        {step} · {kicker}
      </span>
      <h2 className="mt-1 text-[15px] font-semibold text-zinc-950 tracking-tight">{title}</h2>
    </div>
  );
}

export function CompactField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step="any"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-2 text-[13px] font-mono tabular-nums text-zinc-900 placeholder:text-zinc-400 placeholder:font-mono focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
    />
  );
}

export function Alert({ children, tone }: { children: ReactNode; tone: 'error' | 'warn' }) {
  const styles =
    tone === 'error'
      ? 'bg-rose-50 border-rose-200 text-rose-900'
      : 'bg-amber-50 border-amber-200 text-amber-900';
  return (
    <div className={`text-[13px] leading-relaxed border rounded-xl px-3.5 py-2.5 ${styles}`}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-r-transparent animate-spin" />
  );
}

export function TriangleUp() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" aria-hidden="true">
      <path d="M5 0 L10 8.66 L0 8.66 Z" />
    </svg>
  );
}

export function TriangleDown() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" aria-hidden="true">
      <path d="M5 9 L0 0.34 L10 0.34 Z" />
    </svg>
  );
}
