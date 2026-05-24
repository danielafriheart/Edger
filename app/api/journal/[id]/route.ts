import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import {
  buildJournalUpdateRow,
  rowToJournalEntry,
  validateJournalEntryPatch,
} from '@/lib/journal/journalRow';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** GET /api/journal/[id] — read a single entry the user owns. */
export async function GET(_req: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load entry' },
      { status: 500 },
    );
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    entry: rowToJournalEntry(data as Record<string, unknown>),
  });
}

/** PATCH /api/journal/[id] — partial update. */
export async function PATCH(req: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;

  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validated = validateJournalEntryPatch(parsed);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('journal_entries')
    .update(buildJournalUpdateRow(validated.data))
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update entry' },
      { status: 500 },
    );
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    entry: rowToJournalEntry(data as Record<string, unknown>),
  });
}

/** DELETE /api/journal/[id] */
export async function DELETE(_req: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('journal_entries').delete().eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete entry' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
