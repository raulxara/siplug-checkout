export type PicPayWebhookAuthMode = 'required' | 'optional';

export class ValidatePicPayWebhookDtoIn {
  public readonly authorization: string | null;
  public readonly webhookToken: string | null;
  public readonly authMode: PicPayWebhookAuthMode;

  constructor(params: {
    authorization?: unknown;
    webhookToken?: unknown;
    authMode?: unknown;
  }) {
    this.authorization = this.toNullableString(params.authorization);
    this.webhookToken = this.toNullableString(params.webhookToken);

    const mode = String(params.authMode ?? 'required').trim();

    this.authMode = mode === 'optional' ? 'optional' : 'required';

    if (this.authMode === 'required' && this.webhookToken === null) {
      throw new Error('PicPay webhookToken is required when auth mode is required');
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
