import type { CalcResult } from '@/lib/calc';

/** Structured chart commentary from Gemini (not used for lot math). */
export interface AiChartFeedbackPayload {
  chartSummary: string;
  structureNotes: string[];
  caveats: string[];
}

export interface AnalyzeRiskResponseBody {
  result: CalcResult;
  aiFeedback: AiChartFeedbackPayload | null;
  historyId: string | null;
  /** When row insert failed but sizing succeeded. */
  persistWarning?: string;
}
