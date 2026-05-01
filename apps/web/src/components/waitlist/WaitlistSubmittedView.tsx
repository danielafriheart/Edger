import { Link } from "@tanstack/react-router";

export function WaitlistSubmittedView({ email, onReset }: { email: string; onReset: () => void }) {
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
        <span className="font-mono text-zinc-900">{email}</span> the moment sign-ups open. Thanks for the patience.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          Back to home
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          Use a different email
        </button>
      </div>
    </>
  );
}
