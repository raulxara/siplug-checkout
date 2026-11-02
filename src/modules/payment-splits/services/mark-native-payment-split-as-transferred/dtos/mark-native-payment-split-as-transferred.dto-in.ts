export class MarkNativePaymentSplitAsTransferredDtoIn {
  public readonly paymentSplitId: string;
  public readonly paymentTransactionId: string;
  public readonly paymentWebhookEventId: string | null;

  public readonly provider: string;
  public readonly settlementMode: string;

  public readonly sourceTransactionId: string | null;
  public readonly eventId: string | null;
  public readonly eventType: string | null;
  public readonly eventAction: string | null;
  public readonly canonicalStatus: string | null;

  public readonly rawPayload: Record<string, unknown> | null;
  public readonly source: string;

  constructor(params: {
    paymentSplitId?: unknown;
    paymentTransactionId?: unknown;
    paymentWebhookEventId?: unknown;

    provider?: unknown;
    settlementMode?: unknown;

    sourceTransactionId?: unknown;
    eventId?: unknown;
    eventType?: unknown;
    eventAction?: unknown;
    canonicalStatus?: unknown;

    rawPayload?: unknown;
    source?: unknown;
  }) {
    this.paymentSplitId = this.requiredString(
      params.paymentSplitId,
      'paymentSplitId',
    );

    this.paymentTransactionId = this.requiredString(
      params.paymentTransactionId,
      'paymentTransactionId',
    );

    this.paymentWebhookEventId = this.toNullableString(
      params.paymentWebhookEventId,
    );

    this.provider = this.requiredString(params.provider, 'provider');

    this.settlementMode =
      this.toNullableString(params.settlementMode) ?? 'native_split';

    this.sourceTransactionId = this.toNullableString(
      params.sourceTransactionId,
    );

    this.eventId = this.toNullableString(params.eventId);
    this.eventType = this.toNullableString(params.eventType);
    this.eventAction = this.toNullableString(params.eventAction);
    this.canonicalStatus = this.toNullableString(params.canonicalStatus);

    this.rawPayload = this.toNullableObject(params.rawPayload);

    this.source =
      this.toNullableString(params.source) ??
      'MarkNativePaymentSplitAsTransferredService';
  }

  private requiredString(value: unknown, field: string): string {
    const stringValue = this.toNullableString(value);

    if (stringValue === null) {
      throw new Error(`${field} is required`);
    }

    return stringValue;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('rawPayload must be an object');
    }

    return value as Record<string, unknown>;
  }
}