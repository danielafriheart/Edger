import type { AiChartFeedbackPayload } from '@/types/analyze-risk-api';

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

/** Parse model JSON; returns null if shape is invalid. */
export function parseAiChartFeedbackJson(raw: string): AiChartFeedbackPayload | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const o = parsed as Record<string, unknown>;
  const chartSummary = o.chartSummary;
  const structureNotes = o.structureNotes;
  const caveats = o.caveats;
  if (typeof chartSummary !== 'string') return null;
  if (!isStringArray(structureNotes) || !isStringArray(caveats)) return null;
  return { chartSummary, structureNotes, caveats };
}
