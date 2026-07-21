export class CreateSubscriptionInvoiceDtoIn {
  constructor(
    public readonly subscriptionId: string,
    public readonly subscriptionCycleId: string | null,
    public readonly paymentTransactionId: string | null,

    public readonly invoiceNumber: string | null,

    public readonly amount: number,
    public readonly currency: string,

    public readonly dueAt: string | null,
    public readonly paidAt: string | null,

    public readonly attemptNumber: number,
    public readonly externalReference: string | null,
    public readonly gatewayInvoiceId: string | null,
    public readonly lastAttemptAt: string | null,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}