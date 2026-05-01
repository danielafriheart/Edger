import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { EdgerLogo } from "../components/Logo";

// =============================================================================
// Edger Login — pastel-frame, single-viewport, no nav
// -----------------------------------------------------------------------------
// Visual language pulled from the rest of the platform so the page feels
// native to Edger:
//   • Warm off-white background (landing-root)
//   • Soft pastel aurora bleeding from the top
//   • Faint dotted grain texture
//   • Mint gradient frame (gradient-frame-mint + frame-grain) around a clean
//     white inner card — same recipe as the landing's product mockups
//   • Mono uppercase labels and a pulsing emerald dot for the magic-link line
//   • Black rounded-full pill CTA matching the platform's primary buttons
//
// Reachable only via /login (no link from anywhere). Form is a no-op until
// auth is wired up.
// =============================================================================

export default function Login() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Intentionally left blank — wire to your auth provider when ready.
  };

  return (
    <div className="landing-root h-[100svh] relative overflow-hidden flex items-center justify-center px-4">
      {/* Soft pastel aurora — bleeds in from the top, gives the page life
          without a nav. */}
      <div className="landing-aurora absolute inset-x-0 top-0 h-[700px] pointer-events-none z-0" />

      {/* Faint dotted grain so the warm-white background isn't dead flat. */}
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />

      {/* Centered card column */}
      <div className="relative z-10 w-full max-w-md">
        {/* Mint gradient frame (same recipe as the landing trade card mockup) */}
        <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
          {/* Inner white surface */}
          <div className="bg-white rounded-[20px] p-7 md:p-9">
            {/* Brand */}
            <div className="flex justify-center mb-7">
              <EdgerLogo size="lg" variant="dark" />
            </div>

            {/* Headline */}
            <div className="text-center mb-7">
              <h1 className="text-[28px] md:text-[34px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
                Welcome back.
              </h1>
              <p className="text-zinc-600 text-[14px] md:text-[15px] leading-relaxed max-w-xs mx-auto">
                Sign in to continue sizing your trades.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="login-email"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@trade.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 text-white text-[14px] font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
              >
                Continue with email
                <span aria-hidden>→</span>
              </button>
            </form>

            {/* Magic-link explainer in mono with a live emerald dot */}
            <div className="flex items-center justify-center gap-2 mt-7 pt-6 border-t border-zinc-100 font-mono text-[11px] tracking-tight text-zinc-500 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse shrink-0" />
              We'll sign you in or create an account
            </div>
          </div>
        </div>

        {/* Below the card: terms + back link, kept very quiet so the card stays the focus */}
        <div className="mt-6 text-center space-y-2.5">
          <p className="text-[12px] text-zinc-500 leading-relaxed">
            By continuing, you agree to the{" "}
            <a
              href="/legal#terms"
              className="text-zinc-800 underline underline-offset-2 hover:text-zinc-900 transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/legal#privacy"
              className="text-zinc-800 underline underline-offset-2 hover:text-zinc-900 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
          <Link
            to="/"
            className="inline-block text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
