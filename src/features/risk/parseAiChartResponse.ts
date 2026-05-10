import type { AiChartFeedback } from '@/types/trade-analyze';

function extractJsonCandidate(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) return fence[1].trim();

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

/** Best-effort parse; returns null when the model output is unusable. */
export function parseAiChartFeedback(raw: string): AiChartFeedback | null {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const parsed = JSON.parse(extractJsonCandidate(raw)) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;

    const o = parsed as Record<string, unknown>;
    const chartSummary = typeof o.chartSummary === 'string' ? o.chartSummary.trim() : '';
    const structureNotes = Array.isArray(o.structureNotes)
      ? (o.structureNotes as unknown[]).filter((x): x is string => typeof x === 'string')
      : [];
    const caveats = Array.isArray(o.caveats)
      ? (o.caveats as unknown[]).filter((x): x is string => typeof x === 'string')
      : [];

    return {
      chartSummary: chartSummary || 'Chart feedback could not be summarized.',
      structureNotes,
      caveats,
    };
  } catch {
    return null;
  }
}
