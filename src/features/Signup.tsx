import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { EdgerLogo } from "../components/Logo";
import { createFreshSession, setSession } from "../lib/auth";

// =============================================================================
// Edger /signup — smart-detect single-page auth
// -----------------------------------------------------------------------------
// One URL, two steps:
//
//   Step 1 (form):
//     - Full name
//     - Email
//     - "Continue with email" → moves to OTP step
//     - If email is recognized as a returning user the name field is hidden
//       (returning users don't need to re-enter their name)
//
//   Step 2 (OTP):
//     - 6-digit code input
//     - Resend link
//     - "← Back" to edit email
//     - On submit (currently a no-op since the backend doesn't exist) we set a
//       fake session in localStorage and route the user to /app
//
// Returning-user detection is also a no-op for now — we treat any email that
// already has a saved session as "returning." Once the backend is wired this
// becomes a real `lookup` call.
// =============================================================================

const RETURNING_EMAILS_KEY = "edger.known_emails";

function isReturningEmail(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(RETURNING_EMAILS_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    return list.includes(email.toLowerCase().trim());
  } catch {
    return false;
  }
}

function rememberEmail(email: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(RETURNING_EMAILS_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    const e = email.toLowerCase().trim();
    if (!list.includes(e)) list.push(e);
    window.localStorage.setItem(RETURNING_EMAILS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

type Step = "form" | "otp";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [returning, setReturning] = useState(false);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus OTP input when entering step 2
  useEffect(() => {
    if (step === "otp") otpInputRef.current?.focus();
  }, [step]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const isKnown = isReturningEmail(trimmedEmail);
    setReturning(isKnown);

    // Returning users don't have to provide a name (we'll keep whatever the
    // backend has for them); new users do.
    if (!isKnown && !name.trim()) return;

    // No real OTP send yet — backend will dispatch the code here.
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    // No real verification — accept any 6-digit code for now.
    rememberEmail(email);
    setSession(
      createFreshSession(name.trim() || email.split("@")[0], email.trim()),
    );
    navigate({ to: "/app" });
  };

  const handleResend = () => {
    // No-op until the backend is wired. Visual feedback only.
    setOtp("");
    otpInputRef.current?.focus();
  };

  const handleBack = () => {
    setStep("form");
    setOtp("");
  };

  return (
    <div className="landing-root h-[100svh] relative overflow-hidden flex items-center justify-center px-4">
      {/* Pastel aurora bleeding from the top */}
      <div className="landing-aurora absolute inset-x-0 top-0 h-[700px] pointer-events-none z-0" />

      {/* Dotted grain background */}
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Mint gradient frame matching the platform's signature mockup style */}
        <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
          <div className="bg-white rounded-[20px] p-7 md:p-9">
            {/* Brand */}
            <div className="flex justify-center mb-7">
              <EdgerLogo size="lg" variant="dark" />
            </div>

            {step === "form" ? (
              <FormStep
                name={name}
                email={email}
                returning={returning}
                onName={setName}
                onEmail={setEmail}
                onSubmit={handleEmailSubmit}
                /* Live-detect known emails so we can hide the name field */
                onEmailBlur={() => setReturning(isReturningEmail(email))}
              />
            ) : (
              <OtpStep
                otp={otp}
                email={email}
                returning={returning}
                onOtp={setOtp}
                onSubmit={handleOtpSubmit}
                onResend={handleResend}
                onBack={handleBack}
                inputRef={otpInputRef}
              />
            )}
          </div>
        </div>

        {/* Footer below card */}
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

// =============================================================================
// Step 1 — name + email
// =============================================================================

function FormStep({
  name,
  email,
  returning,
  onName,
  onEmail,
  onSubmit,
  onEmailBlur,
}: {
  name: string;
  email: string;
  returning: boolean;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEmailBlur: () => void;
}) {
  const canSubmit = !!email.trim() && (returning || !!name.trim());

  return (
    <>
      <div className="text-center mb-7">
        <h1 className="text-[28px] md:text-[32px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
          {returning ? "Welcome back." : "Get sized in."}
        </h1>
        <p className="text-zinc-600 text-[14px] md:text-[15px] leading-relaxed max-w-xs mx-auto">
          {returning
            ? "Enter your email and we'll send you a 6-digit code."
            : "Two fields, then a code to your inbox. No password to remember."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {!returning && (
          <div>
            <label
              htmlFor="signup-name"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
            >
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Trader"
              value={name}
              onChange={(e) => onName(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="signup-email"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@trade.com"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            onBlur={onEmailBlur}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 text-white text-[14px] font-medium hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          Continue with email
          <span aria-hidden>→</span>
        </button>
      </form>

      <div className="flex items-center justify-center gap-2 mt-7 pt-6 border-t border-zinc-100 font-mono text-[11px] tracking-tight text-zinc-500 leading-relaxed">
        <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse shrink-0" />
        We'll sign you in or create an account
      </div>
    </>
  );
}

// =============================================================================
// Step 2 — OTP entry
// =============================================================================

function OtpStep({
  otp,
  email,
  returning,
  onOtp,
  onSubmit,
  onResend,
  onBack,
  inputRef,
}: {
  otp: string;
  email: string;
  returning: boolean;
  onOtp: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const canSubmit = otp.length === 6;

  return (
    <>
      <div className="text-center mb-7">
        <h1 className="text-[26px] md:text-[30px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
          Check your inbox.
        </h1>
        <p className="text-zinc-600 text-[14px] leading-relaxed max-w-sm mx-auto">
          We sent a 6-digit code to{" "}
          <span className="font-mono text-zinc-900">{email}</span>
          {returning ? "." : ". Welcome aboard."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="signup-otp"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
          >
            Verification code
          </label>
          <input
            id="signup-otp"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            placeholder="000000"
            value={otp}
            onChange={(e) => onOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-[18px] font-mono tabular-nums tracking-[0.4em] text-center text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 text-white text-[14px] font-medium hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          Verify and continue
          <span aria-hidden>→</span>
        </button>
      </form>

      <div className="flex items-center justify-between gap-3 mt-7 pt-6 border-t border-zinc-100 text-[12px]">
        <button
          type="button"
          onClick={onBack}
          className="text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          ← Edit email
        </button>
        <button
          type="button"
          onClick={onResend}
          className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors"
        >
          Resend code
        </button>
      </div>
    </>
  );
}
