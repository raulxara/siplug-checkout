export class RegisterSplitRuleDtoIn {
  public readonly token: string;

  public readonly officeId: string;
  public readonly clientId: string;
  public readonly gatewayId: string | null;

  public readonly name: string;
  public readonly slug: string;
  public readonly description: string | null;
  public readonly splitType: string;
  public readonly calculationBase: string;
  public readonly priority: number;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string;

  constructor(params: {
    token?: unknown;

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

    this.officeId = String(params.officeId ?? '').trim();
    this.clientId = String(params.clientId ?? '').trim();
    this.gatewayId = this.toNullableString(params.gatewayId);

    this.name = String(params.name ?? '').trim();
    this.slug = String(params.slug ?? '').trim();
    this.description = this.toNullableString(params.description);
    this.splitType = this.toNullableString(params.splitType) ?? 'percentage';
    this.calculationBase =
      this.toNullableString(params.calculationBase) ?? 'gross_amount';
    this.priority = this.toNumber(params.priority, 0);

    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);

    this.status = this.toNullableString(params.status) ?? 'active';

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.officeId === '') {
      throw new Error('officeId is required');
    }

    if (this.clientId === '') {
      throw new Error('clientId is required');
    }

    if (this.name === '') {
      throw new Error('name is required');
    }

    if (this.slug === '') {
      throw new Error('slug is required');
    }
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNumber(value: unknown, fallback: number): number {
    if (value === undefined || value === null || value === '') {
      return fallback;
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