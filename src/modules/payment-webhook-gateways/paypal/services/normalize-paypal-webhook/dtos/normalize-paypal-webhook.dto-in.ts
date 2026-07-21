export class NormalizePayPalWebhookDtoIn {
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;

  constructor(params: {
    payload?: unknown;
    headers?: unknown;
  }) {
    this.payload = this.toObject(params.payload, 'payload');
    this.headers = this.toObject(params.headers, 'headers');
  }

  private toObject(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }
}
