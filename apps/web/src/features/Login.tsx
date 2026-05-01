import {
  ClerkLoaded,
  ClerkLoading,
  useAuth,
  useClerk,
  useSession,
  useSignIn,
  useSignUp,
  useUser,
} from "@clerk/react";
import { useMemo, useLayoutEffect, useState } from "react";
import { LoginAuthCard } from "../components/login/LoginAuthCard";
import { LoginCodeStep } from "../components/login/LoginCodeStep";
import { LoginEmailStep } from "../components/login/LoginEmailStep";
import { LoginFooterLinks } from "../components/login/LoginFooterLinks";
import { LoginPageLayout } from "../components/login/LoginPageLayout";
import { LoginProfileStep } from "../components/login/LoginProfileStep";
import {
  HANDLED_MISSING_KEYS,
  clerkErrList,
  clerkErrMsg,
  clerkMissingFieldToParamKey,
  humanizeMissingField,
  type FieldBag,
} from "../components/login/clerkFormHelpers";

// =============================================================================
// Edger Login — custom UI + Clerk (`signUpIfMissing` + email verification code).
// Presentational pieces live in `components/login/`.
// =============================================================================

type Step = "email" | "code" | "profile";

/** Full navigation to `/app` — survives Clerk/UI-router edge cases where client-side replace does nothing. */
function redirectToApp() {
  const base = import.meta.env.BASE_URL;
  const pathname = !base || base === "/" ? "/app" : base.endsWith("/") ? `${base}app` : `${base}/app`;
  window.location.replace(new URL(pathname, window.location.origin).href);
}

function ClerkErrorMeansAlreadySignedIn(err: unknown): boolean {
  for (const e of clerkErrList(err)) {
    const hay = `${e.longMessage ?? ""} ${e.message ?? ""} ${e.code ?? ""}`.toLowerCase();
    if (hay.includes("already signed")) return true;
  }
  return false;
}

function LoginBootstrapSpinner() {
  return (
    <div className="landing-root h-svh flex items-center justify-center">
      <span className="w-2 h-2 rounded-full bg-emerald-500 edger-dot-pulse" />
      <span className="sr-only">Loading authentication…</span>
    </div>
  );
}

/** Spinner + hard redirect once mounted (runs even if client router replace does nothing). */
function SignedInHardRedirect() {
  useLayoutEffect(() => {
    redirectToApp();
  }, []);

  return <LoginBootstrapSpinner />;
}

/** True once Clerk signals an active signed-in browser session — check several sources (`useAuth` alone can disagree during hydration). */
function useSignedInSignals() {
  const { isSignedIn, userId } = useAuth();
  const { session } = useSession();
  const { user } = useUser();
  const clerk = useClerk();

  const hasSession =
    isSignedIn === true
    || Boolean(userId)
    || !!session?.id
    || !!user?.id
    || !!(clerk as { session?: { id?: string } | null }).session?.id
    || !!(clerk as { user?: { id?: string } | null }).user?.id;

  return hasSession;
}

/**
 * Shell: never mount sign-in/up hooks until Clerk has finished its client bootstrap (`ClerkLoaded`),
 * because `useAuth().isLoaded` can be true while the JS client still hasn't applied the cookie session —
 * users would wrongly see `/login`.
 */
export default function Login() {
  return (
    <>
      <ClerkLoading>
        <LoginBootstrapSpinner />
      </ClerkLoading>
      <ClerkLoaded>
        <LoginAuthenticatedGate />
      </ClerkLoaded>
    </>
  );
}

function LoginAuthenticatedGate() {
  const hasSession = useSignedInSignals();

  if (hasSession) {
    return <SignedInHardRedirect />;
  }

  return <LoginFlow />;
}

/** Only mounts when Clerk reports no active session. */
function LoginFlow() {
  const { signIn, errors: signInErrors, fetchStatus: signInFetch } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpFetch } = useSignUp();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [otherAccepted, setOtherAccepted] = useState<Record<string, boolean>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [extraStrings, setExtraStrings] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const fetching = signInFetch === "fetching" || signUpFetch === "fetching";

  function goApp() {
    redirectToApp();
  }

  async function finalizeSignIn() {
    await signIn.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/app");
        if (url.startsWith("http")) window.location.href = url;
        else goApp();
      },
    });
  }

  async function finalizeSignUp() {
    await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/app");
        if (url.startsWith("http")) window.location.href = url;
        else goApp();
      },
    });
  }

  async function startOver() {
    setFormError(null);
    setCode("");
    setStep("email");
    setLegalAccepted(false);
    setOtherAccepted({});
    setFirstName("");
    setLastName("");
    setUsername("");
    setPhoneNumber("");
    setExtraStrings({});
    await signIn.reset();
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim();
    if (!trimmed || fetching) return;

    const { error: createError } = await signIn.create({
      identifier: trimmed,
      signUpIfMissing: true,
    });
    if (createError) {
      if (ClerkErrorMeansAlreadySignedIn(createError)) {
        redirectToApp();
        return;
      }
      setFormError(clerkErrMsg(createError) ?? "Could not start sign-in.");
      return;
    }

    const { error: sendError } = await signIn.emailCode.sendCode();
    if (sendError) {
      if (ClerkErrorMeansAlreadySignedIn(sendError)) {
        redirectToApp();
        return;
      }
      setFormError(clerkErrMsg(sendError) ?? "Could not send verification code.");
      return;
    }

    setStep("code");
  }

  async function handleTransfer() {
    const { error } = await signUp.create({ transfer: true });
    if (error) {
      setFormError(clerkErrMsg(error) ?? "Could not create account.");
      return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
    } else if (signUp.status === "missing_requirements") {
      setStep("profile");
    } else {
      setFormError("Unexpected sign-up state. Try again.");
    }
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!code.trim() || fetching) return;

    const { error } = await signIn.emailCode.verifyCode({ code: code.trim() });

    if (error) {
      if (ClerkErrorMeansAlreadySignedIn(error)) {
        redirectToApp();
        return;
      }
      const transferCodes = clerkErrList(error).some((er) => er.code === "sign_up_if_missing_transfer");
      if (transferCodes) {
        await handleTransfer();
        return;
      }
      setFormError(clerkErrMsg(error) ?? "Invalid or expired code.");
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else if (signIn.status === "needs_second_factor") {
      setFormError("Additional verification required (configure MFA handling).");
    } else if (signIn.status === "needs_client_trust") {
      setFormError("Trust verification required — complete in Clerk Dashboard Client Trust docs.");
    } else {
      setFormError("Could not finish sign-in. Try again.");
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const missing = signUp.missingFields ?? [];
    const patch = {} as Record<string, unknown>;

    if (missing.includes("password")) {
      setFormError(
        "Your Clerk application still requires a password for new accounts. Disable password strategy for this passwordless flow, or enable password capture in code.",
      );
      return;
    }

    if (missing.includes("legal_accepted")) {
      if (!legalAccepted) {
        setFormError("Please accept the terms to continue.");
        return;
      }
      patch.legalAccepted = true;
    }

    for (const id of missing) {
      if (id === "legal_accepted") continue;
      if (id.endsWith("_accepted")) {
        const ok = otherAccepted[id] === true;
        if (!ok) {
          setFormError(`Please confirm: ${humanizeMissingField(id)}.`);
          return;
        }
        patch[clerkMissingFieldToParamKey(id)] = true;
      }
    }

    if (missing.includes("first_name")) {
      const t = firstName.trim();
      if (!t) {
        setFormError("First name is required.");
        return;
      }
      patch.firstName = t;
    }
    if (missing.includes("last_name")) {
      const t = lastName.trim();
      if (!t) {
        setFormError("Last name is required.");
        return;
      }
      patch.lastName = t;
    }
    if (missing.includes("username")) {
      const t = username.trim();
      if (!t) {
        setFormError("Username is required.");
        return;
      }
      patch.username = t;
    }
    if (missing.includes("phone_number")) {
      const t = phoneNumber.trim();
      if (!t) {
        setFormError("Phone number is required (E.164 format recommended, e.g. +15551234567).");
        return;
      }
      patch.phoneNumber = t;
    }

    for (const field of missing) {
      if (HANDLED_MISSING_KEYS.has(field)) continue;
      if (field.endsWith("_accepted")) continue;
      if (field === "password") continue;
      const py = clerkMissingFieldToParamKey(field);
      const raw = extraStrings[field]?.trim() ?? "";
      if (!raw) {
        setFormError(`${humanizeMissingField(field)} is required.`);
        return;
      }
      patch[py] = raw;
    }

    const { error } = await signUp.update(patch as Parameters<typeof signUp.update>[0]);
    if (error) {
      setFormError(clerkErrMsg(error) ?? "Could not update profile.");
      return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
    } else if (signUp.status === "missing_requirements") {
      setFormError(`Still missing: ${signUp.missingFields?.join(", ") ?? "unknown"}`);
    }
  }

  const headlineAndSub = useMemo(() => {
    if (step === "code") {
      return {
        title: "Check your email",
        subtitle: `Enter the verification code we sent to ${email.trim()}`,
      };
    }
    if (step === "profile") {
      return {
        title: "Almost there",
        subtitle: "A few details to finish your account.",
      };
    }
    return {
      title: "Welcome back.",
      subtitle: "Sign in or create an account with your email.",
    };
  }, [step, email]);

  const signInFields = signInErrors?.fields as unknown as FieldBag;
  const signUpFields = signUpErrors?.fields as unknown as FieldBag;

  return (
    <LoginPageLayout>
      <LoginAuthCard
        title={headlineAndSub.title}
        subtitle={headlineAndSub.subtitle}
        footerNote="Clerk auth • Supabase uses your signed-in JWT"
      >
        {step === "email" ? (
          <LoginEmailStep
            email={email}
            onEmailChange={setEmail}
            fetching={fetching}
            formError={formError}
            signInFields={signInFields}
            onSubmit={handleEmailSubmit}
          />
        ) : null}

        {step === "code" ? (
          <LoginCodeStep
            code={code}
            onCodeChange={setCode}
            fetching={fetching}
            formError={formError}
            signInFields={signInFields}
            onResendCode={() =>
              signIn.emailCode.sendCode().then(({ error }) => {
                if (error) {
                  if (ClerkErrorMeansAlreadySignedIn(error)) redirectToApp();
                  else setFormError(clerkErrMsg(error) ?? "Resend failed");
                } else setFormError(null);
              })}
            onSubmit={handleCodeSubmit}
            onStartOver={startOver}
          />
        ) : null}

        {step === "profile" ? (
          <LoginProfileStep
            missingFields={signUp.missingFields ?? []}
            fetching={fetching}
            formError={formError}
            signUpFields={signUpFields}
            legalAccepted={legalAccepted}
            onLegalAccepted={setLegalAccepted}
            otherAccepted={otherAccepted}
            onOtherAccepted={(id, checked) =>
              setOtherAccepted((prev) => ({
                ...prev,
                [id]: checked,
              }))}
            firstName={firstName}
            onFirstName={setFirstName}
            lastName={lastName}
            onLastName={setLastName}
            username={username}
            onUsername={setUsername}
            phoneNumber={phoneNumber}
            onPhoneNumber={setPhoneNumber}
            extraStrings={extraStrings}
            onExtraStringChange={(fieldId, value) =>
              setExtraStrings((prev) => ({
                ...prev,
                [fieldId]: value,
              }))}
            onSubmit={handleProfileSubmit}
            onStartOver={startOver}
          />
        ) : null}
      </LoginAuthCard>

      <LoginFooterLinks />
    </LoginPageLayout>
  );
}
