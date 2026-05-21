'use client';

import { useCallback, useState } from 'react';

import { applyExtractedChartLevels, type ApplyExtractedChartHandlers } from '@/lib/risk/applyExtractedChartLevels';
import type { ExtractChartResponseBody } from '@/types/chart-extract';

function splitDataUrl(dataUrl: string): { mimeType: string; base64: string } | null {
  const idx = dataUrl.indexOf(';base64,');
  if (!dataUrl.startsWith('data:') || idx === -1) return null;
  const mimeType = dataUrl.slice('data:'.length, idx);
  const base64 = dataUrl.slice(idx + ';base64,'.length);
  if (!mimeType || !base64) return null;
  return { mimeType, base64 };
}

export function useChartLevelExtraction({
  setCategory,
  setPair,
  setDirection,
  setEntry,
  setStopLoss,
  setTakeProfit,
}: ApplyExtractedChartHandlers) {
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractWarnings, setExtractWarnings] = useState<string[]>([]);
  const [extractNotice, setExtractNotice] = useState<string | null>(null);

  const clearExtractStatus = useCallback(() => {
    setExtractError(null);
    setExtractWarnings([]);
    setExtractNotice(null);
  }, []);

  const extractFromDataUrl = useCallback(
    async (dataUrl: string) => {
      const bits = splitDataUrl(dataUrl);
      if (!bits) {
        setExtractError('Invalid chart image.');
        return;
      }

      setExtracting(true);
      setExtractError(null);
      setExtractWarnings([]);
      setExtractNotice(null);

      try {
        console.info('[Edger] extract-chart request');

        const res = await fetch('/api/risk/extract-chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: bits }),
        });

        const data = (await res.json()) as ExtractChartResponseBody & { error?: string };

        // Browser DevTools console (not the Next.js terminal)
        console.info('[Edger] extract-chart response', {
          status: res.status,
          ok: res.ok,
          levels: data.levels,
          skippedReason: data.skippedReason,
          debug: data.debug,
        });

        if (!res.ok) {
          setExtractError(data.error ?? `Could not read chart (${res.status}).`);
          return;
        }

        if (!data.levels) {
          setExtractError(
            data.skippedReason ?? 'No trade levels detected — enter them manually.',
          );
          return;
        }

        const { appliedFields, warnings, resolvedInstrument } = applyExtractedChartLevels(
          data.levels,
          {
            setCategory,
            setPair,
            setDirection,
            setEntry,
            setStopLoss,
            setTakeProfit,
          },
        );
        if (appliedFields.length === 0) {
          setExtractError('No fields could be filled from this chart.');
        }
        if (resolvedInstrument) {
          setExtractNotice(`Instrument set to ${resolvedInstrument}`);
        }
        if (warnings.length > 0) setExtractWarnings(warnings);
      } catch (err) {
        console.error('[Edger] extract-chart failed', err);
        setExtractError('Network error while reading chart levels.');
      } finally {
        setExtracting(false);
      }
    },
    [setCategory, setDirection, setEntry, setPair, setStopLoss, setTakeProfit],
  );

  return {
    extracting,
    extractError,
    extractWarnings,
    extractNotice,
    extractFromDataUrl,
    clearExtractStatus,
  };
}
