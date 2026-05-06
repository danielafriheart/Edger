import { useSignIn } from "@clerk/react";
import { useMemo, useState } from "react";
import { LoginAuthCard } from "../../components/login/LoginAuthCard";
import { LoginCodeStep } from "../../components/login/LoginCodeStep";
import { LoginEmailStep } from "../../components/login/LoginEmailStep";
import { LoginFooterLinks } from "../../components/login/LoginFooterLinks";
import { LoginPageLayout } from "../../components/login/LoginPageLayout";
import {
  clerkErrMsg,
  type FieldBag,
} from "../../components/login/clerkFormHelpers";

// ─────────────────────────────────────────────────────────────────────────────
// LoginEmailOtpFlow — sign-in only (no sign-up)
//
// Steps:
//   1. "email"  → user types email, clicks Continue
//   2. "code"   → user enters the OTP from their inbox
//
// Clerk API sequence:
//   signIn.create({ identifier })  →  signIn.emailCode.sendCode()
//   signIn.emailCode.verifyCode()  →  setActive({ session })  →  redirect
// ─────────────────────────────────────────────────────────────────────────────

type Step = "email" | "code";

export function LoginEmailOtpFlow({
  prefilledEmail,
}: {
  prefilledEmail?: string;
}) {
  const { signIn, setActive, errors: signInErrors, fetchStatus } = useSignIn();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(
    () => prefilledEmail?.trim().toLowerCase() ?? "",
  );
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Sync prefilled email when the query-string changes (e.g. /signup → /login?email=…).
  const [prevPrefill, setPrevPrefill] = useState(prefilledEmail);
  if (prefilledEmail !== prevPrefill) {
    setPrevPrefill(prefilledEmail);
    if (prefilledEmail) setEmail(prefilledEmail.trim().toLowerCase());
  }

  const fetching = fetchStatus === "fetching";
  const fields = signInErrors?.fields as unknown as FieldBag;

  // ── Navigation helpers ────────────────────────────────────────────────────

  async function finalizeAndRedirect() {
    // setActive writes the session token to the browser — without this,
    // Clerk never marks isSignedIn as true on the next page.
    await setActive({ session: signIn.createdSessionId });
    window.location.replace("/app");
  }

  // ── Step 1: email → create sign-in + send code ────────────────────────────

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || fetching) return;

    try {
      // 1a — Create the sign-in attempt
      const { error: createErr } = await signIn.create({ identifier: trimmed });
      if (createErr) {
        setFormError(clerkErrMsg(createErr) ?? "Could not start sign-in.");
        return;
      }

      // 1b — Send the OTP email
      const { error: sendErr } = await signIn.emailCode.sendCode();
      if (sendErr) {
        setFormError(
          clerkErrMsg(sendErr) ?? "Could not send verification code.",
        );
        return;
      }

      // Success → move to code step
      setStep("code");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  // ── Step 2: code → verify + finalize ──────────────────────────────────────

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!code.trim() || fetching) return;

    try {
      const { error } = await signIn.emailCode.verifyCode({
        code: code.trim(),
      });
      if (error) {
        setFormError(clerkErrMsg(error) ?? "Invalid or expired code.");
        return;
      }

      if (signIn.status === "complete") {
        await finalizeAndRedirect();
        return;
      }

      setFormError("Could not finish sign-in. Try again.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  // ── Resend code ───────────────────────────────────────────────────────────

  async function handleResendCode() {
    setFormError(null);
    try {
      const { error } = await signIn.emailCode.sendCode();
      if (error) {
        setFormError(clerkErrMsg(error) ?? "Resend failed.");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Resend failed.");
    }
  }

  // ── Start over ────────────────────────────────────────────────────────────

  async function startOver() {
    setCode("");
    setFormError(null);
    setStep("email");
    try {
      await signIn.reset();
    } catch {
      /* ok */
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const headlineAndSub = useMemo(() => {
    if (step === "code") {
      return {
        title: "Check your email",
        subtitle: `Enter the verification code we sent to ${email.trim()}`,
      };
    }
    return {
      title: "Welcome back.",
      subtitle: "Sign in with your email — we'll send a one-time code.",
    };
  }, [step, email]);

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
            signInFields={fields}
            onSubmit={handleEmailSubmit}
          />
        ) : null}

        {step === "code" ? (
          <LoginCodeStep
            code={code}
            onCodeChange={setCode}
            fetching={fetching}
            formError={formError}
            signInFields={fields}
            onResendCode={handleResendCode}
            onSubmit={handleCodeSubmit}
            onStartOver={startOver}
          />
        ) : null}
      </LoginAuthCard>

      <LoginFooterLinks
        alternateTo="/signup"
        alternateLabel="Need an account? Sign up"
        alternateSearch={{ email: email.trim().toLowerCase() || undefined }}
      />
    </LoginPageLayout>
  );
}
