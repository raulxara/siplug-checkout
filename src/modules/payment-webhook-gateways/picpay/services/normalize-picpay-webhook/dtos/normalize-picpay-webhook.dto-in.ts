export class NormalizePicPayWebhookDtoIn {
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;
  public readonly eventTypeHeader: string | null;

  constructor(params: {
    payload?: unknown;
    headers?: unknown;
    eventTypeHeader?: unknown;
  }) {
    this.payload = this.toObject(params.payload, 'payload');
    this.headers = this.toObject(params.headers, 'headers');
    this.eventTypeHeader = this.toNullableString(params.eventTypeHeader);
  }

  private toObject(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
