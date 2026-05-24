import type {
  JournalEntry,
  JournalEntryInput,
  JournalEntryPatch,
  JournalListResponse,
  JournalSingleResponse,
} from '@/types/journal';

// =============================================================================
// Journal SDK — single seam between the UI and /api/journal endpoints.
// -----------------------------------------------------------------------------
// All journal pages/components call through this module so swapping the
// transport (e.g. moving to a tRPC procedure later) only touches one file.
// =============================================================================

interface ListOptions {
  /** Inclusive start date filter, ISO date (YYYY-MM-DD). */
  from?: string;
  /** Inclusive end date filter, ISO date (YYYY-MM-DD). */
  to?: string;
  /** Override the abort signal (useful for cancellable refetches). */
  signal?: AbortSignal;
}

/** GET /api/journal — optionally bounded by `from`/`to`. Used to populate the
 *  calendar's current month. */
export async function listJournalEntries(opts: ListOptions = {}): Promise<JournalEntry[]> {
  const params = new URLSearchParams();
  if (opts.from) params.set('from', opts.from);
  if (opts.to) params.set('to', opts.to);
  const url = `/api/journal${params.size ? `?${params}` : ''}`;
  const res = await fetch(url, { signal: opts.signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load journal (${res.status})`);
  const data = (await res.json()) as JournalListResponse;
  return data.entries ?? [];
}

/** POST /api/journal — create a new entry. Returns the created row. */
export async function createJournalEntry(input: JournalEntryInput): Promise<JournalEntry> {
  const res = await fetch('/api/journal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail || `Failed to create entry (${res.status})`);
  }
  const data = (await res.json()) as JournalSingleResponse;
  return data.entry;
}

/** PATCH /api/journal/[id] — partial update of an existing entry. */
export async function updateJournalEntry(
  id: string,
  patch: JournalEntryPatch,
): Promise<JournalEntry> {
  const res = await fetch(`/api/journal/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail || `Failed to update entry (${res.status})`);
  }
  const data = (await res.json()) as JournalSingleResponse;
  return data.entry;
}

/** DELETE /api/journal/[id] */
export async function deleteJournalEntry(id: string): Promise<void> {
  const res = await fetch(`/api/journal/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail || `Failed to delete entry (${res.status})`);
  }
}
