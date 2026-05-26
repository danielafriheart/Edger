'use client';

import { useEffect } from 'react';
import type { AiChartFeedbackPayload } from '@/types/analyze-risk-api';

import { type CalcResult, formatRR, roundLot } from '../../lib/calc';
import { BackIcon, CloseIcon, CopyIcon } from '../ui/Icons';
import { DirectionBadge, InlineStat, ResultLevelRow } from './ResultPieces';
import { ResultAiFeedback } from './ResultAiFeedback';

// =============================================================================
// ResultModal
// -----------------------------------------------------------------------------
// Replaces the full-page ResultView. Pops open over the configure view when
// the user clicks Calculate. Handles three visual states:
//   1. Success → mint-frame lot-size hero, stats, levels, AI feedback
//   2. Errors  → rose-tinted issues list with a single "Got it" close
//   3. Warning (persist) → amber callout above the success content
//
// ESC and backdrop click close the modal via `onClose`.
// =============================================================================

const KIND_LABELS: Record<CalcResult['instrument']['kind'], string> = {
  forex_jpy: 'JPY Pair',
  forex: 'Forex',
  metal: 'Metal',
  index: 'Index',
  crypto: 'Crypto',
};

export interface ResultModalProps {
  open: boolean;
  result: CalcResult | null;
  image: string | null;
  aiFeedback?: AiChartFeedbackPayload | null;
  persistWarning?: string | null;
  onClose: () => void;
  onCopy: () => void;
}

export function ResultModal({
  open,
  result,
  image,
  aiFeedback,
  persistWarning,
  onClose,
  onCopy,
}: ResultModalProps) {
  // Lock body scroll + ESC-to-close while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !result) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-[modal-fade_0.18s_ease-out]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden animate-[modal-pop_0.22s_cubic-bezier(0.2,0.7,0.2,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {result.ok ? (
          <SuccessContent
            result={result}
            image={image}
            aiFeedback={aiFeedback}
            persistWarning={persistWarning}
            onClose={onClose}
            onCopy={onCopy}
          />
        ) : (
          <ErrorContent errors={result.errors} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Success state — mint-frame lot-size hero + breakdown
// =============================================================================

function SuccessContent({
  result,
  image,
  aiFeedback,
  persistWarning,
  onClose,
  onCopy,
}: {
  result: CalcResult;
  image: string | null;
  aiFeedback?: AiChartFeedbackPayload | null;
  persistWarning?: string | null;
  onClose: () => void;
  onCopy: () => void;
}) {
  const lot = roundLot(result.lotSize);
  const kindLabel = KIND_LABELS[result.instrument.kind];

  return (
    <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]">
      <div className="bg-white rounded-[22px] max-h-[calc(90vh-12px)] overflow-y-auto">
        {/* Close button — floats top-right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-sm"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="p-6 md:p-8">
          {persistWarning ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-950 mb-4">
              {persistWarning}
            </div>
          ) : null}

          {/* Top row — direction + symbol */}
          <div className="flex items-center justify-between mb-6">
            <DirectionBadge direction={result.direction} />
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                {result.instrument.symbol}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-400 hidden sm:inline">
                {kindLabel}
              </span>
            </div>
          </div>

          {/* Lot size hero */}
          <div className="text-center mb-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2 font-medium">
              Recommended lot size
            </div>
            <div className="font-mono text-[clamp(4rem,12vw,7rem)] font-medium tabular-nums tracking-[-0.04em] text-zinc-950 leading-none mb-3">
              {lot.toFixed(2)}
            </div>
            <div className="text-[13px] text-zinc-500 leading-relaxed">
              to risk{' '}
              <span className="font-mono text-zinc-900">
                ${result.riskUSD.toFixed(2)}
              </span>{' '}
              on a{' '}
              <span className="font-mono text-zinc-900">
                {result.pipDistanceSL.toFixed(1)}-pip
              </span>{' '}
              stop
            </div>
          </div>

          {/* Three stats */}
          <div className="grid grid-cols-3 gap-2 pt-5 pb-6 border-t border-zinc-100 mb-6">
            <InlineStat
              label="Pip"
              value={`$${result.pipValuePerLotUSD.toFixed(2)}`}
            />
            <InlineStat
              label="R:R"
              value={formatRR(result.riskRewardRatio)}
              tone={result.riskRewardRatio >= 2 ? 'emerald' : 'neutral'}
            />
            <InlineStat
              label="Profit"
              value={`+$${result.potentialProfitUSD.toFixed(2)}`}
              tone="emerald"
            />
          </div>

          {/* Levels card */}
          <div className="mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 block mb-3 font-medium">
              Levels
            </span>
            <div className="space-y-1.5">
              <ResultLevelRow
                label="Take Profit"
                value={result.takeProfit.toString()}
                pips={`${result.pipDistanceTP.toFixed(1)} pips`}
                tone="profit"
              />
              <ResultLevelRow
                label="Entry"
                value={result.entry.toString()}
                tone="neutral"
              />
              <ResultLevelRow
                label="Stop Loss"
                value={result.stopLoss.toString()}
                pips={`${result.pipDistanceSL.toFixed(1)} pips`}
                tone="loss"
              />
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-amber-800 mb-2 block font-medium">
                Heads up
              </span>
              <ul className="space-y-1.5">
                {result.warnings.slice(0, 3).map((w, i) => (
                  <li
                    key={i}
                    className="text-[12px] text-amber-900 flex gap-2 leading-relaxed"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-600 shrink-0" />{' '}
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI feedback */}
          {aiFeedback ? (
            <div className="mb-4">
              <ResultAiFeedback feedback={aiFeedback} />
            </div>
          ) : null}

          {/* Chart preview */}
          {image && (
            <div className="bg-zinc-50/60 rounded-xl border border-zinc-100 p-2 mb-6">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 block mb-2 px-1 font-medium">
                Source chart
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Source chart"
                className="w-full max-h-[200px] object-contain rounded-lg bg-white"
              />
            </div>
          )}

          {/* Action row */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              <BackIcon /> New analysis
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
            >
              <CopyIcon /> Copy summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Error state — rose-tinted issue list with a single "Got it" close
// =============================================================================

function ErrorContent({
  errors,
  onClose,
}: {
  errors: string[];
  onClose: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] overflow-hidden border border-zinc-200/70 relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-sm"
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </span>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rose-700 font-medium block">
              Can&apos;t size yet
            </span>
            <h2 className="text-lg md:text-xl font-semibold text-zinc-950 tracking-tight mt-0.5">
              Fix these issues.
            </h2>
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          {errors.map((err, i) => (
            <li
              key={i}
              className="bg-rose-50 border border-rose-200/70 rounded-xl px-3.5 py-2.5 text-[13px] text-rose-900 flex gap-2 leading-relaxed"
            >
              <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-600 shrink-0" />
              <span>{err}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          Got it — let me fix
        </button>
      </div>
    </div>
  );
}
