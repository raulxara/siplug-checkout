export class SimulateMercadoPagoPaymentWebhookDtoIn {
  public readonly apiCredentialId: string;
  public readonly paymentId: string;
  public readonly eventId: string;
  public readonly userId: number | null;

  constructor(params: {
    apiCredentialId?: unknown;
    paymentId?: unknown;
    eventId?: unknown;
    userId?: unknown;
  }) {
    this.apiCredentialId = this.requiredString(
      params.apiCredentialId,
      'apiCredentialId',
    );

    this.paymentId = this.requiredString(params.paymentId, 'paymentId');

    this.eventId =
      this.toNullableString(params.eventId) ??
      `dev-mercado-pago-payment-${this.paymentId}-${Date.now()}`;

    const userId = Number(params.userId);

    this.userId = Number.isFinite(userId) ? userId : null;
  }

  private requiredString(value: unknown, field: string): string {
    const stringValue = this.toNullableString(value);

    if (stringValue === null) {
      throw new Error(`${field} is required`);
    }

    return stringValue;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}