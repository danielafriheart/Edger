import { CATEGORY_LABELS, INSTRUMENTS, type Instrument, type PairCategory } from '../../constants/trading';
import { RISK_PRESETS } from '../../constants/risk-presets';
import type { Direction } from '../../lib/calc';
import { BarIcon, ChevronIcon } from '../ui/Icons';
import {
  CompactCard,
  CompactCardHeader,
  CompactField,
  PriceInput,
  TriangleDown,
  TriangleUp,
} from './AnalyzerPrimitives';
import { DropZone } from './DropZone';

export interface ConfigureViewProps {
  image: string | null;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  category: PairCategory;
  onCategoryChange: (c: PairCategory) => void;
  pair: string;
  setPair: (p: string) => void;
  instrument: Instrument;
  direction: Direction;
  setDirection: (d: Direction) => void;
  entry: string;
  setEntry: (v: string) => void;
  stopLoss: string;
  setStopLoss: (v: string) => void;
  takeProfit: string;
  setTakeProfit: (v: string) => void;
  risk: string;
  setRisk: (v: string) => void;
  onAnalyze: () => void | Promise<void>;
  canAnalyze: boolean;
  analyzing?: boolean;
  analyzeError?: string | null;
}

export function ConfigureView(p: ConfigureViewProps) {
  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="grid md:grid-cols-2 gap-3 h-[50vh] max-h-[50vh] min-h-0">
        <CompactCard>
          <CompactCardHeader step="01" kicker="Chart" title="Trade Chart" />

          <DropZone
            image={p.image}
            dragOver={p.dragOver}
            setDragOver={p.setDragOver}
            onDrop={p.onDrop}
            onFileInput={p.onFileInput}
          />

          {p.image && (
            <div className="flex flex-col gap-2">
              <button
                onClick={p.onRemoveImage}
                className="text-[11px] text-zinc-500 hover:text-zinc-900 self-end transition-colors"
              >
                Remove image
              </button>
            </div>
          )}
        </CompactCard>

        <CompactCard scrollable>
          <CompactCardHeader step="02" kicker="Setup" title="Trade Setup" />

          <CompactField label="Category">
            <div className="flex flex-wrap gap-1">
              {(Object.keys(INSTRUMENTS) as PairCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => p.onCategoryChange(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    p.category === cat
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </CompactField>

          <div className="grid grid-cols-[1.1fr_1fr] gap-2.5">
            <CompactField label="Instrument">
              <div className="relative">
                <select
                  value={p.pair}
                  onChange={(e) => p.setPair(e.target.value)}
                  className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-2 pr-8 text-[13px] font-mono tabular-nums text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors cursor-pointer"
                >
                  {INSTRUMENTS[p.category].map((i) => (
                    <option key={i.symbol} value={i.symbol}>
                      {i.symbol}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                  <ChevronIcon />
                </span>
              </div>
            </CompactField>

            <CompactField label="Direction">
              <div className="grid grid-cols-2 gap-1 p-0.5 bg-zinc-100/70 border border-zinc-200 rounded-lg">
                <button
                  onClick={() => p.setDirection('long')}
                  className={`py-1.5 rounded-md text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    p.direction === 'long'
                      ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <TriangleUp /> Long
                </button>
                <button
                  onClick={() => p.setDirection('short')}
                  className={`py-1.5 rounded-md text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    p.direction === 'short'
                      ? 'bg-rose-100 text-rose-700 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <TriangleDown /> Short
                </button>
              </div>
            </CompactField>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <CompactField label="Entry">
              <PriceInput
                value={p.entry}
                onChange={p.setEntry}
                placeholder={(1.085).toFixed(p.instrument.decimals)}
              />
            </CompactField>
            <CompactField label="Stop loss">
              <PriceInput value={p.stopLoss} onChange={p.setStopLoss} placeholder="SL" />
            </CompactField>
            <CompactField label="Take profit">
              <PriceInput value={p.takeProfit} onChange={p.setTakeProfit} placeholder="TP" />
            </CompactField>
          </div>

          <CompactField label="Risk (USD)">
            <div className="grid grid-cols-6 gap-1">
              {RISK_PRESETS.map((amt) => {
                const active = p.risk === String(amt);
                return (
                  <button
                    key={amt}
                    onClick={() => p.setRisk(String(amt))}
                    className={`py-1.5 rounded-md font-mono tabular-nums text-[11px] font-semibold border transition-colors ${
                      active
                        ? 'bg-zinc-900 border-zinc-900 text-white'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
              <div className="relative col-span-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[12px] text-zinc-400 pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={RISK_PRESETS.includes(parseFloat(p.risk)) ? '' : p.risk}
                  onChange={(e) => p.setRisk(e.target.value)}
                  placeholder="Custom"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-1.5 py-1.5 pl-5 text-[11px] font-mono tabular-nums font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </CompactField>
        </CompactCard>
      </div>

      {p.analyzeError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-900">
          {p.analyzeError}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void p.onAnalyze()}
        disabled={!p.canAnalyze || p.analyzing}
        className="w-1/2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
      >
        <BarIcon /> {p.analyzing ? 'Calculating…' : 'Calculate Lot Size'}
      </button>
    </div>
  );
}
