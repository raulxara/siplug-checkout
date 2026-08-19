export type RetryPaymentSplitDispatchRequest = {
  token?: string | null;
  paymentSplitId: string;
  sourceTransactionId?: string | null;
  reason?: string | null;
};
