'use client';

import { useCallback, useEffect } from 'react';

import {
  getImageFileFromDataTransfer,
  isEditablePasteTarget,
} from '@/lib/risk/chartImageClipboard';

export function useChartPaste({
  onImageFile,
  enabled,
}: {
  onImageFile: (file: File) => void;
  enabled: boolean;
}): void {
  const onPaste = useCallback(
    (e: ClipboardEvent) => {
      if (!enabled) return;
      if (isEditablePasteTarget(e.target)) return;

      const file = getImageFileFromDataTransfer(e.clipboardData);
      if (!file) return;

      e.preventDefault();
      onImageFile(file);
    },
    [enabled, onImageFile],
  );

  useEffect(() => {
    if (!enabled) return;
    const listener = onPaste;
    document.addEventListener('paste', listener);
    return () => document.removeEventListener('paste', listener);
  }, [enabled, onPaste]);
}
