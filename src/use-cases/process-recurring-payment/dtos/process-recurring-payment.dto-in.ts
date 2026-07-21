export class ProcessRecurringPaymentDtoIn {
  public readonly token: string;

  public readonly checkoutSessionId: string;
  public readonly paymentMethod: string;

  public readonly gatewayProvider: string | null;
  public readonly gatewaySlug: string | null;
  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly payer: Record<string, unknown> | null;
  public readonly paymentData: Record<string, unknown> | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    token: string;

    checkoutSessionId: string;
    paymentMethod: string;

    gatewayProvider?: string | null;
    gatewaySlug?: string | null;
    gatewayId?: string | null;
    apiCredentialId?: string | null;

    payer?: Record<string, unknown> | null;
    paymentData?: Record<string, unknown> | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
  }) {
    if (!params.token || params.token.trim() === '') {
      throw new Error('token is required');
    }

    if (!params.checkoutSessionId || params.checkoutSessionId.trim() === '') {
      throw new Error('checkoutSessionId is required');
    }

    if (!params.paymentMethod || params.paymentMethod.trim() === '') {
      throw new Error('paymentMethod is required');
    }

    this.token = params.token.trim();

    this.checkoutSessionId = params.checkoutSessionId.trim();
    this.paymentMethod = params.paymentMethod.trim();

    this.gatewayProvider = this.normalizeNullableString(params.gatewayProvider);
    this.gatewaySlug = this.normalizeNullableString(params.gatewaySlug);
    this.gatewayId = this.normalizeNullableString(params.gatewayId);
    this.apiCredentialId = this.normalizeNullableString(params.apiCredentialId);

    this.payer = params.payer ?? null;
    this.paymentData = params.paymentData ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;
  }

  private normalizeNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
