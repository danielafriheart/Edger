'use client';

import { useMemo } from 'react';
import type { JournalEntry } from '@/types/journal';
import { buildCalendarGrid } from '@/lib/journal/calendarMath';
import { JournalDayCell } from './JournalDayCell';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface JournalCalendarProps {
  year: number;
  month: number;
  entries: JournalEntry[];
  onSelectDay: (iso: string) => void;
}

export function JournalCalendar({
  year,
  month,
  entries,
  onSelectDay,
}: JournalCalendarProps) {
  const cells = useMemo(() => buildCalendarGrid(year, month), [year, month]);
  const entriesByDate = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    for (const e of entries) {
      const arr = map.get(e.tradeDate) ?? [];
      arr.push(e);
      map.set(e.tradeDate, arr);
    }
    return map;
  }, [entries]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/70 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] overflow-hidden">
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium text-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid — 6 rows × 7 columns, 1px borders via gap on a tinted bg */}
      <div className="grid grid-cols-7 gap-px bg-zinc-100">
        {cells.map((cell) => (
          <JournalDayCell
            key={cell.iso}
            cell={cell}
            entries={entriesByDate.get(cell.iso) ?? []}
            onClick={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
}
