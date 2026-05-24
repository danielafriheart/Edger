import type {
  JournalDirection,
  JournalEntry,
  JournalEntryInput,
  JournalEntryPatch,
  JournalOutcome,
  JournalSource,
} from '@/types/journal';

// =============================================================================
// Journal row helpers — map between Supabase `journal_entries` rows (snake_case)
// and the JournalEntry shape the UI/SDK use (camelCase).
// =============================================================================

const VALID_OUTCOMES: JournalOutcome[] = ['pending', 'win', 'loss', 'breakeven'];
const VALID_DIRECTIONS: JournalDirection[] = ['long', 'short'];
const VALID_SOURCES: JournalSource[] = ['analyzer', 'manual'];

/** Build a Supabase insert row from a sanitized JournalEntryInput. */
export function buildJournalInsertRow(
  userId: string,
  input: JournalEntryInput,
): Record<string, unknown> {
  return {
    user_id: userId,
    trade_date: input.tradeDate,
    instrument_symbol: input.instrumentSymbol,
    pair_category: input.pairCategory,
    direction: input.direction,
    outcome: input.outcome ?? 'pending',
    pnl_usd: input.pnlUsd ?? null,
    notes: input.notes ?? null,
    source: input.source ?? 'manual',
    history_id: input.historyId ?? null,
  };
}

/** Build a Supabase update payload from a JournalEntryPatch. Only includes
 *  fields explicitly present on the patch — never overwrites with `undefined`. */
export function buildJournalUpdateRow(patch: JournalEntryPatch): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.tradeDate !== undefined) row.trade_date = patch.tradeDate;
  if (patch.instrumentSymbol !== undefined) row.instrument_symbol = patch.instrumentSymbol;
  if (patch.pairCategory !== undefined) row.pair_category = patch.pairCategory;
  if (patch.direction !== undefined) row.direction = patch.direction;
  if (patch.outcome !== undefined) row.outcome = patch.outcome;
  if (patch.pnlUsd !== undefined) row.pnl_usd = patch.pnlUsd;
  if (patch.notes !== undefined) row.notes = patch.notes;
  row.updated_at = new Date().toISOString();
  return row;
}

/** Convert a Supabase row to the JournalEntry shape the UI consumes. */
export function rowToJournalEntry(row: Record<string, unknown>): JournalEntry {
  const id = String(row.id ?? '');
  const pnl = row.pnl_usd;
  return {
    id,
    tradeDate: String(row.trade_date ?? ''),
    instrumentSymbol: String(row.instrument_symbol ?? ''),
    pairCategory: String(row.pair_category ?? ''),
    direction: VALID_DIRECTIONS.includes(row.direction as JournalDirection)
      ? (row.direction as JournalDirection)
      : 'long',
    outcome: VALID_OUTCOMES.includes(row.outcome as JournalOutcome)
      ? (row.outcome as JournalOutcome)
      : 'pending',
    pnlUsd: pnl === null || pnl === undefined ? null : Number(pnl),
    notes: row.notes == null ? null : String(row.notes),
    source: VALID_SOURCES.includes(row.source as JournalSource)
      ? (row.source as JournalSource)
      : 'manual',
    historyId: row.history_id == null ? null : String(row.history_id),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

/** Lightweight runtime validator for incoming POST bodies. Returns either a
 *  sanitized payload or an error message. Keep validation thin — final
 *  enforcement happens via Postgres column constraints + RLS. */
export function validateJournalEntryInput(
  raw: unknown,
):
  | { ok: true; data: JournalEntryInput }
  | { ok: false; error: string; status: 400 } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Body must be an object.', status: 400 };
  }
  const r = raw as Record<string, unknown>;

  const tradeDate = typeof r.tradeDate === 'string' ? r.tradeDate.trim() : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tradeDate)) {
    return { ok: false, error: 'tradeDate must be YYYY-MM-DD.', status: 400 };
  }

  const instrumentSymbol =
    typeof r.instrumentSymbol === 'string' ? r.instrumentSymbol.trim() : '';
  if (!instrumentSymbol) {
    return { ok: false, error: 'instrumentSymbol is required.', status: 400 };
  }

  const pairCategory = typeof r.pairCategory === 'string' ? r.pairCategory.trim() : '';
  if (!pairCategory) {
    return { ok: false, error: 'pairCategory is required.', status: 400 };
  }

  const direction = r.direction;
  if (direction !== 'long' && direction !== 'short') {
    return { ok: false, error: "direction must be 'long' or 'short'.", status: 400 };
  }

  const outcome =
    typeof r.outcome === 'string' && VALID_OUTCOMES.includes(r.outcome as JournalOutcome)
      ? (r.outcome as JournalOutcome)
      : 'pending';

  let pnlUsd: number | null = null;
  if (r.pnlUsd !== undefined && r.pnlUsd !== null) {
    const n = Number(r.pnlUsd);
    if (!Number.isFinite(n)) {
      return { ok: false, error: 'pnlUsd must be a finite number or null.', status: 400 };
    }
    pnlUsd = n;
  }

  const notes =
    typeof r.notes === 'string' ? (r.notes.length === 0 ? null : r.notes) : null;

  const source =
    typeof r.source === 'string' && VALID_SOURCES.includes(r.source as JournalSource)
      ? (r.source as JournalSource)
      : 'manual';

  const historyId =
    typeof r.historyId === 'string' && r.historyId.length > 0 ? r.historyId : null;

  return {
    ok: true,
    data: {
      tradeDate,
      instrumentSymbol,
      pairCategory,
      direction,
      outcome,
      pnlUsd,
      notes,
      source,
      historyId,
    },
  };
}

/** Validate a PATCH body. All fields are optional but, if present, must pass. */
export function validateJournalEntryPatch(
  raw: unknown,
):
  | { ok: true; data: JournalEntryPatch }
  | { ok: false; error: string; status: 400 } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Body must be an object.', status: 400 };
  }
  const r = raw as Record<string, unknown>;
  const patch: JournalEntryPatch = {};

  if (r.tradeDate !== undefined) {
    if (typeof r.tradeDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.tradeDate)) {
      return { ok: false, error: 'tradeDate must be YYYY-MM-DD.', status: 400 };
    }
    patch.tradeDate = r.tradeDate;
  }

  if (r.instrumentSymbol !== undefined) {
    if (typeof r.instrumentSymbol !== 'string' || r.instrumentSymbol.trim() === '') {
      return { ok: false, error: 'instrumentSymbol must be non-empty.', status: 400 };
    }
    patch.instrumentSymbol = r.instrumentSymbol.trim();
  }

  if (r.pairCategory !== undefined) {
    if (typeof r.pairCategory !== 'string' || r.pairCategory.trim() === '') {
      return { ok: false, error: 'pairCategory must be non-empty.', status: 400 };
    }
    patch.pairCategory = r.pairCategory.trim();
  }

  if (r.direction !== undefined) {
    if (r.direction !== 'long' && r.direction !== 'short') {
      return { ok: false, error: "direction must be 'long' or 'short'.", status: 400 };
    }
    patch.direction = r.direction;
  }

  if (r.outcome !== undefined) {
    if (
      typeof r.outcome !== 'string' ||
      !VALID_OUTCOMES.includes(r.outcome as JournalOutcome)
    ) {
      return { ok: false, error: 'outcome is invalid.', status: 400 };
    }
    patch.outcome = r.outcome as JournalOutcome;
  }

  if (r.pnlUsd !== undefined) {
    if (r.pnlUsd === null) {
      patch.pnlUsd = null;
    } else {
      const n = Number(r.pnlUsd);
      if (!Number.isFinite(n)) {
        return { ok: false, error: 'pnlUsd must be a finite number or null.', status: 400 };
      }
      patch.pnlUsd = n;
    }
  }

  if (r.notes !== undefined) {
    if (r.notes === null) {
      patch.notes = null;
    } else if (typeof r.notes !== 'string') {
      return { ok: false, error: 'notes must be a string or null.', status: 400 };
    } else {
      patch.notes = r.notes.length === 0 ? null : r.notes;
    }
  }

  return { ok: true, data: patch };
}
