import { clerkErrList } from '../../components/auth/clerkFormHelpers';

/** Clerk FAPI / SDK error `meta` codes that mean an active session already exists. */
const SESSION_LIKE_CODES = new Set(['session_exists', 'identifier_already_signed_in']);

export function clerkErrorMeansAlreadySignedIn(err: unknown): boolean {
  for (const e of clerkErrList(err)) {
    if (e.code && SESSION_LIKE_CODES.has(e.code)) return true;
    const hay = `${e.longMessage ?? ''} ${e.message ?? ''} ${e.code ?? ''}`.toLowerCase();
    if (hay.includes('already signed')) return true;
  }
  return false;
}
