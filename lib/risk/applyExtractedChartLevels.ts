import { findInstrument, type PairCategory } from '@/constants/trading';
import type { Direction } from '@/lib/calc';
import { resolveInstrumentFromExtract } from '@/lib/risk/resolveChartInstrument';
import type { ExtractedChartLevels } from '@/types/chart-extract';

export interface ApplyExtractedChartHandlers {
  setCategory: (c: PairCategory) => void;
  setPair: (p: string) => void;
  setDirection: (d: Direction) => void;
  setEntry: (v: string) => void;
  setStopLoss: (v: string) => void;
  setTakeProfit: (v: string) => void;
}

export interface ApplyExtractedChartResult {
  appliedFields: string[];
  warnings: string[];
  resolvedInstrument: string | null;
}

function formatPrice(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

export function applyExtractedChartLevels(
  levels: ExtractedChartLevels,
  handlers: ApplyExtractedChartHandlers,
): ApplyExtractedChartResult {
  const warnings: string[] = [];
  const appliedFields: string[] = [];

  const resolved = resolveInstrumentFromExtract(levels.instrumentSymbol, levels.pairCategory);
  if (resolved) {
    handlers.setCategory(resolved.category);
    handlers.setPair(resolved.symbol);
    appliedFields.push('instrument');
  } else if (levels.instrumentSymbol) {
    warnings.push(
      `Could not match instrument "${levels.instrumentSymbol}" — pick it from the list.`,
    );
  } else {
    warnings.push('Instrument not detected on chart — select it manually.');
  }

  const instrument = resolved ? findInstrument(resolved.symbol) : null;
  const decimals = instrument?.decimals ?? 5;

  if (levels.direction === 'long' || levels.direction === 'short') {
    handlers.setDirection(levels.direction);
    appliedFields.push('direction');
  }

  const applyPrice = (value: number | null, setter: (v: string) => void, label: string) => {
    if (value == null || !Number.isFinite(value)) return;
    setter(formatPrice(value, decimals));
    appliedFields.push(label);
  };

  applyPrice(levels.entry, handlers.setEntry, 'entry');
  applyPrice(levels.stopLoss, handlers.setStopLoss, 'stop loss');
  applyPrice(levels.takeProfit, handlers.setTakeProfit, 'take profit');

  if (appliedFields.length === 0) {
    warnings.push('No price levels could be applied — enter them manually.');
  } else if (levels.confidence !== 'high') {
    warnings.push('Double-check extracted levels before calculating.');
  }

  return {
    appliedFields,
    warnings,
    resolvedInstrument: resolved?.symbol ?? null,
  };
}

export function hasExtractedPrices(levels: ExtractedChartLevels): boolean {
  return (
    levels.entry != null || levels.stopLoss != null || levels.takeProfit != null
  );
}

export function hasExtractedInstrument(levels: ExtractedChartLevels): boolean {
  return Boolean(levels.instrumentSymbol?.trim());
}
