export type PaymentWebhookProvider =
  | 'stripe'
  | 'mercado_pago'
  | 'pagseguro'
  | 'paypal'
  | 'picpay'
  | 'infinitepay'
  | 'infinity_pay';

export type PaymentWebhookCanonicalStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'expired'
  | 'refunded'
  | 'chargeback'
  | 'subscription_active'
  | 'subscription_canceled'
  | 'invoice_paid'
  | 'invoice_payment_failed'
  | 'ignored';

export class NormalizedPaymentWebhookEventDto {
  public readonly provider: PaymentWebhookProvider;

  public readonly eventId: string;
  public readonly eventType: string | null;
  public readonly eventAction: string | null;
  public readonly canonicalStatus: PaymentWebhookCanonicalStatus;

  public readonly gatewayTransactionId: string | null;
  public readonly gatewayPaymentIntentId: string | null;
  public readonly gatewayChargeId: string | null;
  public readonly gatewaySubscriptionId: string | null;
  public readonly gatewayInvoiceId: string | null;

  public readonly paymentTransactionId: string | null;
  public readonly checkoutSessionId: string | null;
  public readonly subscriptionId: string | null;
  public readonly subscriptionInvoiceId: string | null;
  public readonly externalReference: string | null;

  public readonly amount: number | null;
  public readonly currency: string | null;

  public readonly rawPayload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;

  constructor(params: {
    provider?: unknown;

    eventId?: unknown;
    eventType?: unknown;
    eventAction?: unknown;
    canonicalStatus?: unknown;

    gatewayTransactionId?: unknown;
    gatewayPaymentIntentId?: unknown;
    gatewayChargeId?: unknown;
    gatewaySubscriptionId?: unknown;
    gatewayInvoiceId?: unknown;

    paymentTransactionId?: unknown;
    checkoutSessionId?: unknown;
    subscriptionId?: unknown;
    subscriptionInvoiceId?: unknown;
    externalReference?: unknown;

    amount?: unknown;
    currency?: unknown;

    rawPayload?: unknown;
    headers?: unknown;
  }) {
    this.provider = this.parseProvider(params.provider);

    this.eventId = String(params.eventId ?? '').trim();
    this.eventType = this.toNullableString(params.eventType);
    this.eventAction = this.toNullableString(params.eventAction);
    this.canonicalStatus = this.parseCanonicalStatus(params.canonicalStatus);

    this.gatewayTransactionId = this.toNullableString(
      params.gatewayTransactionId,
    );
    this.gatewayPaymentIntentId = this.toNullableString(
      params.gatewayPaymentIntentId,
    );
    this.gatewayChargeId = this.toNullableString(params.gatewayChargeId);
    this.gatewaySubscriptionId = this.toNullableString(
      params.gatewaySubscriptionId,
    );
    this.gatewayInvoiceId = this.toNullableString(params.gatewayInvoiceId);

    this.paymentTransactionId = this.toNullableString(
      params.paymentTransactionId,
    );
    this.checkoutSessionId = this.toNullableString(params.checkoutSessionId);
    this.subscriptionId = this.toNullableString(params.subscriptionId);
    this.subscriptionInvoiceId = this.toNullableString(
      params.subscriptionInvoiceId,
    );
    this.externalReference = this.toNullableString(params.externalReference);

    this.amount = this.toNullableNumber(params.amount);
    this.currency = this.toNullableString(params.currency);

    this.rawPayload = this.toObject(params.rawPayload);
    this.headers = this.toObject(params.headers);

    if (this.eventId === '') {
      throw new Error('eventId is required');
    }
  }

  private parseProvider(value: unknown): PaymentWebhookProvider {
    const provider = String(value ?? '').trim();

    const allowedProviders: PaymentWebhookProvider[] = [
      'stripe',
      'mercado_pago',
      'pagseguro',
      'paypal',
      'picpay',
      'infinitepay',
      'infinity_pay',
    ];

    if (!allowedProviders.includes(provider as PaymentWebhookProvider)) {
      throw new Error(`invalid webhook provider: ${provider}`);
    }

    return provider as PaymentWebhookProvider;
  }

  private parseCanonicalStatus(
    value: unknown,
  ): PaymentWebhookCanonicalStatus {
    const canonicalStatus = String(value ?? '').trim();

    const allowedStatuses: PaymentWebhookCanonicalStatus[] = [
      'pending',
      'authorized',
      'paid',
      'failed',
      'canceled',
      'expired',
      'refunded',
      'chargeback',
      'subscription_active',
      'subscription_canceled',
      'invoice_paid',
      'invoice_payment_failed',
      'ignored',
    ];

    if (
      !allowedStatuses.includes(
        canonicalStatus as PaymentWebhookCanonicalStatus,
      )
    ) {
      throw new Error(`invalid webhook canonicalStatus: ${canonicalStatus}`);
    }

    return canonicalStatus as PaymentWebhookCanonicalStatus;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      throw new Error('amount must be a valid number');
    }

    return numberValue;
  }

  private toObject(value: unknown): Record<string, unknown> {
    if (value === undefined || value === null) {
      return {};
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('value must be an object');
    }

    return value as Record<string, unknown>;
  }
}
  