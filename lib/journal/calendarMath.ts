// =============================================================================
// Calendar grid math for the Journal page.
// -----------------------------------------------------------------------------
// All dates are handled in the user's local timezone — the calendar shows
// "their" weeks, not UTC weeks. Trade dates are stored as YYYY-MM-DD strings
// so they're timezone-independent on the server.
// =============================================================================

const MS_PER_DAY = 86_400_000;

export interface CalendarCell {
  /** Full Date object in local time. */
  date: Date;
  /** ISO YYYY-MM-DD in local time. Matches the trade_date stored in DB. */
  iso: string;
  /** Day-of-month (1..31). */
  day: number;
  /** True if this cell is in the currently displayed month (not a spillover). */
  isCurrentMonth: boolean;
  /** True if this cell matches today's local date. */
  isToday: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Format a Date as YYYY-MM-DD in local time. */
export function toLocalIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Today's local date as YYYY-MM-DD. */
export function todayIso(): string {
  return toLocalIso(new Date());
}

/** Parse YYYY-MM-DD into a local Date (midnight). */
export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function shortMonthLabel(month: number): string {
  return SHORT_MONTH_NAMES[month] ?? '';
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Build a calendar grid of 6 weeks × 7 days starting on Sunday.
 * Returns 42 cells covering the month + leading/trailing spillover days so the
 * grid is always rectangular.
 */
export function buildCalendarGrid(year: number, month: number): CalendarCell[] {
  const today = new Date();
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 = Sun
  const gridStart = new Date(year, month, 1 - startDay);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getTime() + i * MS_PER_DAY);
    cells.push({
      date: d,
      iso: toLocalIso(d),
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: isSameDay(d, today),
    });
  }
  return cells;
}

/** Inclusive bounds for a month's calendar grid (first Sunday → last Saturday). */
export function monthGridBounds(
  year: number,
  month: number,
): { from: string; to: string } {
  const cells = buildCalendarGrid(year, month);
  return {
    from: cells[0].iso,
    to: cells[cells.length - 1].iso,
  };
}

/** Add `months` to a (year, month) pair, normalizing the month overflow. */
export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}
