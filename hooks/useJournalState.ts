'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  JournalEntry,
  JournalEntryInput,
  JournalEntryPatch,
} from '@/types/journal';
import {
  createJournalEntry,
  deleteJournalEntry,
  listJournalEntries,
  updateJournalEntry,
} from '@/lib/journal/journalSdk';
import {
  monthGridBounds,
  shiftMonth,
  todayIso,
} from '@/lib/journal/calendarMath';

// =============================================================================
// useJournalState
// -----------------------------------------------------------------------------
// Manages the data + UI state for the /journal page:
//   • Current month/year for the calendar view
//   • Fetches entries that cover the current month grid (refetched on month
//     change). Includes leading/trailing spillover days so cells at the edges
//     also show data.
//   • Modal state for create / edit, with optimistic-ish refetch after writes.
// =============================================================================

type ViewMode = 'calendar' | 'table';

export interface UseJournalStateOptions {
  /** Defaults to current month — useful for stories/tests. */
  initialDate?: Date;
}

export function useJournalState(opts: UseJournalStateOptions = {}) {
  const initial = opts.initialDate ?? new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [view, setView] = useState<ViewMode>('calendar');

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntry, setModalEntry] = useState<JournalEntry | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string>(todayIso());

  const bounds = useMemo(() => monthGridBounds(year, month), [year, month]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await listJournalEntries({ from: bounds.from, to: bounds.to });
      setEntries(list);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load journal.');
    } finally {
      setLoading(false);
    }
  }, [bounds.from, bounds.to]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  // ── Month nav ──────────────────────────────────────────────────────────
  const goPrev = useCallback(() => {
    const next = shiftMonth(year, month, -1);
    setYear(next.year);
    setMonth(next.month);
  }, [year, month]);

  const goNext = useCallback(() => {
    const next = shiftMonth(year, month, 1);
    setYear(next.year);
    setMonth(next.month);
  }, [year, month]);

  const goToday = useCallback(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }, []);

  // ── Modal control ──────────────────────────────────────────────────────
  const openNewEntry = useCallback((defaultDate?: string) => {
    setModalEntry(null);
    setModalDefaultDate(defaultDate ?? todayIso());
    setModalOpen(true);
  }, []);

  const openEntry = useCallback((entry: JournalEntry) => {
    setModalEntry(entry);
    setModalDefaultDate(entry.tradeDate);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalEntry(null);
  }, []);

  // ── Day-selected behaviour ────────────────────────────────────────────
  // Clicking a day with entries opens the FIRST entry for editing; clicking an
  // empty day opens a fresh "new entry" modal pre-dated to that day.
  const handleSelectDay = useCallback(
    (iso: string) => {
      const dayEntries = entries.filter((e) => e.tradeDate === iso);
      if (dayEntries.length > 0) {
        openEntry(dayEntries[0]);
      } else {
        openNewEntry(iso);
      }
    },
    [entries, openEntry, openNewEntry],
  );

  // ── CRUD ───────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (
      data: JournalEntryInput | JournalEntryPatch,
      entryId: string | null,
    ) => {
      if (entryId) {
        await updateJournalEntry(entryId, data as JournalEntryPatch);
      } else {
        await createJournalEntry(data as JournalEntryInput);
      }
      await refetch();
    },
    [refetch],
  );

  const handleDelete = useCallback(
    async (entryId: string) => {
      await deleteJournalEntry(entryId);
      await refetch();
    },
    [refetch],
  );

  return {
    // State
    year,
    month,
    view,
    entries,
    loading,
    loadError,
    modalOpen,
    modalEntry,
    modalDefaultDate,
    // Actions
    setView,
    goPrev,
    goNext,
    goToday,
    openNewEntry,
    openEntry,
    closeModal,
    handleSelectDay,
    handleSubmit,
    handleDelete,
    refetch,
  };
}
