/** Structured Gemini output (stored in calculation_history.ai_feedback). */
export interface AiChartFeedback {
  chartSummary: string;
  structureNotes: string[];
  caveats: string[];
}

export interface AnalyzeRiskResponseBody {
  result: import('@/lib/calc').CalcResult;
  aiFeedback: AiChartFeedback | null;
  historyId: string | null;
  geminiSkippedReason?: string;
}
