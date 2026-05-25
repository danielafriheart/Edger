import type { Direction } from '@/lib/calc';
import { refineExtractedChartLevels } from '@/lib/risk/refineExtractedChartLevels';
import { resolvePairCategory } from '@/lib/risk/resolveChartInstrument';
import type {
  AxisPriceInferredRole,
  AxisPriceLabel,
  ChartExtractConfidence,
  ExtractedChartLevels,
} from '@/types/chart-extract';

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

const AXIS_ROLES: AxisPriceInferredRole[] = [
  'entry',
  'stop_loss',
  'take_profit',
  'structure',
  'current_price',
  'unknown',
];

function parseAxisRole(v: unknown): AxisPriceInferredRole | null {
  if (typeof v !== 'string') return null;
  const normalized = v.trim().toLowerCase().replace(/\s+/g, '_');
  return AXIS_ROLES.includes(normalized as AxisPriceInferredRole)
    ? (normalized as AxisPriceInferredRole)
    : null;
}

function parseAxisPriceLabels(v: unknown): AxisPriceLabel[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const labels: AxisPriceLabel[] = [];
  for (const item of v) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const price = parseNullableNumber(row.price);
    if (price == null) continue;
    labels.push({
      price,
      boxColor:
        typeof row.boxColor === 'string' && row.boxColor.trim() ? row.boxColor.trim() : null,
      chartLabel:
        typeof row.chartLabel === 'string' && row.chartLabel.trim()
          ? row.chartLabel.trim()
          : null,
      inferredRole: parseAxisRole(row.inferredRole),
    });
  }
  return labels.length > 0 ? labels : undefined;
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

  const draft: ExtractedChartLevels = {
    instrumentSymbol,
    pairCategory: parsePairCategory(o.pairCategory),
    axisPriceLabels: parseAxisPriceLabels(o.axisPriceLabels),
    direction: parseDirection(o.direction),
    entry,
    stopLoss,
    takeProfit,
    confidence: parseConfidence(o.confidence),
    notes: parseNotes(o.notes),
  };

  return refineExtractedChartLevels(draft);
}
