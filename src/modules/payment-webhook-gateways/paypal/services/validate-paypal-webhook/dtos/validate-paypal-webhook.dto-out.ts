export class ValidatePayPalWebhookDtoOut {
  constructor(
    public readonly valid: boolean,
    public readonly skipped: boolean,
    public readonly reason: string | null,
    public readonly providerResponse: Record<string, unknown> | null,
  ) {}
}
