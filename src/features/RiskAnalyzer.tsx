import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  type PairCategory,
  type Instrument,
  INSTRUMENTS,
  CATEGORY_LABELS,
  findInstrument,
} from "../constants/trading";
import { EdgerLogo } from "../components/Logo";
import {
  ImageIcon,
  ChevronIcon,
  BarIcon,
  BackIcon,
  SparkleIcon,
  SettingsIcon,
  CloseIcon,
  CopyIcon,
} from "../components/Icons";
import {
  calculateTrade,
  formatRR,
  roundLot,
  type CalcResult,
  type Direction,
} from "../lib/calc";
import { analyzeChart, getStoredApiKey, setStoredApiKey } from "../lib/vision";

// =============================================================================
// Edger Risk Analyzer — light, refined, platform-vibe
// -----------------------------------------------------------------------------
// Same design tokens as the landing:
//   • landing-root background + landing-grain dot pattern
//   • Floating pill-nav at top
//   • White cards with subtle borders and soft shadows
//   • Pastel mint gradient frame around the result hero (matching the landing
//     TradeCard mockup)
//   • Geist sans for prose, Geist Mono with tabular-nums for every number
//   • Section number markers ("Step 01 · Chart") instead of generic titles
// =============================================================================

const DEFAULT_CATEGORY: PairCategory = "Standard Forex Pairs";
const RISK_PRESETS = [25, 50, 100, 250, 500];

export default function RiskAnalyzer() {
  const navigate = useNavigate();

  // === API key + drawer ===
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyDraft, setApiKeyDraft] = useState<string>("");

  // === Configure state ===
  const [image, setImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState<PairCategory>(DEFAULT_CATEGORY);
  const [pair, setPair] = useState(INSTRUMENTS[DEFAULT_CATEGORY][0].symbol);
  const [risk, setRisk] = useState("");
  const [direction, setDirection] = useState<Direction>("long");
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  // === AI status ===
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  // === Result ===
  const [result, setResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    // Force-disable any leftover dark-mode toggle from prior sessions.
    document.documentElement.classList.remove("dark");
    const stored = getStoredApiKey();
    if (stored) {
      setApiKey(stored);
      setApiKeyDraft(stored);
    }
  }, []);

  const instrument = useMemo(
    () => findInstrument(pair) ?? INSTRUMENTS[DEFAULT_CATEGORY][0],
    [pair],
  );

  // === Handlers ===
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
    if (file && file.type.startsWith("image/")) handleImageUpload(file);
  };

  const handleCategoryChange = (cat: PairCategory) => {
    setCategory(cat);
    setPair(INSTRUMENTS[cat][0].symbol);
  };

  const runAi = async () => {
    if (!image) return;
    if (!apiKey) {
      setApiKeyDraft(apiKey);
      setSettingsOpen(true);
      return;
    }
    setAiError(null);
    setAiRationale(null);
    setAiLoading(true);
    try {
      const v = await analyzeChart(image, apiKey);
      if (v.direction) setDirection(v.direction);
      if (v.entry !== null) setEntry(String(v.entry));
      if (v.stopLoss !== null) setStopLoss(String(v.stopLoss));
      if (v.takeProfit !== null) setTakeProfit(String(v.takeProfit));
      if (v.rationale) setAiRationale(v.rationale);

      if (v.detectedSymbol) {
        const cleaned = v.detectedSymbol.toUpperCase().replace(/[^A-Z0-9]/g, "");
        for (const [cat, list] of Object.entries(INSTRUMENTS)) {
          const match = list.find((i) => i.symbol.replace("/", "") === cleaned);
          if (match) {
            setCategory(cat as PairCategory);
            setPair(match.symbol);
            break;
          }
        }
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Couldn't analyze the chart.");
    } finally {
      setAiLoading(false);
    }
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
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canAnalyze =
    !!risk && !!entry && !!stopLoss && !!takeProfit && parseFloat(risk) > 0;

  const saveApiKey = () => {
    setStoredApiKey(apiKeyDraft.trim());
    setApiKey(apiKeyDraft.trim());
    setSettingsOpen(false);
  };

  const handleLogout = () => {
    // "Logout" for Edger == clear the stored Anthropic API key (the only
    // persistent identity we have) and route the user back to the marketing
    // home. No real auth/session.
    setStoredApiKey("");
    setApiKey("");
    setApiKeyDraft("");
    setSettingsOpen(false);
    navigate({ to: "/" });
  };

  const resetAll = () => {
    setResult(null);
    setAiError(null);
    setAiRationale(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copySummary = () => {
    if (!result) return;
    const lines = [
      `Edger — Trade Summary`,
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
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  };

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="landing-root h-[100svh] relative overflow-hidden flex flex-col">
      {/* Background grain */}
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />

      {/* Subtle aurora — softer than the landing's hero */}
      <div
        className="absolute inset-x-0 top-0 h-[520px] pointer-events-none z-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 50% 35% at 30% 20%, rgba(167,243,208,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 45% 30% at 75% 30%, rgba(253,230,138,0.32) 0%, transparent 60%),
            radial-gradient(ellipse 40% 25% at 50% 60%, rgba(233,213,255,0.28) 0%, transparent 60%)
          `,
          filter: "blur(2px)",
        }}
      />

      {/* ── Floating pill nav ── */}
      <div className="absolute top-5 inset-x-0 z-50 px-4 flex justify-center">
        <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
          <Link to="/" className="px-3 py-1.5">
            <EdgerLogo size="md" variant="dark" />
          </Link>

          <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
            Analyzer
          </span>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => {
                setApiKeyDraft(apiKey);
                setSettingsOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              aria-label="Logout"
              title="Clear stored API key and return home"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* ── Main: cards capped at 60vh and vertically centered with breathing room ── */}
      <main className="flex-1 relative z-10 pt-24 md:pt-28 pb-6 px-4 min-h-0 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col">
          {!result ? (
            <ConfigureView
              image={image}
              dragOver={dragOver}
              setDragOver={setDragOver}
              onDrop={handleDrop}
              onFileInput={handleFileInput}
              onRemoveImage={() => setImage(null)}
              category={category}
              onCategoryChange={handleCategoryChange}
              pair={pair}
              setPair={setPair}
              instrument={instrument}
              direction={direction}
              setDirection={setDirection}
              entry={entry}
              setEntry={setEntry}
              stopLoss={stopLoss}
              setStopLoss={setStopLoss}
              takeProfit={takeProfit}
              setTakeProfit={setTakeProfit}
              risk={risk}
              setRisk={setRisk}
              aiLoading={aiLoading}
              aiError={aiError}
              aiRationale={aiRationale}
              hasApiKey={!!apiKey}
              onRunAi={runAi}
              onAnalyze={handleAnalyze}
              canAnalyze={canAnalyze}
            />
          ) : (
            <ResultView
              result={result}
              image={image}
              onReset={resetAll}
              onCopy={copySummary}
            />
          )}
        </div>
      </main>

      {/* ── Settings drawer ── */}
      {settingsOpen && (
        <SettingsDrawer
          apiKeyDraft={apiKeyDraft}
          setApiKeyDraft={setApiKeyDraft}
          onSave={saveApiKey}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

// =============================================================================
// CONFIGURE VIEW
// =============================================================================

interface ConfigureViewProps {
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
  aiLoading: boolean;
  aiError: string | null;
  aiRationale: string | null;
  hasApiKey: boolean;
  onRunAi: () => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

function ConfigureView(p: ConfigureViewProps) {
  return (
    <div className="flex flex-col gap-4 min-h-0">
      {/* Two-column form — capped at 60vh so the page breathes around it */}
      <div className="grid md:grid-cols-2 gap-3 h-[50vh] max-h-[50vh] min-h-0">
        {/* === LEFT: Chart (drop zone fills remaining height) === */}
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
                onClick={p.onRunAi}
                disabled={p.aiLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-100 hover:border-zinc-300 transition-colors disabled:opacity-50"
              >
                {p.aiLoading ? (
                  <>
                    <Spinner /> Reading chart…
                  </>
                ) : (
                  <>
                    <SparkleIcon />
                    {p.hasApiKey ? "Auto-fill from chart" : "Add API key to enable AI"}
                  </>
                )}
              </button>

              {p.aiError && <Alert tone="error">{p.aiError}</Alert>}

              {p.aiRationale && (
                <div className="text-[12px] leading-relaxed text-emerald-900 bg-emerald-50/70 border border-emerald-200/60 rounded-lg px-3 py-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-700 mr-2">
                    AI
                  </span>
                  {p.aiRationale}
                </div>
              )}

              <button
                onClick={p.onRemoveImage}
                className="text-[11px] text-zinc-500 hover:text-zinc-900 self-end transition-colors"
              >
                Remove image
              </button>
            </div>
          )}
        </CompactCard>

        {/* === RIGHT: Setup === */}
        <CompactCard scrollable>
          <CompactCardHeader step="02" kicker="Setup" title="Trade Setup" />

          {/* Category pills */}
          <CompactField label="Category">
            <div className="flex flex-wrap gap-1">
              {(Object.keys(INSTRUMENTS) as PairCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => p.onCategoryChange(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    p.category === cat
                      ? "bg-zinc-900 border-zinc-900 text-white"
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </CompactField>

          {/* Instrument + Direction in a row */}
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
                  onClick={() => p.setDirection("long")}
                  className={`py-1.5 rounded-md text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    p.direction === "long"
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <TriangleUp /> Long
                </button>
                <button
                  onClick={() => p.setDirection("short")}
                  className={`py-1.5 rounded-md text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    p.direction === "short"
                      ? "bg-rose-100 text-rose-700 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <TriangleDown /> Short
                </button>
              </div>
            </CompactField>
          </div>

          {/* Entry / SL / TP in a 3-col row */}
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

          {/* Risk presets + custom */}
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
                        ? "bg-zinc-900 border-zinc-900 text-white"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
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
                  value={
                    RISK_PRESETS.includes(parseFloat(p.risk)) ? "" : p.risk
                  }
                  onChange={(e) => p.setRisk(e.target.value)}
                  placeholder="Custom"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-1.5 py-1.5 pl-5 text-[11px] font-mono tabular-nums font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </CompactField>
        </CompactCard>
      </div>

      {/* Calculate CTA — full width */}
      <button
        onClick={p.onAnalyze}
        disabled={!p.canAnalyze}
        className="w-1/2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
      >
        <BarIcon /> Calculate Lot Size
      </button>
    </div>
  );
}

// Compact card and field variants used inside the analyzer's 100vh layout.
function CompactCard({
  children,
  scrollable,
}: {
  children: ReactNode;
  scrollable?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-zinc-200/70 p-4 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex flex-col gap-3 min-h-0 ${
        scrollable ? "overflow-y-auto" : ""
      }`}
    >
      {children}
    </div>
  );
}

function CompactCardHeader({
  step,
  kicker,
  title,
}: {
  step: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="shrink-0">
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
        {step} · {kicker}
      </span>
      <h2 className="mt-1 text-[15px] font-semibold text-zinc-950 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function CompactField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

// =============================================================================
// RESULT VIEW
// =============================================================================

function ResultView({
  result,
  image,
  onReset,
  onCopy,
}: {
  result: CalcResult;
  image: string | null;
  onReset: () => void;
  onCopy: () => void;
}) {
  const lot = roundLot(result.lotSize);
  const kindLabel =
    result.instrument.kind === "forex_jpy"
      ? "JPY Pair"
      : result.instrument.kind === "forex"
      ? "Forex"
      : result.instrument.kind === "metal"
      ? "Metal"
      : result.instrument.kind === "index"
      ? "Index"
      : "Crypto";

  // Errors-only fallback
  if (!result.ok) {
    return (
      <div className="flex flex-col gap-3 min-h-0">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rose-700 mb-3 block">
            Issues
          </span>
          <ul className="space-y-2">
            {result.errors.map((err, i) => (
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

  return (
    <div className="flex flex-col gap-4 min-h-0">
      {/* Two-column result — capped at 60vh, hero on the left, levels + chart on the right */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-3 h-[60vh] max-h-[60vh] min-h-0">
        {/* === LEFT: Hero lot size in mint frame === */}
        <div className="gradient-frame-mint frame-grain rounded-2xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] min-h-0 flex">
          <div className="bg-white rounded-[14px] p-5 md:p-6 w-full flex flex-col">
            {/* Top: direction + instrument */}
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

            {/* Big lot size — fills available height */}
            <div className="text-center flex-1 flex flex-col justify-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2 font-medium">
                Lot Size
              </div>
              <div className="font-mono text-[clamp(3.5rem,10vw,6rem)] font-medium tabular-nums tracking-[-0.04em] text-zinc-950 leading-none mb-3">
                {lot.toFixed(2)}
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                to risk{" "}
                <span className="font-mono text-zinc-900">
                  ${result.riskUSD.toFixed(2)}
                </span>{" "}
                on a{" "}
                <span className="font-mono text-zinc-900">
                  {result.pipDistanceSL.toFixed(1)}-pip
                </span>{" "}
                stop
              </div>
            </div>

            {/* Three stats inline at the bottom of the hero card */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-100 shrink-0">
              <InlineStat label="Pip" value={`$${result.pipValuePerLotUSD.toFixed(2)}`} />
              <InlineStat
                label="R:R"
                value={formatRR(result.riskRewardRatio)}
                tone={result.riskRewardRatio >= 2 ? "emerald" : "neutral"}
              />
              <InlineStat
                label="Profit"
                value={`+$${result.potentialProfitUSD.toFixed(2)}`}
                tone="emerald"
              />
            </div>
          </div>
        </div>

        {/* === RIGHT: Levels + chart preview + warnings === */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          {/* Levels */}
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

          {/* Warnings (only when present) */}
          {result.warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 shrink-0">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-amber-800 mb-2 block">
                Heads up
              </span>
              <ul className="space-y-1.5">
                {result.warnings.slice(0, 2).map((w, i) => (
                  <li
                    key={i}
                    className="text-[12px] text-amber-900 flex gap-2 leading-relaxed"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-600 shrink-0" />{" "}
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source chart preview if uploaded */}
          {image && (
            <div className="bg-white rounded-2xl border border-zinc-200/70 p-3 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex-1 min-h-[120px] flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 block mb-2 shrink-0">
                Chart
              </span>
              <img
                src={image}
                alt="Source chart"
                className="w-full flex-1 object-contain rounded-lg border border-zinc-100 bg-zinc-50 min-h-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action row */}
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

// =============================================================================
// SETTINGS DRAWER
// =============================================================================

function SettingsDrawer({
  apiKeyDraft,
  setApiKeyDraft,
  onSave,
  onClose,
}: {
  apiKeyDraft: string;
  setApiKeyDraft: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] bg-white border-l border-zinc-200 flex flex-col animate-[drawer-in_0.2s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <span className="text-sm font-semibold text-zinc-900 tracking-tight">
            Settings
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-2">
              Anthropic API Key
            </div>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-sm font-mono text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
            />
            <p className="text-xs text-zinc-500 leading-relaxed mt-3">
              Required for AI auto-fill. Stored locally in your browser only. Get a
              key at{" "}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-800 underline hover:text-zinc-900"
              >
                console.anthropic.com
              </a>
              .
            </p>
            <p className="text-xs text-rose-700 leading-relaxed mt-3 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              ⚠ Dev mode: key sent directly from the browser. For production, route
              through your own backend.
            </p>
          </div>

          <button
            onClick={onSave}
            className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Save
          </button>
        </div>
      </aside>
    </>
  );
}

// =============================================================================
// REUSABLE PIECES
// =============================================================================

function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step="any"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-2 text-[13px] font-mono tabular-nums text-zinc-900 placeholder:text-zinc-400 placeholder:font-mono focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
    />
  );
}

function DropZone({
  image,
  dragOver,
  setDragOver,
  onDrop,
  onFileInput,
}: {
  image: string | null;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center flex-1 min-h-[160px] rounded-2xl cursor-pointer overflow-hidden transition-all duration-200 ${
        dragOver
          ? "gradient-frame-mint border-2 border-emerald-400/60"
          : image
          ? "border border-zinc-200 bg-zinc-50"
          : "border-2 border-dashed border-zinc-200 bg-zinc-50/40 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {image ? (
        <img
          src={image}
          alt="Uploaded chart"
          className="max-h-full max-w-full w-full h-full object-contain"
        />
      ) : (
        <div className="text-center px-6">
          <div className="w-10 h-10 mx-auto rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 mb-3 shadow-sm">
            <ImageIcon />
          </div>
          <p className="text-sm font-medium text-zinc-800">
            Drop your chart here
          </p>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono tracking-tight">
            PNG · JPG · WebP · or click to browse
          </p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onFileInput}
        className="hidden"
      />
    </label>
  );
}

function Alert({ children, tone }: { children: ReactNode; tone: "error" | "warn" }) {
  const styles =
    tone === "error"
      ? "bg-rose-50 border-rose-200 text-rose-900"
      : "bg-amber-50 border-amber-200 text-amber-900";
  return (
    <div className={`text-[13px] leading-relaxed border rounded-xl px-3.5 py-2.5 ${styles}`}>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-r-transparent animate-spin" />
  );
}

function DirectionBadge({ direction }: { direction: Direction }) {
  if (direction === "long") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
        Long
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-rose-700">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 edger-dot-pulse" />
      Short
    </span>
  );
}

// Compact inline stat used inside the result hero card's footer.
function InlineStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "emerald" | "neutral";
}) {
  return (
    <div className="text-center">
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500 mb-1 font-medium">
        {label}
      </div>
      <div
        className={`font-mono text-[13px] md:text-sm font-semibold tabular-nums tracking-[-0.01em] ${
          tone === "emerald" ? "text-emerald-600" : "text-zinc-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ResultLevelRow({
  label,
  value,
  pips,
  tone,
}: {
  label: string;
  value: string;
  pips?: string;
  tone: "profit" | "loss" | "neutral";
}) {
  const styles =
    tone === "profit"
      ? "bg-emerald-50/70 border-emerald-200/70"
      : tone === "loss"
      ? "bg-rose-50/70 border-rose-200/70"
      : "bg-zinc-50 border-zinc-200/70";
  const labelColor =
    tone === "profit"
      ? "text-emerald-700"
      : tone === "loss"
      ? "text-rose-700"
      : "text-zinc-600";

  return (
    <div className={`flex items-center justify-between border ${styles} rounded-lg py-2.5 px-3.5`}>
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.22em] font-semibold ${labelColor}`}
      >
        {label}
      </span>
      <div className="flex items-center gap-3">
        {pips && (
          <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
            {pips}
          </span>
        )}
        <span className="font-mono text-sm text-zinc-900 tabular-nums font-medium">
          {value}
        </span>
      </div>
    </div>
  );
}

// === Triangle direction icons ===
function TriangleUp() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" aria-hidden="true">
      <path d="M5 0 L10 8.66 L0 8.66 Z" />
    </svg>
  );
}

function TriangleDown() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" aria-hidden="true">
      <path d="M5 9 L0 0.34 L10 0.34 Z" />
    </svg>
  );
}
