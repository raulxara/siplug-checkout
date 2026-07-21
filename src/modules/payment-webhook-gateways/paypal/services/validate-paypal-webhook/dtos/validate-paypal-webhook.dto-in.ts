export class ValidatePayPalWebhookDtoIn {
  public readonly baseUrl: string;
  public readonly accessToken: string;
  public readonly webhookId: string | null;
  public readonly authMode: string;
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;

  constructor(params: {
    baseUrl?: unknown;
    accessToken?: unknown;
    webhookId?: unknown;
    authMode?: unknown;
    payload?: unknown;
    headers?: unknown;
  }) {
    this.baseUrl = String(params.baseUrl ?? '').trim().replace(/\/+$/, '');
    this.accessToken = String(params.accessToken ?? '').trim();
    this.webhookId = this.toNullableString(params.webhookId);
    this.authMode = String(params.authMode ?? 'required').trim().toLowerCase();
    this.payload = this.toObject(params.payload, 'payload');
    this.headers = this.toObject(params.headers, 'headers');

    if (this.baseUrl === '') {
      throw new Error('baseUrl is required');
    }

    if (this.accessToken === '') {
      throw new Error('accessToken is required');
    }

    if (!['required', 'optional'].includes(this.authMode)) {
      throw new Error('authMode must be required or optional');
    }
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
