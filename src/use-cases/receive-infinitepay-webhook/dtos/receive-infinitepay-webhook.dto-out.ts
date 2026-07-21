export class ReceiveInfinitePayWebhookDtoOut {
  constructor(
    public readonly paymentWebhookEvent: Record<string, unknown>,
    public readonly paymentTransaction: Record<string, unknown> | null,
    public readonly processingResult: Record<string, unknown>,
    public readonly wasAlreadyRegistered: boolean,
  ) {}
}
