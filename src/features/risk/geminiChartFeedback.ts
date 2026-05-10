import 'server-only';

import { GoogleGenerativeAI } from '@google/generative-ai';

import { parseAiChartFeedbackJson } from '@/features/risk/parseGeminiChartJson';
import type { AiChartFeedbackPayload } from '@/types/analyze-risk-api';

const CHART_SYSTEM_INSTRUCTION = `You describe trading chart screenshots for educational position-sizing context only.
You do not give financial advice, trade signals, or guaranteed outcomes.
Return JSON only with keys: chartSummary (string, 1-3 sentences), structureNotes (array of short strings about visible structure), caveats (array of short strings about uncertainty or what you cannot see).
Do not output entry/stop/take-profit prices or lot size.`;

function geminiModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
}

export async function fetchGeminiChartFeedback(input: {
  imageBase64: string;
  mimeType: string;
  userSetupSummary: string;
}): Promise<AiChartFeedbackPayload | null> {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!key) return null;

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: geminiModelId(),
    systemInstruction: CHART_SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = `User trade setup (authoritative for sizing, not to be changed by you):\n${input.userSetupSummary}\n\nDescribe the attached chart image in context of that setup.`;

  try {
    const res = await model.generateContent([
      prompt,
      { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } },
    ]);
    const text = res.response.text();
    return parseAiChartFeedbackJson(text);
  } catch {
    return null;
  }
}
