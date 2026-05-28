import type { PaymentTransactionRow } from '../../payment-transactions/entities/payment-transactions-repository.interface';

export type GatewayApiCredentialData = {
  _id: string | null;
  slug: string | null;
  gatewayId: string | null;
  token: string | null;
  config: Record<string, unknown> | null;
  connectionData: Record<string, unknown> | null;
};

export class GatewayPaymentDtoIn {
  public readonly gatewayProvider: string;
  public readonly gatewaySlug: string;
  public readonly paymentTransaction: PaymentTransactionRow;
  public readonly apiCredential: GatewayApiCredentialData | null;
  public readonly providerPayload: Record<string, unknown> | null;
  public readonly idempotencyKey: string | null;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    gatewayProvider: string;
    gatewaySlug: string;
    paymentTransaction: PaymentTransactionRow;
    apiCredential?: GatewayApiCredentialData | null;
    providerPayload?: Record<string, unknown> | null;
    idempotencyKey?: string | null;
    config?: Record<string, unknown> | null;
  }) {
    this.gatewayProvider = params.gatewayProvider;
    this.gatewaySlug = params.gatewaySlug;
    this.paymentTransaction = params.paymentTransaction;
    this.apiCredential = params.apiCredential ?? null;
    this.providerPayload = params.providerPayload ?? null;
    this.idempotencyKey = params.idempotencyKey ?? null;
    this.config = params.config ?? null;

    if (this.gatewayProvider.trim() === '') {
      throw new Error('gatewayProvider is required');
    }

    if (this.gatewaySlug.trim() === '') {
      throw new Error('gatewaySlug is required');
    }

    if (
      !this.paymentTransaction._id ||
      this.paymentTransaction._id.trim() === ''
    ) {
      throw new Error('paymentTransaction._id is required');
    }
  }
}
