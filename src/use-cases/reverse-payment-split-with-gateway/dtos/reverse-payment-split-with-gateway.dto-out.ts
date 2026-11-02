export class ReversePaymentSplitWithGatewayDtoOut {
  constructor(
    public readonly reversed: boolean,
    public readonly status: string,
    public readonly message: string,
    public readonly paymentSplit: Record<string, unknown> | null,
    public readonly recipientResults: Array<Record<string, unknown>>,
    public readonly summary: Record<string, unknown>,
  ) {}
}