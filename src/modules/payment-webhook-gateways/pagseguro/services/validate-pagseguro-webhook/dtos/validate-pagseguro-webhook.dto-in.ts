export type PagSeguroWebhookSignatureMode = 'required' | 'optional';

export class ValidatePagSeguroWebhookDtoIn {
  public readonly rawBody: string;
  public readonly token: string;
  public readonly xAuthenticityToken: string | null;
  public readonly signatureMode: PagSeguroWebhookSignatureMode;

  constructor(params: {
    rawBody?: unknown;
    token?: unknown;
    xAuthenticityToken?: unknown;
    signatureMode?: unknown;
  }) {
    this.rawBody = String(params.rawBody ?? '');
    this.token = String(params.token ?? '').trim();
    this.xAuthenticityToken = this.toNullableString(params.xAuthenticityToken);

    const mode = String(params.signatureMode ?? 'required').trim();

    this.signatureMode = mode === 'optional' ? 'optional' : 'required';

    if (this.rawBody === '') {
      throw new Error('rawBody is required');
    }

    if (this.token === '') {
      throw new Error('PagSeguro token is required');
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
