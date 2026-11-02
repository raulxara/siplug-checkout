export class ReconcilePaymentSplitWithGatewayDtoOut {
  constructor(
    public readonly reconciled: boolean,
    public readonly status: string,
    public readonly message: string,
    public readonly paymentSplit: Record<string, unknown> | null,
    public readonly recipientResults: Array<Record<string, unknown>>,
    public readonly summary: Record<string, unknown>,
  ) {}
}
