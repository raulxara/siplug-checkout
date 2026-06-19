export class NormalizeInfinitePayWebhookDtoIn {
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;

  constructor(params: {
    payload?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  }) {
    if (
      !params.payload ||
      typeof params.payload !== 'object' ||
      Array.isArray(params.payload)
    ) {
      throw new Error('InfinitePay webhook payload is required');
    }

    this.payload = params.payload;
    this.headers = params.headers ?? {};
  }
}
