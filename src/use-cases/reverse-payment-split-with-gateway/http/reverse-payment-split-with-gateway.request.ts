export type ReversePaymentSplitWithGatewayRequest = {
  token?: string | null;
  paymentSplitId: string;
  reversalAmount?: number | null;
  reason?: string | null;
  idempotencyKey?: string | null;
  force?: boolean | null;
};