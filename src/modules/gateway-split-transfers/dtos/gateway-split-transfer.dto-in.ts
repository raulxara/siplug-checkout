export type GatewaySplitTransferRecipientDto = {
  paymentSplitRecipientId: string;
  splitRecipientId: string;
  destinationAccountId: string;
  amount: number;
  currency: string;
  role: string;
  metadata: Record<string, unknown> | null;
  config: Record<string, unknown> | null;
};

export class GatewaySplitTransferDtoIn {
  public readonly gatewayProvider: string;
  public readonly providerToken: string;

  public readonly paymentSplitId: string;
  public readonly paymentTransactionId: string;
  public readonly paymentWebhookEventId: string | null;

  public readonly sourceTransactionId: string;
  public readonly idempotencyKey: string;

  public readonly recipients: GatewaySplitTransferRecipientDto[];

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    gatewayProvider?: unknown;
    providerToken?: unknown;

    paymentSplitId?: unknown;
    paymentTransactionId?: unknown;
    paymentWebhookEventId?: unknown;

    sourceTransactionId?: unknown;
    idempotencyKey?: unknown;

    recipients?: GatewaySplitTransferRecipientDto[];

    metadata?: unknown;
    config?: unknown;
  }) {
    this.gatewayProvider = String(params.gatewayProvider ?? '').trim();
    this.providerToken = String(params.providerToken ?? '').trim();

    this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
    this.paymentTransactionId = String(
      params.paymentTransactionId ?? '',
    ).trim();

    this.paymentWebhookEventId = this.toNullableString(
      params.paymentWebhookEventId,
    );

    this.sourceTransactionId = String(
      params.sourceTransactionId ?? '',
    ).trim();

    this.idempotencyKey = String(params.idempotencyKey ?? '').trim();

    this.recipients = params.recipients ?? [];

    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);

    if (this.gatewayProvider === '') {
      throw new Error('gatewayProvider is required');
    }

    if (this.providerToken === '') {
      throw new Error('providerToken is required');
    }

    if (this.paymentSplitId === '') {
      throw new Error('paymentSplitId is required');
    }

    if (this.paymentTransactionId === '') {
      throw new Error('paymentTransactionId is required');
    }

    if (this.sourceTransactionId === '') {
      throw new Error('sourceTransactionId is required');
    }

    if (this.idempotencyKey === '') {
      throw new Error('idempotencyKey is required');
    }

    if (!Array.isArray(this.recipients) || this.recipients.length === 0) {
      throw new Error('recipients must have at least one item');
    }
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
      throw new Error('value must be an object');
    }

    return value as Record<string, unknown>;
  }
}
