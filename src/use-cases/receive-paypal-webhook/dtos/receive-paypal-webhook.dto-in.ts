export class ReceivePayPalWebhookDtoIn {
  public readonly apiCredentialId: string;
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;

  constructor(params: {
    apiCredentialId?: unknown;
    payload?: unknown;
    headers?: unknown;
  }) {
    this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
    this.payload = this.toObject(params.payload, 'payload');
    this.headers = this.toObject(params.headers, 'headers');

    if (this.apiCredentialId === '') {
      throw new Error('apiCredentialId is required');
    }
  }

  private toObject(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }
}
