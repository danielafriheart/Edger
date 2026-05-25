import { INSTRUMENTS, type PairCategory } from '@/constants/trading';

import { CHART_EXTRACT_AXIS_RULES } from '@/lib/risk/chartExtractAxisRules';

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

${CHART_EXTRACT_AXIS_RULES}

INSTRUMENT (required when visible):
- Read the ticker from the chart header, tab title, or top-left symbol label (e.g. EURUSD, GBPUSD, XAUUSD, GOLD, US100, BTCUSDT).
- Map it to instrumentSymbol using the catalog below (use slash form: "EUR/USD", "XAU/USD", "NAS100").
- Set pairCategory to the matching catalog category name.
- Common mappings: GOLD→XAU/USD, SILVER→XAG/USD, US100/USTEC→NAS100, US500→SPX500, BTCUSDT→BTC/USD.

TRADE LEVELS (entry, stopLoss, takeProfit):
- Derive from the ACTIVE trade zone or position tool — not from the first three axis numbers.
- Use exact prices shown. Do not invent values.
- Long/Short tool panel text overrides axis guessing when visible.

Return JSON only:
{
  "instrumentSymbol": string | null,
  "pairCategory": string | null,
  "axisPriceLabels": [
    {
      "price": number,
      "boxColor": string | null,
      "chartLabel": string | null,
      "inferredRole": "entry" | "stop_loss" | "take_profit" | "structure" | "current_price" | "unknown" | null
    }
  ],
  "direction": "long" | "short" | null,
  "entry": number | null,
  "stopLoss": number | null,
  "takeProfit": number | null,
  "confidence": "high" | "medium" | "low",
  "notes": []
}

Rules:
- axisPriceLabels: complete list of right-axis highlighted prices (top to bottom). Required on every chart.
- entry/stopLoss/takeProfit: must match the active trade setup; null only if truly not shown.
- instrumentSymbol: exact catalog symbol when readable; null only if the ticker is truly hidden.
- pairCategory: exact catalog category name when known.
- direction: long if SL below entry and TP above; short if opposite.
- notes: always []. Do not include chart commentary or analysis text.`;

export function chartExtractUserPrompt(): string {
  return `Extract instrument + active trade levels from this chart.

Instrument catalog (instrumentSymbol must be one of these symbols):
${instrumentCatalog()}

Steps:
1. Identify the chart ticker in the header/tab and set instrumentSymbol + pairCategory.
2. List every right-axis highlighted price in axisPriceLabels (all box colors, with chartLabel when visible).
3. Find the active Short/Long position tool or shaded vertical setup (ignore older setups on the left).
4. entry = divider line between gray and green boxes; takeProfit = bottom of green profit box; stopLoss = top of gray box OR interior line in green box (e.g. W.O.) — read exact prices from axis labels and horizontal lines.
5. If SL and TP are both below entry, stopLoss must be the higher price (closer to entry) and takeProfit the lower price.

Return JSON only.`;
}
