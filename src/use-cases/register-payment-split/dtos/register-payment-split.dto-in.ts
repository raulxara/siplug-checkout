export class RegisterPaymentSplitDtoIn {
  public readonly token: string;

  public readonly splitRuleId: string;
  public readonly checkoutSessionId: string | null;
  public readonly paymentTransactionId: string;
  public readonly subscriptionId: string | null;
  public readonly subscriptionInvoiceId: string | null;
  public readonly gatewayProvider: string;

  public readonly grossAmount: number;
  public readonly gatewayFeeAmount: number | null;
  public readonly netAmount: number | null;
  public readonly currency: string;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    token?: unknown;

    splitRuleId?: unknown;
    checkoutSessionId?: unknown;
    paymentTransactionId?: unknown;
    subscriptionId?: unknown;
    subscriptionInvoiceId?: unknown;
    gatewayProvider?: unknown;

    grossAmount?: unknown;
    gatewayFeeAmount?: unknown;
    netAmount?: unknown;
    currency?: unknown;

    metadata?: unknown;
    config?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();

    this.splitRuleId = String(params.splitRuleId ?? '').trim();
    this.checkoutSessionId = this.toNullableString(params.checkoutSessionId);
    this.paymentTransactionId = String(
      params.paymentTransactionId ?? '',
    ).trim();
    this.subscriptionId = this.toNullableString(params.subscriptionId);
    this.subscriptionInvoiceId = this.toNullableString(
      params.subscriptionInvoiceId,
    );
    this.gatewayProvider = String(params.gatewayProvider ?? '').trim();

    this.grossAmount = this.toRequiredInteger(params.grossAmount, 'grossAmount');
    this.gatewayFeeAmount = this.toNullableInteger(params.gatewayFeeAmount);
    this.netAmount = this.toNullableInteger(params.netAmount);
    this.currency = String(params.currency ?? 'BRL').trim().toUpperCase();

    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.splitRuleId === '') {
      throw new Error('splitRuleId is required');
    }

    if (this.paymentTransactionId === '') {
      throw new Error('paymentTransactionId is required');
    }

    if (this.gatewayProvider === '') {
      throw new Error('gatewayProvider is required');
    }

    if (this.currency === '') {
      throw new Error('currency is required');
    }
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toRequiredInteger(value: unknown, field: string): number {
    if (value === undefined || value === null || value === '') {
      throw new Error(`${field} is required`);
    }

    const numberValue = Number(value);

    if (!Number.isInteger(numberValue)) {
      throw new Error(`${field} must be an integer amount in cents`);
    }

    if (numberValue < 0) {
      throw new Error(`${field} cannot be negative`);
    }

    return numberValue;
  }

  private toNullableInteger(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isInteger(numberValue)) {
      throw new Error('amount must be an integer amount in cents');
    }

    if (numberValue < 0) {
      throw new Error('amount cannot be negative');
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
