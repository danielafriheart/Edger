// =============================================================================
// Edger — Instrument & Category Catalog
// -----------------------------------------------------------------------------
// Each instrument carries the metadata the calc engine needs:
//   - pipSize:      the price-unit equivalent of 1 "pip" (or 1 point, for indices/crypto)
//   - contractSize: units per 1 standard lot
//   - usdPipValuePerLot: dollars gained/lost per 1 pip on 1 standard lot,
//                        assuming the quote currency is USD or using a
//                        practical approximation when it isn't.
//   - decimals:     how many decimals to format prices with in the UI
//   - kind:         the broad asset class (used by calc engine for behaviour tweaks)
// =============================================================================

export type PairCategory =
  | "Standard Forex Pairs"
  | "JPY Pairs"
  | "Cross Pairs"
  | "Metals"
  | "Indices"
  | "Crypto";

export type InstrumentKind = "forex" | "forex_jpy" | "metal" | "index" | "crypto";

export interface Instrument {
  symbol: string;
  kind: InstrumentKind;
  pipSize: number;
  contractSize: number;
  usdPipValuePerLot: number;
  decimals: number;
  // Optional: a human-friendly note shown in the UI
  note?: string;
}

// -----------------------------------------------------------------------------
// Instruments
// -----------------------------------------------------------------------------
// USD-quoted pairs use exact pip values: pipSize * contractSize
//   e.g. EUR/USD: 0.0001 * 100,000 = $10/pip per standard lot
// Non-USD-quoted pairs (USD/JPY, EUR/GBP, etc.) need a current FX rate for
// exact accuracy. We use sensible 2024-2025 approximations and the user can
// always override the SL distance using the manual editable fields.

const fx = (symbol: string, kind: InstrumentKind, pipSize: number, usdPipValuePerLot: number, decimals: number, note?: string): Instrument => ({
  symbol,
  kind,
  pipSize,
  contractSize: 100_000,
  usdPipValuePerLot,
  decimals,
  note,
});

export const INSTRUMENTS: Record<PairCategory, Instrument[]> = {
  "Standard Forex Pairs": [
    fx("EUR/USD", "forex", 0.0001, 10, 5),
    fx("GBP/USD", "forex", 0.0001, 10, 5),
    fx("AUD/USD", "forex", 0.0001, 10, 5),
    fx("NZD/USD", "forex", 0.0001, 10, 5),
    fx("USD/CHF", "forex", 0.0001, 11, 5, "Approx. — quote in CHF, verify with broker"),
    fx("USD/CAD", "forex", 0.0001, 7.3, 5, "Approx. — quote in CAD, verify with broker"),
  ],
  "JPY Pairs": [
    fx("USD/JPY", "forex_jpy", 0.01, 6.7, 3, "Approx. at USD/JPY ≈ 150"),
    fx("EUR/JPY", "forex_jpy", 0.01, 6.7, 3, "Approx. — verify with broker"),
    fx("GBP/JPY", "forex_jpy", 0.01, 6.7, 3, "Approx. — verify with broker"),
    fx("AUD/JPY", "forex_jpy", 0.01, 6.7, 3, "Approx. — verify with broker"),
    fx("CHF/JPY", "forex_jpy", 0.01, 6.7, 3, "Approx. — verify with broker"),
    fx("CAD/JPY", "forex_jpy", 0.01, 6.7, 3, "Approx. — verify with broker"),
  ],
  "Cross Pairs": [
    fx("EUR/GBP", "forex", 0.0001, 13.2, 5, "Approx. — quote in GBP"),
    fx("EUR/AUD", "forex", 0.0001, 6.5, 5, "Approx. — quote in AUD"),
    fx("GBP/AUD", "forex", 0.0001, 6.5, 5, "Approx. — quote in AUD"),
    fx("AUD/NZD", "forex", 0.0001, 6.0, 5, "Approx. — quote in NZD"),
    fx("EUR/CAD", "forex", 0.0001, 7.3, 5, "Approx. — quote in CAD"),
    fx("GBP/CAD", "forex", 0.0001, 7.3, 5, "Approx. — quote in CAD"),
  ],
  "Metals": [
    {
      symbol: "XAU/USD",
      kind: "metal",
      pipSize: 0.01,
      contractSize: 100,
      usdPipValuePerLot: 1, // 100 oz × $0.01 = $1/pip on 1 lot
      decimals: 2,
      note: "Gold — 100 oz contract, $1/pip per lot (1 pip = $0.01 move)",
    },
    {
      symbol: "XAG/USD",
      kind: "metal",
      pipSize: 0.001,
      contractSize: 5000,
      usdPipValuePerLot: 5, // 5000 oz × $0.001 = $5/pip
      decimals: 3,
      note: "Silver — 5000 oz contract, $5/pip per lot",
    },
  ],
  "Indices": [
    {
      symbol: "NAS100",
      kind: "index",
      pipSize: 1,
      contractSize: 1,
      usdPipValuePerLot: 1,
      decimals: 2,
      note: "Nasdaq 100 — $1 per point per lot (varies by broker)",
    },
    {
      symbol: "US30",
      kind: "index",
      pipSize: 1,
      contractSize: 1,
      usdPipValuePerLot: 1,
      decimals: 2,
      note: "Dow Jones — $1 per point per lot (varies by broker)",
    },
    {
      symbol: "SPX500",
      kind: "index",
      pipSize: 0.1,
      contractSize: 1,
      usdPipValuePerLot: 1,
      decimals: 2,
      note: "S&P 500 — $1 per 0.1 point per lot (varies by broker)",
    },
    {
      symbol: "GER40",
      kind: "index",
      pipSize: 1,
      contractSize: 1,
      usdPipValuePerLot: 1.1,
      decimals: 2,
      note: "DAX — quoted in EUR, approx. $1.1/point",
    },
    {
      symbol: "UK100",
      kind: "index",
      pipSize: 1,
      contractSize: 1,
      usdPipValuePerLot: 1.27,
      decimals: 2,
      note: "FTSE 100 — quoted in GBP, approx. $1.27/point",
    },
  ],
  "Crypto": [
    {
      symbol: "BTC/USD",
      kind: "crypto",
      pipSize: 1,
      contractSize: 1,
      usdPipValuePerLot: 1,
      decimals: 2,
      note: "$1 per $1 move per 1 BTC (broker conventions vary)",
    },
    {
      symbol: "ETH/USD",
      kind: "crypto",
      pipSize: 0.1,
      contractSize: 1,
      usdPipValuePerLot: 0.1,
      decimals: 2,
      note: "$0.10 per $0.10 move per 1 ETH (broker conventions vary)",
    },
    {
      symbol: "SOL/USD",
      kind: "crypto",
      pipSize: 0.01,
      contractSize: 1,
      usdPipValuePerLot: 0.01,
      decimals: 2,
    },
  ],
};

// -----------------------------------------------------------------------------
// Backwards-compatible string list (used by existing select dropdowns)
// -----------------------------------------------------------------------------
export const PAIR_OPTIONS: Record<PairCategory, string[]> = Object.fromEntries(
  Object.entries(INSTRUMENTS).map(([cat, list]) => [cat, list.map((i) => i.symbol)])
) as Record<PairCategory, string[]>;

export const CATEGORY_LABELS: Record<PairCategory, string> = {
  "Standard Forex Pairs": "Standard FX",
  "JPY Pairs": "JPY",
  "Cross Pairs": "Cross",
  "Metals": "Metals",
  "Indices": "Indices",
  "Crypto": "Crypto",
};

// -----------------------------------------------------------------------------
// Quick lookup helper
// -----------------------------------------------------------------------------
export function findInstrument(symbol: string): Instrument | undefined {
  for (const list of Object.values(INSTRUMENTS)) {
    const found = list.find((i) => i.symbol === symbol);
    if (found) return found;
  }
  return undefined;
}

// -----------------------------------------------------------------------------
// Per-category guidance shown in the analyzer (real, useful tips — no placeholders)
// -----------------------------------------------------------------------------
export const CATEGORY_INSTRUCTIONS: Record<PairCategory, { title: string; rules: string[] }> = {
  "Standard Forex Pairs": {
    title: "Standard FX — Reading Tips",
    rules: [
      "Pip = 0.0001 of price (4th decimal). $10/pip per standard lot on USD-quoted pairs.",
      "Highest liquidity during London/New York overlap (12:00–16:00 UTC).",
      "Avoid entries within 30 minutes of high-impact news (NFP, CPI, FOMC).",
      "Use the chart's long/short tool: Edger reads entry, SL, and TP from the colored zones.",
    ],
  },
  "JPY Pairs": {
    title: "JPY Pairs — Reading Tips",
    rules: [
      "Pip = 0.01 of price (2nd decimal) — different from non-JPY pairs.",
      "Pip value depends on USD/JPY rate; expect ~$6.5–7 per pip per lot at current rates.",
      "Tokyo session opens at 00:00 UTC — watch BoJ commentary and intervention zones.",
      "Spreads widen during Asian-to-London handoff; pad SL by 1–2 pips on entries here.",
    ],
  },
  "Cross Pairs": {
    title: "Cross Pairs — Reading Tips",
    rules: [
      "Quote currency isn't USD — pip value depends on the quote→USD conversion rate.",
      "Lower liquidity than majors; expect wider spreads and slightly slower fills.",
      "Check correlations: EUR/AUD often mirrors EUR/USD vs AUD/USD spread movement.",
      "Avoid trading when both legs have scheduled news in the same session.",
    ],
  },
  "Metals": {
    title: "Metals — Reading Tips",
    rules: [
      "Gold (XAU/USD): 1 pip = $0.01, $1/pip per lot on a 100 oz contract.",
      "Silver (XAG/USD): 1 pip = $0.001, $5/pip per lot on a 5000 oz contract.",
      "Watch DXY (dollar index) — gold typically moves inverse to it.",
      "Liquidity drops during Asian session; use wider stops in low-volume hours.",
    ],
  },
  "Indices": {
    title: "Indices — Reading Tips",
    rules: [
      "Indices are quoted in points, not pips. NAS100/US30 ≈ $1 per point per lot.",
      "Cash sessions: NAS100/US30 most active during US open (13:30 UTC).",
      "Overnight gaps are common — set SL beyond prior session highs/lows.",
      "Earnings season and FOMC days drive outsized moves; reduce size or skip.",
    ],
  },
  "Crypto": {
    title: "Crypto — Reading Tips",
    rules: [
      "Crypto trades 24/7 — no 'session' rules but volume peaks during US/EU hours.",
      "Volatility is 3–5x typical FX; widen SL or scale down lot size accordingly.",
      "Broker contract sizes vary widely — verify pip value before sizing up.",
      "Weekend gaps possible if broker pauses trading; flatten exposure Friday close.",
    ],
  },
};
