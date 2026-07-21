export class ValidateMercadoPagoWebhookDtoOut {
  constructor(
    public readonly valid: boolean,
    public readonly timestamp: string,
  ) {}
}
