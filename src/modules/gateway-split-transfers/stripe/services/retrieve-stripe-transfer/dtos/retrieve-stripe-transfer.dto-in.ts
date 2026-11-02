export class RetrieveStripeTransferDtoIn {
  public readonly providerToken: string;
  public readonly transferId: string;

  constructor(params: { providerToken: string; transferId: string }) {
    this.providerToken = this.normalizeRequiredString(
      params.providerToken,
      'providerToken',
    );

    this.transferId = this.normalizeRequiredString(
      params.transferId,
      'transferId',
    );

    if (!this.providerToken.startsWith('sk_')) {
      throw new Error('Stripe provider token must start with sk_');
    }

    if (!this.transferId.startsWith('tr_')) {
      throw new Error('Stripe transferId must start with tr_');
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
