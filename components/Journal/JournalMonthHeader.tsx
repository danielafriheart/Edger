'use client';

import { monthLabel } from '@/lib/journal/calendarMath';
import type { JournalEntry } from '@/types/journal';

type ViewMode = 'calendar' | 'table';

interface JournalMonthHeaderProps {
  year: number;
  month: number;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onNew: () => void;
  entriesThisMonth: JournalEntry[];
}

export function JournalMonthHeader({
  year,
  month,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onNew,
  entriesThisMonth,
}: JournalMonthHeaderProps) {
  const totals = summarizeMonth(entriesThisMonth);

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Year + monthly P/L summary */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
            <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 align-middle mr-1.5 edger-dot-pulse" />
            Profit / Loss
          </span>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950">
            {year}
          </h1>
        </div>

        {/* Monthly summary chips */}
        <div className="flex flex-wrap items-center gap-2">
          <SummaryChip
            label="Net P/L"
            value={
              totals.netPnl === null
                ? '—'
                : `${totals.netPnl >= 0 ? '+' : ''}$${totals.netPnl.toFixed(2)}`
            }
            tone={
              totals.netPnl === null || totals.netPnl === 0
                ? 'neutral'
                : totals.netPnl > 0
                  ? 'emerald'
                  : 'rose'
            }
          />
          <SummaryChip
            label="Trades"
            value={String(totals.count)}
            tone="neutral"
          />
          <SummaryChip
            label="Win rate"
            value={
              totals.closedCount === 0
                ? '—'
                : `${Math.round((totals.win / totals.closedCount) * 100)}%`
            }
            tone="neutral"
          />
        </div>
      </div>

      {/* Controls row — view toggle on the left, month nav + actions on the right */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* View toggle */}
        <div className="inline-flex items-center gap-0.5 p-0.5 bg-zinc-100/70 border border-zinc-200 rounded-full self-start">
          <button
            type="button"
            onClick={() => onViewChange('calendar')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
              view === 'calendar'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <CalendarIcon /> Calendar view
          </button>
          <button
            type="button"
            onClick={() => onViewChange('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
              view === 'table'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <TableIcon /> Table
          </button>
        </div>

        {/* Month nav + new button */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="font-mono text-[12px] text-zinc-700 tabular-nums mr-1.5">
            {monthLabel(year, month)}
          </span>

          <button
            type="button"
            onClick={onToday}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Today
          </button>

          <div className="inline-flex items-center gap-0.5 p-0.5 bg-zinc-100/70 border border-zinc-200 rounded-full">
            <button
              type="button"
              onClick={onPrev}
              className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:bg-white hover:text-zinc-900 transition-colors"
              aria-label="Previous month"
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:bg-white hover:text-zinc-900 transition-colors"
              aria-label="Next month"
            >
              <ArrowRightIcon />
            </button>
          </div>

          <button
            type="button"
            onClick={onNew}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-900 text-white text-[12px] font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
          >
            <PlusIcon /> New entry
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'emerald' | 'rose' | 'neutral';
}) {
  const valueColor =
    tone === 'emerald'
      ? 'text-emerald-700'
      : tone === 'rose'
        ? 'text-rose-700'
        : 'text-zinc-900';
  const bg =
    tone === 'emerald'
      ? 'bg-emerald-50 border-emerald-200/70'
      : tone === 'rose'
        ? 'bg-rose-50 border-rose-200/70'
        : 'bg-white border-zinc-200/70';

  return (
    <span
      className={`inline-flex items-baseline gap-2 px-3 py-1.5 rounded-full border ${bg}`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
        {label}
      </span>
      <span className={`font-mono text-[13px] font-semibold tabular-nums ${valueColor}`}>
        {value}
      </span>
    </span>
  );
}

interface MonthSummary {
  netPnl: number | null;
  count: number;
  closedCount: number;
  win: number;
  loss: number;
  breakeven: number;
}

function summarizeMonth(entries: JournalEntry[]): MonthSummary {
  let net: number | null = null;
  let win = 0;
  let loss = 0;
  let breakeven = 0;
  let closed = 0;

  for (const e of entries) {
    if (e.outcome === 'win') {
      win += 1;
      closed += 1;
    } else if (e.outcome === 'loss') {
      loss += 1;
      closed += 1;
    } else if (e.outcome === 'breakeven') {
      breakeven += 1;
      closed += 1;
    }
    if (typeof e.pnlUsd === 'number' && Number.isFinite(e.pnlUsd)) {
      net = (net ?? 0) + e.pnlUsd;
    }
  }

  return { netPnl: net, count: entries.length, closedCount: closed, win, loss, breakeven };
}

// =============================================================================
// Inline icons (kept local — small + only used here)
// =============================================================================

function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 16h18M10 4v16" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
