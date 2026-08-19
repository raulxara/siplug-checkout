export class MarkNativePaymentSplitAsTransferredDtoOut {
  constructor(
    public readonly nativeSettled: boolean,
    public readonly wasAlreadySettled: boolean,
    public readonly reason: string,

    public readonly paymentSplit: Record<string, unknown> | null,
    public readonly paymentSplitRecipients: Array<Record<string, unknown>>,

    public readonly paymentSplitId: string,
    public readonly sourceTransactionId: string | null,

    public readonly gatewayResult: Record<string, unknown>,
  ) {}
}