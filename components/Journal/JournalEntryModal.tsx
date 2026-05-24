'use client';

import { useEffect, useMemo, useState } from 'react';
import { CATEGORY_LABELS, INSTRUMENTS, type PairCategory } from '@/constants/trading';
import type {
  JournalDirection,
  JournalEntry,
  JournalEntryInput,
  JournalEntryPatch,
  JournalOutcome,
} from '@/types/journal';
import { todayIso } from '@/lib/journal/calendarMath';
import { CloseIcon } from '../ui/Icons';

// =============================================================================
// JournalEntryModal — create OR edit a single journal entry
// -----------------------------------------------------------------------------
// Modes:
//   - existing entry passed → edit mode (PATCH on save, Delete button visible)
//   - no entry passed       → create mode (POST on save)
// Date is fixed to whatever the caller passes via `defaultDate`.
// =============================================================================

const OUTCOMES: { id: JournalOutcome; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'win', label: 'Win' },
  { id: 'loss', label: 'Loss' },
  { id: 'breakeven', label: 'Breakeven' },
];

const OUTCOME_TONE: Record<JournalOutcome, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  win: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  loss: 'bg-rose-100 text-rose-700 border-rose-200',
  breakeven: 'bg-zinc-100 text-zinc-700 border-zinc-200',
};

export interface JournalEntryModalProps {
  open: boolean;
  /** Existing entry (edit mode) or null (create mode). */
  entry: JournalEntry | null;
  /** Default date for new entries (YYYY-MM-DD). */
  defaultDate: string;
  onClose: () => void;
  onSubmit: (data: JournalEntryInput | JournalEntryPatch, entryId: string | null) => Promise<void>;
  onDelete?: (entryId: string) => Promise<void>;
}

export function JournalEntryModal({
  open,
  entry,
  defaultDate,
  onClose,
  onSubmit,
  onDelete,
}: JournalEntryModalProps) {
  const isEdit = !!entry;

  // Resolve a default category/pair from the entry (edit) or sensible defaults (create)
  const initialCategory = useMemo<PairCategory>(() => {
    if (entry && Object.keys(INSTRUMENTS).includes(entry.pairCategory)) {
      return entry.pairCategory as PairCategory;
    }
    return Object.keys(INSTRUMENTS)[0] as PairCategory;
  }, [entry]);

  const [tradeDate, setTradeDate] = useState(entry?.tradeDate ?? defaultDate);
  const [category, setCategory] = useState<PairCategory>(initialCategory);
  const [pair, setPair] = useState(
    entry?.instrumentSymbol ?? INSTRUMENTS[initialCategory][0].symbol,
  );
  const [direction, setDirection] = useState<JournalDirection>(entry?.direction ?? 'long');
  const [outcome, setOutcome] = useState<JournalOutcome>(entry?.outcome ?? 'pending');
  const [pnl, setPnl] = useState(
    entry?.pnlUsd != null ? String(entry.pnlUsd) : '',
  );
  const [notes, setNotes] = useState(entry?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when the modal opens with a different entry
  useEffect(() => {
    if (!open) return;
    setTradeDate(entry?.tradeDate ?? defaultDate);
    const cat: PairCategory =
      entry && Object.keys(INSTRUMENTS).includes(entry.pairCategory)
        ? (entry.pairCategory as PairCategory)
        : (Object.keys(INSTRUMENTS)[0] as PairCategory);
    setCategory(cat);
    setPair(entry?.instrumentSymbol ?? INSTRUMENTS[cat][0].symbol);
    setDirection(entry?.direction ?? 'long');
    setOutcome(entry?.outcome ?? 'pending');
    setPnl(entry?.pnlUsd != null ? String(entry.pnlUsd) : '');
    setNotes(entry?.notes ?? '');
    setError(null);
  }, [open, entry, defaultDate]);

  // ESC + body-scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCategoryChange = (next: PairCategory) => {
    setCategory(next);
    setPair(INSTRUMENTS[next][0].symbol);
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const pnlValue =
        outcome === 'pending' || pnl.trim() === ''
          ? null
          : Number(pnl);

      if (pnlValue !== null && !Number.isFinite(pnlValue)) {
        setError('P/L must be a number or blank.');
        return;
      }

      const payload: JournalEntryInput = {
        tradeDate,
        instrumentSymbol: pair,
        pairCategory: category,
        direction,
        outcome,
        pnlUsd: pnlValue,
        notes: notes.trim() === '' ? null : notes.trim(),
        source: entry?.source ?? 'manual',
        historyId: entry?.historyId ?? null,
      };

      await onSubmit(payload, entry?.id ?? null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entry || !onDelete) return;
    setError(null);
    setDeleting(true);
    try {
      await onDelete(entry.id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-[modal-fade_0.18s_ease-out]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-hidden animate-[modal-pop_0.22s_cubic-bezier(0.2,0.7,0.2,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] border border-zinc-200/70 overflow-hidden relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          <div className="p-6 md:p-7 max-h-[calc(90vh-12px)] overflow-y-auto">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block">
              {isEdit ? 'Edit entry' : 'New journal entry'}
            </span>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
              {isEdit ? 'Update this trade.' : 'Log a trade.'}
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              {/* Date */}
              <Field label="Date">
                <input
                  type="date"
                  value={tradeDate}
                  onChange={(e) => setTradeDate(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-[13px] font-mono tabular-nums text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
                />
              </Field>

              {/* Category pills */}
              <Field label="Category">
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(INSTRUMENTS) as PairCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                        category === cat
                          ? 'bg-zinc-900 border-zinc-900 text-white'
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Instrument + Direction */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Instrument">
                  <select
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                    className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-[13px] font-mono tabular-nums text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors cursor-pointer"
                  >
                    {INSTRUMENTS[category].map((i) => (
                      <option key={i.symbol} value={i.symbol}>
                        {i.symbol}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Direction">
                  <div className="grid grid-cols-2 gap-1 p-0.5 bg-zinc-100/70 border border-zinc-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDirection('long')}
                      className={`py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                        direction === 'long'
                          ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      Long
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirection('short')}
                      className={`py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                        direction === 'short'
                          ? 'bg-rose-100 text-rose-700 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      Short
                    </button>
                  </div>
                </Field>
              </div>

              {/* Outcome */}
              <Field label="Outcome">
                <div className="grid grid-cols-4 gap-1">
                  {OUTCOMES.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOutcome(o.id)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                        outcome === o.id
                          ? OUTCOME_TONE[o.id]
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* P/L $ */}
              <Field
                label="P/L (USD)"
                hint={
                  outcome === 'pending'
                    ? 'Leave blank — fill once the trade closes.'
                    : 'Use a negative number for a loss.'
                }
              >
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-zinc-400 pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder={outcome === 'pending' ? '—' : '0.00'}
                    disabled={outcome === 'pending'}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-6 pr-3 py-2 text-[13px] font-mono tabular-nums text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors disabled:opacity-50"
                  />
                </div>
              </Field>

              {/* Notes */}
              <Field label="Notes" hint="What happened? Anything to remember.">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="London open breakout — late entry, trailed too tight."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors resize-none"
                />
              </Field>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-900">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 mt-2">
                {isEdit && onDelete ? (
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={deleting || saving}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border border-rose-200 text-rose-700 text-[13px] font-medium hover:bg-rose-50 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? 'Deleting…' : 'Delete entry'}
                  </button>
                ) : null}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-800 text-[13px] font-medium hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-zinc-900 text-white text-[13px] font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
                >
                  {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-1.5">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}
