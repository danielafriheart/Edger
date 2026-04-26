import { useState } from "react";
import { Link } from "@tanstack/react-router";

// =============================================================================
// Edger Landing — dark editorial direction
// -----------------------------------------------------------------------------
// Design notes:
// - Pure black canvas; restrained type system (Inter sans + Instrument Serif italic accents).
// - The hero sells the product visually with a real-looking TradeCard, not an
//   abstract animation.
// - Each section is a single confident statement with one supporting paragraph.
// - Section dividers are 1px borders at 5% white — almost invisible, just enough
//   rhythm. Generous vertical breathing room.
// =============================================================================

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Edger free?",
    a: "It's free during early access. A paid tier comes later for power features (faster AI, broker presets, history) — early access traders keep generous limits.",
  },
  {
    q: "Do I need an account?",
    a: "No. Open the app and use it. To enable AI chart reading, paste your own Anthropic API key into Settings — it stays in your browser, never on our servers.",
  },
  {
    q: "How accurate is the AI chart reading?",
    a: "Strong on clean screenshots from TradingView, MT4/5, and similar platforms. If a level looks off, every field is editable before you calculate — Edger never blocks you on AI accuracy.",
  },
  {
    q: "What about non-USD account currencies?",
    a: "v1 sizes everything in USD. If your account is in EUR or GBP, multiply the resulting lot size by the FX rate to your account currency. Native multi-currency support is on the roadmap.",
  },
  {
    q: "Why does my broker show a different pip value?",
    a: "Pip values for non-USD-quoted pairs depend on live FX rates. Edger uses sensible approximations — for exact match, your broker is the source of truth. Edger gets you within ~2% in seconds.",
  },
  {
    q: "Where is my data stored?",
    a: "Nowhere we control. Screenshots go from your browser to Anthropic's API for analysis. Your API key sits in localStorage. Nothing is logged on Edger's side.",
  },
];

const INSTRUMENT_GROUPS: [string, string[]][] = [
  ["Standard FX", ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD"]],
  ["JPY Pairs", ["USD/JPY", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CHF/JPY", "CAD/JPY"]],
  ["Cross", ["EUR/GBP", "EUR/AUD", "GBP/AUD", "AUD/NZD", "EUR/CAD", "GBP/CAD"]],
  ["Metals", ["XAU/USD", "XAG/USD"]],
  ["Indices", ["NAS100", "US30", "SPX500", "GER40", "UK100"]],
  ["Crypto", ["BTC/USD", "ETH/USD", "SOL/USD"]],
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      className="landing-root min-h-screen bg-black text-zinc-100 selection:bg-emerald-500/30"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Subtle dotted grain — barely visible, gives the black some texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Hero glow — soft, warm, anchored upper-left */}
      <div
        className="fixed top-0 left-0 w-[60vw] h-[60vh] pointer-events-none z-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(16,185,129,0.08), transparent 60%)",
        }}
      />

      {/* NAV ===================================================================== */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/5">
        <span className="font-medium tracking-tight text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 edger-dot-pulse" />
          Edger
        </span>

        <div className="hidden md:flex items-center gap-8 text-xs text-zinc-500">
          <a href="#how" className="hover:text-zinc-100 transition-colors">
            How it works
          </a>
          <a href="#instruments" className="hover:text-zinc-100 transition-colors">
            Instruments
          </a>
          <a href="#faq" className="hover:text-zinc-100 transition-colors">
            FAQ
          </a>
        </div>

        <Link
          to="/app"
          className="text-xs px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
        >
          Try Edger
        </Link>
      </nav>

      {/* HERO ==================================================================== */}
      <section className="relative min-h-screen flex items-center px-6 md:px-10 pt-32 pb-20 z-10">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-10">
              <span className="w-8 h-px bg-zinc-700" />
              Now in early access
            </div>

            <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[0.95] tracking-tight mb-8">
              The lot size,
              <br />
              <span className="font-display italic text-zinc-300">decided</span>.
            </h1>

            <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-md mb-10">
              Drop a chart. Set your risk. Edger calculates the exact lot size in
              under a second — across forex, metals, indices, and crypto.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/app"
                className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                Try Edger free
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#how"
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                See how it works
              </a>
            </div>

            <p className="mt-8 text-xs text-zinc-600">
              Free during early access · No signup
            </p>
          </div>

          {/* Trade card visual */}
          <div className="relative">
            <TradeCard />
          </div>
        </div>
      </section>

      {/* THREE STATEMENTS ======================================================== */}
      <section className="relative z-10 border-t border-white/5 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 md:gap-10">
          {[
            {
              h: "No spreadsheets.",
              p: "Pip values, contract sizes, JPY quirks, gold's 100-oz contract — Edger handles all of it natively.",
            },
            {
              h: "No brain math.",
              p: "Vision AI reads your chart, extracts the levels, sizes the trade. Five seconds, start to finish.",
            },
            {
              h: "No miscalculation.",
              p: "Direction-aware validation catches reversed stops and sub-1:1 reward ratios before you click buy.",
            },
          ].map(({ h, p }) => (
            <div key={h}>
              <h3 className="text-2xl md:text-3xl font-light mb-3 tracking-tight">
                {h}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-light max-w-xs">
                {p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS ============================================================ */}
      <section
        id="how"
        className="relative z-10 border-t border-white/5 px-6 md:px-10 py-24 md:py-32"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-6">
            How it works
          </p>
          <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-light tracking-tight leading-[0.95] mb-20">
            Three steps,
            <br />
            <span className="font-display italic text-zinc-300">no friction</span>.
          </h2>

          <ol className="space-y-0">
            {[
              {
                n: "01",
                h: "Drop the chart",
                p: "Screenshot your chart with the long or short tool drawn — the colored zones tell Edger entry, stop, and target.",
              },
              {
                n: "02",
                h: "Set your risk",
                p: "Type the dollar amount you're willing to lose. That's it — no balance, no percentages, no math.",
              },
              {
                n: "03",
                h: "Place the trade",
                p: "Get exact lot size, pip value, profit at target, and R:R. Copy the summary into your trade journal in one click.",
              },
            ].map(({ n, h, p }) => (
              <li
                key={n}
                className="grid grid-cols-[60px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-12 items-baseline border-t border-white/5 py-10 first:border-t-0"
              >
                <span className="font-mono text-zinc-600 text-sm tabular-nums">{n}</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-light mb-3 tracking-tight">
                    {h}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed font-light max-w-xl text-sm md:text-base">
                    {p}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INSTRUMENTS ============================================================= */}
      <section
        id="instruments"
        className="relative z-10 border-t border-white/5 px-6 md:px-10 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-6">
            What it sizes
          </p>
          <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-light tracking-tight leading-[0.95] mb-16">
            Whatever
            <br />
            <span className="font-display italic text-zinc-300">you trade</span>.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.04] rounded-2xl overflow-hidden">
            {INSTRUMENT_GROUPS.map(([cat, items]) => (
              <div
                key={cat}
                className="bg-black hover:bg-white/[0.015] transition-colors p-7 md:p-8"
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 mb-5">
                  {cat}
                </p>
                <ul className="space-y-2 text-sm font-mono text-zinc-300 tabular-nums">
                  {items.map((i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ===================================================================== */}
      <section
        id="faq"
        className="relative z-10 border-t border-white/5 px-6 md:px-10 py-24 md:py-32"
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-6">
            Questions
          </p>
          <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-light tracking-tight leading-[0.95] mb-16">
            Things people
            <br />
            <span className="font-display italic text-zinc-300">ask</span>.
          </h2>

          <div className="divide-y divide-white/5 border-y border-white/5">
            {FAQS.map((f, i) => (
              <button
                key={f.q}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left py-7 group focus:outline-none"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-base md:text-lg font-light tracking-tight group-hover:text-emerald-400 transition-colors">
                    {f.q}
                  </span>
                  <span
                    className={`mt-1 text-zinc-500 text-lg leading-none transition-transform duration-200 ${
                      openFaq === i ? "rotate-45 text-emerald-400" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </div>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="mt-4 text-zinc-400 leading-relaxed font-light text-sm md:text-base max-w-xl">
                      {f.a}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA =============================================================== */}
      <section className="relative z-10 border-t border-white/5 px-6 md:px-10 py-32 md:py-48">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.95] tracking-tight mb-12">
            Stop guessing
            <br />
            <span className="font-display italic text-zinc-300">your size</span>.
          </h2>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            Open Edger
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER ================================================================== */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-3 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
            <span className="text-zinc-300 font-medium">Edger</span>
            <span className="text-zinc-700">·</span>
            <span>Analytical tool, not financial advice.</span>
          </div>
          <div>© {new Date().getFullYear()} Edger</div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// TradeCard — the hero centerpiece
// -----------------------------------------------------------------------------
// Renders a static but realistic-looking trade analysis card so the value
// proposition is immediately visible. Numbers are calibrated to be internally
// consistent (EUR/USD, $100 risk, 15-pip SL, 30-pip TP → 0.66 lots, $200 profit).
// =============================================================================

function TradeCard() {
  return (
    <div className="relative">
      {/* Soft outer glow */}
      <div
        className="absolute -inset-8 blur-3xl opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(16,185,129,0.18), transparent 55%), radial-gradient(ellipse at bottom, rgba(244,63,94,0.10), transparent 55%)",
        }}
      />

      <div className="relative bg-zinc-950/90 border border-white/[0.07] rounded-2xl p-6 md:p-7 backdrop-blur-md shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-zinc-100 tracking-wide">
              EUR/USD
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
              Standard FX
            </span>
          </div>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400/60 edger-dot-pulse" />
            Long
          </span>
        </div>

        {/* Levels */}
        <div className="space-y-1.5 mb-6">
          <LevelRow label="Take Profit" value="1.08750" tone="profit" />
          <LevelRow label="Entry" value="1.08450" tone="neutral" />
          <LevelRow label="Stop Loss" value="1.08300" tone="loss" />
        </div>

        {/* Risk */}
        <div className="flex items-center justify-between text-xs pb-6 mb-6 border-b border-white/5">
          <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px]">
            Risk
          </span>
          <span className="font-mono text-zinc-200 tabular-nums">$100.00</span>
        </div>

        {/* Result */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">
            Lot Size
          </div>
          <div className="flex items-end justify-between mb-5">
            <span className="text-5xl md:text-6xl font-light tracking-tight tabular-nums leading-none">
              0.66
            </span>
            <div className="text-right pb-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
                Profit at TP
              </div>
              <div className="text-sm font-mono text-emerald-400 tabular-nums">
                +$200.00
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-zinc-600 pt-4 border-t border-white/5">
            <span>
              R:R <span className="text-zinc-300 font-mono ml-1">1:2</span>
            </span>
            <span className="ml-auto">
              Pip Value{" "}
              <span className="text-zinc-300 font-mono normal-case ml-1">
                $10/lot
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "profit" | "loss" | "neutral";
}) {
  const styles =
    tone === "profit"
      ? "bg-emerald-500/[0.06] border-emerald-500/20"
      : tone === "loss"
      ? "bg-rose-500/[0.06] border-rose-500/20"
      : "bg-zinc-900/40 border-white/5";

  const labelColor =
    tone === "profit"
      ? "text-emerald-400/80"
      : tone === "loss"
      ? "text-rose-400/80"
      : "text-zinc-500";

  return (
    <div
      className={`flex items-center justify-between border ${styles} rounded-md py-2.5 px-3.5`}
    >
      <span
        className={`text-[10px] uppercase tracking-[0.2em] ${labelColor}`}
      >
        {label}
      </span>
      <span className="font-mono text-sm text-zinc-100 tabular-nums">
        {value}
      </span>
    </div>
  );
}
