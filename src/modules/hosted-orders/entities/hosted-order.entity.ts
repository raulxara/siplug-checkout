export type HostedOrderResult = {
  checkoutSessionId: string;
  transactionId: string | null;
  subscriptionId: string | null;
  status: string;
  amount: number;
  currency: string;
  checkoutUrl: string | null;
  paidAt: string | null;
  validUntil: string | null;
  subscriptionStatus: string | null;
  renewalId: string | null;
};
