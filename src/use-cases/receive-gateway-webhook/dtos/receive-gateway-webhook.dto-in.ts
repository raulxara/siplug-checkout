export class ReceiveGatewayWebhookDtoIn {
  public readonly provider: string;
  public readonly body: Record<string, unknown>;
  public readonly query: Record<string, unknown>;
  public readonly headers: Record<string, unknown>;

  constructor(params: {
    provider?: string;
    body?: Record<string, unknown>;
    query?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  }) {
    this.provider = params.provider ?? '';
    this.body = params.body ?? {};
    this.query = params.query ?? {};
    this.headers = params.headers ?? {};

    if (this.provider.trim() === '') {
      throw new Error('provider is required');
    }
  }
}
