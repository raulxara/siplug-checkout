export class UpdateSubscriptionInvoiceDtoIn {
  public readonly token: string;
  public readonly subscriptionInvoiceId: string;

  public readonly paymentTransactionId: string | null;
  public readonly gatewayInvoiceId: string | null;
  public readonly paidAt: string | null;
  public readonly dueAt: string | null;
  public readonly lastAttemptAt: string | null;
  public readonly attemptNumber: number | null;
  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;

  constructor(params: {
    token?: unknown;
    subscriptionInvoiceId?: unknown;

    paymentTransactionId?: unknown;
    gatewayInvoiceId?: unknown;
    paidAt?: unknown;
    dueAt?: unknown;
    lastAttemptAt?: unknown;
    attemptNumber?: unknown;
    metadata?: unknown;
    config?: unknown;
    status?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.subscriptionInvoiceId = String(
      params.subscriptionInvoiceId ?? '',
    ).trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.subscriptionInvoiceId === '') {
      throw new Error('subscriptionInvoiceId is required');
    }

    this.paymentTransactionId = this.toNullableString(
      params.paymentTransactionId,
    );

    this.gatewayInvoiceId = this.toNullableString(params.gatewayInvoiceId);
    this.paidAt = this.toNullableString(params.paidAt);
    this.dueAt = this.toNullableString(params.dueAt);
    this.lastAttemptAt = this.toNullableString(params.lastAttemptAt);
    this.attemptNumber = this.toNullableNumber(params.attemptNumber);
    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);
    this.status = this.toNullableString(params.status);
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

    if (!Number.isFinite(numberValue)) {
      throw new Error(`invalid number value: ${String(value)}`);
    }

    return numberValue;
  }

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('metadata/config must be an object');
    }

    return value as Record<string, unknown>;
  }
}
