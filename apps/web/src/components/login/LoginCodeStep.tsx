import { ClerkFieldErr } from "./clerkFieldErr";
import { loginInputClass, type FieldBag } from "./clerkFormHelpers";

export function LoginCodeStep({
  code,
  onCodeChange,
  fetching,
  formError,
  signInFields,
  onResendCode,
  onSubmit,
  onStartOver,
}: {
  code: string;
  onCodeChange: (value: string) => void;
  fetching: boolean;
  formError: string | null;
  signInFields: FieldBag;
  onResendCode: () => void | Promise<void>;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  onStartOver: () => void | Promise<void>;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="login-code"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2"
        >
          Verification code
        </label>
        <input
          id="login-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          disabled={fetching}
          placeholder="123456"
          className={`${loginInputClass} font-mono tracking-wider text-center`}
        />
        <ClerkFieldErr fields={signInFields} fieldKey="code" />
      </div>

      {formError ? (
        <p className="text-[13px] text-red-600 font-medium">{formError}</p>
      ) : null}

      <button
        type="submit"
        disabled={fetching}
        className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-zinc-900 text-white text-[14px] font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08)] disabled:opacity-70"
      >
        {fetching ? "Verifying…" : "Verify and continue"}
      </button>

      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
        <button
          type="button"
          disabled={fetching}
          onClick={() => void onResendCode()}
          className="text-[13px] text-zinc-600 hover:text-zinc-900 underline underline-offset-2 disabled:opacity-50"
        >
          Resend code
        </button>
        <button
          type="button"
          disabled={fetching}
          onClick={() => void onStartOver()}
          className="text-[13px] text-zinc-600 hover:text-zinc-900 underline underline-offset-2 disabled:opacity-50"
        >
          Start over
        </button>
      </div>
    </form>
  );
}
