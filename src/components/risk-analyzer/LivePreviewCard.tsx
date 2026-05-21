'use client';

import { useMemo } from 'react';
import type { Instrument } from '../../constants/trading';
import {
  calculateTrade,
  formatRR,
  roundLot,
  type Direction,
} from '../../lib/calc';
import { DirectionBadge, InlineStat } from './ResultPieces';

// =============================================================================
// LivePreviewCard
// -----------------------------------------------------------------------------
// Renders the brand TradeCard mockup, but driven by live form state. Replaces
// the giant drop-zone-on-the-left layout. As the user fills entry / SL / TP /
// risk, the lot size populates in real time. Empty fields render as em-dashes,
// no jarring errors — it's a preview, not a verdict.
// =============================================================================

const KIND_LABELS: Record<Instrument['kind'], string> = {
  forex_jpy: 'JPY Pair',
  forex: 'Forex',
  metal: 'Metal',
  index: 'Index',
  crypto: 'Crypto',
};

export interface LivePreviewCardProps {
  instrument: Instrument;
  direction: Direction;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  risk: string;
}

export function LivePreviewCard({
  instrument,
  direction,
  entry,
  stopLoss,
  takeProfit,
  risk,
}: LivePreviewCardProps) {
  const liveResult = useMemo(() => {
    const e = parseFloat(entry);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const r = parseFloat(risk);
    if (!isFinite(e) || !isFinite(sl) || !isFinite(tp) || !isFinite(r) || r <= 0) {
      return null;
    }
    try {
      return calculateTrade({
        instrument,
        direction,
        entry: e,
        stopLoss: sl,
        takeProfit: tp,
        riskUSD: r,
      });
    } catch {
      return null;
    }
  }, [instrument, direction, entry, stopLoss, takeProfit, risk]);

  const hasValidResult = !!liveResult && liveResult.ok;

  return (
    <div className="gradient-frame-mint frame-grain rounded-2xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] min-h-0 flex">
      <div className="bg-white rounded-[14px] p-5 md:p-6 w-full flex flex-col">
        {/* Header: live indicator + direction badge */}
        <div className="flex items-center justify-between mb-5 shrink-0">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
            Live preview
          </span>
          <DirectionBadge direction={direction} />
        </div>

        {/* Instrument identity */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 shrink-0">
          <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
            {instrument.symbol}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-400">
            {KIND_LABELS[instrument.kind]}
          </span>
        </div>

        {/* Level rows */}
        <div className="space-y-1.5 mb-4 shrink-0">
          <PreviewLevelRow
            label="Take Profit"
            value={takeProfit}
            pips={
              hasValidResult ? `${liveResult.pipDistanceTP.toFixed(1)} pips` : null
            }
            tone="profit"
          />
          <PreviewLevelRow label="Entry" value={entry} pips={null} tone="neutral" />
          <PreviewLevelRow
            label="Stop Loss"
            value={stopLoss}
            pips={
              hasValidResult ? `${liveResult.pipDistanceSL.toFixed(1)} pips` : null
            }
            tone="loss"
          />
        </div>

        {/* Risk */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
            Risk
          </span>
          <span
            className={`font-mono text-sm tabular-nums ${
              risk ? 'text-zinc-900' : 'text-zinc-300'
            }`}
          >
            {risk ? `$${parseFloat(risk).toFixed(2)}` : '—'}
          </span>
        </div>

        {/* Lot size hero */}
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2 font-medium">
            Lot Size
          </div>
          {hasValidResult ? (
            <>
              <div className="font-mono text-[clamp(2.75rem,7vw,4.25rem)] font-medium tabular-nums tracking-[-0.04em] text-zinc-950 leading-none mb-2">
                {roundLot(liveResult.lotSize).toFixed(2)}
              </div>
              <div className="text-[12px] text-zinc-500 leading-relaxed">
                Click <span className="font-medium text-zinc-700">Calculate</span> for
                full result
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-[clamp(2.75rem,7vw,4.25rem)] font-medium tabular-nums tracking-[-0.04em] text-zinc-200 leading-none mb-2">
                —
              </div>
              <div className="text-[12px] text-zinc-400 leading-relaxed">
                Fill the levels and risk to size the trade
              </div>
            </>
          )}
        </div>

        {/* Stats footer (only when fully calculable) */}
        {hasValidResult && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-100 shrink-0">
            <InlineStat
              label="Pip"
              value={`$${liveResult.pipValuePerLotUSD.toFixed(2)}`}
            />
            <InlineStat
              label="R:R"
              value={formatRR(liveResult.riskRewardRatio)}
              tone={liveResult.riskRewardRatio >= 2 ? 'emerald' : 'neutral'}
            />
            <InlineStat
              label="Profit"
              value={`+$${liveResult.potentialProfitUSD.toFixed(2)}`}
              tone="emerald"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// PreviewLevelRow — like ResultLevelRow but renders em-dash when empty
// =============================================================================

function PreviewLevelRow({
  label,
  value,
  pips,
  tone,
}: {
  label: string;
  value: string;
  pips: string | null;
  tone: 'profit' | 'loss' | 'neutral';
}) {
  const filled = !!value;
  const styles = filled
    ? tone === 'profit'
      ? 'bg-emerald-50/70 border-emerald-200/70'
      : tone === 'loss'
        ? 'bg-rose-50/70 border-rose-200/70'
        : 'bg-zinc-50 border-zinc-200/70'
    : 'bg-zinc-50/40 border-zinc-100';

  const labelColor = filled
    ? tone === 'profit'
      ? 'text-emerald-700'
      : tone === 'loss'
        ? 'text-rose-700'
        : 'text-zinc-600'
    : 'text-zinc-400';

  return (
    <div
      className={`flex items-center justify-between border rounded-lg py-2.5 px-3.5 transition-colors ${styles}`}
    >
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.22em] font-semibold ${labelColor}`}
      >
        {label}
      </span>
      <div className="flex items-center gap-3">
        {pips && (
          <span className="font-mono text-[11px] text-zinc-500 tabular-nums">{pips}</span>
        )}
        <span
          className={`font-mono text-sm tabular-nums font-medium ${
            filled ? 'text-zinc-900' : 'text-zinc-300'
          }`}
        >
          {filled ? value : '—'}
        </span>
      </div>
    </div>
  );
}
