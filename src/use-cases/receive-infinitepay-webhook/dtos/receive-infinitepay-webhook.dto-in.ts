export class ReceiveInfinitePayWebhookDtoIn {
  public readonly apiCredentialId: string | null;
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;

  constructor(params: {
    apiCredentialId?: unknown;
    payload?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  }) {
    const apiCredentialId = String(params.apiCredentialId ?? '').trim();

    this.apiCredentialId = apiCredentialId === '' ? null : apiCredentialId;

    if (
      !params.payload ||
      typeof params.payload !== 'object' ||
      Array.isArray(params.payload)
    ) {
      throw new Error('payload is required');
    }

    this.payload = params.payload;
    this.headers = params.headers ?? {};
  }
}
