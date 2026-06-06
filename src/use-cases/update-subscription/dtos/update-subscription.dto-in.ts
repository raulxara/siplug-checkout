export class UpdateSubscriptionDtoIn {
  public readonly token: string;
  public readonly subscriptionId: string;

  public readonly gatewaySubscriptionId: string | null;
  public readonly currentCycle: number | null;
  public readonly nextBillingAt: string | null;
  public readonly startedAt: string | null;
  public readonly canceledAt: string | null;
  public readonly endedAt: string | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;

  constructor(params: {
    token?: unknown;
    subscriptionId?: unknown;

    gatewaySubscriptionId?: unknown;
    currentCycle?: unknown;
    nextBillingAt?: unknown;
    startedAt?: unknown;
    canceledAt?: unknown;
    endedAt?: unknown;

    metadata?: unknown;
    config?: unknown;
    status?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.subscriptionId = String(params.subscriptionId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.subscriptionId === '') {
      throw new Error('subscriptionId is required');
    }

    this.gatewaySubscriptionId = this.toNullableString(
      params.gatewaySubscriptionId,
    );

    this.currentCycle = this.toNullableNumber(params.currentCycle);
    this.nextBillingAt = this.toNullableString(params.nextBillingAt);
    this.startedAt = this.toNullableString(params.startedAt);
    this.canceledAt = this.toNullableString(params.canceledAt);
    this.endedAt = this.toNullableString(params.endedAt);

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
