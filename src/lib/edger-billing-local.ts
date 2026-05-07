/**
 * Device-local plan / credits for profile + billing UI until a real backend exists.
 * Not used for authentication (Clerk owns that).
 */

const STORAGE_KEY = "edger.billing.v1";

export type PlanId = "free" | "payg" | "pro_monthly" | "pro_annual";

export interface EdgerBillingSlice {
  plan: PlanId;
  credits: number;
}

const DEFAULT: EdgerBillingSlice = {
  plan: "free",
  credits: 5,
};

export function loadEdgerBilling(): EdgerBillingSlice {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<EdgerBillingSlice>;
    if (!parsed || typeof parsed !== "object") return DEFAULT;
    const plan =
      parsed.plan === "payg"
      || parsed.plan === "pro_monthly"
      || parsed.plan === "pro_annual"
      || parsed.plan === "free"
        ? parsed.plan
        : "free";
    const credits =
      typeof parsed.credits === "number" && Number.isFinite(parsed.credits) ? parsed.credits : DEFAULT.credits;
    return { plan, credits };
  } catch {
    return DEFAULT;
  }
}

export function saveEdgerBilling(next: EdgerBillingSlice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
