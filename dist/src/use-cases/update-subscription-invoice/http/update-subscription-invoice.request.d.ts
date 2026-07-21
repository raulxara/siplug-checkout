export declare class UpdateSubscriptionInvoiceRequest {
    token?: string;
    subscriptionInvoiceId?: string;
    _id?: string;
    paymentTransactionId?: string;
    gatewayInvoiceId?: string;
    paidAt?: string;
    dueAt?: string;
    lastAttemptAt?: string;
    attemptNumber?: number;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
}
