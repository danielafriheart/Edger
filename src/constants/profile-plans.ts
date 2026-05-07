import type { PlanId } from '../lib/edger-billing-local';

export const PLAN_LABEL: Record<PlanId, string> = {
  free: 'Free',
  payg: 'Pay as you go',
  pro_monthly: 'Pro Monthly',
  pro_annual: 'Pro Annual',
};

export const PLAN_DESCRIPTION: Record<PlanId, string> = {
  free: '5 AI analyses per month, no card on file.',
  payg: 'Pre-paid credits — $0.20 per AI analysis.',
  pro_monthly: 'Unlimited AI · billed $19/month.',
  pro_annual: 'Unlimited AI · billed $190/year (2 months free).',
};
