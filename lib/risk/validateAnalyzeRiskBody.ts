import { INSTRUMENTS, type PairCategory } from '@/constants/trading';

export interface ValidatedAnalyzeBody {
  pairCategory: PairCategory;
  instrumentSymbol: string;
  direction: 'long' | 'short';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskUSD: number;
}

function isPairCategory(s: unknown): s is PairCategory {
  return typeof s === 'string' && s in INSTRUMENTS;
}

/** POST body from the analyzer (numeric trade inputs only). */
export function validateAnalyzeRiskBody(body: unknown):
  | { ok: true; data: ValidatedAnalyzeBody }
  | { ok: false; status: number; message: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, message: 'Invalid JSON body' };
  }

  const b = body as Record<string, unknown>;
  const pairCategory = b.pairCategory;
  const instrumentSymbol = b.instrumentSymbol;
  const direction = b.direction;

  if (!isPairCategory(pairCategory)) {
    return { ok: false, status: 400, message: 'Invalid pairCategory' };
  }
  if (typeof instrumentSymbol !== 'string' || !instrumentSymbol.trim()) {
    return { ok: false, status: 400, message: 'Invalid instrumentSymbol' };
  }
  if (direction !== 'long' && direction !== 'short') {
    return { ok: false, status: 400, message: 'Invalid direction' };
  }

  const entry = Number(b.entry);
  const stopLoss = Number(b.stopLoss);
  const takeProfit = Number(b.takeProfit);
  const riskUSD = Number(b.riskUSD);

  for (const [name, n] of Object.entries({
    entry,
    stopLoss,
    takeProfit,
    riskUSD,
  }) as [string, number][]) {
    if (!Number.isFinite(n)) {
      return { ok: false, status: 400, message: `Invalid ${name}` };
    }
  }

  const data: ValidatedAnalyzeBody = {
    pairCategory,
    instrumentSymbol: instrumentSymbol.trim(),
    direction,
    entry,
    stopLoss,
    takeProfit,
    riskUSD,
  };

  const symbols = INSTRUMENTS[data.pairCategory].map((i) => i.symbol);
  if (!symbols.includes(data.instrumentSymbol)) {
    return { ok: false, status: 400, message: 'Instrument does not match category' };
  }

  return { ok: true, data };
}
