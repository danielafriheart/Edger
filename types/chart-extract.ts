import type { Direction } from '@/lib/calc';
import type { PairCategory } from '@/constants/trading';

export type ChartExtractConfidence = 'high' | 'medium' | 'low';

/** Structured trade levels read from a chart screenshot (TradingView, etc.). */
export interface ExtractedChartLevels {
  instrumentSymbol: string | null;
  pairCategory: PairCategory | null;
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
