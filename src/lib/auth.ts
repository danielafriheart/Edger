// =============================================================================
// Edger Auth — frontend-only stub
// -----------------------------------------------------------------------------
// We don't have a real backend yet. This module is the single seam where
// session state lives. When the backend is wired up, replace these functions
// with real fetches/cookies/JWT — every page already calls through here.
//
// Session shape (localStorage key: edger.session):
//   { name: string, email: string, plan: PlanId, credits: number, signedAt: number }
// =============================================================================

const SESSION_KEY = "edger.session";

export type PlanId = "free" | "payg" | "pro_monthly" | "pro_annual";

export interface Session {
  name: string;
  email: string;
  plan: PlanId;
  /** Credits remaining (only meaningful for PAYG users; for Free users this is the
   *  remaining-this-month quota; for Pro users it's null/uncapped). */
  credits: number;
  signedAt: number;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setSession(s: Session): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function isSignedIn(): boolean {
  return !!getSession();
}

/** Default session created right after a fresh signup. New users land on the
 *  Free plan with 5 monthly analyses. */
export function createFreshSession(name: string, email: string): Session {
  return {
    name,
    email,
    plan: "free",
    credits: 5,
    signedAt: Date.now(),
  };
}
