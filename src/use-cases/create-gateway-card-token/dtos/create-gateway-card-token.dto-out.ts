export class CreateGatewayCardTokenDtoOut {
  constructor(
    public readonly provider: string,
    public readonly cardToken: string,
    public readonly publicKeyPrefix: string | null,
    public readonly firstSixDigits: string | null,
    public readonly lastFourDigits: string | null,
    public readonly expirationMonth: number | null,
    public readonly expirationYear: number | null,
    public readonly providerResponse: Record<string, unknown>,
    public readonly gatewayResponse: Record<string, unknown>,
  ) {}
}