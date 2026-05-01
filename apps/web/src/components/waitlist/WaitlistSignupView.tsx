export function WaitlistSignupView({
  email,
  setEmail,
  onSubmit,
  isSubmitting,
  submitError,
}: {
  email: string;
  setEmail: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
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
        Edger is in private early access. Drop your email and we'll let you know the moment sign-ups open.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 max-w-md mx-auto mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@trade.com"
            value={email}
            disabled={isSubmitting}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white border border-zinc-200 rounded-full px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSubmitting ? "Saving…" : "Get notified"}
            {!isSubmitting ? <span aria-hidden>→</span> : null}
          </button>
        </div>
        {submitError ? (
          <p className="text-[13px] text-red-600 text-left font-medium" role="alert">
            {submitError}
          </p>
        ) : null}
      </form>

      <p className="text-[12px] text-zinc-500 font-mono tracking-tight">
        Already 1,247 traders on the list
      </p>
    </>
  );
}
