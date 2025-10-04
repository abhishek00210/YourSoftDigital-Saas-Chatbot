// lib/config/plans.ts
export const PLAN_LIMITS = {
  "Free Plan": {
    maxChatbots: 1,
    maxMessages: 100,
    maxProducts: 10,
    canRemoveBranding: false,
  },
  "Basic Plan": {
    maxChatbots: 3,
    maxMessages: 1000,
    maxProducts: Infinity,
    canRemoveBranding: false,
  },
  "Pro Plan": {
    maxChatbots: Infinity,
    maxMessages: 10000,
    maxProducts: Infinity,
    canRemoveBranding: true,
  },
};

export type PlanName = keyof typeof PLAN_LIMITS;