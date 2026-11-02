export class CreateStripeTransferReversalDtoOut {
  constructor(
    public readonly success: boolean,
    public readonly statusCode: number,
    public readonly reversal: Record<string, unknown> | null,
    public readonly providerRequest: Record<string, unknown>,
    public readonly providerResponse: Record<string, unknown>,
    public readonly errorMessage: string | null,
  ) {}
}