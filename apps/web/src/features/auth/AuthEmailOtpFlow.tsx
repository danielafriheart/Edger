import { useSignIn, useSignUp } from "@clerk/react";
import { useCallback, useMemo, useState } from "react";
import { LoginAuthCard } from "../../components/login/LoginAuthCard";
import { LoginCodeStep } from "../../components/login/LoginCodeStep";
import { LoginEmailStep } from "../../components/login/LoginEmailStep";
import { LoginFooterLinks } from "../../components/login/LoginFooterLinks";
import { LoginIdentityStep } from "../../components/login/LoginIdentityStep";
import { LoginPageLayout } from "../../components/login/LoginPageLayout";
import { LoginProfileStep } from "../../components/login/LoginProfileStep";
import {
  HANDLED_MISSING_KEYS,
  clerkErrList,
  clerkErrMsg,
  clerkMissingFieldToParamKey,
  humanizeMissingField,
  normalizeClerkMissingFieldIds,
  type FieldBag,
} from "../../components/login/clerkFormHelpers";
import { redirectToApp } from "./authRedirect";
import { clerkErrorMeansAlreadySignedIn } from "./clerkAlreadySignedIn";
import { usernameFromFullName } from "./fullNameDerived";
import { SignupPageChrome } from "./SignupPageChrome";

// =============================================================================
// Clerk: signUpIfMissing + email verification code · shared /login vs /signup
// =============================================================================

type Step = "identity" | "email" | "code" | "profile";

export type AuthEmailOtpChrome = "login" | "signup";

export function AuthEmailOtpFlow({
  chrome,
  prefilledEmail,
}: {
  chrome: AuthEmailOtpChrome;
  /** From `?email=` when switching between `/login` and `/signup`. */
  prefilledEmail?: string;
}) {
  const signupCollectsIdentity = chrome === "signup";
  const { signIn, errors: signInErrors, fetchStatus: signInFetch } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpFetch } = useSignUp();

  const initialStep: Step = signupCollectsIdentity ? "identity" : "email";
  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState(() => prefilledEmail?.trim().toLowerCase() ?? "");
  const [code, setCode] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [otherAccepted, setOtherAccepted] = useState<Record<string, boolean>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [extraStrings, setExtraStrings] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  /** Login ignores SignUp loading so a stale / in-flight signup after navigating here cannot lock inputs. */
  const fetching =
    signupCollectsIdentity ? signInFetch === "fetching" || signUpFetch === "fetching" : signInFetch === "fetching";

  /** Mirror `prefilledEmail` into `email` when the query changes (prefer render-time adjustment over effect + setState). */
  const [prevPrefilledEmail, setPrevPrefilledEmail] = useState(prefilledEmail);
  if (prefilledEmail !== prevPrefilledEmail) {
    setPrevPrefilledEmail(prefilledEmail);
    if (prefilledEmail) setEmail(prefilledEmail.trim().toLowerCase());
  }

  /** Prefill username slug from identity first + last once profile step renders. */
  const applySignupProfileDraftFromIdentity = useCallback(() => {
    const combined = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!combined) return;
    setUsername((prev) => prev.trim() || usernameFromFullName(combined));
  }, [firstName, lastName]);

  const profileMissingFields = useMemo(
    () => normalizeClerkMissingFieldIds(signUp.missingFields),
    [signUp.missingFields],
  );

  /**
   * Clerk expects `firstName` / `lastName` on `signUp.create` for custom flows (see docs). We pass them on
   * `create({ transfer: true, ... })` from `/signup`, then only `update` what is still in `missingFields` (names
   * and/or username) so we avoid redundant PATCHes.
   */
  /** `false` if a required `signUp.update` failed — caller must not finalize. */
  async function persistSignupIdentityOnSignUpResource(): Promise<boolean> {
    const fn = firstName.trim();
    const ln = lastName.trim();
    const miss = normalizeClerkMissingFieldIds(signUp.missingFields);

    const needsNamePatch =
      fn && ln && (miss.includes("first_name") || miss.includes("last_name"));

    if (needsNamePatch) {
      const { error: nameErr } = await signUp.update({ firstName: fn, lastName: ln });
      if (nameErr) {
        const nameParamIssues = clerkErrList(nameErr).some((e) => {
          const pn = e.meta?.paramName;
          return pn === "first_name" || pn === "last_name";
        });
        const hint = nameParamIssues
          ? " Toggle on Name under Clerk Dashboard → User & authentication → Personal information."
          : "";
        setFormError(`${clerkErrMsg(nameErr) ?? "Could not save your name."}${hint}`);
        return false;
      }
    }

    if (miss.includes("username")) {
      const combined = `${fn} ${ln}`.trim();
      const u = username.trim() || (combined ? usernameFromFullName(combined) : "");
      if (!u) {
        setFormError("Username is required.");
        return false;
      }
      setUsername((prev) => prev.trim() || u);
      const { error: userErr } = await signUp.update({ username: u });
      if (userErr) {
        setFormError(clerkErrMsg(userErr) ?? "Could not save username.");
        return false;
      }
    }

    setFormError(null);
    return true;
  }

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
    setStep(initialStep);
    setLegalAccepted(false);
    setOtherAccepted({});
    setFirstName("");
    setLastName("");
    setUsername("");
    setPhoneNumber("");
    setExtraStrings({});
    await signIn.reset();
  }

  async function sendVerificationForEmail(trimmedEmail: string) {
    // Discards an in-progress Clerk sign-in (e.g. user was on /signup code step then used "Sign in instead")
    // so this screen always runs a fresh identifier + email_code send.
    try {
      await signIn.reset();
    } catch {
      /* best-effort — still attempt create */
    }

    const { error: createError } = await signIn.create({
      identifier: trimmedEmail,
      signUpIfMissing: true,
    });
    if (createError) {
      if (clerkErrorMeansAlreadySignedIn(createError)) {
        redirectToApp();
        return false;
      }
      setFormError(clerkErrMsg(createError) ?? "Could not start sign-in.");
      return false;
    }

    const { error: sendError } = await signIn.emailCode.sendCode();
    if (sendError) {
      if (clerkErrorMeansAlreadySignedIn(sendError)) {
        redirectToApp();
        return false;
      }
      setFormError(clerkErrMsg(sendError) ?? "Could not send verification code.");
      return false;
    }

    return true;
  }

  async function handleIdentitySubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmedEmail = email.trim();
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!trimmedEmail || !fn || !ln || fetching) return;

    const ok = await sendVerificationForEmail(trimmedEmail.toLowerCase());
    if (!ok) return;

    setStep("code");
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || fetching) return;

    const ok = await sendVerificationForEmail(trimmed);
    if (!ok) return;

    setStep("code");
  }

  async function handleTransfer() {
    const fn = signupCollectsIdentity ? firstName.trim() : "";
    const ln = signupCollectsIdentity ? lastName.trim() : "";

    type SignUpCreateParams = Parameters<typeof signUp.create>[0];
    const payload = {
      transfer: true as const,
      ...(fn && ln ? { firstName: fn, lastName: ln } : {}),
    } as SignUpCreateParams;

    const { error } = await signUp.create(payload);
    if (error) {
      const nameParamIssues = clerkErrList(error).some((e) => {
        const pn = e.meta?.paramName;
        return pn === "first_name" || pn === "last_name";
      });
      const hint = nameParamIssues
        ? " Toggle on Name under Clerk Dashboard → User & authentication → Personal information."
        : "";
      setFormError(`${clerkErrMsg(error) ?? "Could not create account."}${hint}`);
      return;
    }

    const needsRequirements = signUp.status === "missing_requirements";

    if (signupCollectsIdentity) {
      const persisted = await persistSignupIdentityOnSignUpResource();
      if (!persisted) return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
      return;
    }

    if (needsRequirements) {
      applySignupProfileDraftFromIdentity();
      setStep("profile");
      return;
    }

    setFormError("Unexpected sign-up state. Try again.");
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!code.trim() || fetching) return;

    const { error } = await signIn.emailCode.verifyCode({ code: code.trim() });

    if (error) {
      if (clerkErrorMeansAlreadySignedIn(error)) {
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
    const missing = normalizeClerkMissingFieldIds(signUp.missingFields ?? []);
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

    const combinedForSlug = `${firstName.trim()} ${lastName.trim()}`.trim();
    const derivedUsername = combinedForSlug ? usernameFromFullName(combinedForSlug) : null;

    const resolvedFirst = firstName.trim();
    const resolvedLast = lastName.trim();
    if (missing.includes("first_name") && !resolvedFirst) {
      setFormError("First name is required.");
      return;
    }
    if (missing.includes("last_name") && !resolvedLast) {
      setFormError("Last name is required.");
      return;
    }
    if (resolvedFirst && resolvedLast) {
      patch.firstName = resolvedFirst;
      patch.lastName = resolvedLast;
    }
    if (missing.includes("username")) {
      const t = username.trim() || (derivedUsername ?? "");
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
      subtitle: "Sign in with your email — we’ll send a one-time code.",
    };
  }, [step, email]);

  const signInFields = signInErrors?.fields as unknown as FieldBag;
  const signUpFields = signUpErrors?.fields as unknown as FieldBag;

  const codeOnChange =
    chrome === "signup" ? (v: string) => setCode(v.replace(/\D/g, "").slice(0, 6)) : setCode;

  const footer = <LoginFooterLinks />;

  const signupIdentityHeader = (
    <div className="text-center mb-7">
      <h1 className="text-[28px] md:text-[32px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
        Get sized in.
      </h1>
      <p className="text-zinc-600 text-[14px] md:text-[15px] leading-relaxed max-w-xs mx-auto">
        First name, last name, and email — then we send a one-time code to your inbox. No password to remember.
      </p>
    </div>
  );

  const signupCodeHeader = (
    <div className="text-center mb-7">
      <h1 className="text-[26px] md:text-[30px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
        Check your inbox.
      </h1>
      <p className="text-zinc-600 text-[14px] leading-relaxed max-w-sm mx-auto">
        We sent a verification code to <span className="font-mono text-zinc-900">{email.trim()}</span>.
      </p>
    </div>
  );

  const signupProfileHeader = (
    <div className="text-center mb-7">
      <h1 className="text-[24px] md:text-[28px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
        Almost there
      </h1>
      <p className="text-zinc-600 text-[14px] leading-relaxed max-w-sm mx-auto">
        Finish what Clerk requires to activate your account.
      </p>
    </div>
  );

  if (chrome === "signup") {
    return (
      <SignupPageChrome footer={footer}>
        {step === "identity" ? (
          <>
            {signupIdentityHeader}
            <LoginIdentityStep
              firstName={firstName}
              onFirstNameChange={setFirstName}
              lastName={lastName}
              onLastNameChange={setLastName}
              email={email}
              onEmailChange={setEmail}
              fetching={fetching}
              formError={formError}
              signInFields={signInFields}
              onSubmit={handleIdentitySubmit}
            />
            <div className="flex items-center justify-center gap-2 mt-7 pt-6 border-t border-zinc-100 font-mono text-[11px] tracking-tight text-zinc-500 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse shrink-0" />
              Clerk will sign you in or create your account
            </div>
          </>
        ) : null}

        {step === "code" ? (
          <>
            {signupCodeHeader}
            <LoginCodeStep
              code={code}
              onCodeChange={codeOnChange}
              fetching={fetching}
              formError={formError}
              signInFields={signInFields}
              onResendCode={() =>
                signIn.emailCode.sendCode().then(({ error }) => {
                  if (error) {
                    if (clerkErrorMeansAlreadySignedIn(error)) redirectToApp();
                    else setFormError(clerkErrMsg(error) ?? "Resend failed");
                  } else setFormError(null);
                })}
              onSubmit={handleCodeSubmit}
              onStartOver={startOver}
            />
          </>
        ) : null}

        {step === "profile" ? (
          <>
            {signupProfileHeader}
            <LoginProfileStep
              missingFields={profileMissingFields}
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
          </>
        ) : null}
      </SignupPageChrome>
    );
  }

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
            onCodeChange={codeOnChange}
            fetching={fetching}
            formError={formError}
            signInFields={signInFields}
            onResendCode={() =>
              signIn.emailCode.sendCode().then(({ error }) => {
                if (error) {
                  if (clerkErrorMeansAlreadySignedIn(error)) redirectToApp();
                  else setFormError(clerkErrMsg(error) ?? "Resend failed");
                } else setFormError(null);
              })}
            onSubmit={handleCodeSubmit}
            onStartOver={startOver}
          />
        ) : null}

        {step === "profile" ? (
          <LoginProfileStep
            missingFields={profileMissingFields}
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

      {footer}
    </LoginPageLayout>
  );
}
