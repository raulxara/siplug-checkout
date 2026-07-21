export class ReservePaymentSplitDispatchDtoOut {
  constructor(
    public readonly reserved: boolean,
    public readonly reason: string,
    public readonly paymentSplitId: string,
    public readonly previousStatus: string | null,
    public readonly currentStatus: string | null,
    public readonly reservation: Record<string, unknown> | null,
    public readonly paymentSplit: Record<string, unknown> | null,
  ) {}
}
