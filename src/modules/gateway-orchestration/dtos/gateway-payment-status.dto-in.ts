import type { PaymentTransactionRow } from '../../payment-transactions/entities/payment-transactions-repository.interface';

export type GatewayStatusApiCredentialData = {
  _id: string;
  slug: string;
  gatewayId: string | null;
  token: string | null;
  config: Record<string, unknown> | null;
  connectionData: Record<string, unknown> | null;
};

export class GatewayPaymentStatusDtoIn {
  public readonly gatewayProvider: string;
  public readonly gatewaySlug: string;
  public readonly paymentTransaction: PaymentTransactionRow;
  public readonly apiCredential: GatewayStatusApiCredentialData | null;
  public readonly config: {
    gatewayConfig?: Record<string, unknown> | null;
    transactionConfig?: Record<string, unknown> | null;
    apiCredentialConfig?: Record<string, unknown> | null;
  };

  constructor(params: {
    gatewayProvider: string;
    gatewaySlug: string;
    paymentTransaction: PaymentTransactionRow;
    apiCredential: GatewayStatusApiCredentialData | null;
    config?: {
      gatewayConfig?: Record<string, unknown> | null;
      transactionConfig?: Record<string, unknown> | null;
      apiCredentialConfig?: Record<string, unknown> | null;
    };
  }) {
    if (!params.gatewayProvider || params.gatewayProvider.trim() === '') {
      throw new Error('gatewayProvider is required');
    }

    if (!params.gatewaySlug || params.gatewaySlug.trim() === '') {
      throw new Error('gatewaySlug is required');
    }

    this.gatewayProvider = params.gatewayProvider.trim();
    this.gatewaySlug = params.gatewaySlug.trim();
    this.paymentTransaction = params.paymentTransaction;
    this.apiCredential = params.apiCredential;
    this.config = params.config ?? {};
  }
}
