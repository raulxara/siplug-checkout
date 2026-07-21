export class CapturePayPalOrderReturnDtoIn {
  public readonly apiCredentialId: string;
  public readonly orderId: string;

  constructor(params: {
    apiCredentialId?: unknown;
    orderId?: unknown;
  }) {
    this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
    this.orderId = String(params.orderId ?? '').trim();

    if (this.apiCredentialId === '') {
      throw new Error('apiCredentialId is required');
    }

    if (this.orderId === '') {
      throw new Error('PayPal orderId is required');
    }
  }
}
