export declare class CreateSubscriptionInvoiceDtoIn {
    readonly subscriptionId: string;
    readonly subscriptionCycleId: string | null;
    readonly paymentTransactionId: string | null;
    readonly invoiceNumber: string | null;
    readonly amount: number;
    readonly currency: string;
    readonly dueAt: string | null;
    readonly paidAt: string | null;
    readonly attemptNumber: number;
    readonly externalReference: string | null;
    readonly gatewayInvoiceId: string | null;
    readonly lastAttemptAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(subscriptionId: string, subscriptionCycleId: string | null, paymentTransactionId: string | null, invoiceNumber: string | null, amount: number, currency: string, dueAt: string | null, paidAt: string | null, attemptNumber: number, externalReference: string | null, gatewayInvoiceId: string | null, lastAttemptAt: string | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string);
}
