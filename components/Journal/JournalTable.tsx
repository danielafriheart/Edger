'use client';

import { fromIso, shortMonthLabel } from '@/lib/journal/calendarMath';
import type { JournalEntry } from '@/types/journal';

interface JournalTableProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

const OUTCOME_LABELS: Record<JournalEntry['outcome'], string> = {
  win: 'Win',
  loss: 'Loss',
  breakeven: 'Breakeven',
  pending: 'Pending',
};

const OUTCOME_PILL: Record<JournalEntry['outcome'], string> = {
  win: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  loss: 'bg-rose-50 text-rose-700 border-rose-200/70',
  breakeven: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200/70',
};

export function JournalTable({ entries, onSelectEntry }: JournalTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200/70 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] p-10 text-center">
        <p className="text-sm text-zinc-600">No entries yet for this month.</p>
        <p className="text-[12px] text-zinc-500 font-mono mt-1">
          Click a day in the calendar or hit + New entry to log one.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/70 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100">
            <Th>Date</Th>
            <Th>Instrument</Th>
            <Th>Direction</Th>
            <Th>Outcome</Th>
            <Th className="text-right">P/L</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr
              key={e.id}
              onClick={() => onSelectEntry(e)}
              className="border-b border-zinc-50 last:border-b-0 hover:bg-zinc-50/70 cursor-pointer transition-colors"
            >
              <Td>
                <span className="font-mono tabular-nums text-zinc-900">
                  {formatDateCell(e.tradeDate)}
                </span>
              </Td>
              <Td>
                <span className="font-mono tabular-nums font-medium text-zinc-900">
                  {e.instrumentSymbol}
                </span>
              </Td>
              <Td>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] font-semibold ${
                    e.direction === 'long' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {e.direction}
                </span>
              </Td>
              <Td>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full border font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${OUTCOME_PILL[e.outcome]}`}
                >
                  {OUTCOME_LABELS[e.outcome]}
                </span>
              </Td>
              <Td className="text-right">
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    e.pnlUsd === null
                      ? 'text-zinc-400'
                      : e.pnlUsd > 0
                        ? 'text-emerald-700'
                        : e.pnlUsd < 0
                          ? 'text-rose-700'
                          : 'text-zinc-700'
                  }`}
                >
                  {e.pnlUsd === null
                    ? '—'
                    : `${e.pnlUsd > 0 ? '+' : ''}$${e.pnlUsd.toFixed(2)}`}
                </span>
              </Td>
              <Td>
                <span className="text-zinc-600 line-clamp-1 max-w-[260px] inline-block">
                  {e.notes ?? '—'}
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium px-4 py-2.5 text-left ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-2.5 text-[13px] ${className}`}>{children}</td>
  );
}

function formatDateCell(iso: string): string {
  const d = fromIso(iso);
  return `${shortMonthLabel(d.getMonth())} ${d.getDate()}`;
}
