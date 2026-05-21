import {
  formatChartImageLimitKb,
  MAX_CHART_IMAGE_SOURCE_BYTES,
} from '@/constants/chart-image';

const EDITABLE_SELECTOR =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

/** Skip paste when the user is typing in a form control. */
export function isEditablePasteTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(EDITABLE_SELECTOR));
}

/** Read image/png (TradingView "Copy image") and other image types from the clipboard. */
export function getImageFileFromDataTransfer(
  data: DataTransfer | null,
): File | null {
  if (!data) return null;

  for (const item of data.items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) return file;
    }
  }

  const fromFiles = Array.from(data.files).find((f) => f.type.startsWith('image/'));
  return fromFiles ?? null;
}

export function validateChartImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Clipboard does not contain an image.';
  }
  if (file.size > MAX_CHART_IMAGE_SOURCE_BYTES) {
    return 'Image file is too large — use a smaller screenshot.';
  }
  return null;
}

export function chartImageCompressErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message === 'COMPRESS_TOO_LARGE') {
    return `Could not compress chart below ${formatChartImageLimitKb()} — try a smaller screenshot.`;
  }
  return 'Could not read image — try again.';
}
