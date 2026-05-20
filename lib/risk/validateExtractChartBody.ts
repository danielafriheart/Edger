import { Buffer } from 'node:buffer';

import { MAX_CHART_IMAGE_BYTES } from '@/constants/chart-image';

const ALLOWED_IMAGE_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

export interface ValidatedExtractChartBody {
  image: { mimeType: string; base64: string };
}

export function validateExtractChartBody(body: unknown):
  | { ok: true; data: ValidatedExtractChartBody }
  | { ok: false; status: number; message: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, message: 'Invalid JSON body' };
  }

  const b = body as Record<string, unknown>;
  if (b.image == null || typeof b.image !== 'object') {
    return { ok: false, status: 400, message: 'Image is required' };
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
    if (bytes > MAX_CHART_IMAGE_BYTES) {
      return { ok: false, status: 413, message: 'Image too large' };
    }
    if (bytes === 0) return { ok: false, status: 400, message: 'Empty image' };
  } catch {
    return { ok: false, status: 400, message: 'Invalid base64 image' };
  }

  return {
    ok: true,
    data: { image: { mimeType: mimeType.trim().toLowerCase(), base64 } },
  };
}
