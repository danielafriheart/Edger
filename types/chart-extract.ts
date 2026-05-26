import type { Direction } from '@/lib/calc';
import type { PairCategory } from '@/constants/trading';

export type ChartExtractConfidence = 'high' | 'medium' | 'low';

export type AxisPriceInferredRole =
  | 'entry'
  | 'stop_loss'
  | 'take_profit'
  | 'structure'
  | 'current_price'
  | 'unknown';

/** One highlighted price on the TradingView right axis. */
export interface AxisPriceLabel {
  price: number;
  boxColor: string | null;
  chartLabel: string | null;
  inferredRole: AxisPriceInferredRole | null;
}

/** Structured trade levels read from a chart screenshot (TradingView, etc.). */
export interface ExtractedChartLevels {
  instrumentSymbol: string | null;
  pairCategory: PairCategory | null;
  /** All highlighted right-axis prices (helps busy charts; optional for older clients). */
  axisPriceLabels?: AxisPriceLabel[];
  direction: Direction | null;
  entry: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  confidence: ChartExtractConfidence;
  notes: string[];
}

export interface ExtractChartDebug {
  rawModelText: string | null;
  parsed: ExtractedChartLevels | null;
}

export interface ExtractChartResponseBody {
  levels: ExtractedChartLevels | null;
  /** Present when Gemini is not configured or extraction failed server-side. */
  skippedReason?: string;
  /** Dev-only: raw Gemini JSON text + parsed levels for debugging. */
  debug?: ExtractChartDebug;
}
