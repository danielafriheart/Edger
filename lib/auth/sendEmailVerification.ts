import { clerkErrMsg } from '../../components/auth/clerkFormHelpers';
import { clerkErrorMeansAlreadySignedIn } from './clerkAlreadySignedIn';

type SignInResource = {
  identifier?: string | null;
  status?: string | null;
  reset: () => Promise<unknown>;
  create: (params: { identifier: string; signUpIfMissing?: boolean }) => Promise<{ error?: unknown }>;
  emailCode: { sendCode: () => Promise<{ error?: unknown }> };
};

export type SendVerificationResult =
  | { ok: true }
  | { ok: false; error: string; alreadySignedInSession?: boolean };

/**
 * Start a sign-in attempt for `email` and email a one-time code. We avoid
 * `reset()` on every submit because that clears bot/CAPTCHA state — only
 * discard when the active attempt belongs to a different email or already
 * completed.
 *
 * Never call `emailCode.sendCode()` unless `create` succeeded — Clerk requires
 * an active sign-in (with identifier) or you get
 * "cannot be called without an emailAddress if an existing signIn does not exist".
 */
export async function sendVerificationForEmail(
  signIn: SignInResource,
  trimmedEmail: string,
  options: { signUpIfMissing: boolean },
): Promise<SendVerificationResult> {
  try {
    const current = signIn.identifier?.trim().toLowerCase() ?? '';
    const sameIdentifier = current === trimmedEmail;
    if (signIn.status === 'complete' || !sameIdentifier) {
      await signIn.reset();
    }
  } catch {
    /* best-effort — still attempt create */
  }

  const createParams: { identifier: string; signUpIfMissing?: boolean } = { identifier: trimmedEmail };
  if (options.signUpIfMissing) createParams.signUpIfMissing = true;

  const { error: createError } = await signIn.create(createParams);
  if (createError) {
    if (clerkErrorMeansAlreadySignedIn(createError)) {
      return {
        ok: false,
        error:
          'You’re already signed in. Open the app or sign out on this page to use a different account.',
        alreadySignedInSession: true,
      };
    }
    return { ok: false, error: clerkErrMsg(createError) ?? 'Could not start sign-in.' };
  }

  const { error: sendError } = await signIn.emailCode.sendCode();
  if (sendError) {
    if (clerkErrorMeansAlreadySignedIn(sendError)) {
      return {
        ok: false,
        error:
          'You’re already signed in. Open the app or sign out on this page to use a different account.',
        alreadySignedInSession: true,
      };
    }
    return { ok: false, error: clerkErrMsg(sendError) ?? 'Could not send verification code.' };
  }

  return { ok: true };
}
