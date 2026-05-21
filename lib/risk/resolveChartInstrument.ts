import {
  CATEGORY_LABELS,
  INSTRUMENTS,
  findInstrument,
  type Instrument,
  type PairCategory,
} from '@/constants/trading';

/** TradingView / broker tickers → Edger catalog symbol. */
const TICKER_ALIASES: Record<string, string> = {
  GOLD: 'XAU/USD',
  XAUUSD: 'XAU/USD',
  XAUUSDT: 'XAU/USD',
  SILVER: 'XAG/USD',
  XAGUSD: 'XAG/USD',
  XAGUSDT: 'XAG/USD',
  EURUSD: 'EUR/USD',
  GBPUSD: 'GBP/USD',
  AUDUSD: 'AUD/USD',
  NZDUSD: 'NZD/USD',
  USDCHF: 'USD/CHF',
  USDCAD: 'USD/CAD',
  USDJPY: 'USD/JPY',
  EURJPY: 'EUR/JPY',
  GBPJPY: 'GBP/JPY',
  AUDJPY: 'AUD/JPY',
  CHFJPY: 'CHF/JPY',
  CADJPY: 'CAD/JPY',
  EURGBP: 'EUR/GBP',
  EURAUD: 'EUR/AUD',
  GBPAUD: 'GBP/AUD',
  AUDNZD: 'AUD/NZD',
  EURCAD: 'EUR/CAD',
  GBPCAD: 'GBP/CAD',
  BTCUSD: 'BTC/USD',
  BTCUSDT: 'BTC/USD',
  BITCOIN: 'BTC/USD',
  ETHUSD: 'ETH/USD',
  ETHUSDT: 'ETH/USD',
  ETHEREUM: 'ETH/USD',
  SOLUSD: 'SOL/USD',
  SOLUSDT: 'SOL/USD',
  NAS100: 'NAS100',
  US100: 'NAS100',
  USTEC: 'NAS100',
  USTECH100: 'NAS100',
  NQ1: 'NAS100',
  NQ: 'NAS100',
  US30: 'US30',
  DJI: 'US30',
  DOW: 'US30',
  SPX500: 'SPX500',
  US500: 'SPX500',
  SPX: 'SPX500',
  ES1: 'SPX500',
  GER40: 'GER40',
  DE40: 'GER40',
  DAX: 'GER40',
  UK100: 'UK100',
  FTSE: 'UK100',
};

const CATEGORY_ALIASES: Record<string, PairCategory> = {
  ...(Object.fromEntries(
    (Object.entries(CATEGORY_LABELS) as [PairCategory, string][]).map(([cat, label]) => [
      label.toUpperCase(),
      cat,
    ]),
  ) as Record<string, PairCategory>),
  FX: 'Standard Forex Pairs',
  FOREX: 'Standard Forex Pairs',
  JPY: 'JPY Pairs',
  METAL: 'Metals',
  METALS: 'Metals',
  INDEX: 'Indices',
  INDICES: 'Indices',
  CRYPTO: 'Crypto',
};

/** Strip broker prefixes (OANDA:EURUSD) and TradingView suffixes. */
export function normalizeChartTicker(raw: string): string {
  let s = raw.trim();
  if (!s) return '';

  if (s.includes(':')) {
    const parts = s.split(':');
    s = parts[parts.length - 1] ?? s;
  }

  s = s
    .replace(/\.(P|PERP|CASH)$/gi, '')
    .replace(/!+$/g, '')
    .replace(/[^A-Za-z0-9/]/g, '')
    .toUpperCase();

  return s.replace(/\//g, '');
}

function findCategoryForSymbol(symbol: string): PairCategory | null {
  for (const [cat, list] of Object.entries(INSTRUMENTS) as [
    PairCategory,
    Instrument[],
  ][]) {
    if (list.some((i) => i.symbol === symbol)) return cat;
  }
  return null;
}

function resolveCatalogSymbol(symbol: string): { symbol: string; category: PairCategory } | null {
  const trimmed = symbol.trim();
  const exact = findInstrument(trimmed);
  if (exact) {
    const category = findCategoryForSymbol(exact.symbol);
    if (category) return { symbol: exact.symbol, category };
  }

  const compact = normalizeChartTicker(trimmed);
  if (!compact) return null;

  const aliasTarget = TICKER_ALIASES[compact];
  if (aliasTarget) {
    const category = findCategoryForSymbol(aliasTarget);
    if (category) return { symbol: aliasTarget, category };
  }

  for (const [cat, list] of Object.entries(INSTRUMENTS) as [PairCategory, Instrument[]][]) {
    for (const inst of list) {
      const instCompact = inst.symbol.replace('/', '').toUpperCase();
      if (compact === instCompact) {
        return { symbol: inst.symbol, category: cat };
      }
    }
  }

  return null;
}

export function resolvePairCategory(raw: string | null): PairCategory | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed in INSTRUMENTS) return trimmed as PairCategory;

  const upper = trimmed.toUpperCase();
  return CATEGORY_ALIASES[upper] ?? null;
}

/** Map extracted symbol / category to an Edger instrument + category tab. */
export function resolveInstrumentFromExtract(
  symbol: string | null,
  category: PairCategory | null,
): { symbol: string; category: PairCategory } | null {
  if (symbol) {
    const fromSymbol = resolveCatalogSymbol(symbol);
    if (fromSymbol) return fromSymbol;
  }

  const resolvedCategory = category ? resolvePairCategory(category) : null;
  if (resolvedCategory && symbol) {
    const retry = resolveCatalogSymbol(symbol);
    if (retry) return retry;
  }

  if (resolvedCategory) {
    const first = INSTRUMENTS[resolvedCategory][0];
    if (first) return { symbol: first.symbol, category: resolvedCategory };
  }

  return null;
}
