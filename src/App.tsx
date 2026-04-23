import { useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

type PairCategory = "Standard Forex Pairs" | "JPY Pairs" | "Cross Pairs" | "Metals";

const PAIR_OPTIONS: Record<PairCategory, string[]> = {
  "Standard Forex Pairs": ["EUR/USD", "GBP/USD", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD"],
  "JPY Pairs": ["USD/JPY", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CHF/JPY", "CAD/JPY"],
  "Cross Pairs": ["EUR/GBP", "EUR/AUD", "GBP/AUD", "AUD/NZD", "EUR/CAD", "GBP/CAD"],
  "Metals": ["XAU/USD", "XAG/USD", "XPT/USD", "XPD/USD"],
};

const CATEGORY_LABELS: Record<PairCategory, string> = {
  "Standard Forex Pairs": "Standard",
  "JPY Pairs": "JPY",
  "Cross Pairs": "Cross",
  "Metals": "Metals",
};

const CATEGORY_INSTRUCTIONS: Record<PairCategory, { title: string; rules: string[] }> = {
  "Standard Forex Pairs": {
    title: "Standard Forex — Trading Rules",
    rules: [
      "Placeholder: Only trade during London or New York session overlap.",
      "Placeholder: Minimum 1:2 risk-to-reward ratio required.",
      "Placeholder: Avoid entries within 30 min of major news events.",
      "Placeholder: Max 2 concurrent trades on standard pairs.",
    ],
  },
  "JPY Pairs": {
    title: "JPY Pairs — Trading Rules",
    rules: [
      "Placeholder: Account for JPY pip value difference (÷100 vs ÷10000).",
      "Placeholder: Monitor BOJ rate decisions and Tokyo session opens.",
      "Placeholder: Wider spreads expected during low-liquidity periods.",
      "Placeholder: Placeholder rule #4 for JPY pairs — replace me.",
    ],
  },
  "Cross Pairs": {
    title: "Cross Pairs — Trading Rules",
    rules: [
      "Placeholder: Check correlation with major pairs before entering.",
      "Placeholder: Cross pairs typically have lower liquidity — widen SL.",
      "Placeholder: Avoid trading when both base currencies have news.",
      "Placeholder: Placeholder rule #4 for Cross pairs — replace me.",
    ],
  },
  "Metals": {
    title: "Metals — Trading Rules",
    rules: [
      "Placeholder: XAU/USD lot sizes differ — verify contract size.",
      "Placeholder: Metals act as safe-haven; monitor DXY correlation.",
      "Placeholder: Avoid trading metals during thin holiday sessions.",
      "Placeholder: Placeholder rule #4 for Metals — replace me.",
    ],
  },
};

// Icons
const SunIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" strokeWidth="2" />
    <path strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const TrendIcon = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ImageIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const BarIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BackIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function RiskAnalyzer() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState<PairCategory>("Standard Forex Pairs");
  const [pair, setPair] = useState(PAIR_OPTIONS["Standard Forex Pairs"][0]);
  const [risk, setRisk] = useState("");
  const [result, setResult] = useState<null | {
    lotSize: number;
    profit: number;
    rr: string;
    pair: string;
    category: string;
  }>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

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
    setPair(PAIR_OPTIONS[cat][0]);
  };

  const handleAnalyze = () => {
    const riskValue = parseFloat(risk);
    if (!riskValue) return;
    const lotSize = riskValue / 100;
    const profit = riskValue * 2;
    setResult({ lotSize, profit, rr: "1:2", pair, category });
  };

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-dot"><TrendIcon /></div>
          Edger
        </div>
        <button
          id="theme-toggle"
          className="theme-toggle"
          onClick={() => setDark(d => !d)}
          aria-label="Toggle theme"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {/* Main */}
      <main className="main">
        {!result ? (
          <div className="grid-layout">
            {/* LEFT — Chart Upload */}
            <div className="card">
              <div>
                <p className="card-title">Trade Chart</p>
                <p className="card-sub">Upload a screenshot for analysis</p>
              </div>

              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`drop-zone ${dragOver ? "drag-over" : ""} ${image ? "has-image" : ""}`}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded chart"
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8, maxHeight: 200 }}
                  />
                ) : (
                  <>
                    <div className="drop-zone-icon"><ImageIcon /></div>
                    <p className="drop-text">Drop chart here</p>
                    <p className="drop-hint">or click to browse · PNG, JPG, WebP</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFileInput} style={{ display: "none" }} />
              </label>

              {image && (
                <button className="remove-btn" onClick={() => setImage(null)}>Remove</button>
              )}
            </div>

            {/* RIGHT — Setup */}
            <div className="card">
              <div>
                <p className="card-title">Trade Setup</p>
                <p className="card-sub">Configure pair and risk</p>
              </div>

              {/* Category */}
              <div>
                <label className="field-label">Category</label>
                <div className="pill-group">
                  {(Object.keys(PAIR_OPTIONS) as PairCategory[]).map((cat) => (
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
                    {PAIR_OPTIONS[category].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <span className="select-arrow"><ChevronIcon /></span>
                </div>
              </div>

              {/* Risk */}
              <div>
                <label className="field-label">Risk (USD)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    id="risk-input"
                    type="number"
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="spacer" />

              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={!risk}
                className="btn-primary"
              >
                <BarIcon /> Analyze Trade
              </button>

            </div>

            {/* Category Instructions */}
            <div className="instructions-box lg:col-span-2 ">
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
                <p className="card-sub">{result.pair} · {result.category}</p>
              </div>
              {image ? (
                <img src={image} alt="chart" style={{ width: "100%", objectFit: "contain", borderRadius: 8, maxHeight: 220, background: "var(--input-bg)" }} />
              ) : (
                <div className="drop-zone" style={{ minHeight: 160, cursor: "default", borderStyle: "dashed" }}>
                  <p className="drop-hint">No chart uploaded</p>
                </div>
              )}
            </div>

            {/* Right — results */}
            <div className="card">
              <div>
                <p className="card-title">Analysis Result</p>
                <p className="card-sub">Based on your risk parameters</p>
              </div>

              <div className="result-list">
                {[
                  { label: "Instrument", value: result.pair },
                  { label: "Category", value: result.category },
                  { label: "Lot Size", value: result.lotSize.toFixed(2) },
                  { label: "Potential Profit", value: `$${result.profit.toFixed(2)}` },
                  { label: "Risk : Reward", value: result.rr },
                ].map(({ label, value }) => (
                  <div key={label} className="result-row">
                    <span className="result-label">{label}</span>
                    <span className="result-value">{value}</span>
                  </div>
                ))}
              </div>

              <div className="spacer" />

              <button className="btn-secondary" onClick={() => setResult(null)}>
                <BackIcon /> New Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mini Video Player */}
      <div 
        className="fixed bottom-6 left-6 w-48 aspect-video bg-black rounded-lg shadow-lg overflow-hidden cursor-pointer group border border-[var(--border)] z-40 transition-transform hover:scale-105"
        onClick={() => setIsVideoModalOpen(true)}
      >
        <video 
          src="https://www.w3schools.com/html/mov_bbb.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video 
              src="https://www.w3schools.com/html/mov_bbb.mp4" 
              controls 
              autoPlay 
              className="w-full h-auto max-h-[80vh] outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
