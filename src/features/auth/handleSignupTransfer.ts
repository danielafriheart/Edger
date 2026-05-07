import { clerkErrList, clerkErrMsg } from '../../components/auth/clerkFormHelpers';
import { persistSignupIdentityOnSignUpResource } from './persistSignupIdentity';

type SignUpResource = Parameters<typeof persistSignupIdentityOnSignUpResource>[0]['signUp'] & {
  status?: string | null;
  create: (params: Record<string, unknown>) => Promise<{ error?: unknown }>;
  finalize: (opts: { navigate: (ctx: { decorateUrl: (path: string) => string }) => void | Promise<void> }) => Promise<unknown>;
};

export type TransferOutcome =
  | { kind: 'finalize' }
  | { kind: 'goto-profile' }
  | { kind: 'error'; error: string };

/**
 * Sign-up-if-missing transfer flow. Clerk expects firstName/lastName on the
 * `signUp.create({ transfer: true, ... })` call for custom flows, so we pass
 * them up-front and only PATCH what is still listed in `missingFields`.
 */
export async function handleSignupTransfer(args: {
  signUp: SignUpResource;
  collectsIdentity: boolean;
  firstName: string;
  lastName: string;
  username: string;
  setUsername: (next: string) => void;
}): Promise<TransferOutcome> {
  const { signUp, collectsIdentity, firstName, lastName, username, setUsername } = args;
  const fn = collectsIdentity ? firstName.trim() : '';
  const ln = collectsIdentity ? lastName.trim() : '';

  const payload: Record<string, unknown> = { transfer: true };
  if (fn && ln) {
    payload.firstName = fn;
    payload.lastName = ln;
  }

  const { error } = await signUp.create(payload);
  if (error) {
    const nameParamIssues = clerkErrList(error).some((e) => {
      const pn = e.meta?.paramName;
      return pn === 'first_name' || pn === 'last_name';
    });
    const hint = nameParamIssues
      ? ' Toggle on Name under Clerk Dashboard → User & authentication → Personal information.'
      : '';
    return { kind: 'error', error: `${clerkErrMsg(error) ?? 'Could not create account.'}${hint}` };
  }

  if (collectsIdentity) {
    const persisted = await persistSignupIdentityOnSignUpResource({
      signUp,
      firstName,
      lastName,
      username,
      setUsername,
    });
    if (!persisted.ok) return { kind: 'error', error: persisted.error };
  }

  if (signUp.status === 'complete') return { kind: 'finalize' };
  if (signUp.status === 'missing_requirements') return { kind: 'goto-profile' };

  return { kind: 'error', error: 'Unexpected sign-up state. Try again.' };
}
