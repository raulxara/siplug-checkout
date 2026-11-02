export class CreateStripeTransferReversalDtoIn {
  public readonly providerToken: string;
  public readonly transferId: string;
  public readonly amount: number;
  public readonly currency: string;
  public readonly idempotencyKey: string;
  public readonly metadata: Record<string, unknown>;

  constructor(params: {
    providerToken: string;
    transferId: string;
    amount: number;
    currency: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown> | null;
  }) {
    this.providerToken = this.normalizeRequiredString(
      params.providerToken,
      'providerToken',
    );

    this.transferId = this.normalizeRequiredString(
      params.transferId,
      'transferId',
    );

    this.amount = Number(params.amount);
    this.currency = this.normalizeRequiredString(params.currency, 'currency');
    this.idempotencyKey = this.normalizeRequiredString(
      params.idempotencyKey,
      'idempotencyKey',
    );

    this.metadata = params.metadata ?? {};

    if (!this.providerToken.startsWith('sk_')) {
      throw new Error('Stripe provider token must start with sk_');
    }

    if (!this.transferId.startsWith('tr_')) {
      throw new Error('Stripe transferId must start with tr_');
    }

    if (!Number.isInteger(this.amount) || this.amount <= 0) {
      throw new Error('amount must be an integer greater than zero');
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
}