export class UpdateSplitRuleDtoIn {
  public readonly token: string;
  public readonly splitRuleId: string;

  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly gatewayId: string | null;

  public readonly name: string | null;
  public readonly slug: string | null;
  public readonly description: string | null;
  public readonly splitType: string | null;
  public readonly calculationBase: string | null;
  public readonly priority: number | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string | null;

  constructor(params: {
    token?: unknown;
    splitRuleId?: unknown;

    officeId?: unknown;
    clientId?: unknown;
    gatewayId?: unknown;

    name?: unknown;
    slug?: unknown;
    description?: unknown;
    splitType?: unknown;
    calculationBase?: unknown;
    priority?: unknown;

    metadata?: unknown;
    config?: unknown;

    status?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.splitRuleId = String(params.splitRuleId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.splitRuleId === '') {
      throw new Error('splitRuleId is required');
    }

    this.officeId = this.toNullableString(params.officeId);
    this.clientId = this.toNullableString(params.clientId);
    this.gatewayId = this.toNullableString(params.gatewayId);

    this.name = this.toNullableString(params.name);
    this.slug = this.toNullableString(params.slug);
    this.description = this.toNullableString(params.description);
    this.splitType = this.toNullableString(params.splitType);
    this.calculationBase = this.toNullableString(params.calculationBase);
    this.priority = this.toNullableNumber(params.priority);

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
      throw new Error('value must be an object');
    }

    return value as Record<string, unknown>;
  }
}
