import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import {
  buildJournalInsertRow,
  rowToJournalEntry,
  validateJournalEntryInput,
} from '@/lib/journal/journalRow';

/**
 * GET /api/journal
 *
 * Query params (optional):
 *   from=YYYY-MM-DD  inclusive lower bound on trade_date
 *   to=YYYY-MM-DD    inclusive upper bound on trade_date
 *
 * Returns: { entries: JournalEntry[] }
 *
 * Requires: Supabase `journal_entries` table with RLS allowing the signed-in
 * user to read their own rows (`user_id = auth.jwt() ->> 'sub'`).
 */
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    return NextResponse.json({ error: 'from must be YYYY-MM-DD' }, { status: 400 });
  }
  if (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return NextResponse.json({ error: 'to must be YYYY-MM-DD' }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from('journal_entries')
    .select('*')
    .order('trade_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (from) query = query.gte('trade_date', from);
  if (to) query = query.lte('trade_date', to);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load journal entries' },
      { status: 500 },
    );
  }

  const entries = (data ?? []).map((row) =>
    rowToJournalEntry(row as Record<string, unknown>),
  );

  return NextResponse.json({ entries });
}

/**
 * POST /api/journal — create an entry.
 *
 * Body: JournalEntryInput
 * Returns: { entry: JournalEntry }
 */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validated = validateJournalEntryInput(parsed);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const supabase = await getSupabaseServerClient();
  const insertRow = buildJournalInsertRow(userId, validated.data);

  const { data, error } = await supabase
    .from('journal_entries')
    .insert(insertRow)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create entry' },
      { status: 500 },
    );
  }

  const entry = rowToJournalEntry(data as Record<string, unknown>);
  return NextResponse.json({ entry }, { status: 201 });
}
