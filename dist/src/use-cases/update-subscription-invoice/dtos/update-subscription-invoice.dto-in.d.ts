export declare class UpdateSubscriptionInvoiceDtoIn {
    readonly token: string;
    readonly subscriptionInvoiceId: string;
    readonly paymentTransactionId: string | null;
    readonly gatewayInvoiceId: string | null;
    readonly paidAt: string | null;
    readonly dueAt: string | null;
    readonly lastAttemptAt: string | null;
    readonly attemptNumber: number | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    constructor(params: {
        token?: unknown;
        subscriptionInvoiceId?: unknown;
        paymentTransactionId?: unknown;
        gatewayInvoiceId?: unknown;
        paidAt?: unknown;
        dueAt?: unknown;
        lastAttemptAt?: unknown;
        attemptNumber?: unknown;
        metadata?: unknown;
        config?: unknown;
        status?: unknown;
    });
    private toNullableString;
    private toNullableNumber;
    private toNullableObject;
}
