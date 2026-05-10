/**
 * Ask for strict JSON only so we can persist ai_feedback deterministically.
 * Model must not invent lot size; user levels are echoed for context only.
 */
export function buildChartAnalyzeUserPrompt(setupLines: string[]): string {
  const setup = setupLines.filter(Boolean).join('\n');

  return `You assist a trader sizing a discretionary trade.

The ENTRY, STOP LOSS, and TAKE PROFIT levels below come from the user (not inferred by you).
Your job: briefly describe what you observe on the chart image (structure, notable levels, caution if unclear). Do NOT recalculate pip values or position size—the app does that deterministically.

User setup:
${setup}

Respond with ONLY a single JSON object (no markdown) using this shape:
{"chartSummary":"one short paragraph","structureNotes":["bullet as string"],"caveats":["optional warnings about visibility, timeframe mismatch, missing axis labels"]}

Rules:
- If the image does not clearly show levels, say so in chartSummary/caveats and keep structureNotes short.
- Never output lot size, leverage, pip distance in pips as authoritative numbers—you may qualitatively mention risk proximity.
`;
}
