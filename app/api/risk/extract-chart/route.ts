import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import {
  hasExtractedInstrument,
  hasExtractedPrices,
} from '@/lib/risk/applyExtractedChartLevels';
import { fetchGeminiExtractedChartLevels } from '@/lib/risk/geminiExtractChartLevels';
import { validateExtractChartBody } from '@/lib/risk/validateExtractChartBody';
import type { ExtractChartResponseBody } from '@/types/chart-extract';

/** Clerk-authenticated OCR-style extraction of entry / SL / TP from a chart image. */
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

  const validated = validateExtractChartBody(parsed);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.message }, { status: validated.status });
  }

  const { image } = validated.data;
  const isDev = process.env.NODE_ENV === 'development';

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) {
    const body: ExtractChartResponseBody = {
      levels: null,
      skippedReason: 'Chart auto-fill is not configured.',
    };
    console.log('[Edger] extract-chart response:', body);
    return NextResponse.json(body);
  }

  const { levels, rawModelText, apiError } = await fetchGeminiExtractedChartLevels({
    imageBase64: image.base64,
    mimeType: image.mimeType,
  });

  const debug = isDev ? { rawModelText, parsed: levels } : undefined;

  if (apiError) {
    const body: ExtractChartResponseBody = {
      levels: null,
      skippedReason: apiError,
      ...(debug ? { debug } : {}),
    };
    console.log('[Edger] extract-chart response:', JSON.stringify(body, null, 2));
    return NextResponse.json(body);
  }

  if (!levels || (!hasExtractedPrices(levels) && !hasExtractedInstrument(levels))) {
    const body: ExtractChartResponseBody = {
      levels: null,
      skippedReason: 'Could not read the instrument or trade levels on this chart.',
      ...(debug ? { debug } : {}),
    };
    console.log('[Edger] extract-chart response:', JSON.stringify(body, null, 2));
    return NextResponse.json(body);
  }

  const body: ExtractChartResponseBody = { levels, ...(debug ? { debug } : {}) };
  console.log('[Edger] extract-chart response:', JSON.stringify(body, null, 2));
  return NextResponse.json(body);
}
