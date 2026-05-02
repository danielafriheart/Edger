// =============================================================================
// Edger Vision — UI-only stub
// -----------------------------------------------------------------------------
// The real AI chart-extraction will run server-side once the backend is wired.
// For now this returns plausible mock data after a brief delay so the analyzer
// flow can be tested end-to-end without any external calls.
//
// When the backend is ready, replace the body of `analyzeChart()` with a fetch
// to your own endpoint (e.g. POST /api/analyze) that proxies to Anthropic.
// =============================================================================

export interface VisionResult {
  direction: "long" | "short" | null;
  entry: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  detectedSymbol: string | null;
  rationale: string;
}

/**
 * Simulates a chart-extraction call. Returns a reasonable EUR/USD long setup
 * so the form auto-fills with valid values for demo/testing.
 *
 * The signature still accepts the image so the call site doesn't need to
 * change when the backend is wired up.
 */
export async function analyzeChart(_imageDataUrl: string): Promise<VisionResult> {
  // Brief delay to feel like a real network call.
  await new Promise((resolve) => setTimeout(resolve, 1100));

  return {
    direction: "long",
    entry: 1.0845,
    stopLoss: 1.083,
    takeProfit: 1.0875,
    detectedSymbol: "EURUSD",
    rationale:
      "Demo data — backend not yet wired. These levels are placeholders so you can test the flow.",
  };
}
