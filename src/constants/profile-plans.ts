import type { PlanId } from '../lib/edger-billing-local';

export const PLAN_LABEL: Record<PlanId, string> = {
  free: 'Free',
  payg: 'Pay as you go',
  pro_monthly: 'Pro Monthly',
  pro_annual: 'Pro Annual',
};

export const PLAN_DESCRIPTION: Record<PlanId, string> = {
  free: 'Full manual calculator · no card on file.',
  payg: 'Pre-paid credit balance — applies when metered features ship.',
  pro_monthly: 'Pro workflow extras · billed $19/month.',
  pro_annual: 'Pro workflow extras · billed $190/year (2 months free).',
};
