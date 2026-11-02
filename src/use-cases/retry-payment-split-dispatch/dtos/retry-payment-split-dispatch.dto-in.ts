export class RetryPaymentSplitDispatchDtoIn {
  public readonly token: string | null;
  public readonly paymentSplitId: string;
  public readonly sourceTransactionId: string | null;
  public readonly reason: string | null;

  constructor(params: {
    token?: string | null;
    paymentSplitId: string;
    sourceTransactionId?: string | null;
    reason?: string | null;
  }) {
    this.token = this.normalizeNullableString(params.token);
    this.paymentSplitId = this.normalizeRequiredString(
      params.paymentSplitId,
      'paymentSplitId',
    );
    this.sourceTransactionId = this.normalizeNullableString(
      params.sourceTransactionId,
    );
    this.reason = this.normalizeNullableString(params.reason);
  }

  private normalizeRequiredString(value: unknown, field: string): string {
    if (value === undefined || value === null) {
      throw new Error(`${field} is required`);
    }

    const normalized = String(value).trim();

    if (normalized === '') {
      throw new Error(`${field} is required`);
    }

    return normalized;
  }

  private normalizeNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = String(value).trim();

    return normalized === '' ? null : normalized;
  }
}
