import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { EdgerLogo } from "../components/Logo";

// =============================================================================
// Edger /pricing — four tiers, monthly/annual toggle for the Pro plan
// -----------------------------------------------------------------------------
// Tiers:
//   • Free — 5 AI analyses per month, no card
//   • Pay as you go — $0.20 per AI analysis, $10 minimum credit pack
//   • Pro Monthly — $19/mo, unlimited AI + power features
//   • Pro Annual — $190/yr (≈ $15.83/mo, 2 months free)
//
// Pro Monthly is the highlighted "Most popular" tier. Annual is shown via a
// monthly/annual toggle on the Pro card.
// =============================================================================

type Billing = "monthly" | "annual";

const PRO_FEATURES = [
  "Unlimited AI chart analyses",
  "Faster vision model",
  "History of past calculations",
  "Broker-specific contract presets",
  "Trade-journal export",
  "Account-currency conversion (EUR, GBP, etc.)",
];

const PAYG_FEATURES = [
  "$0.20 per AI chart analysis",
  "Pre-paid credit packs ($10 = 50 analyses)",
  "Credits never expire",
  "Same calculator + validation as Pro",
  "Upgrade to Pro any time",
];

const FREE_FEATURES = [
  "5 AI chart analyses per month",
  "Unlimited manual lot sizing",
  "All instruments (FX, metals, indices, crypto)",
  "Direction-aware validation",
  "Forever free, no card needed",
];

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="landing-root min-h-screen relative overflow-x-hidden">
      {/* Background grain */}
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-50 z-0" />

      {/* Soft pastel aurora at the top */}
      <div className="landing-aurora absolute inset-x-0 top-0 h-[500px] pointer-events-none z-0 opacity-60" />

      {/* ── Floating pill nav ── */}
      <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center">
        <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
          <Link to="/" className="px-3 py-1.5">
            <EdgerLogo size="md" variant="dark" />
          </Link>

          <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
            Pricing
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/signup"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              Try Edger
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-36 md:pt-40 pb-12 px-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-[12px] font-medium text-zinc-700 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
          Pricing
        </span>
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-zinc-950 mb-5">
          Sized for any pace.
        </h1>
        <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Free for casual sizers. Pay-as-you-go for occasional traders. Pro for
          everyone trading every day.
        </p>

        {/* Monthly / Annual toggle */}
        <div className="inline-flex items-center gap-1 p-1 bg-zinc-100/80 border border-zinc-200 rounded-full">
          <BillingToggle
            label="Monthly"
            active={billing === "monthly"}
            onClick={() => setBilling("monthly")}
          />
          <BillingToggle
            label="Annual"
            active={billing === "annual"}
            onClick={() => setBilling("annual")}
            badge="Save 17%"
          />
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          {/* === Free === */}
          <PlanCard
            tier="Free"
            price="$0"
            cadence="forever"
            description="For anyone curious about the tool."
            features={FREE_FEATURES}
            cta={{ label: "Get started", href: "/signup" }}
          />

          {/* === Pay as you go === */}
          <PlanCard
            tier="Pay as you go"
            price="$0.20"
            cadence="per analysis"
            description="Buy credits, use them whenever."
            features={PAYG_FEATURES}
            cta={{ label: "Buy credits", href: "/signup" }}
            footnote="$10 minimum · credits never expire"
          />

          {/* === Pro (highlighted) === */}
          <PlanCard
            tier="Pro"
            highlighted
            price={billing === "monthly" ? "$19" : "$15.83"}
            cadence={billing === "monthly" ? "/ month" : "/ month, billed annually"}
            description="For traders sizing every day."
            features={PRO_FEATURES}
            cta={{
              label: billing === "monthly" ? "Start Pro Monthly" : "Start Pro Annual",
              href: "/signup",
            }}
            footnote={
              billing === "annual"
                ? "$190 billed yearly · 2 months free"
                : "Cancel any time"
            }
          />
        </div>

        {/* ── Detail line below ── */}
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 mt-12">
          All plans · Same accurate math · Unlimited manual sizing
        </p>
      </section>

      {/* ── Comparison line ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-zinc-200/70 p-6 md:p-8 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l5 5L20 6.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-950 tracking-tight mb-1.5">
                Same calculator on every plan
              </h3>
              <p className="text-zinc-600 text-[14px] leading-relaxed">
                The lot-size math, the validation checks, the instruments
                covered — these are identical across Free, PAYG, and Pro. The
                difference is volume and convenience: how much AI extraction
                you get, and the workflow features around it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-10 text-center">
            Pricing questions.
          </h2>
          <div className="space-y-3">
            <FaqRow q="Is the AI included?">
              Yes — every plan gets AI chart extraction. Free includes 5 per
              month, PAYG bills $0.20 each, Pro is unlimited (fair-use 500/mo).
            </FaqRow>
            <FaqRow q="Does PAYG ever expire?">
              No. Credits you buy stay on your account until used. There's no
              monthly minimum.
            </FaqRow>
            <FaqRow q="What does Annual save vs Monthly?">
              Annual is $190/year, equivalent to $15.83/month — that's two
              months free vs paying $19/month. Roughly 17% cheaper.
            </FaqRow>
            <FaqRow q="Can I switch plans?">
              Yes — upgrade, downgrade, or move between PAYG and Pro any time
              from your profile. Pro time is prorated.
            </FaqRow>
            <FaqRow q="Refunds?">
              Pro Monthly: cancel any time, no refund on the current month.
              Pro Annual: 14-day refund window from purchase. PAYG credits are
              non-refundable but never expire.
            </FaqRow>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-zinc-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
            © {new Date().getFullYear()} Edger
          </div>
          <div className="flex items-center gap-4 font-mono">
            <a
              href="/legal#privacy"
              className="hover:text-zinc-900 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/legal#terms"
              className="hover:text-zinc-900 transition-colors"
            >
              Terms
            </a>
            <a
              href="/legal#disclaimer"
              className="hover:text-zinc-900 transition-colors"
            >
              Disclaimer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function BillingToggle({
  label,
  active,
  onClick,
  badge,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {label}
      {badge && (
        <span
          className={`text-[10px] uppercase tracking-[0.18em] font-mono px-1.5 py-0.5 rounded-full ${
            active
              ? "bg-emerald-400/30 text-emerald-200"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function PlanCard({
  tier,
  price,
  cadence,
  description,
  features,
  cta,
  footnote,
  highlighted = false,
}: {
  tier: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  footnote?: string;
  highlighted?: boolean;
}) {
  if (highlighted) {
    return (
      <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
        <div className="bg-white rounded-[20px] p-6 md:p-7 h-full flex flex-col">
          <PlanHeader
            tier={tier}
            price={price}
            cadence={cadence}
            description={description}
            highlighted
          />
          <PlanFeatures features={features} />
          <Link
            to={cta.href}
            className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
          >
            {cta.label}
            <span aria-hidden>→</span>
          </Link>
          {footnote && (
            <p className="font-mono text-[10px] tracking-tight text-zinc-500 text-center mt-3">
              {footnote}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/70 p-6 md:p-7 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex flex-col">
      <PlanHeader
        tier={tier}
        price={price}
        cadence={cadence}
        description={description}
      />
      <PlanFeatures features={features} />
      <Link
        to={cta.href}
        className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
      >
        {cta.label}
        <span aria-hidden>→</span>
      </Link>
      {footnote && (
        <p className="font-mono text-[10px] tracking-tight text-zinc-500 text-center mt-3">
          {footnote}
        </p>
      )}
    </div>
  );
}

function PlanHeader({
  tier,
  price,
  cadence,
  description,
  highlighted,
}: {
  tier: string;
  price: string;
  cadence: string;
  description: string;
  highlighted?: boolean;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
          {tier}
        </span>
        {highlighted && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] uppercase tracking-[0.22em] font-semibold text-emerald-700 font-mono">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            Most popular
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-mono text-4xl md:text-5xl font-medium tabular-nums tracking-[-0.03em] text-zinc-950">
          {price}
        </span>
        <span className="font-mono text-[12px] text-zinc-500 tabular-nums">
          {cadence}
        </span>
      </div>
      <p className="text-zinc-600 text-[14px] leading-relaxed">{description}</p>
    </div>
  );
}

function PlanFeatures({ features }: { features: string[] }) {
  return (
    <ul className="space-y-2.5 mb-7">
      {features.map((f) => (
        <li
          key={f}
          className="flex gap-2.5 text-[13px] text-zinc-700 leading-relaxed"
        >
          <svg
            className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l5 5L20 6.5" />
          </svg>
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function FaqRow({ q, children }: { q: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/70 p-5 md:p-6 shadow-[0_4px_30px_-16px_rgba(0,0,0,0.05)]">
      <h3 className="text-base font-semibold text-zinc-950 tracking-tight mb-1.5">
        {q}
      </h3>
      <p className="text-zinc-600 text-[14px] leading-relaxed">{children}</p>
    </div>
  );
}
