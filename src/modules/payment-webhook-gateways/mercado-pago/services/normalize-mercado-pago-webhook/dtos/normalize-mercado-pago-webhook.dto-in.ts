export class NormalizeMercadoPagoWebhookDtoIn {
  public readonly payload: Record<string, unknown>;
  public readonly payment: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;
  public readonly queryParams: Record<string, unknown>;

  constructor(params: {
    payload?: unknown;
    payment?: unknown;
    headers?: unknown;
    queryParams?: unknown;
  }) {
    this.payload = this.toObject(params.payload, 'payload');
    this.payment = this.toObject(params.payment, 'payment');
    this.headers = this.toObject(params.headers, 'headers');
    this.queryParams = this.toObject(params.queryParams, 'queryParams');
  }

  private toObject(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }
}