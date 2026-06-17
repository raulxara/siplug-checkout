export class ReceivePagSeguroWebhookDtoIn {
  public readonly apiCredentialId: string;
  public readonly payload: Record<string, unknown>;
  public readonly rawBody: string;
  public readonly headers: Record<string, unknown>;
  public readonly xAuthenticityToken: string | null;

  constructor(params: {
    apiCredentialId?: unknown;
    payload?: unknown;
    rawBody?: unknown;
    headers?: unknown;
    xAuthenticityToken?: unknown;
  }) {
    this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
    this.payload = this.toObject(params.payload, 'payload');
    this.rawBody = String(params.rawBody ?? '').trim();
    this.headers = this.toObject(params.headers, 'headers');
    this.xAuthenticityToken = this.toNullableString(params.xAuthenticityToken);

    if (this.apiCredentialId === '') {
      throw new Error('apiCredentialId is required');
    }

    if (this.rawBody === '') {
      throw new Error('rawBody is required for PagSeguro webhook validation');
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
