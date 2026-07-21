import type { PaymentWebhookEventEntity } from './payment-webhook-event.entity';

export type PaymentWebhookEventRow = {
  id: number;
  _id: string;

  provider: string;
  eventId: string;
  eventType: string | null;
  eventAction: string | null;
  canonicalStatus: string | null;

  gatewayTransactionId: string | null;
  gatewayPaymentIntentId: string | null;
  gatewayChargeId: string | null;
  gatewaySubscriptionId: string | null;
  gatewayInvoiceId: string | null;

  paymentTransactionId: string | null;
  checkoutSessionId: string | null;
  subscriptionId: string | null;
  subscriptionInvoiceId: string | null;
  externalReference: string | null;

  amount: number | null;
  currency: string | null;

  headers: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  normalizedPayload: Record<string, unknown> | null;
  processingResult: Record<string, unknown> | null;

  errorMessage: string | null;

  receivedAt: string | null;
  processedAt: string | null;

  metadata: Record<string, unknown> | null;
  config: Record<string, unknown> | null;
  changesHistory: Array<Record<string, unknown>> | null;

  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export interface IPaymentWebhookEventsRepository {
  create(entity: PaymentWebhookEventEntity): Promise<PaymentWebhookEventEntity>;

  updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<PaymentWebhookEventRow>;

  findByUniqueId(_id: string): Promise<PaymentWebhookEventRow | null>;

  findByProviderAndEventId(params: {
    provider: string;
    eventId: string;
  }): Promise<PaymentWebhookEventRow | null>;

  getAllByStatus(status: string): Promise<PaymentWebhookEventRow[]>;
}
