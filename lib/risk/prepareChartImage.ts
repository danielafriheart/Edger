'use client';

import {
  CHART_IMAGE_FALLBACK_DIMENSIONS_PX,
  CHART_IMAGE_MAX_DIMENSION_PX,
  CHART_IMAGE_OUTPUT_MIME,
  CHART_IMAGE_QUALITY,
  MAX_CHART_IMAGE_BYTES,
} from '@/constants/chart-image';

const QUALITY_FLOOR = 0.76;
const QUALITY_STEP = 0.04;

function scaleToMaxDimension(width: number, height: number, max: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= max) return { width, height };
  const scale = max / longest;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to compress image'));
      },
      CHART_IMAGE_OUTPUT_MIME,
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Failed to read compressed image'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read compressed image'));
    reader.readAsDataURL(blob);
  });
}

async function compressOnCanvas(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  maxDimension: number,
  quality: number,
): Promise<Blob> {
  const { width, height } = scaleToMaxDimension(srcWidth, srcHeight, maxDimension);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return canvasToBlob(canvas, quality);
}

async function tryCompressAtDimension(
  bitmap: ImageBitmap,
  maxDimension: number,
  startQuality: number,
): Promise<Blob | null> {
  let quality = startQuality;
  while (quality >= QUALITY_FLOOR) {
    const blob = await compressOnCanvas(
      bitmap,
      bitmap.width,
      bitmap.height,
      maxDimension,
      quality,
    );
    if (blob.size <= MAX_CHART_IMAGE_BYTES) return blob;
    quality -= QUALITY_STEP;
  }
  return null;
}

async function compressToTarget(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const dimensions = [
      CHART_IMAGE_MAX_DIMENSION_PX,
      ...CHART_IMAGE_FALLBACK_DIMENSIONS_PX,
    ];

    for (const maxDimension of dimensions) {
      const blob = await tryCompressAtDimension(bitmap, maxDimension, CHART_IMAGE_QUALITY);
      if (blob) return blob;
    }

    throw new Error('COMPRESS_TOO_LARGE');
  } finally {
    bitmap.close();
  }
}

/** Resize and WebP-compress a chart for analyzer preview + API upload. */
export async function prepareChartImage(file: File): Promise<string> {
  const blob = await compressToTarget(file);
  return blobToDataUrl(blob);
}
