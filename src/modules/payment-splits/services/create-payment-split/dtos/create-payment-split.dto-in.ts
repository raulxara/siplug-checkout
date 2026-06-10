export class CreatePaymentSplitDtoIn {
  constructor(
    public readonly officeId: string,
    public readonly clientId: string,
    public readonly checkoutSessionId: string | null,
    public readonly paymentTransactionId: string,
    public readonly subscriptionId: string | null,
    public readonly subscriptionInvoiceId: string | null,
    public readonly splitRuleId: string | null,

    public readonly gatewayProvider: string,
    public readonly gatewaySplitId: string | null,

    public readonly amount: number,
    public readonly currency: string,

    public readonly providerPayload: Record<string, unknown> | null,
    public readonly providerResponse: Record<string, unknown> | null,
    public readonly gatewayResponse: Record<string, unknown> | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}
