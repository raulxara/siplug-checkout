export class GetMercadoPagoPaymentDtoOut {
  constructor(
    public readonly payment: Record<string, unknown>,
    public readonly providerResponse: Record<string, unknown>,
  ) {}
}
