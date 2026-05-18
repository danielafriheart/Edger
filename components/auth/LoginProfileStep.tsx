import { ClerkFieldErr } from "./clerkFieldErr";
import {
  HANDLED_MISSING_KEYS,
  clerkMissingFieldToParamKey,
  humanizeMissingField,
  loginInputClass,
  type FieldBag,
} from "./clerkFormHelpers";

export function LoginProfileStep({
  missingFields,
  fetching,
  formError,
  signUpFields,
  legalAccepted,
  onLegalAccepted,
  otherAccepted,
  onOtherAccepted,
  firstName,
  onFirstName,
  lastName,
  onLastName,
  username,
  onUsername,
  phoneNumber,
  onPhoneNumber,
  extraStrings,
  onExtraStringChange,
  onSubmit,
  onStartOver,
}: {
  missingFields: string[];
  fetching: boolean;
  formError: string | null;
  signUpFields: FieldBag;
  legalAccepted: boolean;
  onLegalAccepted: (v: boolean) => void;
  otherAccepted: Record<string, boolean>;
  onOtherAccepted: (id: string, checked: boolean) => void;
  firstName: string;
  onFirstName: (v: string) => void;
  lastName: string;
  onLastName: (v: string) => void;
  username: string;
  onUsername: (v: string) => void;
  phoneNumber: string;
  onPhoneNumber: (v: string) => void;
  extraStrings: Record<string, string>;
  onExtraStringChange: (fieldId: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  onStartOver: () => void | Promise<void>;
}) {
  const unknownStringFields = missingFields.filter(
    (f) =>
      !HANDLED_MISSING_KEYS.has(f)
      && !f.endsWith("_accepted")
      && f !== "password",
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left">
      {missingFields.includes("password") ? (
        <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Clerk is asking for a <strong>password</strong>. For this OTP-only screen, disable password-based sign-up in
          Clerk (User & authentication) or extend the form with a password field.
        </p>
      ) : null}

      <p className="text-[11px] text-zinc-500 font-mono text-center break-words">
        Required:&nbsp;
        {missingFields.join(", ") || "—"}
      </p>

      {missingFields.includes("legal_accepted") ? (
        <label className="flex items-start gap-3 text-[14px] text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={legalAccepted}
            onChange={(e) => onLegalAccepted(e.target.checked)}
            className="mt-1 rounded border-zinc-300"
          />
          <span>
            I agree to the Terms of Service and Privacy Policy
            {signUpFields?.legalAccepted?.message ? (
              <span className="block text-red-600 text-[12px] mt-1">{signUpFields.legalAccepted.message}</span>
            ) : null}
          </span>
        </label>
      ) : null}

      {missingFields
        .filter((id) => id.endsWith("_accepted") && id !== "legal_accepted")
        .map((id) => (
          <label key={id} className="flex items-start gap-3 text-[14px] text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={otherAccepted[id] === true}
              onChange={(e) => onOtherAccepted(id, e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span>{humanizeMissingField(id)}</span>
          </label>
        ))}

      {missingFields.includes("first_name") ? (
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2">
            First name
          </label>
          <input
            value={firstName}
            onChange={(e) => onFirstName(e.target.value)}
            disabled={fetching}
            className={loginInputClass}
            autoComplete="given-name"
          />
          <ClerkFieldErr fields={signUpFields} fieldKey="firstName" />
        </div>
      ) : null}

      {missingFields.includes("last_name") ? (
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2">
            Last name
          </label>
          <input
            value={lastName}
            onChange={(e) => onLastName(e.target.value)}
            disabled={fetching}
            className={loginInputClass}
            autoComplete="family-name"
          />
          <ClerkFieldErr fields={signUpFields} fieldKey="lastName" />
        </div>
      ) : null}

      {missingFields.includes("username") ? (
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => onUsername(e.target.value)}
            disabled={fetching}
            className={`${loginInputClass} font-mono`}
            autoComplete="username"
          />
          <ClerkFieldErr fields={signUpFields} fieldKey="username" />
        </div>
      ) : null}

      {missingFields.includes("phone_number") ? (
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2">
            Phone number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneNumber(e.target.value)}
            disabled={fetching}
            placeholder="+155501234567"
            className={loginInputClass}
            autoComplete="tel"
          />
          <p className="text-[11px] text-zinc-500 mt-1">Use international format when possible.</p>
          <ClerkFieldErr fields={signUpFields} fieldKey="phoneNumber" />
        </div>
      ) : null}

      {unknownStringFields.map((fieldId) => (
        <div key={fieldId}>
          <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2">
            {humanizeMissingField(fieldId)}
          </label>
          <input
            value={extraStrings[fieldId] ?? ""}
            onChange={(e) => onExtraStringChange(fieldId, e.target.value)}
            disabled={fetching}
            className={loginInputClass}
          />
          <ClerkFieldErr fields={signUpFields} fieldKey={clerkMissingFieldToParamKey(fieldId)} />
        </div>
      ))}

      {formError ? (
        <p className="text-[13px] text-red-600 font-medium">{formError}</p>
      ) : null}

      <button
        type="submit"
        disabled={fetching}
        className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-zinc-900 text-white text-[14px] font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70"
      >
        {fetching ? "Saving…" : "Create account"}
      </button>
      <button
        type="button"
        disabled={fetching}
        onClick={() => void onStartOver()}
        className="w-full text-[13px] text-zinc-600 hover:text-zinc-900"
      >
        Start over
      </button>
    </form>
  );
}
