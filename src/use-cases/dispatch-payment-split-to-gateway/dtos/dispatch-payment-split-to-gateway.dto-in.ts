export class DispatchPaymentSplitToGatewayDtoIn {
  public readonly paymentSplitId: string;
  public readonly sourceTransactionId: string;

  public readonly paymentTransactionId: string;
  public readonly paymentWebhookEventId: string | null;

  public readonly provider: string;
  public readonly eventId: string | null;
  public readonly eventType: string | null;
  public readonly eventAction: string | null;
  public readonly canonicalStatus: string | null;

  constructor(params: {
    paymentSplitId?: unknown;
    sourceTransactionId?: unknown;

    paymentTransactionId?: unknown;
    paymentWebhookEventId?: unknown;

    provider?: unknown;
    eventId?: unknown;
    eventType?: unknown;
    eventAction?: unknown;
    canonicalStatus?: unknown;
  }) {
    this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
    this.sourceTransactionId = String(
      params.sourceTransactionId ?? '',
    ).trim();

    this.paymentTransactionId = String(
      params.paymentTransactionId ?? '',
    ).trim();

    this.paymentWebhookEventId = this.toNullableString(
      params.paymentWebhookEventId,
    );

    this.provider = String(params.provider ?? '').trim();
    this.eventId = this.toNullableString(params.eventId);
    this.eventType = this.toNullableString(params.eventType);
    this.eventAction = this.toNullableString(params.eventAction);
    this.canonicalStatus = this.toNullableString(params.canonicalStatus);

    if (this.paymentSplitId === '') {
      throw new Error('paymentSplitId is required');
    }

    if (this.sourceTransactionId === '') {
      throw new Error('sourceTransactionId is required');
    }

    if (this.paymentTransactionId === '') {
      throw new Error('paymentTransactionId is required');
    }

    if (this.provider === '') {
      throw new Error('provider is required');
    }
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
