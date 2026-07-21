export class ReceiveGatewayWebhookDtoIn {
  public readonly gatewayProvider: string;
  public readonly payload: Record<string, unknown>;
  public readonly headers: Record<string, string | string[] | undefined>;
  public readonly rawBody: Buffer | null;

  constructor(params: {
    gatewayProvider?: unknown;
    payload?: Record<string, unknown> | null;
    headers?: Record<string, string | string[] | undefined> | null;
    rawBody?: Buffer | null;
  }) {
    this.gatewayProvider = String(params.gatewayProvider ?? '').trim();
    this.payload = params.payload ?? {};
    this.headers = params.headers ?? {};
    this.rawBody = params.rawBody ?? null;

    if (this.gatewayProvider === '') {
      throw new Error('gatewayProvider is required');
    }
  }
}
