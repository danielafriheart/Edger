import type { Direction } from '@/lib/calc';

/** GBPUSD-style charts: two sub-entry levels within ~20 pips are often SL/TP pair. */
const CLOSE_LEVEL_THRESHOLD = 0.002;

export interface SlTpGeometryFix {
  stopLoss: number;
  takeProfit: number;
  direction: Direction | null;
  swapped: boolean;
}

/**
 * When SL and TP sit on the same side of entry (common on Short tools with a large
 * green profit box), the farther price is TP and the nearer price is SL.
 */
export function fixSlTpByEntryGeometry(
  entry: number,
  stopLoss: number,
  takeProfit: number,
  direction: Direction | null,
): SlTpGeometryFix {
  const span = Math.abs(stopLoss - takeProfit);
  if (span > CLOSE_LEVEL_THRESHOLD) {
    return { stopLoss, takeProfit, direction, swapped: false };
  }

  if (stopLoss < entry && takeProfit < entry) {
    const nearer = Math.max(stopLoss, takeProfit);
    const farther = Math.min(stopLoss, takeProfit);
    const swapped = stopLoss !== nearer || takeProfit !== farther;
    return {
      stopLoss: nearer,
      takeProfit: farther,
      direction: direction ?? 'short',
      swapped,
    };
  }

  if (stopLoss > entry && takeProfit > entry) {
    const nearer = Math.min(stopLoss, takeProfit);
    const farther = Math.max(stopLoss, takeProfit);
    const swapped = stopLoss !== nearer || takeProfit !== farther;
    return {
      stopLoss: nearer,
      takeProfit: farther,
      direction: direction ?? 'long',
      swapped,
    };
  }

  return { stopLoss, takeProfit, direction, swapped: false };
}
