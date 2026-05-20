/**
 * Chart image limits — shared by client compression and POST /api/risk/analyze validation.
 * Sized for Gemini vision + future Supabase Storage (free tier 1 GB total).
 *
 * WebP at ~800 KB keeps chart lines/labels sharp while ~1,250 stored charts ≈ 1 GB.
 */

/** Hard cap on stored / API payload bytes (after client compression). */
export const MAX_CHART_IMAGE_BYTES = 800 * 1024;

/** Longest side after resize — keeps TradingView detail without huge files. */
export const CHART_IMAGE_MAX_DIMENSION_PX = 1600;

/** WebP quality — high enough for price levels and candle detail. */
export const CHART_IMAGE_QUALITY = 0.88;

/** Smaller dimension steps only if quality reduction is not enough. */
export const CHART_IMAGE_FALLBACK_DIMENSIONS_PX = [1440, 1280] as const;

/**
 * Max raw file size before compression (TradingView PNGs can be several MB).
 * Rejected early to avoid decoding huge images in the browser.
 */
export const MAX_CHART_IMAGE_SOURCE_BYTES = 12 * 1024 * 1024;

export const CHART_IMAGE_OUTPUT_MIME = 'image/webp' as const;

export function formatChartImageLimitKb(): string {
  return `${Math.round(MAX_CHART_IMAGE_BYTES / 1024)} KB`;
}
