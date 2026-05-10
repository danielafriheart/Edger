import type { CalcResult } from '@/lib/calc';
import type { AiChartFeedbackPayload } from '@/types/analyze-risk-api';

export function buildCalculationHistoryRow(
  userId: string,
  pairCategory: string,
  calc: CalcResult,
  aiFeedback: AiChartFeedbackPayload | null,
) {
  return {
    user_id: userId,
    pair_category: pairCategory,
    instrument_symbol: calc.instrument.symbol,
    direction: calc.direction,
    entry: calc.entry,
    stop_loss: calc.stopLoss,
    take_profit: calc.takeProfit,
    risk_usd: calc.riskUSD,
    calculation_ok: calc.ok,
    lot_size: calc.lotSize,
    pip_distance_sl: calc.pipDistanceSL,
    pip_distance_tp: calc.pipDistanceTP,
    pip_value_per_lot_usd: calc.pipValuePerLotUSD,
    potential_profit_usd: calc.potentialProfitUSD,
    risk_reward_ratio: calc.riskRewardRatio,
    errors: calc.errors,
    warnings: calc.warnings,
    ai_feedback: aiFeedback,
  };
}
