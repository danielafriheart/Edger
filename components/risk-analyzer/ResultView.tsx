import type { AiChartFeedbackPayload } from '@/types/analyze-risk-api';

import { type CalcResult, formatRR, roundLot } from '../../lib/calc';
import { BackIcon, CopyIcon } from '../ui/Icons';
import { DirectionBadge, InlineStat, ResultLevelRow } from './ResultPieces';
import { ResultAiFeedback } from './ResultAiFeedback';

const KIND_LABELS: Record<CalcResult['instrument']['kind'], string> = {
  forex_jpy: 'JPY Pair',
  forex: 'Forex',
  metal: 'Metal',
  index: 'Index',
  crypto: 'Crypto',
};

export function ResultView({
  result,
  image,
  aiFeedback,
  persistWarning,
  journalDraftSaved,
  onReset,
  onCopy,
}: {
  result: CalcResult;
  image: string | null;
  aiFeedback?: AiChartFeedbackPayload | null;
  persistWarning?: string | null;
  journalDraftSaved?: boolean;
  onReset: () => void;
  onCopy: () => void;
}) {
  if (!result.ok) {
    return <ResultErrors errors={result.errors} onReset={onReset} />;
  }

  const lot = roundLot(result.lotSize);
  const kindLabel = KIND_LABELS[result.instrument.kind];

  return (
    <div className="flex flex-col gap-4 min-h-0">
      {persistWarning ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-950">
          {persistWarning}
        </div>
      ) : null}
      {journalDraftSaved ? (
        <a
          href="/journal"
          className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 border border-emerald-200/70 px-3 py-1 text-[12px] text-emerald-800 font-medium hover:bg-emerald-100 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
          Saved to journal — open to log outcome
          <span aria-hidden>→</span>
        </a>
      ) : null}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-3 h-[60vh] max-h-[60vh] min-h-0">
        <ResultHero result={result} lot={lot} kindLabel={kindLabel} />
        <ResultRightColumn result={result} image={image} aiFeedback={aiFeedback} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          <BackIcon /> New Analysis
        </button>
        <button
          onClick={onCopy}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          <CopyIcon /> Copy summary
        </button>
      </div>
    </div>
  );
}

function ResultErrors({ errors, onReset }: { errors: string[]; onReset: () => void }) {
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rose-700 mb-3 block">
          Issues
        </span>
        <ul className="space-y-2">
          {errors.map((err, i) => (
            <li key={i} className="text-sm text-rose-900 flex gap-2 leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-600 shrink-0" /> {err}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onReset}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
      >
        <BackIcon /> Back to setup
      </button>
    </div>
  );
}

function ResultHero({
  result,
  lot,
  kindLabel,
}: {
  result: CalcResult;
  lot: number;
  kindLabel: string;
}) {
  return (
    <div className="gradient-frame-mint frame-grain rounded-2xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] min-h-0 flex">
      <div className="bg-white rounded-[14px] p-5 md:p-6 w-full flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
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

        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2 font-medium">
            Lot Size
          </div>
          <div className="font-mono text-[clamp(3.5rem,10vw,6rem)] font-medium tabular-nums tracking-[-0.04em] text-zinc-950 leading-none mb-3">
            {lot.toFixed(2)}
          </div>
          <div className="text-[13px] text-zinc-500 leading-relaxed">
            to risk{' '}
            <span className="font-mono text-zinc-900">${result.riskUSD.toFixed(2)}</span>{' '}
            on a{' '}
            <span className="font-mono text-zinc-900">
              {result.pipDistanceSL.toFixed(1)}-pip
            </span>{' '}
            stop
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-100 shrink-0">
          <InlineStat label="Pip" value={`$${result.pipValuePerLotUSD.toFixed(2)}`} />
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
      </div>
    </div>
  );
}

function ResultRightColumn({
  result,
  image,
  aiFeedback,
}: {
  result: CalcResult;
  image: string | null;
  aiFeedback?: AiChartFeedbackPayload | null;
}) {
  return (
    <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
      {aiFeedback ? <ResultAiFeedback feedback={aiFeedback} /> : null}

      <div className="bg-white rounded-2xl border border-zinc-200/70 p-4 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] shrink-0">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 block mb-2.5">
          Levels
        </span>
        <div className="space-y-1">
          <ResultLevelRow
            label="Take Profit"
            value={result.takeProfit.toString()}
            pips={`${result.pipDistanceTP.toFixed(1)} pips`}
            tone="profit"
          />
          <ResultLevelRow label="Entry" value={result.entry.toString()} tone="neutral" />
          <ResultLevelRow
            label="Stop Loss"
            value={result.stopLoss.toString()}
            pips={`${result.pipDistanceSL.toFixed(1)} pips`}
            tone="loss"
          />
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 shrink-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-amber-800 mb-2 block">
            Heads up
          </span>
          <ul className="space-y-1.5">
            {result.warnings.slice(0, 2).map((w, i) => (
              <li key={i} className="text-[12px] text-amber-900 flex gap-2 leading-relaxed">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-600 shrink-0" /> {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {image && (
        <div className="bg-white rounded-2xl border border-zinc-200/70 p-3 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex-1 min-h-[120px] flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 block mb-2 shrink-0">
            Chart
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Source chart"
            className="w-full flex-1 object-contain rounded-lg border border-zinc-100 bg-zinc-50 min-h-0"
          />
        </div>
      )}
    </div>
  );
}
