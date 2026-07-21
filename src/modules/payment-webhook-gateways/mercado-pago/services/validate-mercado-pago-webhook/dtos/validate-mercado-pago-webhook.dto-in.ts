export class ValidateMercadoPagoWebhookDtoIn {
  public readonly xSignature: string;
  public readonly xRequestId: string;
  public readonly dataId: string | null;
  public readonly webhookSecret: string;

  constructor(params: {
    xSignature?: unknown;
    xRequestId?: unknown;
    dataId?: unknown;
    webhookSecret?: unknown;
  }) {
    this.xSignature = String(params.xSignature ?? '').trim();
    this.xRequestId = String(params.xRequestId ?? '').trim();
    this.dataId = this.toNullableString(params.dataId)?.toLowerCase() ?? null;
    this.webhookSecret = String(params.webhookSecret ?? '').trim();

    if (this.xSignature === '') {
      throw new Error('x-signature header is required');
    }

    if (this.xRequestId === '') {
      throw new Error('x-request-id header is required');
    }

    if (this.webhookSecret === '') {
      throw new Error('Mercado Pago webhookSecret is required');
    }
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
