import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { EdgerLogo } from "../components/Logo";

// =============================================================================
// Edger Waitlist — minimal, single-viewport
// -----------------------------------------------------------------------------
// Same design tokens as the rest of the platform: warm off-white background,
// soft pastel aurora at the top, floating pill-nav, Geist sans + Geist Mono,
// rounded-full pill CTAs. The page locks to 100svh and centers vertically.
// =============================================================================

const STORAGE_KEY = "edger.waitlist_email";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSubmitted(true);
      setSubmittedEmail(stored);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    // Frontend-only persistence for now. Wire to your backend (Resend,
    // ConvertKit, etc.) when ready — submit `trimmed` to that endpoint here.
    window.localStorage.setItem(STORAGE_KEY, trimmed);
    setSubmittedEmail(trimmed);
    setSubmitted(true);
  };

  const handleReset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSubmitted(false);
    setSubmittedEmail(null);
    setEmail("");
  };

  return (
    <div className="landing-root h-[100svh] relative overflow-hidden flex flex-col">
      {/* Background grain */}
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />

      {/* Soft pastel aurora at top */}
      <div className="landing-aurora absolute inset-x-0 top-0 h-[600px] pointer-events-none z-0" />

      {/* ── Floating pill nav (matches landing/analyzer) ── */}
      <div className="absolute top-5 inset-x-0 z-50 px-4 flex justify-center">
        <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
          <Link to="/" className="px-3 py-1.5">
            <EdgerLogo size="md" variant="dark" />
          </Link>

          <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
            Waitlist
          </span>

          <div className="ml-auto">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              ← Home
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Centered content ── */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          {submitted && submittedEmail ? (
            <SubmittedView email={submittedEmail} onReset={handleReset} />
          ) : (
            <SignupView
              email={email}
              setEmail={setEmail}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </main>

      {/* Footer strip — minimal, matches the platform's quiet bottom */}
      <footer className="relative z-10 px-6 pb-6 pt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span>© {new Date().getFullYear()} Edger</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          Sign-ups opening soon
        </span>
      </footer>
    </div>
  );
}

// =============================================================================
// SignupView — the form
// =============================================================================

function SignupView({
  email,
  setEmail,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-[12px] font-medium text-zinc-700 mb-7">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
        Early access
      </span>

      <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.04em] text-zinc-950 mb-6">
        Get on the
        <br />
        waitlist.
      </h1>

      <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed max-w-md mx-auto mb-9">
        Edger is in private early access. Drop your email and we'll let you know
        the moment sign-ups open.
      </p>

      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-6"
      >
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@trade.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white border border-zinc-200 rounded-full px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          Get notified
          <span aria-hidden>→</span>
        </button>
      </form>

      <p className="text-[12px] text-zinc-500 font-mono tracking-tight">
        Already 1,247 traders on the list
      </p>
    </>
  );
}

// =============================================================================
// SubmittedView — success state
// =============================================================================

function SubmittedView({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[12px] font-medium text-emerald-700 mb-7">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        On the list
      </span>

      <div className="mb-6 mx-auto w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12.5l5 5L20 6.5" />
        </svg>
      </div>

      <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[0.98] tracking-[-0.04em] text-zinc-950 mb-5">
        You're on the list.
      </h1>

      <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed max-w-md mx-auto mb-8">
        We'll email{" "}
        <span className="font-mono text-zinc-900">{email}</span> the moment
        sign-ups open. Thanks for the patience.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          Back to home
        </Link>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          Use a different email
        </button>
      </div>
    </>
  );
}
