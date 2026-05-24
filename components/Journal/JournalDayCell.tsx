'use client';

import type { JournalEntry } from '@/types/journal';
import type { CalendarCell } from '@/lib/journal/calendarMath';

interface JournalDayCellProps {
  cell: CalendarCell;
  entries: JournalEntry[];
  onClick: (iso: string) => void;
}

export function JournalDayCell({ cell, entries, onClick }: JournalDayCellProps) {
  const summary = summarize(entries);

  return (
    <button
      type="button"
      onClick={() => onClick(cell.iso)}
      className={`group relative flex flex-col items-stretch text-left min-h-[110px] p-2 transition-colors ${
        cell.isCurrentMonth ? 'bg-white hover:bg-zinc-50/70' : 'bg-zinc-50/40 hover:bg-zinc-50'
      }`}
    >
      {/* Date pill — emerald when today, otherwise muted */}
      <span
        className={`inline-flex items-center justify-center self-end font-mono text-[12px] tabular-nums rounded-full w-7 h-7 mb-1 transition-colors ${
          cell.isToday
            ? 'bg-zinc-900 text-white'
            : cell.isCurrentMonth
              ? 'text-zinc-700'
              : 'text-zinc-400'
        }`}
      >
        {cell.day}
      </span>

      {/* Entry summary — only shown when there's data */}
      {entries.length > 0 ? (
        <div className="flex flex-col gap-1 mt-auto">
          {/* P/L pill (only when at least one closed entry has a P/L) */}
          {summary.pnlTotal !== null ? (
            <span
              className={`inline-flex items-center justify-between rounded-md px-2 py-1 font-mono text-[11px] font-semibold tabular-nums ${
                summary.pnlTotal > 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                  : summary.pnlTotal < 0
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
            >
              <span className="opacity-70">P/L</span>
              <span>
                {summary.pnlTotal > 0 ? '+' : ''}
                ${summary.pnlTotal.toFixed(2)}
              </span>
            </span>
          ) : null}

          {/* Entry-count strip */}
          <span className="inline-flex items-center gap-1.5 px-1 font-mono text-[10px] text-zinc-500 uppercase tracking-[0.18em]">
            <span className="inline-flex items-center gap-0.5">
              {summary.win > 0 && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  title={`${summary.win} win`}
                />
              )}
              {summary.loss > 0 && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-rose-500"
                  title={`${summary.loss} loss`}
                />
              )}
              {summary.breakeven > 0 && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-zinc-400"
                  title={`${summary.breakeven} breakeven`}
                />
              )}
              {summary.pending > 0 && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
                  title={`${summary.pending} pending`}
                />
              )}
            </span>
            <span className="ml-auto">
              {entries.length} {entries.length === 1 ? 'trade' : 'trades'}
            </span>
          </span>
        </div>
      ) : (
        // Subtle "+" affordance on hover, only when cell belongs to this month
        cell.isCurrentMonth && (
          <span className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 self-start">
            + Add
          </span>
        )
      )}
    </button>
  );
}

interface DaySummary {
  pnlTotal: number | null;
  win: number;
  loss: number;
  breakeven: number;
  pending: number;
}

function summarize(entries: JournalEntry[]): DaySummary {
  let total: number | null = null;
  let win = 0;
  let loss = 0;
  let breakeven = 0;
  let pending = 0;

  for (const e of entries) {
    if (e.outcome === 'win') win += 1;
    else if (e.outcome === 'loss') loss += 1;
    else if (e.outcome === 'breakeven') breakeven += 1;
    else pending += 1;

    if (typeof e.pnlUsd === 'number' && Number.isFinite(e.pnlUsd)) {
      total = (total ?? 0) + e.pnlUsd;
    }
  }

  return { pnlTotal: total, win, loss, breakeven, pending };
}
