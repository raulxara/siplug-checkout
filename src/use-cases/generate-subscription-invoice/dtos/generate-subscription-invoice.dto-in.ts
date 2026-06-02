export class GenerateSubscriptionInvoiceDtoIn {
  public readonly token: string;
  public readonly subscriptionId: string;
  public readonly scheduledAt: string | null;
  public readonly dueAt: string | null;
  public readonly force: boolean;

  constructor(params: {
    token: string;
    subscriptionId: string;
    scheduledAt?: string | null;
    dueAt?: string | null;
    force?: boolean | null;
  }) {
    if (!params.token || params.token.trim() === '') {
      throw new Error('token is required');
    }

    if (!params.subscriptionId || params.subscriptionId.trim() === '') {
      throw new Error('subscriptionId is required');
    }

    this.token = params.token.trim();
    this.subscriptionId = params.subscriptionId.trim();
    this.scheduledAt = this.normalizeNullableString(params.scheduledAt);
    this.dueAt = this.normalizeNullableString(params.dueAt);
    this.force = Boolean(params.force);
  }

  private normalizeNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}