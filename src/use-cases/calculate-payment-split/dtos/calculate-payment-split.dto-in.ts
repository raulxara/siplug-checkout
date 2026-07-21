export class CalculatePaymentSplitDtoIn {
  public readonly token: string;
  public readonly splitRuleId: string;
  public readonly grossAmount: number;
  public readonly gatewayFeeAmount: number | null;
  public readonly netAmount: number | null;
  public readonly currency: string;
  public readonly metadata: Record<string, unknown> | null;

  constructor(params: {
    token?: unknown;
    splitRuleId?: unknown;
    grossAmount?: unknown;
    gatewayFeeAmount?: unknown;
    netAmount?: unknown;
    currency?: unknown;
    metadata?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.splitRuleId = String(params.splitRuleId ?? '').trim();
    this.grossAmount = this.toRequiredInteger(params.grossAmount, 'grossAmount');
    this.gatewayFeeAmount = this.toNullableInteger(params.gatewayFeeAmount);
    this.netAmount = this.toNullableInteger(params.netAmount);
    this.currency = String(params.currency ?? 'BRL').trim().toUpperCase();
    this.metadata = this.toNullableObject(params.metadata);

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.splitRuleId === '') {
      throw new Error('splitRuleId is required');
    }

    if (this.currency === '') {
      throw new Error('currency is required');
    }
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
      throw new Error('metadata must be an object');
    }

    return value as Record<string, unknown>;
  }
}
