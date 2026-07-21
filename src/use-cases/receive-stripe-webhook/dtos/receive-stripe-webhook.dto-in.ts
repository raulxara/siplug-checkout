export class ReceiveStripeWebhookDtoIn {
  public readonly apiCredentialId: string;
  public readonly rawBody: string;
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;
  public readonly stripeSignature: string;

  constructor(params: {
    apiCredentialId?: unknown;
    rawBody?: unknown;
    payload?: unknown;
    headers?: unknown;
    stripeSignature?: unknown;
  }) {
    this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
    this.rawBody = String(params.rawBody ?? '');
    this.payload = this.toObject(params.payload, 'payload');
    this.headers = this.toObject(params.headers, 'headers');
    this.stripeSignature = String(params.stripeSignature ?? '').trim();

    if (this.apiCredentialId === '') {
      throw new Error('apiCredentialId is required');
    }

    if (this.rawBody === '') {
      throw new Error('rawBody is required');
    }

    if (this.stripeSignature === '') {
      throw new Error('stripeSignature is required');
    }
  }

  private toObject(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value as Record<string, unknown>;
  }
}
