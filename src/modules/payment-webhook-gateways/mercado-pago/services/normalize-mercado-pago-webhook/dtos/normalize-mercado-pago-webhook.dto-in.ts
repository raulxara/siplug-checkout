export class NormalizeMercadoPagoWebhookDtoIn {
  public readonly payload: Record<string, unknown>;
  public readonly payment: Record<string, unknown> | null;
  public readonly preapproval: Record<string, unknown> | null;
  public readonly headers: Record<string, unknown>;
  public readonly queryParams: Record<string, unknown>;

  constructor(params: {
    payload?: unknown;
    payment?: unknown;
    preapproval?: unknown;
    headers?: unknown;
    queryParams?: unknown;
  }) {
    this.payload = this.toObject(params.payload, 'payload');
    this.payment = this.toNullableObject(params.payment, 'payment');
    this.preapproval = this.toNullableObject(params.preapproval, 'preapproval');
    this.headers = this.toObject(params.headers, 'headers');
    this.queryParams = this.toObject(params.queryParams, 'queryParams');

    if (this.payment === null && this.preapproval === null) {
      throw new Error('payment or preapproval is required');
    }
  }

  private toObject(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }

  private toNullableObject(
    value: unknown,
    field: string,
  ): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }
}