export class DispatchPaymentSplitToGatewayDtoOut {
  constructor(
    public readonly dispatched: boolean,
    public readonly reason: string,
    public readonly paymentSplit: Record<string, unknown> | null,
    public readonly paymentSplitRecipients: Array<Record<string, unknown>>,
    public readonly gatewayResult: Record<string, unknown> | null,
  ) {}
}
