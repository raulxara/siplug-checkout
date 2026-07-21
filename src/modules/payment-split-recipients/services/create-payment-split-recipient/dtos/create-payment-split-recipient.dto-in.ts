export class CreatePaymentSplitRecipientDtoIn {
  constructor(
    public readonly paymentSplitId: string,
    public readonly splitRecipientId: string,

    public readonly gatewayRecipientId: string | null,
    public readonly gatewayTransferId: string | null,

    public readonly role: string,
    public readonly amount: number,
    public readonly percentage: number | null,
    public readonly currency: string,

    public readonly providerPayload: Record<string, unknown> | null,
    public readonly providerResponse: Record<string, unknown> | null,
    public readonly gatewayResponse: Record<string, unknown> | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}
