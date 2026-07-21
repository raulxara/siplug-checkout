import type { IPaymentWebhookEventsRepository } from './payment-webhook-events-repository.interface';

export class PaymentWebhookEventEntity {
  public id: number | null = null;
  public _id: string | null = null;

  public provider: string;
  public eventId: string;
  public eventType: string | null;
  public eventAction: string | null;
  public canonicalStatus: string | null;

  public gatewayTransactionId: string | null;
  public gatewayPaymentIntentId: string | null;
  public gatewayChargeId: string | null;
  public gatewaySubscriptionId: string | null;
  public gatewayInvoiceId: string | null;

  public paymentTransactionId: string | null;
  public checkoutSessionId: string | null;
  public subscriptionId: string | null;
  public subscriptionInvoiceId: string | null;
  public externalReference: string | null;

  public amount: number | null;
  public currency: string | null;

  public headers: Record<string, unknown> | null;
  public payload: Record<string, unknown> | null;
  public normalizedPayload: Record<string, unknown> | null;
  public processingResult: Record<string, unknown> | null;

  public errorMessage: string | null;

  public receivedAt: string | null;
  public processedAt: string | null;

  public metadata: Record<string, unknown> | null;
  public config: Record<string, unknown> | null;
  public changesHistory: Array<Record<string, unknown>> | null;

  public status: string;
  public createdAt: string | null = null;
  public updatedAt: string | null = null;

  constructor(
    private readonly repository: IPaymentWebhookEventsRepository | null,
    params: {
      provider: string;
      eventId: string;
      eventType?: string | null;
      eventAction?: string | null;
      canonicalStatus?: string | null;

      gatewayTransactionId?: string | null;
      gatewayPaymentIntentId?: string | null;
      gatewayChargeId?: string | null;
      gatewaySubscriptionId?: string | null;
      gatewayInvoiceId?: string | null;

      paymentTransactionId?: string | null;
      checkoutSessionId?: string | null;
      subscriptionId?: string | null;
      subscriptionInvoiceId?: string | null;
      externalReference?: string | null;

      amount?: number | null;
      currency?: string | null;

      headers?: Record<string, unknown> | null;
      payload?: Record<string, unknown> | null;
      normalizedPayload?: Record<string, unknown> | null;
      processingResult?: Record<string, unknown> | null;

      errorMessage?: string | null;

      receivedAt?: string | null;
      processedAt?: string | null;

      metadata?: Record<string, unknown> | null;
      config?: Record<string, unknown> | null;
      changesHistory?: Array<Record<string, unknown>> | null;

      status?: string | null;
    },
  ) {
    this.provider = params.provider;
    this.eventId = params.eventId;
    this.eventType = params.eventType ?? null;
    this.eventAction = params.eventAction ?? null;
    this.canonicalStatus = params.canonicalStatus ?? null;

    this.gatewayTransactionId = params.gatewayTransactionId ?? null;
    this.gatewayPaymentIntentId = params.gatewayPaymentIntentId ?? null;
    this.gatewayChargeId = params.gatewayChargeId ?? null;
    this.gatewaySubscriptionId = params.gatewaySubscriptionId ?? null;
    this.gatewayInvoiceId = params.gatewayInvoiceId ?? null;

    this.paymentTransactionId = params.paymentTransactionId ?? null;
    this.checkoutSessionId = params.checkoutSessionId ?? null;
    this.subscriptionId = params.subscriptionId ?? null;
    this.subscriptionInvoiceId = params.subscriptionInvoiceId ?? null;
    this.externalReference = params.externalReference ?? null;

    this.amount = params.amount ?? null;
    this.currency = params.currency ?? null;

    this.headers = params.headers ?? null;
    this.payload = params.payload ?? null;
    this.normalizedPayload = params.normalizedPayload ?? null;
    this.processingResult = params.processingResult ?? null;

    this.errorMessage = params.errorMessage ?? null;

    this.receivedAt = params.receivedAt ?? null;
    this.processedAt = params.processedAt ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;
    this.changesHistory = params.changesHistory ?? null;

    this.status = params.status ?? 'received';
  }

  async create(): Promise<PaymentWebhookEventEntity> {
    if (!this.repository) {
      throw new Error('payment webhook events repository is required');
    }

    return this.repository.create(this);
  }
}
