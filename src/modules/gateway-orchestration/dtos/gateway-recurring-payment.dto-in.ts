import type { PaymentTransactionRow } from '../../payment-transactions/entities/payment-transactions-repository.interface';
import type { SubscriptionInvoiceRow } from '../../subscription-invoices/entities/subscription-invoices-repository.interface';
import type { SubscriptionPlanRow } from '../../subscription-plans/entities/subscription-plans-repository.interface';
import type { SubscriptionRow } from '../../subscriptions/entities/subscriptions-repository.interface';

export type GatewayRecurringApiCredentialData = {
  _id: string;
  slug: string;
  gatewayId: string | null;
  token: string | null;
  config: Record<string, unknown> | null;
  connectionData: Record<string, unknown> | null;
};

export class GatewayRecurringPaymentDtoIn {
  public readonly gatewayProvider: string;
  public readonly gatewaySlug: string;

  public readonly subscriptionPlan: SubscriptionPlanRow;
  public readonly subscription: SubscriptionRow;
  public readonly subscriptionInvoice: SubscriptionInvoiceRow;
  public readonly paymentTransaction: PaymentTransactionRow;

  public readonly apiCredential: GatewayRecurringApiCredentialData;

  public readonly providerPayload: Record<string, unknown>;
  public readonly idempotencyKey: string | null;

  public readonly config: {
    gatewayConfig?: Record<string, unknown> | null;
    transactionConfig?: Record<string, unknown> | null;
    apiCredentialConfig?: Record<string, unknown> | null;
    subscriptionPlanConfig?: Record<string, unknown> | null;
    subscriptionConfig?: Record<string, unknown> | null;
    subscriptionInvoiceConfig?: Record<string, unknown> | null;
    checkoutSessionConfig?: Record<string, unknown> | null;
  };

  constructor(params: {
    gatewayProvider: string;
    gatewaySlug: string;

    subscriptionPlan: SubscriptionPlanRow;
    subscription: SubscriptionRow;
    subscriptionInvoice: SubscriptionInvoiceRow;
    paymentTransaction: PaymentTransactionRow;

    apiCredential: GatewayRecurringApiCredentialData;

    providerPayload: Record<string, unknown>;
    idempotencyKey: string | null;

    config?: {
      gatewayConfig?: Record<string, unknown> | null;
      transactionConfig?: Record<string, unknown> | null;
      apiCredentialConfig?: Record<string, unknown> | null;
      subscriptionPlanConfig?: Record<string, unknown> | null;
      subscriptionConfig?: Record<string, unknown> | null;
      subscriptionInvoiceConfig?: Record<string, unknown> | null;
      checkoutSessionConfig?: Record<string, unknown> | null;
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

    this.subscriptionPlan = params.subscriptionPlan;
    this.subscription = params.subscription;
    this.subscriptionInvoice = params.subscriptionInvoice;
    this.paymentTransaction = params.paymentTransaction;

    this.apiCredential = params.apiCredential;

    this.providerPayload = params.providerPayload;
    this.idempotencyKey = params.idempotencyKey;

    this.config = params.config ?? {};
  }
}
