import { useEffect, useMemo, useState } from "react";
import { FaMountainSun } from "react-icons/fa6";
import {
  type PairCategory,
  INSTRUMENTS,
  CATEGORY_LABELS,
  CATEGORY_INSTRUCTIONS,
  findInstrument,
} from "../constants/trading";
import {
  SunIcon,
  MoonIcon,
  ImageIcon,
  ChevronIcon,
  BarIcon,
  BackIcon,
  SparkleIcon,
  SettingsIcon,
  CloseIcon,
  CopyIcon,
} from "../components/Icons";
import { calculateTrade, formatRR, roundLot, type CalcResult, type Direction } from "../lib/calc";
import { analyzeChart, getStoredApiKey, setStoredApiKey } from "../lib/vision";

const DEFAULT_CATEGORY: PairCategory = "Standard Forex Pairs";

export default function RiskAnalyzer() {
  const [dark, setDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyDraft, setApiKeyDraft] = useState<string>("");

  // Upload + setup
  const [image, setImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState<PairCategory>(DEFAULT_CATEGORY);
  const [pair, setPair] = useState(INSTRUMENTS[DEFAULT_CATEGORY][0].symbol);
  const [risk, setRisk] = useState("");

  // Trade levels
  const [direction, setDirection] = useState<Direction>("long");
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  // AI status
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  // Result
  const [result, setResult] = useState<CalcResult | null>(null);

  // Boot
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) {
      setApiKey(stored);
      setApiKeyDraft(stored);
    }
  }, []);

  // Helpers
  const instrument = useMemo(() => findInstrument(pair) ?? INSTRUMENTS[DEFAULT_CATEGORY][0], [pair]);

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

      // If we got a symbol back, try to switch the instrument selector to match
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
    const riskValue = parseFloat(risk);
    const entryNum = parseFloat(entry);
    const slNum = parseFloat(stopLoss);
    const tpNum = parseFloat(takeProfit);

    const calc = calculateTrade({
      instrument,
      direction,
      entry: entryNum,
      stopLoss: slNum,
      takeProfit: tpNum,
      riskUSD: riskValue,
    });
    setResult(calc);
  };

  const canAnalyze =
    !!risk && !!entry && !!stopLoss && !!takeProfit && parseFloat(risk) > 0;

  const saveApiKey = () => {
    setStoredApiKey(apiKeyDraft.trim());
    setApiKey(apiKeyDraft.trim());
    setSettingsOpen(false);
  };

  const resetAll = () => {
    setResult(null);
    setAiError(null);
    setAiRationale(null);
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <FaMountainSun />
          Edger
        </div>
        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={() => {
              setApiKeyDraft(apiKey);
              setSettingsOpen(true);
            }}
            aria-label="Settings"
            title="API key & settings"
          >
            <SettingsIcon />
          </button>
          <button
            className="theme-toggle"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {!result ? (
          <div className="grid-layout">
            {/* LEFT — Chart Upload */}
            <div className="card">
              <div>
                <p className="card-title">Trade Chart</p>
                <p className="card-sub">Upload a screenshot with the long/short tool drawn</p>
              </div>

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`drop-zone ${dragOver ? "drag-over" : ""} ${image ? "has-image" : ""}`}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded chart"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 8,
                      maxHeight: 220,
                    }}
                  />
                ) : (
                  <>
                    <div className="drop-zone-icon">
                      <ImageIcon />
                    </div>
                    <p className="drop-text">Drop chart here</p>
                    <p className="drop-hint">or click to browse · PNG, JPG, WebP</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                />
              </label>

              {image && (
                <>
                  <button
                    className="ai-button"
                    onClick={runAi}
                    disabled={aiLoading}
                    title={apiKey ? "Extract trade levels with AI" : "Add API key to enable AI"}
                  >
                    {aiLoading ? (
                      <>
                        <span className="spinner" /> Reading chart…
                      </>
                    ) : (
                      <>
                        <SparkleIcon />
                        {apiKey ? "Auto-fill from chart" : "Add API key to enable AI"}
                      </>
                    )}
                  </button>

                  {aiError && <div className="alert error">{aiError}</div>}
                  {aiRationale && <div className="ai-rationale">{aiRationale}</div>}

                  <button className="remove-btn" onClick={() => setImage(null)}>
                    Remove image
                  </button>
                </>
              )}
            </div>

            {/* RIGHT — Setup */}
            <div className="card">
              <div>
                <p className="card-title">Trade Setup</p>
                <p className="card-sub">Edit anything Edger got wrong, then calculate</p>
              </div>

              {/* Category */}
              <div>
                <label className="field-label">Category</label>
                <div className="pill-group">
                  {(Object.keys(INSTRUMENTS) as PairCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`pill ${category === cat ? "active" : ""}`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pair */}
              <div>
                <label className="field-label">Instrument</label>
                <div className="select-wrapper">
                  <select value={pair} onChange={(e) => setPair(e.target.value)}>
                    {INSTRUMENTS[category].map((i) => (
                      <option key={i.symbol} value={i.symbol}>
                        {i.symbol}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <ChevronIcon />
                  </span>
                </div>
              </div>

              {/* Direction */}
              <div>
                <label className="field-label">Direction</label>
                <div className="direction-toggle">
                  <button
                    className={`direction-btn long ${direction === "long" ? "active" : ""}`}
                    onClick={() => setDirection("long")}
                  >
                    Long ▲
                  </button>
                  <button
                    className={`direction-btn short ${direction === "short" ? "active" : ""}`}
                    onClick={() => setDirection("short")}
                  >
                    Short ▼
                  </button>
                </div>
              </div>

              {/* Levels */}
              <div>
                <label className="field-label">Entry</label>
                <div className="level-input-wrapper">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder={`e.g. ${(1.085).toFixed(instrument.decimals)}`}
                  />
                </div>
              </div>

              <div className="levels-grid">
                <div>
                  <label className="field-label">Stop loss</label>
                  <div className="level-input-wrapper">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      placeholder="SL price"
                    />
                  </div>
                </div>
                <div>
                  <label className="field-label">Take profit</label>
                  <div className="level-input-wrapper">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      placeholder="TP price"
                    />
                  </div>
                </div>
              </div>

              {/* Risk */}
              <div>
                <label className="field-label">Risk (USD)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="spacer" />

              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="btn-primary"
              >
                <BarIcon /> Calculate Lot Size
              </button>
            </div>

            {/* Category Instructions */}
            <div className="instructions-box lg:col-span-2">
              <p className="instructions-heading">{CATEGORY_INSTRUCTIONS[category].title}</p>
              <ul className="instructions-list">
                {CATEGORY_INSTRUCTIONS[category].rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="grid-layout">
            {/* Left — chart */}
            <div className="card">
              <div>
                <p className="card-title">Trade Chart</p>
                <p className="card-sub">
                  {result.instrument.symbol} · {result.direction.toUpperCase()}
                </p>
              </div>
              {image ? (
                <img
                  src={image}
                  alt="chart"
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                    maxHeight: 280,
                    background: "var(--input-bg)",
                  }}
                />
              ) : (
                <div
                  className="drop-zone"
                  style={{ minHeight: 160, cursor: "default", borderStyle: "dashed" }}
                >
                  <p className="drop-hint">No chart uploaded</p>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="alert error">
                  {result.errors.map((err, i) => (
                    <div key={i}>{err}</div>
                  ))}
                </div>
              )}
              {result.ok && result.warnings.length > 0 && (
                <div className="alert warn">
                  {result.warnings.map((w, i) => (
                    <div key={i}>{w}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — results */}
            <div className="card">
              <div>
                <p className="card-title">Lot Size</p>
                <p className="card-sub">Calculated from your risk and SL distance</p>
              </div>

              {result.ok ? (
                <>
                  <div className="lot-hero">
                    <div className="lot-hero-label">Recommended Lot Size</div>
                    <div className="lot-hero-value">{roundLot(result.lotSize).toFixed(2)}</div>
                    <div className="lot-hero-sub">
                      to risk ${result.riskUSD.toFixed(2)} on a {result.pipDistanceSL.toFixed(1)}-pip stop
                    </div>
                  </div>

                  <div className="result-list">
                    {[
                      { label: "Instrument", value: result.instrument.symbol },
                      { label: "Direction", value: result.direction.toUpperCase() },
                      { label: "Entry", value: result.entry.toString() },
                      {
                        label: "Stop Loss",
                        value: `${result.stopLoss}  (${result.pipDistanceSL.toFixed(1)} pips)`,
                      },
                      {
                        label: "Take Profit",
                        value: `${result.takeProfit}  (${result.pipDistanceTP.toFixed(1)} pips)`,
                      },
                      {
                        label: "Pip Value",
                        value: `$${result.pipValuePerLotUSD.toFixed(2)} / lot`,
                      },
                      {
                        label: "Potential Profit",
                        value: `$${result.potentialProfitUSD.toFixed(2)}`,
                      },
                      { label: "Risk : Reward", value: formatRR(result.riskRewardRatio) },
                    ].map(({ label, value }) => (
                      <div key={label} className="result-row">
                        <span className="result-label">{label}</span>
                        <span className="result-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="alert error">
                  Fix the issues above and recalculate.
                </div>
              )}

              <div className="spacer" />

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-secondary" onClick={resetAll}>
                  <BackIcon /> New Analysis
                </button>
                {result.ok && (
                  <button className="btn-secondary" onClick={copySummary}>
                    <CopyIcon /> Copy
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings drawer */}
      {settingsOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setSettingsOpen(false)} />
          <aside className="drawer">
            <div className="drawer-header">
              <span className="drawer-title">Settings</span>
              <button
                className="icon-btn"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="drawer-body">
              <div>
                <div className="drawer-section-label">Anthropic API Key</div>
                <input
                  type="password"
                  className="drawer-input"
                  placeholder="sk-ant-..."
                  value={apiKeyDraft}
                  onChange={(e) => setApiKeyDraft(e.target.value)}
                />
                <p className="drawer-helper">
                  Required for AI auto-fill. Stored locally in your browser only.
                  Get a key at{" "}
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noreferrer"
                  >
                    console.anthropic.com
                  </a>
                  .
                </p>
                <p className="drawer-helper" style={{ marginTop: 10, color: "#dc2626" }}>
                  ⚠ Dev mode: this key is sent directly from the browser. For
                  production, route the call through your own backend so the key
                  isn't exposed.
                </p>
              </div>

              <button className="btn-primary" onClick={saveApiKey}>
                Save
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
