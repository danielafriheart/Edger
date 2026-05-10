'use client';

import { useEffect, useMemo, useState } from 'react';

import type { AnalyzeRiskResponseBody } from '@/types/analyze-risk-api';

import { DEFAULT_CATEGORY } from '../../constants/risk-presets';
import {
  CATEGORY_LABELS,
  INSTRUMENTS,
  findInstrument,
  type PairCategory,
} from '../../constants/trading';
import {
  calculateTrade,
  formatRR,
  roundLot,
  type CalcResult,
  type Direction,
} from '../../lib/calc';

function splitDataUrl(dataUrl: string): { mimeType: string; base64: string } | null {
  const idx = dataUrl.indexOf(';base64,');
  if (!dataUrl.startsWith('data:') || idx === -1) return null;
  const mimeType = dataUrl.slice('data:'.length, idx);
  const base64 = dataUrl.slice(idx + ';base64,'.length);
  if (!mimeType || !base64) return null;
  return { mimeType, base64 };
}

export function useRiskAnalyzerState() {
  const [image, setImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState<PairCategory>(DEFAULT_CATEGORY);
  const [pair, setPair] = useState(INSTRUMENTS[DEFAULT_CATEGORY][0].symbol);
  const [risk, setRisk] = useState('');
  const [direction, setDirection] = useState<Direction>('long');
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const [result, setResult] = useState<CalcResult | null>(null);
  const [aiFeedback, setAiFeedback] =
    useState<AnalyzeRiskResponseBody['aiFeedback']>(null);
  const [persistWarning, setPersistWarning] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const instrument = useMemo(
    () => findInstrument(pair) ?? INSTRUMENTS[DEFAULT_CATEGORY][0],
    [pair],
  );

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleImageUpload(file);
  };

  const handleCategoryChange = (cat: PairCategory) => {
    setCategory(cat);
    setPair(INSTRUMENTS[cat][0].symbol);
  };

  const handleAnalyze = async () => {
    setAnalyzeError(null);
    setPersistWarning(null);
    setAnalyzing(true);
    try {
      const snapshot = calculateTrade({
        instrument,
        direction,
        entry: parseFloat(entry),
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit),
        riskUSD: parseFloat(risk),
      });

      const payload: Record<string, unknown> = {
        pairCategory: category,
        instrumentSymbol: pair,
        direction,
        entry: snapshot.entry,
        stopLoss: snapshot.stopLoss,
        takeProfit: snapshot.takeProfit,
        riskUSD: snapshot.riskUSD,
      };

      if (image?.startsWith('data:')) {
        const bits = splitDataUrl(image);
        if (bits) payload.image = { mimeType: bits.mimeType, base64: bits.base64 };
      }

      const res = await fetch('/api/risk/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as AnalyzeRiskResponseBody & { error?: string };

      if (!res.ok) {
        setAnalyzeError(data.error ?? `Request failed (${res.status})`);
        return;
      }

      setResult(data.result);
      setAiFeedback(data.aiFeedback ?? null);
      setPersistWarning(data.persistWarning ?? null);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setAnalyzeError('Network error — try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const canAnalyze =
    !!risk && !!entry && !!stopLoss && !!takeProfit && parseFloat(risk) > 0;

  const resetAll = () => {
    setResult(null);
    setAiFeedback(null);
    setPersistWarning(null);
    setAnalyzeError(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copySummary = () => {
    if (!result || !result.ok) return;
    const lines = [
      'Edger — Trade Summary',
      `Instrument: ${result.instrument.symbol} (${CATEGORY_LABELS[category]})`,
      `Direction: ${result.direction.toUpperCase()}`,
      `Entry: ${result.entry}`,
      `Stop Loss: ${result.stopLoss}  (${result.pipDistanceSL.toFixed(1)} pips)`,
      `Take Profit: ${result.takeProfit}  (${result.pipDistanceTP.toFixed(1)} pips)`,
      `Risk: $${result.riskUSD.toFixed(2)}`,
      `Lot Size: ${roundLot(result.lotSize).toFixed(2)}`,
      `Pip Value: $${result.pipValuePerLotUSD.toFixed(2)} / lot`,
      `Potential Profit: $${result.potentialProfitUSD.toFixed(2)}`,
      `R:R: ${formatRR(result.riskRewardRatio)}`,
    ];

    if (aiFeedback?.chartSummary) {
      lines.push('', 'Chart notes:', aiFeedback.chartSummary);
      if (aiFeedback.structureNotes.length) {
        for (const n of aiFeedback.structureNotes) lines.push(`- ${n}`);
      }
    }

    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  return {
    image,
    setImage,
    dragOver,
    setDragOver,
    category,
    pair,
    setPair,
    risk,
    setRisk,
    direction,
    setDirection,
    entry,
    setEntry,
    stopLoss,
    setStopLoss,
    takeProfit,
    setTakeProfit,
    result,
    aiFeedback,
    persistWarning,
    analyzing,
    analyzeError,
    instrument,
    handleFileInput,
    handleDrop,
    handleCategoryChange,
    handleAnalyze,
    canAnalyze,
    resetAll,
    copySummary,
  };
}
