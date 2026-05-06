import { ClerkFieldErr } from "./clerkFieldErr";
import { loginInputClass, type FieldBag } from "./clerkFormHelpers";

export function LoginIdentityStep({
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  email,
  onEmailChange,
  fetching,
  formError,
  signInFields,
  onSubmit,
}: {
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  fetching: boolean;
  formError: string | null;
  signInFields: FieldBag;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="signup-first-name"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
          >
            First name
          </label>
          <input
            id="signup-first-name"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            disabled={fetching}
            placeholder="Jane"
            className={loginInputClass}
          />
        </div>
        <div>
          <label
            htmlFor="signup-last-name"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
          >
            Last name
          </label>
          <input
            id="signup-last-name"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            disabled={fetching}
            placeholder="Trader"
            className={loginInputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="signup-email-ident"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
        >
          Email
        </label>
        <input
          id="signup-email-ident"
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
        {fetching ? "Sending…" : "Continue with email"}
        {!fetching ? <span aria-hidden>→</span> : null}
      </button>
    </form>
  );
}
