import type { Direction } from '@/lib/calc';
import { fixSlTpByEntryGeometry } from '@/lib/risk/fixSlTpByEntryGeometry';
import type {
  AxisPriceLabel,
  ChartExtractConfidence,
  ExtractedChartLevels,
} from '@/types/chart-extract';

const STRUCTURE_KEYWORDS =
  /breaker|mitigation|asia|cbdr|asian|range|partial|breakeven|\bbe\b|w\.o\.|session|00:00|\+bb/i;

function inferDirectionFromPrices(
  entry: number,
  stopLoss: number,
  takeProfit: number,
): Direction | null {
  if (stopLoss < entry && takeProfit > entry) return 'long';
  if (stopLoss > entry && takeProfit < entry) return 'short';
  return null;
}

function pricesConsistentWithDirection(
  direction: Direction,
  entry: number,
  stopLoss: number,
  takeProfit: number,
): boolean {
  if (direction === 'long') return stopLoss < entry && takeProfit > entry;
  return stopLoss > entry && takeProfit < entry;
}

function roleToField(role: string): 'entry' | 'stopLoss' | 'takeProfit' | null {
  const r = role.toLowerCase();
  if (r.includes('entry')) return 'entry';
  if (r.includes('stop') || r === 'sl') return 'stopLoss';
  if (r.includes('profit') || r === 'tp' || r.includes('target')) return 'takeProfit';
  return null;
}

function pickFromAxisLabels(labels: AxisPriceLabel[]): Partial<
  Pick<ExtractedChartLevels, 'entry' | 'stopLoss' | 'takeProfit'>
> {
  const out: Partial<Pick<ExtractedChartLevels, 'entry' | 'stopLoss' | 'takeProfit'>> = {};
  for (const label of labels) {
    const role = label.inferredRole?.trim();
    if (!role) continue;
    const field = roleToField(role);
    if (!field || out[field] != null) continue;
    out[field] = label.price;
  }
  return out;
}

function lowerConfidence(
  current: ChartExtractConfidence,
  next: ChartExtractConfidence,
): ChartExtractConfidence {
  const rank: Record<ChartExtractConfidence, number> = { high: 3, medium: 2, low: 1 };
  return rank[next] < rank[current] ? next : current;
}

/** Normalize ordering, fill gaps from axis roles, and downgrade bad extractions. */
export function refineExtractedChartLevels(levels: ExtractedChartLevels): ExtractedChartLevels {
  let { entry, stopLoss, takeProfit, direction, confidence } = levels;

  const fromAxis = levels.axisPriceLabels?.length
    ? pickFromAxisLabels(levels.axisPriceLabels)
    : {};
  if (entry == null && fromAxis.entry != null) entry = fromAxis.entry;
  if (stopLoss == null && fromAxis.stopLoss != null) stopLoss = fromAxis.stopLoss;
  if (takeProfit == null && fromAxis.takeProfit != null) takeProfit = fromAxis.takeProfit;

  if (entry != null && stopLoss != null && takeProfit != null) {
    const geometry = fixSlTpByEntryGeometry(entry, stopLoss, takeProfit, direction);
    if (geometry.swapped) {
      stopLoss = geometry.stopLoss;
      takeProfit = geometry.takeProfit;
      direction = geometry.direction;
    }

    if (!direction) direction = inferDirectionFromPrices(entry, stopLoss, takeProfit);
    if (direction && !pricesConsistentWithDirection(direction, entry, stopLoss, takeProfit)) {
      const bothBelow = stopLoss < entry && takeProfit < entry;
      const bothAbove = stopLoss > entry && takeProfit > entry;
      if (!bothBelow && !bothAbove) {
        confidence = lowerConfidence(confidence, 'low');
      }
    }
  } else if (
    levels.axisPriceLabels &&
    levels.axisPriceLabels.length >= 4 &&
    (entry == null || stopLoss == null || takeProfit == null)
  ) {
    confidence = lowerConfidence(confidence, 'medium');
  }

  const structureOnly =
    levels.axisPriceLabels?.filter(
      (l) => l.chartLabel && STRUCTURE_KEYWORDS.test(l.chartLabel),
    ).length ?? 0;
  const axisCount = levels.axisPriceLabels?.length ?? 0;
  if (axisCount >= 5 && structureOnly >= 2 && confidence === 'high') {
    confidence = 'medium';
  }

  return {
    ...levels,
    entry,
    stopLoss,
    takeProfit,
    direction,
    confidence,
    notes: [],
  };
}
