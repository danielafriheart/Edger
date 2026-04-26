import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { EdgerLogo, EdgerMark } from "../components/Logo";

// =============================================================================
// Edger Landing — refined consio-inspired light direction
// -----------------------------------------------------------------------------
// Design rules
//   1. ONE typeface family across the whole platform: Geist (sans) + Geist Mono
//      (numbers). Mono is reserved for prices, lot sizes, pip values, tickers.
//   2. Minimal motion: only the marquee ticker, the pulsing "Long" dot, and
//      subtle hover-lifts on cards. No scroll animations, no fade-ins.
//   3. Visual rhythm: section number markers ("01", "02", "03") instead of
//      pill badges on product sections; pastel-gradient mockup frames; ghost
//      labels behind some sections for editorial weight.
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

// Tickers used in the marquee. Each row gets duplicated for a seamless loop.
const TICKER_ITEMS: { sym: string; pip: string }[] = [
  { sym: "EUR/USD", pip: "$10.00" },
  { sym: "GBP/USD", pip: "$10.00" },
  { sym: "USD/JPY", pip: "$6.70" },
  { sym: "XAU/USD", pip: "$1.00" },
  { sym: "NAS100", pip: "$1.00" },
  { sym: "US30", pip: "$1.00" },
  { sym: "BTC/USD", pip: "$1.00" },
  { sym: "ETH/USD", pip: "$0.10" },
  { sym: "AUD/USD", pip: "$10.00" },
  { sym: "EUR/GBP", pip: "$13.20" },
  { sym: "SPX500", pip: "$1.00" },
  { sym: "XAG/USD", pip: "$5.00" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="landing-root min-h-screen relative overflow-x-hidden">
      {/* Background grain (very faint dot pattern) */}
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-50 z-0" />

      {/* ── Floating pill nav ── */}
      <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center">
        <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-3xl w-full">
          <Link to="/" className="px-3 py-1.5">
            <EdgerLogo size="md" variant="dark" />
          </Link>

          <div className="hidden md:flex items-center gap-1 mx-auto">
            <NavLink href="#how">How it works</NavLink>
            <NavLink href="#instruments">Instruments</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/app"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              Try Edger
            </Link>
          </div>
        </nav>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 md:pt-44 md:pb-24 px-6 z-10">
        {/* Soft pastel aurora behind the hero */}
        <div className="landing-aurora absolute inset-x-0 top-0 h-[700px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <Pill className="mb-7 mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
            Now in early access
          </Pill>

          <h1 className="text-[clamp(2.75rem,7.5vw,5.25rem)] font-bold leading-[0.98] tracking-[-0.04em] text-zinc-950 mb-7">
            The lot size,
            <br />
            sized for you.
          </h1>

          <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed max-w-xl mx-auto mb-10">
            Drop a chart. Set your risk. Edger calculates the exact lot size in
            under a second — across forex, metals, indices, and crypto.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
            >
              Try Edger free
              <span aria-hidden>→</span>
            </Link>
            <a
              href="#how"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              See how it works
            </a>
          </div>

          <p className="text-xs text-zinc-500 font-mono tracking-tight">
            Free during early access · No signup needed
          </p>
        </div>
      </section>

      {/* ── THREE FEATURE CARDS ──────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-px bg-zinc-200/70 border border-zinc-200/70 rounded-2xl overflow-hidden">
          {[
            {
              icon: <SpreadsheetIcon />,
              h: "No spreadsheets",
              p: "Pip values, contract sizes, JPY quirks, gold's 100-oz contract — Edger handles all of it.",
            },
            {
              icon: <SparkIcon />,
              h: "No brain math",
              p: "Vision AI reads your chart, extracts the levels, sizes the trade. Five seconds, start to finish.",
            },
            {
              icon: <ShieldIcon />,
              h: "No miscalculation",
              p: "Direction-aware validation catches reversed stops and sub-1:1 ratios before you click buy.",
            },
          ].map((f) => (
            <div
              key={f.h}
              className="bg-white p-8 md:p-10 flex flex-col items-center text-center"
            >
              <div className="mb-5 w-11 h-11 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-700">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-zinc-950 mb-2">
                {f.h}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed max-w-xs">
                {f.p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 1 — AI CHART VISION ──────────────────────────────────── */}
      <ProductSection
        sectionNum="01"
        kicker="AI Chart Vision"
        ghost="vision"
        headline={<>Read entries, stops,<br />and targets straight from a screenshot.</>}
        bullets={[
          "Drop a chart with the long or short tool drawn — Edger reads the colored zones.",
          "Vision AI extracts entry, stop loss, and take profit automatically.",
          "Every field is editable if the AI gets it wrong — Edger never blocks you.",
        ]}
        ctaLabel="Try the AI"
        mockup={<TradeCard />}
        frame="mint"
      />

      {/* ── SECTION 2 — UNIVERSAL SIZING ─────────────────────────────────── */}
      <ProductSection
        reverse
        sectionNum="02"
        kicker="Universal Sizing"
        ghost="every market"
        headline={<>Sized correctly,<br />whatever you trade.</>}
        bullets={[
          "Forex majors and minors with proper pip-value math (USD-quoted exact, others approximated within 2%).",
          "JPY pairs with the correct 0.01 pip increment — no silent /10000 errors.",
          "Metals (XAU/XAG), indices (NAS100/US30/SPX500), and crypto all sized natively.",
        ]}
        ctaLabel="See instruments"
        ctaHref="#instruments"
        mockup={<InstrumentList />}
        frame="peach"
      />

      {/* ── SECTION 3 — VALIDATION ──────────────────────────────────────── */}
      <ProductSection
        sectionNum="03"
        kicker="Sanity Checks"
        ghost="safe sizes"
        headline={<>Catches the trade you<br />didn't mean to take.</>}
        bullets={[
          "Direction-aware validation: stop on the wrong side of entry? Edger flags it before sizing.",
          "Warns when calculated lot is below typical broker minimums or absurdly large.",
          "Pip distance, R:R ratio, profit at TP, and pip value shown clearly with every result.",
        ]}
        ctaLabel="Open the analyzer"
        mockup={<ValidationCard />}
        frame="lavender"
      />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section
        id="how"
        className="relative z-10 px-6 py-24 md:py-32 bg-white border-y border-zinc-100 overflow-hidden"
      >
        {/* Ghost label behind the section */}
        <div className="ghost-text absolute right-[-2rem] top-12 hidden md:block">flow</div>

        <div className="max-w-5xl mx-auto relative">
          <span className="section-num mb-6">04 · How it works</span>
          <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.02] mb-16 mt-3 text-zinc-950 max-w-2xl">
            Three steps. No friction.
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
                className="grid grid-cols-[60px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-12 items-baseline border-t border-zinc-100 py-10 first:border-t-0"
              >
                <span className="font-mono text-zinc-400 text-sm tabular-nums">{n}</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-zinc-950">
                    {h}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed max-w-xl text-base">{p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── INSTRUMENTS GRID ─────────────────────────────────────────────── */}
      <section id="instruments" className="relative z-10 px-6 py-24 md:py-32 overflow-hidden">
        <div className="ghost-text absolute -left-8 top-12 hidden md:block">markets</div>

        <div className="max-w-6xl mx-auto relative">
          <span className="section-num mb-6">05 · What it sizes</span>
          <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.02] mt-3 mb-12 text-zinc-950 max-w-2xl">
            Every major instrument.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200/70 border border-zinc-200/70 rounded-2xl overflow-hidden">
            {[
              ["Standard FX", ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD"]],
              ["JPY Pairs", ["USD/JPY", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CHF/JPY", "CAD/JPY"]],
              ["Cross", ["EUR/GBP", "EUR/AUD", "GBP/AUD", "AUD/NZD", "EUR/CAD", "GBP/CAD"]],
              ["Metals", ["XAU/USD", "XAG/USD"]],
              ["Indices", ["NAS100", "US30", "SPX500", "GER40", "UK100"]],
              ["Crypto", ["BTC/USD", "ETH/USD", "SOL/USD"]],
            ].map(([cat, items]) => (
              <div key={cat as string} className="bg-white p-7 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-medium mb-5">
                  {cat}
                </p>
                <ul className="space-y-2 text-[13px] font-mono text-zinc-800 tabular-nums">
                  {(items as string[]).map((i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="relative z-10 px-6 py-24 md:py-32 bg-white border-y border-zinc-100 overflow-hidden"
      >
        <div className="ghost-text absolute right-[-2rem] top-12 hidden md:block">questions</div>

        <div className="max-w-3xl mx-auto relative">
          <span className="section-num mb-6">06 · FAQ</span>
          <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.02] mt-3 mb-12 text-zinc-950">
            Things people ask.
          </h2>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQS.map((f, i) => (
              <button
                key={f.q}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left py-6 group focus:outline-none"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-base md:text-lg font-medium tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {f.q}
                  </span>
                  <span
                    className={`mt-1 w-6 h-6 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 text-sm leading-none transition-all duration-200 shrink-0 ${openFaq === i ? "rotate-45 bg-zinc-900 text-white border-zinc-900" : ""
                      }`}
                    aria-hidden
                  >
                    +
                  </span>
                </div>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="mt-4 text-zinc-600 leading-relaxed text-[15px] max-w-xl">
                      {f.a}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA (dark) ─────────────────────────────────────────────── */}
      <section className="relative z-10 bg-zinc-950 text-white overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(167,243,208,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 70%, rgba(233,213,255,0.12) 0%, transparent 50%)",
          }}
        />
        {/* Faint grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 py-32 md:py-44 text-center">
          <div className="mb-8 mx-auto w-14 h-14 rounded-2xl bg-white/[0.07] border border-white/15 flex items-center justify-center backdrop-blur text-zinc-100">
            <EdgerMark size={22} />
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.035em] mb-6">
            Stop guessing
            <br />
            your size.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-md mx-auto mb-10">
            Try Edger free. Five seconds, no signup, no card.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Open Edger
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ── INSTRUMENTS TICKER (marquee) — sits just above the footer ──── */}
      <section className="relative z-10 py-6 bg-zinc-950 border-t border-white/5 overflow-hidden">
        <div className="edger-marquee-mask">
          <div className="edger-marquee flex gap-12 whitespace-nowrap w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[13px] text-zinc-200 font-medium tabular-nums">
                  {t.sym}
                </span>
                <span className="font-mono text-[12px] text-zinc-500 tabular-nums">
                  {t.pip}/pip
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-zinc-950 text-zinc-400 border-t border-white/5 px-6 pt-20 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-3 text-white">
                <EdgerLogo size="md" variant="light" />
              </div>
              <p className="text-sm leading-relaxed text-zinc-500 max-w-[16rem]">
                The lot-sizing tool for serious retail traders.
              </p>
            </div>

            <FooterCol
              title="Product"
              links={[
                { label: "How it works", href: "#how" },
                { label: "Instruments", href: "#instruments" },
                { label: "Try Edger", href: "/app" },
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                { label: "FAQ", href: "#faq" },
                { label: "Roadmap", href: "#" },
                { label: "Changelog", href: "#" },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
                { label: "Disclaimer", href: "#" },
              ]}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500 pt-8 border-t border-white/5">
            <div className="font-mono">
              © {new Date().getFullYear()} Edger · Analytical tool, not financial advice.
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 edger-dot-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="px-3 py-1.5 text-sm font-medium text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
    >
      {children}
    </a>
  );
}

function Pill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-[12px] font-medium text-zinc-700 ${className}`}
    >
      {children}
    </span>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-white text-sm font-semibold mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="hover:text-zinc-200 transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Product section — alternates left/right via `reverse` prop
// -----------------------------------------------------------------------------

function ProductSection({
  reverse = false,
  sectionNum,
  kicker,
  ghost,
  headline,
  bullets,
  ctaLabel,
  ctaHref,
  mockup,
  frame,
}: {
  reverse?: boolean;
  sectionNum: string;
  kicker: string;
  ghost: string;
  headline: ReactNode;
  bullets: string[];
  ctaLabel: string;
  ctaHref?: string;
  mockup: ReactNode;
  frame: "mint" | "peach" | "lavender";
}) {
  const frameClass =
    frame === "mint"
      ? "gradient-frame-mint"
      : frame === "peach"
        ? "gradient-frame-peach"
        : "gradient-frame-lavender";

  const copy = (
    <div className="max-w-md">
      <span className="section-num mb-5">
        {sectionNum} · {kicker}
      </span>
      <h2 className="text-[clamp(1.875rem,4vw,3.25rem)] font-bold tracking-[-0.035em] leading-[1.04] text-zinc-950 mb-7 mt-3">
        {headline}
      </h2>
      <ul className="space-y-3 mb-8">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-zinc-700 leading-relaxed text-[15px]">
            <span className="mt-2 w-1 h-1 rounded-full bg-zinc-400 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {ctaHref ? (
        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </a>
      ) : (
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );

  const visual = (
    <div
      className={`relative ${frameClass} frame-grain rounded-3xl p-8 md:p-12 overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] hover-lift`}
    >
      {mockup}
    </div>
  );

  return (
    <section className="relative z-10 px-6 py-20 md:py-28 overflow-hidden">
      {/* Ghost text behind the section */}
      <div
        className={`ghost-text absolute hidden md:block ${reverse ? "right-[-2rem]" : "left-[-2rem]"
          } top-10`}
      >
        {ghost}
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center relative">
        {reverse ? (
          <>
            <div className="order-2 md:order-1">{visual}</div>
            <div className="order-1 md:order-2">{copy}</div>
          </>
        ) : (
          <>
            {copy}
            {visual}
          </>
        )}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Mockups
// -----------------------------------------------------------------------------

function TradeCard() {
  return (
    <div className="relative bg-white border border-zinc-200/60 rounded-2xl p-5 md:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-zinc-900 tracking-tight font-semibold tabular-nums">
            EUR/USD
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
            Standard FX
          </span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
          Long
        </span>
      </div>

      {/* Levels */}
      <div className="space-y-1.5 mb-5">
        <LevelRow label="Take Profit" value="1.08750" tone="profit" />
        <LevelRow label="Entry" value="1.08450" tone="neutral" />
        <LevelRow label="Stop Loss" value="1.08300" tone="loss" />
      </div>

      {/* Risk */}
      <div className="flex items-center justify-between text-xs pb-5 mb-5 border-b border-zinc-100">
        <span className="font-mono text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-medium">
          Risk
        </span>
        <span className="font-mono text-zinc-900 tabular-nums font-medium">$100.00</span>
      </div>

      {/* Result */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2 font-medium">
          Lot Size
        </div>
        <div className="flex items-end justify-between mb-4">
          <span className="font-mono text-5xl md:text-6xl font-medium tracking-[-0.04em] tabular-nums leading-none text-zinc-950">
            0.66
          </span>
          <div className="text-right pb-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1 font-medium">
              Profit at TP
            </div>
            <div className="font-mono text-sm text-emerald-600 tabular-nums font-semibold">
              +$200.00
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 pt-3 border-t border-zinc-100 font-medium">
          <span>
            R:R <span className="text-zinc-900 ml-1">1:2</span>
          </span>
          <span className="ml-auto normal-case">
            Pip Value <span className="text-zinc-900 ml-1">$10/lot</span>
          </span>
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
      ? "bg-emerald-50 border-emerald-100"
      : tone === "loss"
        ? "bg-rose-50 border-rose-100"
        : "bg-zinc-50 border-zinc-100";

  const labelColor =
    tone === "profit"
      ? "text-emerald-700"
      : tone === "loss"
        ? "text-rose-700"
        : "text-zinc-500";

  return (
    <div
      className={`flex items-center justify-between border ${styles} rounded-md py-2.5 px-3.5`}
    >
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.2em] font-medium ${labelColor}`}
      >
        {label}
      </span>
      <span className="font-mono text-sm text-zinc-900 tabular-nums font-medium">
        {value}
      </span>
    </div>
  );
}

function InstrumentList() {
  const rows: { sym: string; cat: string; pip: string }[] = [
    { sym: "EUR/USD", cat: "Standard FX", pip: "$10.00 / pip" },
    { sym: "USD/JPY", cat: "JPY Pair", pip: "$6.70 / pip" },
    { sym: "XAU/USD", cat: "Metal", pip: "$1.00 / pip" },
    { sym: "NAS100", cat: "Index", pip: "$1.00 / pt" },
    { sym: "BTC/USD", cat: "Crypto", pip: "$1.00 / $1" },
  ];

  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 md:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100">
        <span className="text-sm font-semibold text-zinc-950 tracking-tight">
          Pip values · USD account
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
          per 1 lot
        </span>
      </div>

      <ul className="space-y-1">
        {rows.map((r) => (
          <li
            key={r.sym}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums w-20">
                {r.sym}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium">
                {r.cat}
              </span>
            </div>
            <span className="font-mono text-sm text-zinc-700 tabular-nums">{r.pip}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 pt-4 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
        + 25 more instruments across forex, metals, indices &amp; crypto.
      </div>
    </div>
  );
}

function ValidationCard() {
  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 md:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] space-y-3">
      <div className="flex items-center justify-between mb-3 pb-4 border-b border-zinc-100">
        <span className="text-sm font-semibold text-zinc-950 tracking-tight">
          Pre-trade validation
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
          GBP/JPY · short
        </span>
      </div>

      <CheckRow tone="ok" label="Direction matches level placement (SL above entry)" />
      <CheckRow tone="ok" label="Risk:reward 1:2.4 — above 1:1 minimum" />
      <CheckRow
        tone="warn"
        label="Lot size 0.008 below typical 0.01 broker minimum — consider widening SL"
      />
      <CheckRow tone="ok" label="Pip distance 38.0 — within reasonable range" />

      <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-3 text-center">
        <Stat label="Lot" value="0.01" />
        <Stat label="R:R" value="1:2.4" />
        <Stat label="Profit at TP" value="$48" tone="emerald" />
      </div>
    </div>
  );
}

function CheckRow({
  tone,
  label,
}: {
  tone: "ok" | "warn";
  label: string;
}) {
  const dot = tone === "ok" ? "bg-emerald-500" : "bg-amber-500";
  return (
    <div className="flex items-start gap-3 text-sm text-zinc-700 leading-relaxed">
      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      <span>{label}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "emerald";
}) {
  return (
    <div className="bg-zinc-50 rounded-lg py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1 font-medium">
        {label}
      </div>
      <div
        className={`font-mono text-base font-semibold tabular-nums ${tone === "emerald" ? "text-emerald-600" : "text-zinc-900"
          }`}
      >
        {value}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Inline icons
// -----------------------------------------------------------------------------

function SpreadsheetIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
    >
      <path
        d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM18 14l1 2.2 2.2 1-2.2 1L18 20.4 17 18.2 14.8 17.2 17 16l1-2z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}
