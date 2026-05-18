import { ClerkFieldErr } from "./clerkFieldErr";
import { loginInputClass, type FieldBag } from "./clerkFormHelpers";

export function LoginEmailStep({
  email,
  onEmailChange,
  fetching,
  formError,
  signInFields,
  onSubmit,
}: {
  email: string;
  onEmailChange: (value: string) => void;
  fetching: boolean;
  formError: string | null;
  signInFields: FieldBag;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={fetching}
          placeholder="you@trade.com"
          className={loginInputClass}
        />
        <ClerkFieldErr fields={signInFields} fieldKey="identifier" />
      </div>

      <div id="clerk-captcha" />

      {formError ? (
        <p className="text-[13px] text-red-600 font-medium">{formError}</p>
      ) : null}

      <button
        type="submit"
        disabled={fetching}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 text-white text-[14px] font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)] disabled:opacity-70"
      >
        {fetching ? "Sending…" : "Continue"}
        {!fetching ? <span aria-hidden>→</span> : null}
      </button>
    </form>
  );
}
