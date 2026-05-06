'use client';

import { useState } from 'react';
import { INSTRUMENTS, type PairCategory } from '../../constants/trading';
import type { Direction } from '../../lib/calc';
import { analyzeChart } from '../../lib/vision';

export type VisionApply = {
  setDirection: (d: Direction) => void;
  setEntry: (v: string) => void;
  setStopLoss: (v: string) => void;
  setTakeProfit: (v: string) => void;
  setCategory: (c: PairCategory) => void;
  setPair: (p: string) => void;
};

/**
 * Wraps the chart→levels Anthropic call with loading / error / rationale state
 * and applies the parsed result to the analyzer's setters.
 */
export function useVision(apply: VisionApply, openSettings: () => void) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  async function runAi(image: string | null, apiKey: string) {
    if (!image) return;
    if (!apiKey) {
      openSettings();
      return;
    }
    setAiError(null);
    setAiRationale(null);
    setAiLoading(true);
    try {
      const v = await analyzeChart(image, apiKey);
      if (v.direction) apply.setDirection(v.direction);
      if (v.entry !== null) apply.setEntry(String(v.entry));
      if (v.stopLoss !== null) apply.setStopLoss(String(v.stopLoss));
      if (v.takeProfit !== null) apply.setTakeProfit(String(v.takeProfit));
      if (v.rationale) setAiRationale(v.rationale);

      if (v.detectedSymbol) {
        const cleaned = v.detectedSymbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
        for (const [cat, list] of Object.entries(INSTRUMENTS)) {
          const match = list.find((i) => i.symbol.replace('/', '') === cleaned);
          if (match) {
            apply.setCategory(cat as PairCategory);
            apply.setPair(match.symbol);
            break;
          }
        }
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Couldn't analyze the chart.");
    } finally {
      setAiLoading(false);
    }
  }

  return { aiLoading, aiError, aiRationale, setAiError, setAiRationale, runAi };
}
