export class RegisterPaymentWebhookEventDtoIn {
  public readonly provider: string;
  public readonly eventId: string;
  public readonly eventType: string | null;
  public readonly eventAction: string | null;
  public readonly canonicalStatus: string | null;

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

  public readonly headers: Record<string, unknown> | null;
  public readonly payload: Record<string, unknown> | null;
  public readonly normalizedPayload: Record<string, unknown> | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

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

    headers?: unknown;
    payload?: unknown;
    normalizedPayload?: unknown;

    metadata?: unknown;
    config?: unknown;
  }) {
    this.provider = String(params.provider ?? '').trim();
    this.eventId = String(params.eventId ?? '').trim();

    this.eventType = this.toNullableString(params.eventType);
    this.eventAction = this.toNullableString(params.eventAction);
    this.canonicalStatus = this.toNullableString(params.canonicalStatus);

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

    this.headers = this.toNullableObject(params.headers);
    this.payload = this.toNullableObject(params.payload);
    this.normalizedPayload = this.toNullableObject(params.normalizedPayload);

    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);

    if (this.provider === '') {
      throw new Error('provider is required');
    }

    if (this.eventId === '') {
      throw new Error('eventId is required');
    }
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

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('value must be an object');
    }

    return value as Record<string, unknown>;
  }
}
