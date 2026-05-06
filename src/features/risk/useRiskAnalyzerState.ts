'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { getStoredApiKey, setStoredApiKey } from '../../lib/vision';
import { useVision } from './useVision';

export function useRiskAnalyzerState() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => getStoredApiKey() ?? '');
  const [apiKeyDraft, setApiKeyDraft] = useState<string>(() => getStoredApiKey() ?? '');

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

  const vision = useVision(
    { setDirection, setEntry, setStopLoss, setTakeProfit, setCategory, setPair },
    () => {
      setApiKeyDraft(apiKey);
      setSettingsOpen(true);
    },
  );

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

  const handleAnalyze = () => {
    const calc = calculateTrade({
      instrument,
      direction,
      entry: parseFloat(entry),
      stopLoss: parseFloat(stopLoss),
      takeProfit: parseFloat(takeProfit),
      riskUSD: parseFloat(risk),
    });
    setResult(calc);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canAnalyze =
    !!risk && !!entry && !!stopLoss && !!takeProfit && parseFloat(risk) > 0;

  const saveApiKey = () => {
    const trimmed = apiKeyDraft.trim();
    setStoredApiKey(trimmed);
    setApiKey(trimmed);
    setSettingsOpen(false);
  };

  const resetAll = () => {
    setResult(null);
    vision.setAiError(null);
    vision.setAiRationale(null);
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
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  const openSettingsWithDraft = () => {
    setApiKeyDraft(apiKey);
    setSettingsOpen(true);
  };

  const clearStoredApiKey = () => {
    setStoredApiKey('');
    setApiKey('');
    setApiKeyDraft('');
  };

  return {
    settingsOpen,
    setSettingsOpen,
    apiKey,
    apiKeyDraft,
    setApiKeyDraft,
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
    instrument,
    vision,
    handleFileInput,
    handleDrop,
    handleCategoryChange,
    handleAnalyze,
    canAnalyze,
    saveApiKey,
    resetAll,
    copySummary,
    openSettingsWithDraft,
    clearStoredApiKey,
  };
}
