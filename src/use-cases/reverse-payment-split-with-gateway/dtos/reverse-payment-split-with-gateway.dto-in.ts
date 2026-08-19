export class ReversePaymentSplitWithGatewayDtoIn {
  public readonly token: string | null;
  public readonly paymentSplitId: string;
  public readonly reversalAmount: number | null;
  public readonly reason: string | null;
  public readonly idempotencyKey: string | null;
  public readonly force: boolean;

  constructor(params: {
    token?: string | null;
    paymentSplitId: string;
    reversalAmount?: number | null;
    reason?: string | null;
    idempotencyKey?: string | null;
    force?: boolean | null;
  }) {
    this.token = this.normalizeNullableString(params.token);
    this.paymentSplitId = this.normalizeRequiredString(
      params.paymentSplitId,
      'paymentSplitId',
    );

    this.reversalAmount =
      params.reversalAmount === undefined || params.reversalAmount === null
        ? null
        : Number(params.reversalAmount);

    this.reason = this.normalizeNullableString(params.reason);
    this.idempotencyKey = this.normalizeNullableString(params.idempotencyKey);
    this.force = params.force === true;

    if (
      this.reversalAmount !== null &&
      (!Number.isInteger(this.reversalAmount) || this.reversalAmount <= 0)
    ) {
      throw new Error('reversalAmount must be an integer greater than zero');
    }
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
