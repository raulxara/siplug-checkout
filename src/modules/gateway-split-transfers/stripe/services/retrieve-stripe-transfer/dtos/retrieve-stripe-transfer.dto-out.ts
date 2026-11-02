export class RetrieveStripeTransferDtoOut {
  constructor(
    public readonly success: boolean,
    public readonly statusCode: number,
    public readonly transfer: Record<string, unknown> | null,
    public readonly providerResponse: Record<string, unknown>,
    public readonly errorMessage: string | null,
  ) {}
}