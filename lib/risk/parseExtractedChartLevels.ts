import type { Direction } from '@/lib/calc';
import { resolvePairCategory } from '@/lib/risk/resolveChartInstrument';
import type { ChartExtractConfidence, ExtractedChartLevels } from '@/types/chart-extract';

function extractJsonCandidate(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) return fence[1].trim();

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

function parseNullableNumber(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseDirection(v: unknown): Direction | null {
  return v === 'long' || v === 'short' ? v : null;
}

function parseConfidence(v: unknown): ChartExtractConfidence {
  if (v === 'high' || v === 'medium' || v === 'low') return v;
  return 'low';
}

function parsePairCategory(v: unknown): ExtractedChartLevels['pairCategory'] {
  if (typeof v !== 'string') return null;
  return resolvePairCategory(v);
}

function parseNotes(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
}

/** Parse model JSON; returns null if shape is unusable. */
export function parseExtractedChartLevelsJson(raw: string): ExtractedChartLevels | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonCandidate(raw)) as unknown;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;

  const o = parsed as Record<string, unknown>;
  const entry = parseNullableNumber(o.entry);
  const stopLoss = parseNullableNumber(o.stopLoss);
  const takeProfit = parseNullableNumber(o.takeProfit);

  const instrumentSymbol =
    typeof o.instrumentSymbol === 'string' && o.instrumentSymbol.trim()
      ? o.instrumentSymbol.trim()
      : null;

  const hasPrices = entry != null || stopLoss != null || takeProfit != null;
  const hasInstrument = Boolean(instrumentSymbol);
  if (!hasPrices && !hasInstrument) return null;

  return {
    instrumentSymbol,
    pairCategory: parsePairCategory(o.pairCategory),
    direction: parseDirection(o.direction),
    entry,
    stopLoss,
    takeProfit,
    confidence: parseConfidence(o.confidence),
    notes: parseNotes(o.notes),
  };
}
