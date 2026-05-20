import 'server-only';

import { GoogleGenerativeAI } from '@google/generative-ai';

import {
  CHART_EXTRACT_SYSTEM_INSTRUCTION,
  chartExtractUserPrompt,
} from '@/lib/risk/chartExtractPrompt';
import { geminiErrorToUserMessage } from '@/lib/risk/geminiErrorMessage';
import { geminiModelId } from '@/lib/risk/geminiModelId';
import { parseExtractedChartLevelsJson } from '@/lib/risk/parseExtractedChartLevels';
import type { ExtractedChartLevels } from '@/types/chart-extract';

export interface GeminiExtractChartResult {
  levels: ExtractedChartLevels | null;
  rawModelText: string | null;
  apiError: string | null;
}

export async function fetchGeminiExtractedChartLevels(input: {
  imageBase64: string;
  mimeType: string;
}): Promise<GeminiExtractChartResult> {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!key) return { levels: null, rawModelText: null, apiError: null };

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: geminiModelId(),
    systemInstruction: CHART_EXTRACT_SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  try {
    const res = await model.generateContent([
      chartExtractUserPrompt(),
      { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } },
    ]);
    const rawModelText = res.response.text();
    const levels = parseExtractedChartLevelsJson(rawModelText);

    console.log('[Edger] Gemini extract-chart raw:', rawModelText);
    if (!levels) {
      console.warn('[Edger] Gemini extract-chart parse failed');
    }

    return { levels, rawModelText, apiError: null };
  } catch (err) {
    const apiError = geminiErrorToUserMessage(err);
    console.error('[Edger] Gemini extract-chart error:', err);
    return { levels: null, rawModelText: null, apiError };
  }
}
