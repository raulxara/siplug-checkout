export type ReconcilePaymentSplitWithGatewayRequest = {
  token?: string | null;
  paymentSplitId: string;
  persistResult?: boolean | null;
  reason?: string | null;
};
