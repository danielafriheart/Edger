import { Buffer } from 'node:buffer';

import { INSTRUMENTS, type PairCategory } from '@/constants/trading';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ALLOWED_IMAGE_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

export interface ValidatedAnalyzeBody {
  pairCategory: PairCategory;
  instrumentSymbol: string;
  direction: 'long' | 'short';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskUSD: number;
  image?: { mimeType: string; base64: string };
}

function isPairCategory(s: unknown): s is PairCategory {
  return typeof s === 'string' && s in INSTRUMENTS;
}

/** POST body from the analyzer; image is optional multimodal context. */
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

  let image: { mimeType: string; base64: string } | undefined;
  if (b.image != null && b.image !== '') {
    if (typeof b.image !== 'object') {
      return { ok: false, status: 400, message: 'Invalid image' };
    }
    const img = b.image as Record<string, unknown>;
    const mimeType = img.mimeType;
    const raw64 = img.base64;
    if (typeof mimeType !== 'string' || typeof raw64 !== 'string') {
      return { ok: false, status: 400, message: 'Image requires mimeType and base64' };
    }
    if (!ALLOWED_IMAGE_MIME.has(mimeType.trim().toLowerCase())) {
      return { ok: false, status: 400, message: 'Unsupported image type' };
    }
    let base64 = raw64.includes('base64,') ? raw64.split('base64,')[1]! : raw64;
    base64 = base64.replace(/\s/g, '');
    try {
      const bytes = Buffer.from(base64, 'base64').length;
      if (bytes > MAX_IMAGE_BYTES) {
        return { ok: false, status: 413, message: 'Image too large (max 4MB)' };
      }
      if (bytes === 0) return { ok: false, status: 400, message: 'Empty image' };
    } catch {
      return { ok: false, status: 400, message: 'Invalid base64 image' };
    }
    image = { mimeType: mimeType.trim().toLowerCase(), base64 };
  }

  const data: ValidatedAnalyzeBody = {
    pairCategory,
    instrumentSymbol: instrumentSymbol.trim(),
    direction,
    entry,
    stopLoss,
    takeProfit,
    riskUSD,
    ...(image ? { image } : {}),
  };

  const symbols = INSTRUMENTS[data.pairCategory].map((i) => i.symbol);
  if (!symbols.includes(data.instrumentSymbol)) {
    return { ok: false, status: 400, message: 'Instrument does not match category' };
  }

  return { ok: true, data };
}
