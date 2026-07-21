export class UpdateSubscriptionInvoiceDtoIn {
  constructor(
    public readonly _id: string,

    public readonly paymentTransactionId: string | null,
    public readonly gatewayInvoiceId: string | null,
    public readonly lastAttemptAt: string | null,
    public readonly attemptNumber: number | null,

    public readonly paidAt: string | null,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string | null,
    public readonly source: string,
  ) {}
}
