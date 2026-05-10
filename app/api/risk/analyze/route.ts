import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { buildCalculationHistoryRow } from '@/features/risk/buildCalculationHistoryRow';
import { fetchGeminiChartFeedback } from '@/features/risk/geminiChartFeedback';
import { validateAnalyzeRiskBody } from '@/features/risk/validateAnalyzeRiskBody';
import { calculateTrade } from '@/lib/calc';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { findInstrument } from '@/constants/trading';

/**
 * Clerk-authenticated sizing + optional Gemini chart notes + calculation_history insert.
 * Entitlements: all signed-in users may persist rows until Polar/plan sync ships (same as MVP plan).
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

  const validated = validateAnalyzeRiskBody(parsed);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.message }, { status: validated.status });
  }

  const body = validated.data;
  const instrument = findInstrument(body.instrumentSymbol);
  if (!instrument) {
    return NextResponse.json({ error: 'Unknown instrument' }, { status: 400 });
  }

  const result = calculateTrade({
    instrument,
    direction: body.direction,
    entry: body.entry,
    stopLoss: body.stopLoss,
    takeProfit: body.takeProfit,
    riskUSD: body.riskUSD,
  });

  const setupLines = [
    `Instrument: ${body.instrumentSymbol} (${body.pairCategory})`,
    `Direction: ${body.direction}`,
    `Entry: ${body.entry}`,
    `Stop loss: ${body.stopLoss}`,
    `Take profit: ${body.takeProfit}`,
    `Risk USD: ${body.riskUSD}`,
  ];
  const aiFeedback =
    body.image != null
      ? await fetchGeminiChartFeedback({
          imageBase64: body.image.base64,
          mimeType: body.image.mimeType,
          userSetupSummary: setupLines.join('\n'),
        })
      : null;

  let historyId: string | null = null;
  let persistWarning: string | undefined;

  const supabase = await getSupabaseServerClient();
  const row = buildCalculationHistoryRow(userId, body.pairCategory, result, aiFeedback);

  const { data: inserted, error } = await supabase
    .from('calculation_history')
    .insert(row)
    .select('id')
    .maybeSingle();

  if (error) {
    persistWarning =
      error.message.includes('JWT') || error.message.includes('PGRST')
        ? 'History not saved — check Clerk ↔ Supabase JWT template.'
        : 'History save failed.';
  } else if (inserted?.id && typeof inserted.id === 'string') {
    historyId = inserted.id;
  }

  return NextResponse.json({
    result,
    aiFeedback,
    historyId,
    ...(persistWarning ? { persistWarning } : {}),
  });
}
