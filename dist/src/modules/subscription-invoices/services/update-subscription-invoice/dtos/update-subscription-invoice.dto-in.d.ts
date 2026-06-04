export declare class UpdateSubscriptionInvoiceDtoIn {
    readonly _id: string;
    readonly paymentTransactionId: string | null;
    readonly gatewayInvoiceId: string | null;
    readonly lastAttemptAt: string | null;
    readonly attemptNumber: number | null;
    readonly paidAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(_id: string, paymentTransactionId: string | null, gatewayInvoiceId: string | null, lastAttemptAt: string | null, attemptNumber: number | null, paidAt: string | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string | null, source: string);
}
