export class RetryPaymentSplitDispatchDtoOut {
  constructor(
    public readonly dispatched: boolean,
    public readonly message: string,
    public readonly paymentSplit: Record<string, unknown> | null,
    public readonly recipients: Array<Record<string, unknown>>,
    public readonly gatewayResult: Record<string, unknown> | null,
  ) {}
}