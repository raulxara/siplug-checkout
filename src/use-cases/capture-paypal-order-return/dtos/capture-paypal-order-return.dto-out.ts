export class CapturePayPalOrderReturnDtoOut {
  constructor(
    public readonly paymentWebhookEvent: Record<string, unknown>,
    public readonly paymentTransaction: Record<string, unknown> | null,
    public readonly processingResult: Record<string, unknown>,
    public readonly providerResponse: Record<string, unknown> | null,
    public readonly wasAlreadyRegistered: boolean,
  ) {}
}
