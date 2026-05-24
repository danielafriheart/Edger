// =============================================================================
// Edger Journal — types shared between the UI, SDK, and Supabase row layer.
// -----------------------------------------------------------------------------
// Storage (suggested table layout, build as `journal_entries` in Supabase):
//   id              uuid pk
//   user_id         text  (Clerk subject)
//   trade_date      date  (the day the entry is logged against)
//   instrument_symbol text
//   pair_category   text
//   direction       text  ('long' | 'short')
//   outcome         text  ('pending' | 'win' | 'loss' | 'breakeven')
//   pnl_usd         numeric nullable  (positive = win, negative = loss)
//   notes           text  nullable
//   source          text  ('analyzer' | 'manual')
//   history_id      uuid  nullable  (links back to calculation_history when
//                                    auto-created from the analyzer)
//   created_at      timestamptz default now()
//   updated_at      timestamptz default now()
//
// All API routes return rows in the shape below (camelCase, normalized).
// =============================================================================

export type JournalDirection = 'long' | 'short';
export type JournalOutcome = 'pending' | 'win' | 'loss' | 'breakeven';
export type JournalSource = 'analyzer' | 'manual';

export interface JournalEntry {
  id: string;
  /** ISO date string, no time component, e.g. "2026-06-15" */
  tradeDate: string;
  instrumentSymbol: string;
  pairCategory: string;
  direction: JournalDirection;
  outcome: JournalOutcome;
  /** Null when the trade hasn't closed yet (pending outcome) or for breakeven. */
  pnlUsd: number | null;
  notes: string | null;
  source: JournalSource;
  /** Set when the entry was auto-created from an analyzer calculation. */
  historyId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Body shape for POST /api/journal — creating an entry from scratch or
 *  pre-filled from analyzer state. */
export interface JournalEntryInput {
  tradeDate: string;
  instrumentSymbol: string;
  pairCategory: string;
  direction: JournalDirection;
  outcome?: JournalOutcome;
  pnlUsd?: number | null;
  notes?: string | null;
  source?: JournalSource;
  historyId?: string | null;
}

/** Body shape for PATCH /api/journal/[id] — only the fields the user can edit. */
export type JournalEntryPatch = Partial<
  Pick<
    JournalEntry,
    'tradeDate' | 'instrumentSymbol' | 'pairCategory' | 'direction' | 'outcome' | 'pnlUsd' | 'notes'
  >
>;

export interface JournalListResponse {
  entries: JournalEntry[];
}

export interface JournalSingleResponse {
  entry: JournalEntry;
}

export interface JournalErrorResponse {
  error: string;
}
