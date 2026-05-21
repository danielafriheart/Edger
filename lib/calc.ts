// =============================================================================
// Edger — Lot Size Calculation Engine
// -----------------------------------------------------------------------------
// Given:  risk in USD, entry price, stop-loss price, take-profit price,
//         direction (long/short), and the instrument metadata,
// Returns: pip distance, lot size, pip value, potential profit, R:R, and
//          a sanity-check status.
//
// Formulas
//   pipDistance      = |entry - stopLoss| / pipSize
//   pipValuePerLot   = instrument.usdPipValuePerLot   (in USD)
//   lotSize          = riskUSD / (pipDistance * pipValuePerLot)
//   tpPipDistance    = |takeProfit - entry| / pipSize
//   potentialProfit  = tpPipDistance * pipValuePerLot * lotSize
//   rr               = tpPipDistance / pipDistance
// =============================================================================

import type { Instrument } from "../constants/trading";

export type Direction = "long" | "short";

export interface CalcInput {
  instrument: Instrument;
  direction: Direction;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskUSD: number;
}

export interface CalcResult {
  ok: boolean;
  warnings: string[];
  errors: string[];

  // Inputs echoed for display
  instrument: Instrument;
  direction: Direction;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskUSD: number;

  // Computed
  pipDistanceSL: number;
  pipDistanceTP: number;
  pipValuePerLotUSD: number;
  lotSize: number;
  potentialProfitUSD: number;
  potentialLossUSD: number;
  riskRewardRatio: number; // e.g. 2 → "1:2"
}

/**
 * Validates direction-aware level placement.
 * Long:  stopLoss < entry < takeProfit
 * Short: takeProfit < entry < stopLoss
 */
function validateLevels(input: CalcInput): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { direction, entry, stopLoss, takeProfit } = input;

  if (input.riskUSD <= 0) errors.push("Risk must be greater than $0.");
  if (!isFinite(entry) || !isFinite(stopLoss) || !isFinite(takeProfit)) {
    errors.push("Entry, stop loss, and take profit must all be valid numbers.");
    return { errors, warnings };
  }
  if (entry === stopLoss) errors.push("Stop loss can't equal entry.");
  if (entry === takeProfit) errors.push("Take profit can't equal entry.");

  if (direction === "long") {
    if (stopLoss >= entry) errors.push("On a long, stop loss must be below entry.");
    if (takeProfit <= entry) errors.push("On a long, take profit must be above entry.");
  } else {
    if (stopLoss <= entry) errors.push("On a short, stop loss must be above entry.");
    if (takeProfit >= entry) errors.push("On a short, take profit must be below entry.");
  }

  return { errors, warnings };
}

export function calculateTrade(input: CalcInput): CalcResult {
  const { instrument, direction, entry, stopLoss, takeProfit, riskUSD } = input;
  const { errors, warnings } = validateLevels(input);

  // Always compute what we can — caller can show errors/warnings inline.
  const pipDistanceSL = Math.abs(entry - stopLoss) / instrument.pipSize;
  const pipDistanceTP = Math.abs(takeProfit - entry) / instrument.pipSize;
  const pipValuePerLotUSD = instrument.usdPipValuePerLot;

  const lotSize =
    pipDistanceSL > 0 && pipValuePerLotUSD > 0
      ? riskUSD / (pipDistanceSL * pipValuePerLotUSD)
      : 0;

  const potentialLossUSD = pipDistanceSL * pipValuePerLotUSD * lotSize;
  const potentialProfitUSD = pipDistanceTP * pipValuePerLotUSD * lotSize;
  const riskRewardRatio = pipDistanceSL > 0 ? pipDistanceTP / pipDistanceSL : 0;

  // Soft warnings — still calculable but flag oddities
  if (lotSize > 0 && lotSize < 0.01) {
    warnings.push(
      `Calculated lot size (${lotSize.toFixed(4)}) is below the typical 0.01 minimum. Consider reducing risk or widening SL.`
    );
  }
  if (lotSize > 50) {
    warnings.push(`Lot size is very large (${lotSize.toFixed(2)}). Double-check your SL distance.`);
  }
  if (riskRewardRatio > 0 && riskRewardRatio < 1) {
    warnings.push(`Risk:reward is below 1:1 (1:${riskRewardRatio.toFixed(2)}) — your TP may be too close.`);
  }
  if (instrument.note) warnings.push(instrument.note);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    instrument,
    direction,
    entry,
    stopLoss,
    takeProfit,
    riskUSD,
    pipDistanceSL,
    pipDistanceTP,
    pipValuePerLotUSD,
    lotSize,
    potentialProfitUSD,
    potentialLossUSD,
    riskRewardRatio,
  };
}

/** Format a R:R ratio as "1:2.5" */
export function formatRR(ratio: number): string {
  if (!isFinite(ratio) || ratio <= 0) return "—";
  return `1:${ratio.toFixed(2)}`;
}

/** Round lot size to broker-friendly precision (typically 0.01 minimum). */
export function roundLot(lot: number): number {
  if (!isFinite(lot) || lot <= 0) return 0;
  return Math.round(lot * 100) / 100;
}
