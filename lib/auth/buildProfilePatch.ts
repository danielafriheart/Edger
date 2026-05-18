import {
  HANDLED_MISSING_KEYS,
  clerkMissingFieldToParamKey,
  humanizeMissingField,
} from '../../components/auth/clerkFormHelpers';
import { usernameFromFullName } from './fullNameDerived';

export type ProfileFormState = {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  legalAccepted: boolean;
  otherAccepted: Record<string, boolean>;
  extraStrings: Record<string, string>;
};

export type ProfilePatchResult =
  | { ok: true; patch: Record<string, unknown> }
  | { ok: false; error: string };

/**
 * Translate the user-visible profile form state into a Clerk `signUp.update`
 * patch body. Returns the first validation error so the UI can surface it
 * without duplicating the field-by-field guard logic.
 */
export function buildProfilePatch(
  missingFields: string[],
  form: ProfileFormState,
): ProfilePatchResult {
  const patch: Record<string, unknown> = {};

  if (missingFields.includes('password')) {
    return {
      ok: false,
      error:
        'Your Clerk application still requires a password for new accounts. Disable password strategy for this passwordless flow, or enable password capture in code.',
    };
  }

  if (missingFields.includes('legal_accepted')) {
    if (!form.legalAccepted) return { ok: false, error: 'Please accept the terms to continue.' };
    patch.legalAccepted = true;
  }

  for (const id of missingFields) {
    if (id === 'legal_accepted') continue;
    if (!id.endsWith('_accepted')) continue;
    if (form.otherAccepted[id] !== true) {
      return { ok: false, error: `Please confirm: ${humanizeMissingField(id)}.` };
    }
    patch[clerkMissingFieldToParamKey(id)] = true;
  }

  const fn = form.firstName.trim();
  const ln = form.lastName.trim();
  if (missingFields.includes('first_name') && !fn) return { ok: false, error: 'First name is required.' };
  if (missingFields.includes('last_name') && !ln) return { ok: false, error: 'Last name is required.' };
  if (fn && ln) {
    patch.firstName = fn;
    patch.lastName = ln;
  }

  if (missingFields.includes('username')) {
    const combined = `${fn} ${ln}`.trim();
    const u = form.username.trim() || (combined ? usernameFromFullName(combined) : '');
    if (!u) return { ok: false, error: 'Username is required.' };
    patch.username = u;
  }

  if (missingFields.includes('phone_number')) {
    const t = form.phoneNumber.trim();
    if (!t) {
      return {
        ok: false,
        error: 'Phone number is required (E.164 format recommended, e.g. +15551234567).',
      };
    }
    patch.phoneNumber = t;
  }

  for (const field of missingFields) {
    if (HANDLED_MISSING_KEYS.has(field)) continue;
    if (field.endsWith('_accepted')) continue;
    if (field === 'password') continue;
    const py = clerkMissingFieldToParamKey(field);
    const raw = form.extraStrings[field]?.trim() ?? '';
    if (!raw) return { ok: false, error: `${humanizeMissingField(field)} is required.` };
    patch[py] = raw;
  }

  return { ok: true, patch };
}
