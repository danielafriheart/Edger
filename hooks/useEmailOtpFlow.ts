'use client';

import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useCallback, useMemo, useState } from 'react';
import {
  clerkErrList,
  clerkErrMsg,
  normalizeClerkMissingFieldIds,
  type FieldBag,
} from '@/components/auth/clerkFormHelpers';
import { buildProfilePatch } from '@/lib/auth/buildProfilePatch';
import { clerkErrorMeansAlreadySignedIn } from '@/lib/auth/clerkAlreadySignedIn';
import { usernameFromFullName } from '@/lib/auth/fullNameDerived';
import { handleSignupTransfer } from '@/lib/auth/handleSignupTransfer';
import { sendVerificationForEmail } from '@/lib/auth/sendEmailVerification';

export type AuthEmailOtpChrome = 'login' | 'signup';
export type Step = 'identity' | 'email' | 'code' | 'profile';

function redirectTo(path: string) {
  window.location.replace(new URL(path, window.location.origin).href);
}

export function useEmailOtpFlow(args: { chrome: AuthEmailOtpChrome; prefilledEmail?: string }) {
  const { chrome, prefilledEmail } = args;
  const collectsIdentity = chrome === 'signup';

  const { signIn, errors: signInErrors, fetchStatus: signInFetch } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpFetch } = useSignUp();

  const initialStep: Step = collectsIdentity ? 'identity' : 'email';
  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState(() => prefilledEmail?.trim().toLowerCase() ?? '');
  const [code, setCode] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [otherAccepted, setOtherAccepted] = useState<Record<string, boolean>>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [extraStrings, setExtraStrings] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const fetching = collectsIdentity
    ? signInFetch === 'fetching' || signUpFetch === 'fetching'
    : signInFetch === 'fetching';

  const [prevPrefill, setPrevPrefill] = useState(prefilledEmail);
  if (prefilledEmail !== prevPrefill) {
    setPrevPrefill(prefilledEmail);
    if (prefilledEmail) setEmail(prefilledEmail.trim().toLowerCase());
  }

  const profileMissingFields = useMemo(
    () => normalizeClerkMissingFieldIds(signUp?.missingFields),
    [signUp?.missingFields],
  );

  const applyDraftUsername = useCallback(() => {
    const combined = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!combined) return;
    setUsername((prev) => prev.trim() || usernameFromFullName(combined));
  }, [firstName, lastName]);

  async function finalizeSignIn() {
    await signIn.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl('/app');
        if (url.startsWith('http')) window.location.href = url;
        else redirectTo('/app');
      },
    });
  }

  async function finalizeSignUp() {
    await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl('/app');
        if (url.startsWith('http')) window.location.href = url;
        else redirectTo('/app');
      },
    });
  }

  async function startOver() {
    setFormError(null);
    setCode('');
    setStep(initialStep);
    setLegalAccepted(false);
    setOtherAccepted({});
    setFirstName('');
    setLastName('');
    setUsername('');
    setPhoneNumber('');
    setExtraStrings({});
    try {
      await signIn.reset();
    } catch {
      /* ok */
    }
  }

  async function startVerification(targetEmail: string): Promise<boolean> {
    const result = await sendVerificationForEmail(signIn, targetEmail, {
      signUpIfMissing: collectsIdentity,
    });
    if (result.ok) return true;

    const nextMessage = result.error ?? 'Could not start sign-in.';
    const hasIdentifierFieldError = Boolean(
      (signInErrors?.fields as unknown as FieldBag)?.identifier?.message,
    );
    setFormError(hasIdentifierFieldError ? null : nextMessage);
    return false;
  }

  async function handleIdentitySubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !firstName.trim() || !lastName.trim() || fetching) return;
    if (await startVerification(trimmed)) setStep('code');
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || fetching) return;
    if (await startVerification(trimmed)) setStep('code');
  }

  async function performTransfer() {
    const out = await handleSignupTransfer({
      signUp,
      collectsIdentity,
      firstName,
      lastName,
      username,
      setUsername,
    });
    if (out.kind === 'error') return setFormError(out.error);
    if (out.kind === 'finalize') return finalizeSignUp();
    applyDraftUsername();
    setStep('profile');
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!code.trim() || fetching) return;

    const { error } = await signIn.emailCode.verifyCode({ code: code.trim() });
    if (error) {
      if (clerkErrorMeansAlreadySignedIn(error)) return finalizeSignIn();
      const transferCodes = clerkErrList(error).some((er) => er.code === 'sign_up_if_missing_transfer');
      if (transferCodes) return performTransfer();
      const nextMessage = clerkErrMsg(error) ?? 'Invalid or expired code.';
      const hasCodeFieldError = Boolean(
        (signInErrors?.fields as unknown as FieldBag)?.code?.message,
      );
      setFormError(hasCodeFieldError ? null : nextMessage);
      return;
    }

    if (signIn.status === 'complete') return finalizeSignIn();
    if (signIn.status === 'needs_second_factor') {
      return setFormError('Additional verification required (configure MFA handling).');
    }
    if (signIn.status === 'needs_client_trust') {
      return setFormError('Trust verification required — complete in Clerk Dashboard Client Trust docs.');
    }
    setFormError('Could not finish sign-in. Try again.');
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const result = buildProfilePatch(profileMissingFields, {
      firstName,
      lastName,
      username,
      phoneNumber,
      legalAccepted,
      otherAccepted,
      extraStrings,
    });
    if (!result.ok) return setFormError(result.error);

    const { error } = await signUp.update(result.patch as Parameters<typeof signUp.update>[0]);
    if (error) return setFormError(clerkErrMsg(error) ?? 'Could not update profile.');

    if (signUp.status === 'complete') return finalizeSignUp();
    if (signUp.status === 'missing_requirements') {
      setFormError(`Still missing: ${signUp.missingFields?.join(', ') ?? 'unknown'}`);
    }
  }

  async function resendCode() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setFormError('Enter the same email you used, then tap resend.');
      return;
    }
    setFormError(null);
    const result = await sendVerificationForEmail(signIn, trimmed, {
      signUpIfMissing: collectsIdentity,
    });
    if (result.ok) return setFormError(null);
    setFormError(result.error);
  }

  return {
    step,
    email,
    code,
    firstName,
    lastName,
    username,
    phoneNumber,
    legalAccepted,
    otherAccepted,
    extraStrings,
    formError,
    fetching,
    profileMissingFields,
    signInFields: signInErrors?.fields as unknown as FieldBag,
    signUpFields: signUpErrors?.fields as unknown as FieldBag,
    setEmail,
    setCode,
    setFirstName,
    setLastName,
    setUsername,
    setPhoneNumber,
    setLegalAccepted,
    setOtherAccepted,
    setExtraStrings,
    handleIdentitySubmit,
    handleEmailSubmit,
    handleCodeSubmit,
    handleProfileSubmit,
    resendCode,
    startOver,
  };
}
