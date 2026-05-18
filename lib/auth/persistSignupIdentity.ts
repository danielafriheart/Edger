import { clerkErrList, clerkErrMsg, normalizeClerkMissingFieldIds } from '../../components/auth/clerkFormHelpers';
import { usernameFromFullName } from './fullNameDerived';

type SignUpResource = {
  missingFields?: unknown;
  update: (patch: Record<string, unknown>) => Promise<{ error?: unknown }>;
};

export type PersistIdentityArgs = {
  signUp: SignUpResource;
  firstName: string;
  lastName: string;
  username: string;
  setUsername: (next: string) => void;
};

/**
 * Patch the active SignUp resource with the user's name + (derived) username
 * iff Clerk is still asking for those fields. Returns `{ ok: true }` only when
 * every required PATCH succeeded — caller must not finalize otherwise.
 */
export async function persistSignupIdentityOnSignUpResource({
  signUp,
  firstName,
  lastName,
  username,
  setUsername,
}: PersistIdentityArgs): Promise<{ ok: true } | { ok: false; error: string }> {
  const fn = firstName.trim();
  const ln = lastName.trim();
  const miss = normalizeClerkMissingFieldIds(signUp.missingFields);

  const needsNamePatch = fn && ln && (miss.includes('first_name') || miss.includes('last_name'));

  if (needsNamePatch) {
    const { error: nameErr } = await signUp.update({ firstName: fn, lastName: ln });
    if (nameErr) {
      const nameParamIssues = clerkErrList(nameErr).some((e) => {
        const pn = e.meta?.paramName;
        return pn === 'first_name' || pn === 'last_name';
      });
      const hint = nameParamIssues
        ? ' Toggle on Name under Clerk Dashboard → User & authentication → Personal information.'
        : '';
      return { ok: false, error: `${clerkErrMsg(nameErr) ?? 'Could not save your name.'}${hint}` };
    }
  }

  if (miss.includes('username')) {
    const combined = `${fn} ${ln}`.trim();
    const u = username.trim() || (combined ? usernameFromFullName(combined) : '');
    if (!u) return { ok: false, error: 'Username is required.' };

    setUsername(username.trim() || u);
    const { error: userErr } = await signUp.update({ username: u });
    if (userErr) {
      return { ok: false, error: clerkErrMsg(userErr) ?? 'Could not save username.' };
    }
  }

  return { ok: true };
}
