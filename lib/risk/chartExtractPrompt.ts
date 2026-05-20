import { INSTRUMENTS, type PairCategory } from '@/constants/trading';

function instrumentCatalog(): string {
  return (Object.entries(INSTRUMENTS) as [PairCategory, (typeof INSTRUMENTS)[PairCategory]][])
    .map(([category, list]) => {
      const symbols = list.map((i) => i.symbol).join(', ');
      return `${category}: ${symbols}`;
    })
    .join('\n');
}

export const CHART_EXTRACT_SYSTEM_INSTRUCTION = `You read trading chart screenshots to extract an active trade setup for a position-size calculator.
Focus on TradingView-style charts.

INSTRUMENT (required when visible):
- Read the ticker from the chart header, tab title, or top-left symbol label (e.g. EURUSD, GBPUSD, XAUUSD, GOLD, US100, BTCUSDT).
- Map it to instrumentSymbol using the catalog below (use slash form: "EUR/USD", "XAU/USD", "NAS100").
- Set pairCategory to the matching catalog category name.
- Common mappings: GOLD→XAU/USD, SILVER→XAG/USD, US100/USTEC→NAS100, US500→SPX500, BTCUSDT→BTC/USD.

TRADE LEVELS:
- Long/Short position tool: entry, stop loss (SL), take profit (TP) from line labels or the position panel.
- Use exact prices shown. Do not invent values.

Return JSON only:
{
  "instrumentSymbol": string | null,
  "pairCategory": string | null,
  "direction": "long" | "short" | null,
  "entry": number | null,
  "stopLoss": number | null,
  "takeProfit": number | null,
  "confidence": "high" | "medium" | "low",
  "notes": string[]
}

Rules:
- instrumentSymbol: exact catalog symbol when readable; null only if the ticker is truly hidden.
- pairCategory: exact catalog category name when known.
- direction: long if SL below entry and TP above; short if opposite.
- notes: brief caveats; empty array if none.`;

export function chartExtractUserPrompt(): string {
  return `Extract instrument + active trade levels from this chart.

Instrument catalog (instrumentSymbol must be one of these symbols):
${instrumentCatalog()}

Steps:
1. Identify the chart ticker in the header/tab and set instrumentSymbol + pairCategory.
2. Read entry, SL, TP from the Long/Short tool or labeled horizontal lines.

Return JSON only.`;
}
